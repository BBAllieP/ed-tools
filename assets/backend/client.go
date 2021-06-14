package main

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		msg := ServerMessage{}
		err := c.Conn.ReadJSON(&msg)
		if err != nil {
			log.Println(err)
			break
		}
		// print out that message for clarity
		switch msg.Action {
		case "getMissions":
			misMsg := MissionsMessage{"GetAllMissions", Missions}
			c.Pool.Broadcast <- misMsg
		case "getFactions":
			fmt.Println("Factions Requested")
			factMsg := FactionsMessage{"GetAllFactions", bucketFactions(&Missions)}
			c.Pool.Broadcast <- factMsg
		case "getJournals":
			journMsg := JournalsMessage{"GetAllJournals", Journals}
			c.Pool.Broadcast <- journMsg
		case "getRoutes":
			routeMsg := Message{"GetRoutes", CurrentRoute}
			c.Pool.Broadcast <- routeMsg
		case "acceptRoute":
			fmt.Println("accepting route")
			acceptRoute(msg.Value)
		case "copyDestination":
			CopyDest(msg.Value)
		default:
			c.Pool.Broadcast <- Message{"1", []byte("Unhandled Request")}
		}

	}
}

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan interface{}
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan interface{}),
	}
}
func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				fmt.Println(client)
				client.Conn.WriteJSON(Message{Action: "1", Body: "New User Joined..."})
			}

			break
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(Message{Action: "1", Body: "User Disconnected..."})
			}
			break
		case message := <-pool.Broadcast:
			fmt.Println("Sending message to all clients in Pool")
			for client, _ := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
		if len(pool.Clients) > 0 {
			Connected = true
		} else {
			Connected = false
		}
	}
}
