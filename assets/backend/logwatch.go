package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"regexp"
	"sort"
	"strings"

	"github.com/fsnotify/fsnotify"
)

func watchLogs(journals *[]Logfile, missions *[]Mission) {
	logLocation := getLogLocation()
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
						readChangedFile(event.Name, journals, missions)
						fmt.Println(*missions)
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

func readChangedFile(file string, journals *[]Logfile, missions *[]Mission) {
	found := false
	var tempList []Logfile
	for _, journal := range((*journals)){
		if journal.path == file{
			found = true
			tempList = append(tempList, journal)
		}
	}
	if !found {
		info, err := os.Stat(file)
		if err != nil {
			log.Fatal(err)
		}
		newLog := Logfile{file, info.ModTime(), 0}
		(*journals) = append((*journals), newLog)
		tempList = append(tempList, newLog)
	}
	parseLog(&tempList, missions)
}

func parseLog(journals *[]Logfile, missions *[]Mission){
	for i, journal := range(*journals) {
		var isLatest bool
		if len((*journals)) == i {
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
		var lineCount int
		lineCount = 0
		for scanner.Scan(){
			lineCount +=1
			if lineCount <= journal.lastLine {
				continue
			}
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
				processMission(&event, missions, missionEvent, isLatest)
			} else if strings.Contains(scanner.Text(), "Bounty") {
    			json.Unmarshal([]byte(scanner.Text()), &event)
				processBounty(&event, missions)
			}
		}
		(*journals)[i].lastLine = lineCount
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
	killFaction := fmt.Sprintf("%v",(*event)["VictimFaction"])
	factions := bucketFactions(missions)
	if len(factions) < 1 {
		return
	}
	for _, fact := range(factions){
		if len(fact.Missions) < 1 {
			return
		}
		// now we know there's at least one mission
		// find oldest active mission
		tempFacMissions := fact.Missions
		//remove redirected (i.e. complete) missions from consideration
		for i, misTemp := range(fact.Missions){
			if misTemp.Status != "Progress"{
				tempFacMissions = append(fact.Missions[:i], fact.Missions[i+1:]...)
			}
		}
		//sort oldest to newest
		sort.SliceStable(tempFacMissions, func(i,j int) bool {
			return tempFacMissions[i].Start.Before(tempFacMissions[j].Start)
		})
		// if there are missions
		if len(tempFacMissions) > 0 {
			//add one to progress of oldest active mission
			for i, mis := range((*missions)){
				if mis.Id == tempFacMissions[0].Id && mis.TargetFaction == killFaction{
					(*missions)[i].Kills = (*missions)[i].Kills + 1
				}
			}
		}
	}
}