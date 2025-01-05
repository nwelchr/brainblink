// main.js
const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");

let tray;
let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // for React to interact with Electron
    },
  });

  // Load the React app from the Webpack Dev Server
  win.loadURL("http://localhost:8080");

  win.on("closed", () => {
    win = null;
  });
};

const createTray = () => {
  tray = new Tray(path.join(__dirname, "assets/icon-dark.png"));
  tray.setToolTip("BrainBlink");

  const contextMenu = Menu.buildFromTemplate([
    { label: "Show App", click: () => createWindow() },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (win) {
      win.show();
      win.focus();
    } else {
      createWindow();
    }
  });
};

app.whenReady().then(() => {
  createTray();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
