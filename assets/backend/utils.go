package main

import (
	"crypto/sha1"
	"crypto/sha256"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
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
	Missions = nil
	LoadMissions = nil
	Journals = nil
	getLogList()
	fmt.Println("Loading Missions")
	getResumedMissionList()
	for ind := range Journals {
		parseLog(true, ind)
	}
	cleanupMissions()
	parseLog(false, len(Journals)-1)
	fmt.Println("Missions Loaded")
	Initialized = true
}
func File(src, dst string) error {
	var err error
	var srcfd *os.File
	var dstfd *os.File
	var srcinfo os.FileInfo

	if srcfd, err = os.Open(src); err != nil {
		return err
	}
	defer srcfd.Close()
	if err := os.MkdirAll(filepath.Dir(dst), 0770); err != nil {
		return err
	}
	if dstfd, err = os.Create(dst); err != nil {
		return err
	}
	defer dstfd.Close()

	if _, err = io.Copy(dstfd, srcfd); err != nil {
		return err
	}
	if srcinfo, err = os.Stat(src); err != nil {
		return err
	}
	return os.Chmod(dst, srcinfo.Mode())
}

func makeHash(input string) string {
	h := sha1.New()
	h.Write([]byte(input))
	bs := h.Sum(nil)
	return fmt.Sprintf("%x", bs)
}

func fileHash(inPath string) string {
	input := strings.NewReader(inPath)

	hash := sha256.New()
	if _, err := io.Copy(hash, input); err != nil {
		log.Fatal(err)
	}
	return hash.Sum(nil)
}
