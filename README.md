# CMDR CPT Allie's Elite Dangerous Companion Tool

This is my custom companion tool for Elite Dangerous.

Currently implemented Massacre Mission stacking assistant


# Future Plans

Route Planner - will take exported CSV files from spansh.co.uk tool, monitor the game journal, and whenever a jump is completed copy the next system to the clipboard so you don't have to tab out to target the next system

Shield Calculator - Go port of D2EA's shield calculator. Since it's already done, easy enough to just include

Fleet monitor - get ship config from game journal and make available for export to tools like Coriolis or Spansh

Engineering? - if everything else gets finished, porting most of EDEngineer with additional features that I wanted like easy switching of recipe files, integration with ship monitor, improvements to material trader suggestions, and suggestions for where to farm materials.

# Architecture

React JS frontend with redux and custom middleware

Golang backend for journal parsing and serving a custom websocket

Frontend communicates exclusively with backend through websocket

All wrapped in Electron for packaging app
