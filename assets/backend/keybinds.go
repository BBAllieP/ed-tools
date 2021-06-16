package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
)

type Keybind struct {
	Hash    string
	Name    string
	Changed bool
}

func getBindsDir() string {
	dir, err := os.UserCacheDir()
	if err != nil {
		panic(err)
	}
	dir = dir + "\\Frontier Developments\\Elite Dangerous\\Options\\Bindings"
	return dir
}

func updateBinds() {
	//check for binds json in storagedir
	jsonPath := getStorageDir() + "\\binds.json"
	if _, err := os.Stat(jsonPath); err == nil {
		//if there load to []Binds
		bindsfile, err := ioutil.ReadFile(jsonPath)
		if err != nil {
			log.Fatalln("Couldn't open the csv file", err)
		} else {
			_ = json.Unmarshal(bindsFile, &Keybinds)
		}
	}
	//get contents of bindys folder
	bindsDir := getBindsDir()
	files, err := ioutil.ReadDir(bindsDir)
	if err != nil {
		log.Fatalln("couldn't read binds directory")
	}
	for _, f := range files {
		found := false
		// compute hash of new file
		hash := fileHash(bindsDir + "\\" + f.Name())
		for i, b := range Keybinds {
			if b.Name == f.Name() {
				//file exists in both places, compare hash
				found = true
				if hash != b.Hash {
					b.Changed = true
				}
				break
			}
		}
		if !found {
			// copy file to new location
			err := File(bindsDir+"\\"+f.Name(), getStorageDir()+"\\binds\\"+f.Name())
			if err != nil {
				panic(err)
			}
			//create new binds entry
			tempBind := Keybind{hash, f.Name(), true}
			//add to Keybinds []
			Keybinds = append(Keybinds, tempBind)
		}
	}
	// write keybinds file
	writeBindsJson()
}

func writeBindsJson() {
	jsonPath := getStorageDir() + "\\binds.json"
	file, _ := json.MarshalIndent(Keybinds, "", " ")
	_ = ioutil.WriteFile(jsonPath, file, 0644)
}

func BackupBind(name string) {
	for i, b := range Keybinds {
		if b.Name == name {
			// copy bind to appdir
			err := File(getBindsDir()+"\\"+name, getStorageDir()+"\\binds\\"+name)
			if err != nil {
				panic(err)
			}
			// edit struct data to reflect change
			Keybinds[i].Changed = false
			Keybinds[i].Hash = fileHash(getBindsDir() + "\\" + name)
			// write json
			writeBindsJson()
			return
		}
	}
	// if execution reaches here then bind to backup does not exist in struct
}
