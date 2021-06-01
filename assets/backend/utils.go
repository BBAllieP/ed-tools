package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func Find(slice []string, val string) (int, bool) {
	for i, item := range slice {
		if item == val {
			return i, true
		}
	}
	return -1, false
}

func bucketFactions(missions *[]Mission) []Faction {

	var activeFactionList []Faction
	for _, mission := range *missions {
		found := false
		for i, fact := range activeFactionList {
			if fact.Name == mission.Faction {
				found = true
				activeFactionList[i].Missions = append(activeFactionList[i].Missions, mission)
				//break
			}
		}
		if !found {
			activeFactionList = append(activeFactionList, Faction{[]Mission{mission}, mission.Faction})
		}
		//found = false
	}
	return activeFactionList
}
func getMissionByID(missions *[]Mission, id int) Mission {
	for i, mis := range *missions {
		if mis.Id == id {
			return (*missions)[i]
		}
	}
	return Mission{}
}

/*func factionMissionsGetter(missions *[]Mission, bountyTarget string) []Mission {
	var missionList []Mission
	for _, mission := range *missions {
		if mission.TargetFaction == bountyTarget && mission.Status == "Progress" {
			missionList = append(missionList, mission)
		}
	}
	return missionList
}*/

/*func writeCsv(missions *[]Mission) {
	buff := &bytes.Buffer{}
	w := struct2csv.NewWriter(buff)
	err := w.WriteStructs(*missions)
	if err != nil {
		// handle error
	}
	ioutil.WriteFile("output.csv", buff.Bytes(), 0644)
}*/
func getGameMode(path string) string {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		panic(err)
	}
	s := string(b)
	if strings.Contains(s, "\"Odyssey\":false") {
		return "horizons"
	} else if strings.Contains(s, "\"Odyssey\":true") {
		return "odyssey"
	}
	return ""
}

func initSequence() {
	Initialized = false
	getLogList()
	fmt.Println("Loading Missions")
	getResumedMissionList()
	for ind := range Journals {
		parseLog(true, ind)
	}
	cleanupMissions()
	fmt.Println("Missions Loaded")
	Initialized = true
}
