package main

import (
	"fmt"
	"net/http"
)

var Missions []Mission
var LoadMissions []Mission
var Journals []Logfile
var Initialized bool

func init() {
	Initialized = false
	fmt.Println("Loading Logs")
	getLogList()
	fmt.Println("Loading Missions")
	getResumedMissionList()
	fmt.Println("InitialMissions Found")
	for ind := range Journals {
		parseLog(true, ind)
	}
	cleanupMissions()
	fmt.Println("Missions Loaded")
	Initialized = true
}

func main() {
	fmt.Println("ED-Tools Backend v0.0.0.1")
	Connected = false
	//start websocket
	router := setupRoutes()
	fmt.Println("Serving Router")
	go watchLogs()
	http.ListenAndServe(":8844", router)
}
