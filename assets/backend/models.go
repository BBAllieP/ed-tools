package main

import "time"

type Logfile struct {
	path string
	mod time.Time
	active bool
}

type Mission struct {
	Id int `json:"MissionID"`
	Name string `json:"Name"`
	Passenger_mission bool `json:"PassengerMission`
	Expires int `json:"Expires"`
	Start time.Time
	Faction string
	TargetFaction string
	Needed int
	Kills int
	Value int
	IsWing bool
	Status string
	Destination string
	Reputation string
} 

type Faction struct {
	missions []Mission
	name string
	reputation int
}

type ResumedMissions struct {
	Timestamp time.Time
	Active []Mission `json:"Active"`
	Complete []Mission `json:"Complete"`
	Failed []Mission `json:"Failed"`
}
