package main

import (
	"bufio"
	"encoding/json"
	"fmt"
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
func getLogList() {
	//var resultLogs []Logfile
	var logLocation string
	if runtime.GOOS == "windows" {
		uhome, err := os.UserHomeDir()
		if err != nil {
			log.Fatal(err)
		}
		logLocation = uhome + "\\Saved Games\\Frontier Developments\\Elite Dangerous"
		//logLocation = "../tempLogs"
	} else {
		logLocation = "../data/Elite Dangerous"
	}

	logs, err := ioutil.ReadDir(logLocation)
	if err != nil {
		log.Fatal(err)
	}
	pattern, _ := regexp.Compile("Journal.*.log")
	for _, journal := range logs {
		match := pattern.MatchString(journal.Name())
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
			Journals = append(Journals, newLog)
		}
	}
	//return resultLogs
}

func getLatestLog() int {
	latest := 0
	for i := range Journals {
		if Journals[i].mod.After(Journals[latest].mod) {
			// read the whole file at once
			b, err := ioutil.ReadFile(Journals[i].path)
			if err != nil {
				panic(err)
			}
			s := string(b)
			// //check whether s contains substring text
			if strings.Contains(s, "\"event\":\"Missions\"") {
				latest = i
			}
		}
	}
	return latest
}

func getResumedMissionList() {
	statuses := []string{"Active", "Complete", "Failed"}
	latestLogInd := getLatestLog()
	file, err := os.Open(Journals[latestLogInd].path)
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
			fmt.Println("found load line")
			lastLine = scanner.Text()
			Journals[latestLogInd].lastLoad = lineNo
		}
	}
	//take resumed mission data and populate array with data

	var resumed ResumedMissions
	var allMissions []Mission

	json.Unmarshal([]byte(lastLine), &resumed)
	for _, misStatus := range statuses {
		allMissions = append(allMissions, modAndAddMissions(resumed, misStatus)...)
	}
	//fmt.Println(allMissions)
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

	//make list of journals more recent than that mission
	var journList []Logfile
	for _, journ := range Journals {
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
	Journals = nil
	Journals = journList
	Missions = allMissions
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
