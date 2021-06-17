package main

import (
	"fmt"
	"io/fs"
	"net/http"
	"os"
)

var Missions []Mission
var LoadMissions []Mission
var Journals []Logfile
var Initialized bool
var CurrentRoute Route

func init() {
	Initialized = false
	if _, err := os.Stat(getStorageDir()); os.IsNotExist(err) {
		_ = os.Mkdir(getStorageDir(), fs.ModeDir)
		// TODO: handle error
	}
	fmt.Println("Loading Logs")
	getLogList()
	fmt.Println("Loading Missions")
	getResumedMissionList()
	fmt.Println("InitialMissions Found")
	for ind := range Journals {
		parseLog(true, ind)
	}
	cleanupMissions()
	parseLog(false, len(Journals)-1)
	fmt.Println("Missions Loaded")
	Initialized = true
	fmt.Println("LoadingRoutes")
	go LoadRoutes()
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
