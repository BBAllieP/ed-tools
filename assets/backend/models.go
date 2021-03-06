package main

import "time"

type Logfile struct {
	Path         string    `json:"path""`
	Mod          time.Time `json:"mod""`
	LastLine     int
	LastLoad     int
	Game_version string
}

type Mission struct {
	Id                 int    `json:"MissionID"`
	Name               string `json:"Name"`
	Passenger_mission  bool   `json:"PassengerMission`
	Expires            int    `json:"Expires"`
	Start              time.Time
	End                time.Time
	Faction            string
	TargetFaction      string
	Needed             int `json:"Count"`
	Kills              int
	Value              int `json:"Reward"`
	IsWing             bool
	Status             string
	DestinationSystem  string
	DestinationStation string
	Reputation         string
	TargetType         string `json:"TargetType_Localised"`
	SourceMode         string
}

type Faction struct {
	Missions []Mission
	Name     string
}

type ResumedMissions struct {
	Timestamp time.Time
	Active    []Mission `json:"Active"`
	Complete  []Mission `json:"Complete"`
	Failed    []Mission `json:"Failed"`
}
type ServerMessage struct {
	Action string `json:"action"`
	Value  string `json:"value"`
}

type MissionMessage struct {
	Action  string  `json:"action"`
	Mission Mission `json:"mission"`
}
type MissionsMessage struct {
	Action   string    `json:"action"`
	Missions []Mission `json:"missions"`
}

type FactionsMessage struct {
	Action   string    `json:"action"`
	Factions []Faction `json:"factions"`
}
type JournalsMessage struct {
	Action string    `json:"action"`
	Logs   []Logfile `json:"journals"`
}
type Message struct {
	Action string      `json:"action"`
	Body   interface{} `json:"body"`
}
