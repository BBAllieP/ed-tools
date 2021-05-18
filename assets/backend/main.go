package main

import (
	"fmt"
	"net/http"
)

var Missions []Mission
var Journals []Logfile

func init() {
	getLogList()
	fmt.Println("Loading Missions")
	getResumedMissionList()
	for ind := range Journals {
		parseLog(true, ind)
	}
	fmt.Println("Missions Loaded")
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
