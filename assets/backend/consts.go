package main

import (
	"log"
	"os"
	"runtime"
)

func getLogLocation() string {
	if runtime.GOOS == "windows" {
		uhome, err := os.UserHomeDir()
		if err != nil {
			log.Fatal( err )
		}
		return uhome + "\\Saved Games\\Frontier Developments\\Elite Dangerous"
	} else {
		return "../data/Elite Dangerous"
	}
}