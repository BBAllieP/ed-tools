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

type Logfile struct {
	path string
	mod time.Time
	active bool
}

// the purpose of this one is to:
// 1) read the most recent log and find the login line
// 2) read the login line and determine the oldest mission
// 3) store the names of all of the logs we will need to parse
// 4) parse all logs in chronological order to determine current state
// 5) set the active log
func getLogList() []Logfile {
	var resultLogs []Logfile
	uhome, err := os.UserHomeDir()
	if err != nil {
        log.Fatal( err )
    }
	logLocation := uhome + "\\Saved Games\\Frontier Developments\\Elite Dangerous"
	logs, err := ioutil.ReadDir(logLocation)
	if err != nil {
		log.Fatal(err)
	}
	for _, log := range logs{
		match, err := regexp.MatchString("Journal.*.log", log.Name())
		if err != nil {
			log.Fatal(err)
		}
		if match {
			//Add logfile to slice of logfiles
			var newLog Logfile
			info, err := os.Stat(log.Name())
			if err != nil {
				log.Fatal(err)
			}
			newLog.path = log.Name()
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
	for _, log := range logList {
		if log.mod > latest.mod {
			latest = log
		}
	}
	return latest
}

func getResumedMissionList(missionList *[]Mission){
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
	statuses := []string{"Active", "Failed", "Complete"}
	var resumed ResumedMissions
	var newMissions []Mission
	json.Unmarshal([]byte(lastLine), &resumed)
	parseMissionSlice(resumed.Active, &newMissions)
	parseMissionSlice(resumed.Failed, &newMissions)
	parseMissionSlice(resumed.Complete, &newMissions)
	&missionList = append(&missionList, newMissions)
}
func parseMissionSlice(missionsIn []Mission, missionsOut *[]Mission) {
		if len(missions) != 0 {
			var newMission Mission
			json.Unmarshal([]byte(missionsIn), &newMission)
			for i, mis := range(missionsIn){
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
	}
}