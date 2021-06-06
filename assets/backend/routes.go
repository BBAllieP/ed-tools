package main

import "fmt"

type System struct {
	Name    string
	Bodies  []Body
	Visited bool
}

type Body struct {
	Name  string
	Value int
}

type Route struct {
	Name         string
	Path         string
	Type         string
	Destinations []System
}

func acceptRoute(routePath string) {
	fmt.Println(routePath)
	// copy route to appdata storage
	// load route into memory
	// write csv of current routes
	//send route to client to update state
}
