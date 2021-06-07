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
			log.Fatal(err)
		}
		return uhome + "\\Saved Games\\Frontier Developments\\Elite Dangerous"
		//return "../templogs"
	} else {
		return "../data/Elite Dangerous"
	}
}

var MsgChan chan interface{}

var ClientConn *websocket.Conn

var Connected bool

var CurrentGameMode string

func getStorageDir() string {
	dir, err := os.UserCacheDir()
	if err != nil {
		panic(err)
	}
	dir = dir + "\\ED-Tools"
	return dir
}
