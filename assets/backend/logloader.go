package main

import (
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"time"
)

type Logfile struct {
	path string
	mod time.Time
	active bool
}

// the purpose of this one is to:
// 1) read the most recent log and find the login line
// 2) read the login line and determine the oldest mission
// 3) store the names of all of the logs we will need to parse
// 4) parse all logs in chronological order to determine current state
// 5) set the active log
func getLatestLog(file string) {
	uhome, err := os.UserHomeDir()
	if err != nil {
        log.Fatal( err )
    }
	logLocation := uhome + "\\Saved Games\\Frontier Developments\\Elite Dangerous"
	logs, err := ioutil.ReadDir(logLocation)
	if err != nil {
		log.Fatal(err)
	}
	for _, log := range logs{
		match, err := regexp.MatchString("Journal.*.log", log.Name())
		if err != nil {
			log.Fatal(err)
		}
		if match {
			//Add logfile to slice of logfiles
		}
	}
}