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

func watchLogs() {
	logLocation := getLogLocation()
	w := watcher.New()
	w.SetMaxEvents(1)

	//defer w.Close()
	w.FilterOps(watcher.Write)
	r := regexp.MustCompile("(Journal).*(log)")
	w.AddFilterHook(watcher.RegexFilterHook(r, false))
	done := make(chan bool)
	go func() {
		for {
			select {
			case event := <-w.Event:
				/*fmt.Printf("%T\n", event)
				evt, _ := json.Marshal(event)
				fmt.Println(string(evt))*/
				if strings.Contains(event.Path, ".log") {
					readChangedFile(event.Path)
				}
				//log.Println("modified file:", event)

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

func readChangedFile(file string) {
	found := false
	var index int
	//var tempList []Logfile
	for i, journal := range Journals {
		//fmt.Println(journal)
		if journal.path == file {
			//fmt.Println("found journal")
			found = true
			index = i
			break
		}
	}
	if !found {
		//fmt.Println(file)
		fmt.Println("Writing New Journal")
		info, err := os.Stat(file)
		if err != nil {
			log.Fatal(err)
		}
		newLog := Logfile{file, info.ModTime(), 0, 0, getGameMode(file)}
		Journals = append(Journals, newLog)
		index = len(Journals) - 1
		fmt.Println(index)
		fmt.Println(Journals[index].path)
	}
	parseLog(false, index)
}

func parseLog(initialLoad bool, ind int) {
	file, err := os.Open((Journals[ind]).path)
	gameMode := Journals[ind].Game_version
	if err != nil {
		log.Fatal(err)
	}
	scanner := bufio.NewScanner(file)

	lineCount := 0
	tempJourn := Journals[ind]
	var event map[string]interface{}
	for scanner.Scan() {
		event = nil
		lineCount++
		if lineCount <= (tempJourn).lastLine {
			continue
		}

		//parse each line and do something with it based on contents
		json.Unmarshal([]byte(scanner.Text()), &event)
		if event["event"] == "Missions" && Initialized {
			initSequence()
			if Connected {
				factMsg := FactionsMessage{"GetAllFactions", bucketFactions(&Missions)}
				broadcast <- factMsg
			}
			break
		}
		if strings.Contains(scanner.Text(), "Mission_Massacre") {
			if event["event"] == "Missions" {
				continue
			}
			if lineCount >= Journals[ind].lastLoad {
				missionEvent := fmt.Sprintf("%v", event["event"])[7:]
				processMission(event, missionEvent, false)
			} else {
				missionEvent := fmt.Sprintf("%v", event["event"])[7:]
				processMission(event, missionEvent, initialLoad)
			}

		} else if event["event"] == "Bounty" {
			processBounty(event, gameMode)
		}
	}
	for i := range Journals {
		if Journals[i].path == tempJourn.path {
			Journals[i].lastLine = lineCount
			break
		}
	}

	file.Close()

}

func processMission(mission map[string]interface{}, missionEvent string, initialLoad bool) {
	found := false
	var i int
	misIdInt := int((mission)["MissionID"].(float64))
	//is mission in existing mission list
	for ii := range Missions {
		if Missions[ii].Id == misIdInt {
			found = true
			i = ii
			break
		}
	}

	// fill in mission details in main array
	fmt.Println("Mission " + missionEvent)
	switch missionEvent {
	case "Accepted":
		//if !found && !initialLoad {
		if !found {
			Missions = append(Missions, Mission{Id: misIdInt, Name: fmt.Sprintf("%v", mission["Name"]), IsWing: strings.Contains(fmt.Sprintf("%v", mission["Name"]), "Wing")})
			i = len(Missions) - 1
			found = true
		}
		if found {
			Missions[i].Status = "Progress"
			Missions[i].Faction = fmt.Sprintf("%v", (mission)["Faction"])
			Missions[i].TargetFaction = fmt.Sprintf("%v", (mission)["TargetFaction"])
			Missions[i].TargetType = fmt.Sprintf("%v", (mission)["TargetType_Localised"])
			Missions[i].Needed = int((mission)["KillCount"].(float64))
			Missions[i].Kills = 0
			Missions[i].Value = int((mission)["Reward"].(float64))
			Missions[i].DestinationSystem = fmt.Sprintf("%v", (mission)["DestinationSystem"])
			Missions[i].DestinationStation = fmt.Sprintf("%v", (mission)["DestinationStation"])
			Missions[i].Reputation = fmt.Sprintf("%v", (mission)["Reputation"])
			startTime, _ := time.Parse("2006-01-02T15:04:05Z", fmt.Sprintf("%v", (mission)["timestamp"]))
			Missions[i].Start = startTime
			if Connected && Initialized {
				broadcast <- MissionMessage{"Mission" + missionEvent, Missions[i]}
			}
		}
	case "Redirected":
		if found {
			Missions[i].Status = "Done"
			endTime, _ := time.Parse("2006-01-02T15:04:05Z", fmt.Sprintf("%v", (mission)["timestamp"]))
			Missions[i].End = endTime
			Missions[i].DestinationSystem = fmt.Sprintf("%v", (mission)["NewDestinationSystem"])
			Missions[i].DestinationStation = fmt.Sprintf("%v", (mission)["NewDestinationStation"])
			Missions[i].Kills = Missions[i].Needed
			if Connected && !initialLoad && Initialized {
				broadcast <- MissionMessage{"Mission" + missionEvent, Missions[i]}
			}
		}
	default:
		//Handle failed/abandoned case
		if found {
			tempMis := Missions[i]
			if Connected && !initialLoad && Initialized {
				broadcast <- MissionMessage{"Mission" + missionEvent, tempMis}
			}
			if len(Missions) > 1 {
				//Missions[i] = Missions[len(Missions)-1]
				Missions = append(Missions[:i], Missions[i+1:]...)
			} else {
				Missions = nil
			}
		}

	}

}

func processBounty(event map[string]interface{}, mode string) {
	killFaction := event["VictimFaction"].(string)
	bountyTime, _ := time.Parse("2006-01-02T15:04:05Z", fmt.Sprintf("%v", event["timestamp"]))
	TargetMissions := make(map[string]Mission)
	for _, mis := range Missions {
		if mis.Start.Before(bountyTime) {
			if mis.TargetFaction == killFaction && mis.Status == "Progress" && mis.TargetType == "Pirates" && mis.SourceMode == mode {
				if _, ok := TargetMissions[mis.Faction]; ok {
					if TargetMissions[mis.Faction].Start.After(mis.Start) {
						TargetMissions[mis.Faction] = mis
					}
				} else {
					TargetMissions[mis.Faction] = mis
				}
			}
		}

	}
	for _, mis := range TargetMissions {
		for i, mis1 := range Missions {
			if mis1.Id == mis.Id {
				Missions[i].Kills++
				if Connected && Initialized {
					fmt.Println("bounty processing")
					broadcast <- MissionMessage{"Bounty", Missions[i]}
				}
				break
			}
		}
	}
	TargetMissions = nil

}
