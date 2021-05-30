package main

import (
	"runtime"

	"github.com/gorilla/websocket"
)

func getLogLocation() string {
	if runtime.GOOS == "windows" {
		/*uhome, err := os.UserHomeDir()
		if err != nil {
			log.Fatal(err)
		}
		return uhome + "\\Saved Games\\Frontier Developments\\Elite Dangerous"*/
		return "../templogs"
	} else {
		return "../data/Elite Dangerous"
	}
}

var MsgChan chan interface{}

var ClientConn *websocket.Conn

var Connected bool
