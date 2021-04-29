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
	"time"

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
				//log.Println("event:", event)
				if event.Op&fsnotify.Write == fsnotify.Write {
					match, _ := regexp.MatchString("Journal.*.log", event.Name)
					if match {
						//log.Println("modified file:", event.Name)
						readChangedFile(event.Name, journals, missions)
						//log.Println((*missions))
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
	for _, journal := range *journals {
		if journal.path == file {
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
	parseLog(&tempList, missions, false)
}

func parseLog(journals *[]Logfile, missions *[]Mission, isLatest bool) {
	defer writeCsv(missions)
	for i, journal := range *journals {
		file, err := os.Open(journal.path)
		if err != nil {
			log.Fatal(err)
		}
		scanner := bufio.NewScanner(file)
		
		var lineCount int
		lineCount = 0
		for scanner.Scan() {
			var event map[string]interface{}
			lineCount += 1
			if lineCount <= journal.lastLine {
				continue
			}
			//parse each line and do something with it based on contents
			json.Unmarshal([]byte(scanner.Text()), &event)
			if strings.Contains(scanner.Text(), "Mission_Massacre") {
				if event["event"] == "Missions" {
					continue
				}
				missionEvent := fmt.Sprintf("%v", event["event"])[7:]
				processMission(event, missions, missionEvent, isLatest)
			} else if event["event"] == "Bounty"{
				processBounty(event, missions)
			}
		}
		(*journals)[i].lastLine = lineCount
		file.Close()
	}
}

func processMission(mission map[string]interface{}, missionsIn *[]Mission, missionEvent string, isLatest bool) {
	cont := false
	var i int
	//is mission in existing mission list
	for ii, tempMis := range *missionsIn {
		var misIdInt int
		misIdInt = int((mission)["MissionID"].(float64))
		if tempMis.Id == misIdInt {
			cont = true
			i = ii
			break
		}
	}
	if cont == false {
		return
	}
	// fill in mission details in main array
	switch missionEvent {
	case "Accepted":
		(*missionsIn)[i].Status = "Progress"
		(*missionsIn)[i].Faction = fmt.Sprintf("%v", (mission)["Faction"])
		(*missionsIn)[i].TargetFaction = fmt.Sprintf("%v", (mission)["TargetFaction"])
		(*missionsIn)[i].Needed = int((mission)["KillCount"].(float64))
		(*missionsIn)[i].Value = int((mission)["Reward"].(float64))
		(*missionsIn)[i].Destination = fmt.Sprintf("%v", (mission)["DestinationSystem"])
		(*missionsIn)[i].Reputation = fmt.Sprintf("%v", (mission)["Reputation"])
	case "Redirected":
		(*missionsIn)[i].Status = "Done"
		endTime, _ := time.Parse("2006-01-02T15:04:05Z", fmt.Sprintf("%v", (mission)["timestamp"]))
		(*missionsIn)[i].End = endTime
		(*missionsIn)[i].Destination = fmt.Sprintf("%v", (mission)["Destination"])
		(*missionsIn)[i].Kills = (*missionsIn)[i].Needed
	default:
		//Handle failed/abandoned case
		(*missionsIn) = append((*missionsIn)[:i], (*missionsIn)[i+1:]...)
	}
	if Connected {
		ClientConn.WriteJSON(MissionMessage{"Mission"+missionEvent, (*missionsIn)[i]})
	}
	
}

func processBounty(event map[string]interface{}, missions *[]Mission) {
	//killFaction := fmt.Sprintf("%v", (event)["VictimFaction"])
	killFaction := event["VictimFaction"].(string)
	//bountyTime, _ := time.Parse("2006-01-02T15:04:05Z", fmt.Sprintf("%v", (*event)["timestamp"]))
	factions := bucketFactions(missions)
	if len(factions) < 1 {
		return
	}
	for _, fact := range factions {
		if len(fact.Missions) < 1 {
			continue
		}
		// now we know there's at least one mission
		// find oldest active mission
		var tempFacMissions []Mission
		//remove redirected (i.e. complete) missions from consideration
		for _, misTemp := range fact.Missions {
			if misTemp.Status == "Progress" && misTemp.TargetFaction == killFaction {
				tempFacMissions = append(tempFacMissions, misTemp)
			}
		}
		if len(tempFacMissions) < 1 {
			continue
		}
		//sort oldest to newest
		sort.SliceStable(tempFacMissions, func(i, j int) bool {
			return tempFacMissions[i].Start.Before(tempFacMissions[j].Start)
		})
		// if there are missions
		if len(tempFacMissions) > 0 {
			//add one to progress of oldest active mission
			for i, mis := range *missions {
				if mis.Id == tempFacMissions[0].Id{
					(*missions)[i].Kills += 1
					if Connected {
						ClientConn.WriteJSON(MissionMessage{"Bounty", (*missions)[i]})
					}
				}
			}
		}
	}
}
