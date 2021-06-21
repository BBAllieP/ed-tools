package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/atotto/clipboard"
)

type System struct {
	Name              string
	DistanceToArrival float64
	DistanceRemaining float64
	NeutronStar       bool
	Jumps             int
	Refuel            bool
	Bodies            []Body
	Visited           bool
	Copied            bool
}

type Body struct {
	Name              string
	SubType           string
	IsTerraformable   bool
	DistanceToArrival int
	ScanValue         int
	MappingValue      int
	LightScanned      bool
	DeepScanned       bool
}

type Route struct {
	Id           string
	Name         string
	Path         string
	Type         string
	DestIndex    int
	Destinations []System
}

func acceptRoute(routePath string) {
	fmt.Println(routePath)
	routeName := strings.Split(routePath, "\\")[len(strings.Split(routePath, "\\"))-1]
	//newLoc := getStorageDir() + "\\routes\\" + routeName
	//fmt.Println(newLoc)
	/* copy route to appdata storage
	err := File(routePath, newLoc)
	if err != nil {
		panic(err)
	}*/

	// generate routeID by hashing source name and date/time
	routeId := makeHash(routePath + time.Now().String())
	tempRoute := Route{routeId, routeName, routePath, "", 0, nil}

	// load route into memory
	csvfile, err := os.Open(routePath)
	if err != nil {
		log.Fatalln("Couldn't open the csv file", err)
	}
	r := csv.NewReader(csvfile)
	i := 0
	// Iterate through the records
	record, _ := r.Read()
	switch headerVal := record[3]; headerVal {
	case "Is Terraformable":
		tempRoute.Type = "r2r"
	case "Neutron Star":
		tempRoute.Type = "neutron"
	case "Tritium in tank":
		tempRoute.Type = "fc"
	case "Fuel Left":
		tempRoute.Type = "exact"
	default:
		break
	}
	tempDestSyst := ""
	tempDests := []System{}
	for {
		i++
		// Read each record from csv
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		switch tempRoute.Type {
		//process r2r
		case "r2r":
			if tempDestSyst != record[0] {
				jumps, _ := strconv.Atoi(record[7])
				tempDest := System{record[0], 0, 0, false, jumps, false, []Body{}, false, false}
				tempDests = append(tempDests, tempDest)
				tempDestSyst = record[0]
			}
			isTerra := record[3] == "Yes"
			dist, _ := strconv.Atoi(record[4])
			scanVal, _ := strconv.Atoi(record[5])
			mapVal, _ := strconv.Atoi(record[6])
			tempBody := Body{record[1], record[2], isTerra, dist, scanVal, mapVal, false, false}
			tempDests[len(tempDests)-1].Bodies = append(tempDests[len(tempDests)-1].Bodies, tempBody)
			break
		//process neutron
		case "neutron":
			var neutron bool
			if record[3] == "Yes" {
				neutron = true
			} else {
				neutron = false
			}

			dist, _ := strconv.ParseFloat(record[1], 64)
			remain, _ := strconv.ParseFloat(record[2], 64)
			dist = dist / 1000000000000
			remain = remain / 1000000000000
			jumps, _ := strconv.Atoi(record[4])
			tempDest := System{record[0], dist, remain, neutron, jumps, false, nil, false, false}
			tempDests = append(tempDests, tempDest)
			break
		case "exact":
			var neutron bool
			var refuel bool
			if record[6] == "Yes" {
				neutron = true
			} else {
				neutron = false
			}
			if record[5] == "Yes" {
				refuel = true
			} else {
				refuel = false
			}
			dist, _ := strconv.ParseFloat(record[1], 64)
			remain, _ := strconv.ParseFloat(record[2], 64)
			dist = dist / 1000000000000
			remain = remain / 1000000000000
			//jumps, _ := strconv.Atoi(record[4])
			tempDest := System{record[0], dist, remain, neutron, 0, refuel, nil, false, false}
			tempDests = append(tempDests, tempDest)
			break
		//process fc
		case "fc":
			dist, _ := strconv.ParseFloat(record[1], 64)
			remain, _ := strconv.ParseFloat(record[1], 64)
			dist = dist / 1000000000000
			remain = remain / 1000000000000
			tempDest := System{record[0], dist, remain, false, 0, false, nil, false, false}
			tempDests = append(tempDests, tempDest)
			break
		}

	}
	tempRoute.Destinations = tempDests
	CurrentRoute = tempRoute
	// write json of current routes
	file, _ := json.MarshalIndent(CurrentRoute, "", " ")
	_ = ioutil.WriteFile(getStorageDir()+"\\route.json", file, 0644)
	//send route to client to update state
	if Connected {
		broadcast <- Message{Action: "AddRoute", Body: tempRoute}
	}
}

func LoadRoutes() {
	loadFile := getStorageDir() + "\\route.json"
	if _, err := os.Stat(loadFile); err == nil {
		file, _ := ioutil.ReadFile(loadFile)
		_ = json.Unmarshal([]byte(file), &CurrentRoute)
	}
	fmt.Println("Routes Loaded")
	if Connected {
		broadcast <- Message{Action: "SendRoutes", Body: CurrentRoute}
	}
}
func DeleteRoute() {
	CurrentRoute = Route{"", "", "", "", 0, nil}
	loadFile := getStorageDir() + "\\route.json"
	if _, err := os.Stat(loadFile); err == nil {
		return
	}
	file, _ := json.MarshalIndent(CurrentRoute, "", " ")
	_ = ioutil.WriteFile(getStorageDir()+"\\route.json", file, 0644)
}

/*
processJump(event)
case "SAAScanComplete":
	processDetailedScan(event)
case "Scan":
	processScan(event)
case "JetConeBoost":
	processBoost(event)
*/

func checkClipboard() {
	clip, err := clipboard.ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}
	for i, dest := range CurrentRoute.Destinations {
		if dest.Name == clip {
			CurrentRoute.Destinations[i].Copied = true
		} else {
			CurrentRoute.Destinations[i].Copied = false
		}
	}
}

func CopyDest(input string) {
	// check current clipboard contents
	clip, err := clipboard.ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}
	//Clear copied status from current system on clipboard
	for i, dest := range CurrentRoute.Destinations {
		switch dest.Name {
		case clip:
			if CurrentRoute.Destinations[i].Copied {
				CurrentRoute.Destinations[i].Copied = false
				newMsg := Message{"UnsetCopy", i}
				broadcast <- newMsg
			}
		case input:
			if !CurrentRoute.Destinations[i].Copied {
				CurrentRoute.Destinations[i].Copied = true
				newMsg := Message{"SetCopy", i}
				broadcast <- newMsg
			}
		}
	}
	//
	clipboard.WriteAll(input)
}

func ProcessJump(event map[string]interface{}) {
	SuperCharged = false
	broadcast <- Message{"SuperCharge", false}
	jumpTarget := event["StarSystem"]
	for i, destination := range CurrentRoute.Destinations {
		if destination.Name == jumpTarget {
			// Mark current system as visited
			CurrentRoute.Destinations[i].Visited = true
			broadcast <- Message{"SystemVisit", i}
			// Mark current position in route
			CurrentRoute.DestIndex = i
			// copy next destination to clipboard
			if i < len(CurrentRoute.Destinations)-1 {
				CopyDest(CurrentRoute.Destinations[i+1].Name)
			}
			break
		}
	}
}

func ProcessScan(event map[string]interface{}) {
	deep := false
	if event["event"] == "SAAScanComplete" {
		deep = true
	}
	currentBodies := CurrentRoute.Destinations[CurrentRoute.DestIndex].Bodies
	body := event["BodyName"]
	for i, b := range currentBodies {
		if b.Name == body {
			if deep {
				CurrentRoute.Destinations[CurrentRoute.DestIndex].Bodies[i].DeepScanned = true
				broadcast <- Message{"DeepScan", i}
			} else {
				CurrentRoute.Destinations[CurrentRoute.DestIndex].Bodies[i].LightScanned = true
				broadcast <- Message{"LightScan", i}
			}
		}
	}
}

func ProcessBoost() {
	SuperCharged = true
	broadcast <- Message{"SuperCharge", true}
}
