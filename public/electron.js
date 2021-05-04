const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require("electron-is-dev");
//if(isDev){
	const { default: installExtension, REACT_DEVELOPER_TOOLS,REDUX_DEVTOOLS } = require('electron-devtools-installer');
//}
const url = require("url");
const execFile = require("child_process").execFile;
const path = require("path");
var backendPath = path.join(process.resourcesPath, "assets", "backend", "bin", "backend-amd64.exe");

function runBackend(){
	console.log("starting backend")
	let workerProcess = execFile(backendPath);
	  // print normal background executable output
  workerProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });
 
     // Print the wrong background executable output
  workerProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
 
     // output after exiting
  workerProcess.on('close', function (code) {
    console.log('out code：' + code);
  });
}


let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ width: 900, height: 680 });
	//mainWindow.setMenu(null);
	mainWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	mainWindow.on("closed", () => (mainWindow = null));
	
}

app.on("ready", ()=> {
	//runBackend();
	createWindow();

});

app.on("ready", () => {
	if(isDev){
		installExtension(REACT_DEVELOPER_TOOLS)
		.then((name) => console.log(`Added Extension: ${name}`))
		.catch((err) => console.log("An error occurred: ", err));
		installExtension(REDUX_DEVTOOLS)
		.then((name) => console.log(`Added Extension: ${name}`))
		.catch((err) => console.log("An error occurred: ", err));
	}

});


app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
