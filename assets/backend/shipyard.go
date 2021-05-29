package main

type Ship struct {
	Model         string
	ShipID        int
	ShipName      string
	ShipIdent     string
	HullValue     int
	ModulesValue  int
	HullHealth    int
	UnladenMass   int
	CargoCapacity int
	MaxJumpRange  int
	Rebuy         int
	Hot           bool
	Modules       []Module
}

type Module struct {
	Slot         string
	Item         string
	On           bool
	Priority     int
	Health       int
	Value        int
	AmmoInClip   int
	AmmoInHopper int
	Engineering  Engineering
}
type Engineering struct {
	EngineerID         int
	Engineer           string
	BlueprintID        int
	BlueprintName      string
	Level              int
	Quality            int
	ExperimentalEffect string
	Modifications      []Modification
}

type Modification struct {
	Label         string
	Value         float64
	OriginalValue float64
	LessIsGood    bool
}
