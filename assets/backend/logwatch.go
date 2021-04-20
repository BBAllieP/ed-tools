package main

import (
	"log"
	"regexp"

	"github.com/fsnotify/fsnotify"
)

func watchLogs(logLocation string) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	done := make(chan bool)
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				log.Println("event:", event)
				if event.Op&fsnotify.Write == fsnotify.Write {
					match, _ := regexp.MatchString("Journal.*.log", event.Name)
					if match {
						log.Println("modified file:", event.Name)
						readChangedFile(event.Name)
					}
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}
	}()

	err = watcher.Add(logLocation)
	if err != nil {
		log.Fatal(err)
	}
	<-done
}

func readChangedFile(file string) {
	// look at last lines of file and determine the changes
	// first need to determine how many lines are added
	// we know that the only changes are adding lines or creating a new log
	// if we store the last known length of the active logfile we can check
	// the change in length and know how many lines to read
	return
}