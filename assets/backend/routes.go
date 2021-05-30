package main

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
