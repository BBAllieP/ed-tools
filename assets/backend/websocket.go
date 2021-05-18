package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

//var clients = make(map[*websocket.Conn]bool) // connected clients
//var client *websocket.Conn
var connected = false
var broadcast = make(chan MissionMessage) // broadcast channel

// We'll need to define an Upgrader
// this will require a Read and Write buffer size
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	// We'll need to check the origin of our connection
	// this will allow us to make requests from our React
	// development server to here.
	// For now, we'll do no checking and just allow any connection
	CheckOrigin: func(r *http.Request) bool { return true },
}

// define a reader which will listen for
// new messages being sent to our WebSocket
// endpoint
func reader(conn *websocket.Conn) {
	for {
		// read in a message
		msg := ServerMessage{}
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println(err)
			break
		}
		// print out that message for clarity
		switch msg.Action {
		case "getMissions":
			misMsg := MissionsMessage{"GetAllMissions", Missions}
			conn.WriteJSON(misMsg)
		case "getFactions":
			fmt.Println("Factions Requested")
			factMsg := FactionsMessage{"GetAllFactions", bucketFactions(&Missions)}
			conn.WriteJSON(factMsg)
		case "getMissionById":
			val, _ := strconv.Atoi(msg.Value)
			conn.WriteJSON(getMissionByID(&Missions, val))
		case "getJournals":
			journMsg := JournalsMessage{"GetAllJournals", Journals}
			conn.WriteJSON(journMsg)
		default:
			conn.WriteMessage(1, []byte("Unhandled Request"))
		}

	}
}
func writer(client *websocket.Conn) {
	for msg := range broadcast {

		if connected {
			fmt.Println("Sending Message")
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("sending error: %v", err)
				client.Close()
				break
			}
		}
	}
}

// define our WebSocket endpoint
func serveWs(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Host)

	// upgrade this connection to a WebSocket
	// connection
	clientConn, err := upgrader.Upgrade(w, r, nil)
	//client = clientConn
	connected = true
	if err != nil {
		log.Println(err)
	}
	//defer clientConn.Close()
	go writer(clientConn)
	reader(clientConn)
	connected = false
}
func handleHome(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Host)

	w.Write([]byte("Hello"))
}

func setupRoutes() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/ws", serveWs)
	router.HandleFunc("/", handleHome)
	// listen indefinitely for new messages coming
	// through on our WebSocket connection

	return router
}
