package main

import "time"

type Logfile struct {
	path string
	mod time.Time
	lastLine int
}

type Mission struct {
	Id int `json:"MissionID"`
	Name string `json:"Name"`
	Passenger_mission bool `json:"PassengerMission`
	Expires int `json:"Expires"`
	Start time.Time
	End time.Time
	Faction string
	TargetFaction string
	Needed int `json:"Count"`
	Kills int
	Value int `json:"Reward"`
	IsWing bool
	Status string
	Destination string
	Reputation string
} 

type Faction struct {
	Missions []Mission
	Name string
}

type ResumedMissions struct {
	Timestamp time.Time
	Active []Mission `json:"Active"`
	Complete []Mission `json:"Complete"`
	Failed []Mission `json:"Failed"`
}
type ServerMessage struct {
	Action string `json:"action"`
	Value string `json:"value"`
}

type MissionMessage struct {
	Action string `json:"action"`
	Mission Mission `json:"mission"`
}