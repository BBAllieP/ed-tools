package main

import (
	"fmt"
	"net/http"
)

var Missions []Mission
var Journals []Logfile

func main() {
	fmt.Println("ED-Tools Backend v0.0.0.1")
	Connected = false
	MsgChan = make(chan interface{})
	//var wg sync.WaitGroup
	//http.ListenAndServe(":8080", nil)
	//start websocket
	router := setupRoutes()
	fmt.Println("Loading Missions")
	getResumedMissionList(&Missions, &Journals)
	fmt.Println("Missions Loaded")
	fmt.Println("Serving Router")
	go watchLogs(&Journals, &Missions)
	http.ListenAndServe(":8844", router)
}
