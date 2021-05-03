package main

import (
	"bufio"
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"runtime"
	"sort"
	"strings"
	"time"
)

// the purpose of this one is to:
// 1) read the most recent log and find the login line - DONE
// 2) read the login line and determine the oldest mission - PARTIAL
// 3) store the names of all of the logs we will need to parse - TODO
// 4) parse all logs in chronological order to determine current state - TODO
// 5) set the active log - TODO
func getLogList(resultLogs *[]Logfile) {
	//var resultLogs []Logfile
	var logLocation string
	if runtime.GOOS == "windows" {
		uhome, err := os.UserHomeDir()
		if err != nil {
			log.Fatal(err)
		}
		logLocation = uhome + "\\Saved Games\\Frontier Developments\\Elite Dangerous"
	} else {
		logLocation = "../data/Elite Dangerous"
	}

	logs, err := ioutil.ReadDir(logLocation)
	if err != nil {
		log.Fatal(err)
	}
	for _, journal := range logs {
		match, err := regexp.MatchString("Journal.*.log", journal.Name())
		if err != nil {
			log.Fatal(err)
		}
		if match {
			//Add logfile to slice of logfiles
			var newLog Logfile
			info, err := os.Stat(logLocation + "/" + journal.Name())
			if err != nil {
				log.Fatal(err)
			}
			newLog.path = logLocation + "/" + journal.Name()
			newLog.mod = info.ModTime()
			newLog.lastLine = 0
			newLog.lastLoad = 0
			*resultLogs = append(*resultLogs, newLog)
		}
	}
	//return resultLogs
}

func getLatestLog(logList *[]Logfile) int {
	latest := 0
	for i, journal := range *logList {
		if journal.mod.After((*logList)[i].mod) {
			latest = i
		}
	}
	return latest
}

func getResumedMissionList(missionList *[]Mission, logList *[]Logfile) {
	statuses := []string{"Active", "Complete", "Failed"}
	getLogList(logList)
	latestLogInd := getLatestLog(logList)
	file, err := os.Open((*logList)[latestLogInd].path)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	lastLine := ""
	scanner := bufio.NewScanner(file)
	lineNo := 0
	for scanner.Scan() {
		lineNo += 1
		// Logic to find last mission resume line and assign it to variable
		if strings.Contains(scanner.Text(), "\"event\":\"Missions\"") {
			lastLine = scanner.Text()
			(*logList)[latestLogInd].lastLoad = lineNo
		}
	}
	//take resumed mission data and populate array with data

	var resumed ResumedMissions
	var allMissions []Mission

	json.Unmarshal([]byte(lastLine), &resumed)
	for _, misStatus := range statuses {
		allMissions = append(allMissions, modAndAddMissions(resumed, misStatus)...)
	}
	//find oldest current mission
	var oldestMis Mission
	for cnt, mis := range allMissions {
		if cnt == 1 {
			oldestMis = mis
		}
		if mis.Start.Before(oldestMis.Start) {
			oldestMis = mis
		}
	}

	sort.SliceStable((*logList), func(i, j int) bool {
		return (*logList)[i].mod.Before((*logList)[j].mod)
	})
	//make list of journals more recent than that mission
	var journList []Logfile
	//var tempJourn Logfile
	for _, journ := range *logList {
		if journ.mod.After(oldestMis.Start.Add(time.Duration(24) * time.Hour * -1)) {
			journList = append(journList, journ)
		}
		//tempJourn = journ
	}
	// sort journals in chron order
	sort.SliceStable(journList, func(i, j int) bool {
		return journList[i].mod.Before(journList[j].mod)
	})
	//set master list to sorted and filtered list
	*logList = journList
	// parse journals for updates
	*missionList = allMissions
	parseLog(logList, missionList, true)

}

//adds custom info to missions data and puts it all together
func modAndAddMissions(resumed ResumedMissions, status string) []Mission {
	var missionArr []Mission
	var newMission Mission
	var missionsIn []Mission

	switch status {
	case "Active":
		missionsIn = resumed.Active
	case "Failed":
		missionsIn = resumed.Failed
	case "Complete":
		missionsIn = resumed.Complete
	}
	for _, mis := range missionsIn {
		if strings.Contains(mis.Name, "Massacre") {
			newMission = mis
			if strings.Contains(mis.Name, "Wing") {
				newMission.IsWing = true
				newMission.Start = resumed.Timestamp.Add(time.Duration(604800) * time.Second * -1).Add(time.Duration(mis.Expires) * time.Second)
			} else {
				newMission.Start = resumed.Timestamp.Add(time.Duration(172800) * time.Second * -1).Add(time.Duration(mis.Expires) * time.Second)
			}
			if status == "Active" {
				newMission.Status = "Progress"
			} else {
				newMission.Status = status
			}
			missionArr = append(missionArr, newMission)
		}
	}
	//fmt.Println(len(missionArr))
	return missionArr
}
