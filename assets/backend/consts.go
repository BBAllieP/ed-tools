package main

import (
	"log"
	"os"
	"runtime"

	"github.com/gorilla/websocket"
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

var clientConn *websocket.Conn