package main

import (
	"bytes"
	"io/ioutil"

	"github.com/mohae/struct2csv"
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
	found := false
	var activeFactionList []Faction
	for _, mission := range *missions {
		for _, fact := range activeFactionList {
			if fact.Name == mission.Faction {
				found = true
				fact.Missions = append(fact.Missions, mission)
			}
		}
		if !found {
			activeFactionList = append(activeFactionList, Faction{[]Mission{mission}, mission.Faction})
		}
		found = false
	}
	return activeFactionList
}
func getMissionByID(missions *[]Mission, id int) Mission{
	for i, mis := range (*missions){
		if mis.Id == id{
			return (*missions)[i]
		}
	}
}
func factionMissionsGetter(missions *[]Mission, bountyTarget string) []Mission {
	var missionList []Mission
	for _, mission := range *missions {
		if mission.TargetFaction == bountyTarget && mission.Status == "Progress" {
			missionList = append(missionList, mission)
		}
	}
	return missionList
}

func writeCsv(missions *[]Mission) {
	buff := &bytes.Buffer{}
	w := struct2csv.NewWriter(buff)
	err := w.WriteStructs(*missions)
	if err != nil {
		// handle error
	}
	ioutil.WriteFile("output.csv", buff.Bytes(), 0644)
}
