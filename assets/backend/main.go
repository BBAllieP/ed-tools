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
	parseLog(true)
	fmt.Println("Missions Loaded")
}

func main() {
	fmt.Println("ED-Tools Backend v0.0.0.1")
	Connected = false
	MsgChan = make(chan interface{})
	//start websocket
	router := setupRoutes()
	fmt.Println("Serving Router")
	go watchLogs()
	http.ListenAndServe(":8844", router)
}
