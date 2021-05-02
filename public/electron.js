const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
	REDUX_DEVTOOLS,
} = require("electron-devtools-installer");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");
var child = require("child_process").execFile;
var backendPath = "../assets/backend/bin/backend-amd64.exe";
let mainWindow;

child(backendPath, function (err, data) {
	if (err) {
		console.error(err);
		return;
	}
	console.log(data.toString());
});

function createWindow() {
	mainWindow = new BrowserWindow({ width: 900, height: 680 });
	mainWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	mainWindow.on("closed", () => (mainWindow = null));
}
app.on("ready", () => {
	installExtension(REACT_DEVELOPER_TOOLS)
		.then((name) => console.log(`Added Extension: ${name}`))
		.catch((err) => console.log("An error occurred: ", err));
});
app.on("ready", () => {
	installExtension(REDUX_DEVTOOLS)
		.then((name) => console.log(`Added Extension: ${name}`))
		.catch((err) => console.log("An error occurred: ", err));
});
app.on("ready", createWindow);

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
