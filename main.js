// main.js

const { app, BrowserWindow, Tray, Menu, globalShortcut } = require("electron");
const path = require("path");

let tray = null;
let mainWindow = null;
let resultsWindow = null;

let sessionActive = false;
let timerInterval = null;
let sessionStartTime = null;
let elapsedTime = 0;
let distractionCount = 0;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For React to interact with Electron
    },
  });

  mainWindow.loadURL("http://localhost:8080");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

const createTray = () => {
  tray = new Tray(path.join(__dirname, "assets/icon-dark.png"));
  updateTrayMenu();
};

const formatTime = (seconds) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const updateTrayMenu = () => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: sessionActive ? "Stop Session" : "Start Session",
      click: toggleSession,
    },
    { type: "separator" },
    { label: `Time: ${formatTime(elapsedTime)}`, enabled: false },
    { label: `Distractions: ${distractionCount}`, enabled: false },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
};

const startSession = () => {
  sessionActive = true;
  sessionStartTime = Date.now();
  elapsedTime = 0;
  distractionCount = 0;
  updateTrayMenu();

  timerInterval = setInterval(() => {
    elapsedTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    updateTrayMenu();
  }, 1000);

  const shortcut = "Command+Alt+Control+B";
  const ret = globalShortcut.register(shortcut, () => {
    if (sessionActive) {
      distractionCount += 1;
      updateTrayMenu();
    }
  });

  if (!ret) {
    console.log("Registration of shortcut failed");
  }
};

const stopSession = () => {
  sessionActive = false;
  clearInterval(timerInterval);
  timerInterval = null;

  globalShortcut.unregister("Command+Alt+Control+B");

  updateTrayMenu();

  openResultsWindow();
};

const toggleSession = () => {
  if (sessionActive) {
    stopSession();
  } else {
    startSession();
  }
};

const openResultsWindow = () => {
  resultsWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: "Session Results",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  resultsWindow.loadURL("http://localhost:8080/results");

  resultsWindow.on("closed", () => {
    resultsWindow = null;
  });

  resultsWindow.webContents.on("did-finish-load", () => {
    resultsWindow.webContents.send("session-data", {
      duration: elapsedTime,
      distractions: distractionCount,
    });
  });
};

app.whenReady().then(() => {
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
