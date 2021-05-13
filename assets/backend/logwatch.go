package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/radovskyb/watcher"
)

func watchLogs(journals *[]Logfile, missions *[]Mission) {
	logLocation := getLogLocation()
	w := watcher.New()
	w.SetMaxEvents(1)

	//defer w.Close()
	w.FilterOps(watcher.Write)
	r := regexp.MustCompile("Journal.*.log")
	w.AddFilterHook(watcher.RegexFilterHook(r, false))
	done := make(chan bool)
	go func() {
		for {
			select {
			case event := <-w.Event:
				log.Println("modified file:", event.Path)
				readChangedFile(event.Path, journals, missions)
				//log.Println((*missions))

			case err := <-w.Error:
				log.Println("error:", err)
			}
		}
	}()

	if err := w.Add(logLocation); err != nil {
		log.Fatalln(err)
	}
	// Start the watching process - it'll check for changes every 100ms.
	if err := w.Start(time.Millisecond * 100); err != nil {
		log.Fatalln(err)
	}
	<-done
}

func readChangedFile(file string, journals *[]Logfile, missions *[]Mission) {
	found := false
	var index int
	//var tempList []Logfile
	for i, journal := range *journals {
		//fmt.Println(journal)
		if journal.path == file {
			fmt.Println("found journal")
			found = true
			index = i
			break
		}
	}
	if !found {
		fmt.Println(file)
		fmt.Println((*journals)[0].path)
		info, err := os.Stat(file)
		if err != nil {
			log.Fatal(err)
		}
		newLog := Logfile{file, info.ModTime(), 0, 0}
		(*journals) = append((*journals), newLog)
		index = len((*journals)) - 1
	}

	parseLog(journals, missions, false, index)
}

func parseLog(journals *[]Logfile, missions *[]Mission, initialLoad bool, index int) {
	//defer writeCsv(missions)
	last := len(*journals) - 1
	var latestLog bool
	if index >= 0 {
		fmt.Println("newLine")
	}
	for i, journal := range *journals {
		if index >= 0 && i != index {
			continue
		}

		file, err := os.Open(journal.path)
		if err != nil {
			log.Fatal(err)
		}
		if i == last {
			latestLog = true
			fmt.Println("found latest")
		} else {
			latestLog = false
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
				if !latestLog || (latestLog && lineCount <= journal.lastLoad) {
					go processMission(event, missions, missionEvent, false)
				} else {
					go processMission(event, missions, missionEvent, true)
				}

			} else if event["event"] == "Bounty" {
				go processBounty(event)
			}
		}
		(*journals)[i].lastLine = lineCount

		file.Close()
	}
}

func processMission(mission map[string]interface{}, missionsIn *[]Mission, missionEvent string, processNew bool) {
	cont := processNew
	//fmt.Println("processing mission")
	found := false
	var i int
	//is mission in existing mission list
	for ii, tempMis := range *missionsIn {
		//var misIdInt int
		misIdInt := int((mission)["MissionID"].(float64))
		if tempMis.Id == misIdInt {
			cont = true
			found = true
			i = ii
			break
		}
	}
	if !cont {
		return
	}

	// fill in mission details in main array
	fmt.Println("Mission " + missionEvent)
	switch missionEvent {
	case "Accepted":
		if !found {
			(*missionsIn) = append(*missionsIn, Mission{Id: int(mission["MissionID"].(float64)), Name: fmt.Sprintf("%v", mission["Name"]), IsWing: strings.Contains(fmt.Sprintf("%v", mission["Name"]), "Wing")})
			i = len(*missionsIn) - 1
		}
		(*missionsIn)[i].Status = "Progress"
		(*missionsIn)[i].Faction = fmt.Sprintf("%v", (mission)["Faction"])
		(*missionsIn)[i].TargetFaction = fmt.Sprintf("%v", (mission)["TargetFaction"])
		(*missionsIn)[i].Needed = int((mission)["KillCount"].(float64))
		(*missionsIn)[i].Value = int((mission)["Reward"].(float64))
		(*missionsIn)[i].DestinationSystem = fmt.Sprintf("%v", (mission)["DestinationSystem"])
		(*missionsIn)[i].DestinationStation = fmt.Sprintf("%v", (mission)["DestinationStation"])
		(*missionsIn)[i].Reputation = fmt.Sprintf("%v", (mission)["Reputation"])
		startTime, _ := time.Parse("2006-01-02T15:04:05Z", fmt.Sprintf("%v", (mission)["timestamp"]))
		(*missionsIn)[i].Start = startTime
		if connected {
			broadcast <- MissionMessage{"Mission" + missionEvent, (*missionsIn)[i]}
		}
	case "Redirected":
		(*missionsIn)[i].Status = "Done"
		endTime, _ := time.Parse("2006-01-02T15:04:05Z", fmt.Sprintf("%v", (mission)["timestamp"]))
		(*missionsIn)[i].End = endTime
		(*missionsIn)[i].DestinationSystem = fmt.Sprintf("%v", (mission)["NewDestinationSystem"])
		(*missionsIn)[i].DestinationStation = fmt.Sprintf("%v", (mission)["NewDestinationStation"])
		(*missionsIn)[i].Kills = (*missionsIn)[i].Needed
		if connected {
			broadcast <- MissionMessage{"Mission" + missionEvent, (*missionsIn)[i]}
		}
	default:
		//Handle failed/abandoned case
		if connected && found {
			broadcast <- MissionMessage{"Mission" + missionEvent, (*missionsIn)[i]}
		}
		if len(*missionsIn) > 1 {
			(*missionsIn) = append((*missionsIn)[:i], (*missionsIn)[i+1:]...)
		} else {
			*missionsIn = nil
		}

	}

}

func processBounty(event map[string]interface{}) {
	fmt.Println("bounty processing")
	killFaction := event["VictimFaction"].(string)
	TargetMissions := make(map[string]Mission)
	for _, mis := range Missions {
		if _, ok := TargetMissions[mis.Faction]; ok {
			if TargetMissions[mis.Faction].Start.After(mis.Start) {
				if mis.TargetFaction == killFaction && mis.Status == "Progress" {
					TargetMissions[mis.Faction] = mis
				}
			}
		} else {
			if mis.TargetFaction == killFaction && mis.Status == "Progress" {
				TargetMissions[mis.Faction] = mis
			}
		}
	}
	for _, mis := range TargetMissions {
		for i, mis1 := range Missions {
			if mis1.Id == mis.Id {
				Missions[i].Kills += 1
				if connected {
					broadcast <- MissionMessage{"Bounty", Missions[i]}
				}

				break
			}
		}
	}

}

/*func processBounty(event map[string]interface{}, missions *[]Mission) {
	fmt.Println("bounty processing")
	killFaction := event["VictimFaction"].(string)
	//bountyTime, _ := time.Parse("2006-01-02T15:04:05Z", fmt.Sprintf("%v", (event)["timestamp"]))
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
		var tempFacMissions []Mission = nil
		//remove redirected (i.e. complete) missions from consideration
		for _, misTemp := range fact.Missions {
			if misTemp.Status == "Progress" {
				if misTemp.TargetFaction == killFaction {
					tempFacMissions = append(tempFacMissions, misTemp)
				}
			}
		}
		if len(tempFacMissions) < 1 {
			continue
		}
		//sort oldest to newest
		if len(tempFacMissions) > 1 {
			sort.SliceStable(tempFacMissions, func(i, j int) bool {
				return tempFacMissions[i].Start.Before(tempFacMissions[j].Start)
			})
		}

		// if there are missions
		if len(tempFacMissions) > 0 {
			//add one to progress of oldest active mission
			for i, _ := range *missions {
				fmt.Println("Bounty Applicable")
				if (*missions)[i].Id == tempFacMissions[0].Id {
					(*missions)[i].Kills += 1
					if connected {
						fmt.Println("Sending Bounty")
						broadcast <- MissionMessage{"Bounty", (*missions)[i]}
					}
					break
				}
			}
		}
	}
}*/
