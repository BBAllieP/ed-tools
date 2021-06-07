package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

//var clients = make(map[*websocket.Conn]bool) // connected clients
//var client *websocket.Conn
var broadcast = make(chan interface{}) // broadcast channel

// We'll need to define an Upgrader
// this will require a Read and Write buffer size
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	// We'll need to check the origin of our connection
	// this will allow us to make requests from our React
	// development server to here.
	// For now, we'll do no checking and just allow any connection
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		goodOrigins := []string{"http://localhost:3000", "file://", "chrome-extension://omalebghpgejjiaoknljcfmglgbpocdp"}
		for _, check := range goodOrigins {
			if origin == check {
				return true
			}
		}
		return false
		//return true
	},
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return ws, err
	}
	return ws, nil
}

func writer(pool *Pool) {
	for msg := range broadcast {
		//fmt.Println("Sending Message")
		pool.Broadcast <- msg
	}
}

// define our WebSocket endpoint
func serveWs(pool *Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Header.Get("Origin"))

	// upgrade this connection to a WebSocket
	// connection
	clientConn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	client := &Client{
		Conn: clientConn,
		Pool: pool,
	}
	pool.Register <- client
	client.Read()
}
func handleHome(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Host)

	w.Write([]byte("Hello"))
}

func setupRoutes() *mux.Router {
	router := mux.NewRouter()
	pool := NewPool()
	go pool.Start()
	go writer(pool)
	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
	router.HandleFunc("/", handleHome)
	// listen indefinitely for new messages coming
	// through on our WebSocket connection

	return router
}
