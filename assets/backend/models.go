package main

type mission struct {
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

type faction struct {
	missions []mission
	name string
	reputation int
}