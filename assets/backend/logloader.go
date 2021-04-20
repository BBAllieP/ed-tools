package main

import (
	"bufio"
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"strings"
	"time"
)

// the purpose of this one is to:
// 1) read the most recent log and find the login line
// 2) read the login line and determine the oldest mission
// 3) store the names of all of the logs we will need to parse
// 4) parse all logs in chronological order to determine current state
// 5) set the active log
func getLogList() []Logfile {
	var resultLogs []Logfile
	//uhome, err := os.UserHomeDir()
	/*if err != nil {
        log.Fatal( err )
    }*/
	//logLocation := uhome + "\\Saved Games\\Frontier Developments\\Elite Dangerous"
	logLocation := "../data/Elite Dangerous"
	logs, err := ioutil.ReadDir(logLocation)
	if err != nil {
		log.Fatal(err)
	}
	for _, journal := range logs{
		match, err := regexp.MatchString("Journal.*.log", journal.Name())
		if err != nil {
			log.Fatal( err )
		}
		if match {
			//Add logfile to slice of logfiles
			var newLog Logfile
			info, err := os.Stat(logLocation + "/" +journal.Name())
			if err != nil {
				log.Fatal(err)
			}
			newLog.path = logLocation + "/" + journal.Name()
			newLog.mod = info.ModTime()
			newLog.active = false
			resultLogs = append(resultLogs, newLog)
		}
	}
	return resultLogs
}

func getLatestLog() Logfile {
	logList := getLogList()
	latest:= logList[0]
	for _, journal := range logList {
		if journal.mod.After(latest.mod) {
			latest = journal
		}
	}
	return latest
}

func getResumedMissionList() []Mission{
	statuses := []string{"Active", "Complete", "Failed"}
	latestLog := getLatestLog()
	file, err := os.Open(latestLog.path)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	lastLine := ""
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		// Logic to find last mission resume line and assign it to variable
		if strings.Contains(scanner.Text(), "\"event\":\"Missions\"") {
			lastLine = scanner.Text()
		}
	}
	//take resumed mission data and populate pointed array with data

	var resumed ResumedMissions
	var allMissions []Mission

	json.Unmarshal([]byte(lastLine), &resumed)
	for _, misStatus := range statuses {
		allMissions = append(allMissions, modAndAddMissions(resumed, misStatus)...)
	}
	
	return allMissions
}

func modAndAddMissions(resumed ResumedMissions, status string) []Mission{
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
	for _, mis := range(missionsIn) {
		if strings.Contains(mis.Name, "Massacre"){
			newMission = mis
			if strings.Contains(mis.Name, "Wing"){
				newMission.Start = resumed.Timestamp.Add(time.Duration(7*24)*time.Hour).Add(time.Duration(mis.Expires)* time.Second)
			} else {
				newMission.Start = resumed.Timestamp.Add(time.Duration(172800)*time.Second).Add(time.Duration(mis.Expires)* time.Second)
			}
			newMission.Status = status
			missionArr = append(missionArr, newMission)
		}
	}
	return missionArr
}
/*func parseMissionSlice(missionsIn []Mission, missionsOut *[]Mission) {
	if len(missionsIn) != 0 {
		var newMission Mission
		json.Unmarshal([]byte(missionsIn), &newMission)
		for _, mis := range(missionsIn){
			if strings.Contains(mis.Name, "Massacre"){
				if strings.Contains(mis.Name, "Wing"){
					newMission.start = mis.Timestamp - 604800 + mis["Expires"]
				} else {
					newMission.start = mis.Timestamp - 172800 + mis["Expires"]
				}
				&missionsOut = append(&missionsOut, newMission)
			}
		}
	}
}*/