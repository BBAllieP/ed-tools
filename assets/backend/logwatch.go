package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"

	"github.com/fsnotify/fsnotify"
)

func watchLogs(logLocation string) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	done := make(chan bool)
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				log.Println("event:", event)
				if event.Op&fsnotify.Write == fsnotify.Write {
					match, _ := regexp.MatchString("Journal.*.log", event.Name)
					if match {
						log.Println("modified file:", event.Name)
						readChangedFile(event.Name)
					}
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}
	}()

	err = watcher.Add(logLocation)
	if err != nil {
		log.Fatal(err)
	}
	<-done
}

func readChangedFile(file string) {
	// look at last lines of file and determine the changes
	// first need to determine how many lines are added
	// we know that the only changes are adding lines or creating a new log
	// if we store the last known length of the active logfile we can check
	// the change in length and know how many lines to read
	return
}

func parseLog(journals []Logfile, missions *[]Mission){
	for i, journal := range(journals) {
		var isLatest bool
		if len(journals) == i {
			isLatest = true
		} else {
			isLatest = false
		}
		file, err := os.Open(journal.path)
		if err != nil {
			log.Fatal(err)
		}
		scanner := bufio.NewScanner(file)
		var event map[string]interface{}
		for scanner.Scan() {
			//parse each line and do something with it based on contents
			if strings.Contains(scanner.Text(), "Mission_Massacre"){
				if scanner.Text()[38:56] == "\"event\":\"Missions\""{
					continue
				}				
    			json.Unmarshal([]byte(scanner.Text()), &event)
				if event["event"] == "Missions"{
					continue
				}
				missionEvent := fmt.Sprintf("%v", event["event"])[7:]
				//if missionEvent == "Accepted"{
				//	fmt.Println(event["MissionID"])
				//}
				processMission(&event, missions, missionEvent, isLatest)
			} else if scanner.Text() == "Bounty" {
    			json.Unmarshal([]byte(scanner.Text()), &event)
				processBounty(&event, missions)
			}
		}
		file.Close()
	}
	
}

func processMission(mission *map[string]interface{}, missionsIn *[]Mission, missionEvent string, isLatest bool ){
	
	cont := isLatest
	//if initial load ignore missions not in active list
	var i int
	var tempMis Mission
	for i, tempMis = range((*missionsIn)){
		var misId64 float64 
		var misIdInt int
		misId64, _ = (*mission)["MissionID"].(float64)
		misIdInt = int(misId64)
		if tempMis.Id == misIdInt {
			cont = true
			break
		}
	}
	if cont == false {
		return
	}
	// fill in mission details in main array
	switch missionEvent{
	case "Accepted":
		fmt.Println("accepted")
		(*missionsIn)[i].Status = "Progress"
		(*missionsIn)[i].Faction = fmt.Sprintf("%v", (*mission)["Faction"])
		(*missionsIn)[i].TargetFaction = fmt.Sprintf("%v", (*mission)["TargetFaction"])
		(*missionsIn)[i].Needed = int((*mission)["KillCount"].(float64))
		(*missionsIn)[i].Value = int((*mission)["Reward"].(float64))
		(*missionsIn)[i].Destination = fmt.Sprintf("%v", (*mission)["DestinationSystem"])
		(*missionsIn)[i].Reputation = fmt.Sprintf("%v", (*mission)["Reputation"])
	case "Redirected":
		(*missionsIn)[i].Status = "Done"
		(*missionsIn)[i].Destination = fmt.Sprintf("%v",(*mission)["Destination"])
		(*missionsIn)[i].Kills = (*missionsIn)[i].Needed
	default:
		//Handle failed/abandoned case
		(*missionsIn) = append((*missionsIn)[:i], (*missionsIn)[i+1:]...)
	}
}

func processBounty(event *map[string]interface{}, missions *[]Mission){
	
}