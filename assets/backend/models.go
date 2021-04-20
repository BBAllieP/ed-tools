package main

import "time"

type Mission struct {
	id int `json:"MissionID"`
	name string `json:"Name"`
	passenger_mission bool `json:"PassengerMission`
	expires int `json:"Expires"`
	start time.Time
	faction string
	targetFaction string
	needed int
	kills int
	value int
	isWing bool
	status string
	destination string
	reputation string
} 

type Faction struct {
	missions []mission
	name string
	reputation int
}

type ResumedMissions struct {
	Timestamp time.Time
	Active []Mission
	Complete []Mission
	Failed []Mission
}