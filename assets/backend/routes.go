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
)

type System struct {
	Name              string
	DistanceToArrival float64
	DistanceRemaining float64
	NeutronStar       bool
	Jumps             int
	Bodies            []Body
	Visited           bool
}

type Body struct {
	Name              string
	SubType           string
	IsTerraformable   bool
	DistanceToArrival int
	ScanValue         int
	MappingValue      int
	Visited           bool
}

type Route struct {
	Id           string
	Name         string
	Path         string
	Type         string
	Destinations []System
}

func acceptRoute(routePath string) {
	fmt.Println(routePath)
	routeName := strings.Split(routePath, "\\")[len(strings.Split(routePath, "\\"))-1]
	newLoc := getStorageDir() + "\\routes\\" + routeName
	fmt.Println(newLoc)
	// copy route to appdata storage
	err := File(routePath, newLoc)
	if err != nil {
		panic(err)
	}

	// generate routeID by hashing source name and date/time
	routeId := makeHash(routePath + time.Now().String())
	tempRoute := Route{routeId, routeName, newLoc, "", nil}

	// load route into memory
	csvfile, err := os.Open(newLoc)
	if err != nil {
		log.Fatalln("Couldn't open the csv file", err)
	}
	r := csv.NewReader(csvfile)
	i := 0
	// Iterate through the records
	record, err := r.Read()
	switch headerVal := record[3]; headerVal {
	case "Is Terraformable":
		tempRoute.Type = "r2r"
	case "Neutron Star":
		tempRoute.Type = "neutron"
	case "Tritium in tank":
		tempRoute.Type = "fc"
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
				tempDest := System{record[0], 0, 0, false, jumps, []Body{}, false}
				tempDests = append(tempDests, tempDest)
				tempDestSyst = record[0]
			}
			/*	Name              string
				SubType           string
				IsTerraformable   bool
				DistanceToArrival int
				ScanValue         int
				MappingValue      int
				Jumps             int*/
			isTerra := record[3] == "Yes"
			dist, _ := strconv.Atoi(record[4])
			scanVal, _ := strconv.Atoi(record[5])
			mapVal, _ := strconv.Atoi(record[6])
			tempBody := Body{record[1], record[2], isTerra, dist, scanVal, mapVal, false}
			tempDests[len(tempDests)-1].Bodies = append(tempDests[len(tempDests)-1].Bodies, tempBody)
			break
		//process neutron
		case "neutron":
			var neutron bool
			if record[4] == "Yes" {
				neutron = true
			} else {
				neutron = false
			}
			dist, _ := strconv.ParseFloat(record[1], 64)
			remain, _ := strconv.ParseFloat(record[1], 64)
			dist = dist / 1000000000000
			remain = remain / 1000000000000
			jumps, _ := strconv.Atoi(record[4])
			tempDest := System{record[0], dist, remain, neutron, jumps, nil, false}
			tempDests = append(tempDests, tempDest)
			break
		//process fc
		case "fc":
			dist, _ := strconv.ParseFloat(record[1], 64)
			remain, _ := strconv.ParseFloat(record[1], 64)
			dist = dist / 1000000000000
			remain = remain / 1000000000000
			tempDest := System{record[0], dist, remain, false, 0, nil, false}
			tempDests = append(tempDests, tempDest)
			break
		}

	}
	tempRoute.Destinations = tempDests
	Routes = append(Routes, tempRoute)
	// write json of current routes
	file, _ := json.MarshalIndent(Routes, "", " ")
	_ = ioutil.WriteFile(getStorageDir()+"\\routes\\routes.json", file, 0644)
	//send route to client to update state
	if Connected {
		broadcast <- Message{Action: "AddRoute", Body: tempRoute}
	}
}

func LoadRoutes() {
	loadFile := getStorageDir() + "\\routes\\routes.json"
	if _, err := os.Stat(loadFile); err == nil {
		file, _ := ioutil.ReadFile(loadFile)
		_ = json.Unmarshal([]byte(file), &Routes)
	}
	fmt.Println("Routes Loaded")
	if Connected {
		broadcast <- Message{Action: "SendRoutes", Body: Routes}
	}
}
