package main

import (
	"fmt"
	"strings"
)

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
	Id           string
	Name         string
	Path         string
	Type         string
	Destinations []System
}

func acceptRoute(routePath string) {
	fmt.Println(routePath)
	newLoc := getStorageDir() + "\\" + strings.Split(routePath, "\\")[len(strings.Split(routePath, "\\"))-1]
	fmt.Println(newLoc)
	// copy route to appdata storage
	err := File(routePath, newLoc)
	if err != nil {
		panic(err)
	}
	// load route into memory
	// write csv of current routes
	//send route to client to update state
}
