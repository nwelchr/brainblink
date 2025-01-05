if (process.env.NODE_ENV === "development") {
  try {
    require("electron-reloader")(module);
  } catch (err) {
    console.error("Failed to load electron-reloader:", err);
  }
}

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

  win.loadURL("http://localhost:8080");

  win.on("closed", () => {
    win = null;
  });
};

const createTray = () => {
  tray = new Tray(path.join(__dirname, "assets/icon-dark.png"));
  tray.setToolTip("BrainBlink");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: () => {
        if (win) {
          win.show();
          win.focus();
        } else {
          createWindow();
        }
      },
    },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
};

app.whenReady().then(() => {
  createTray();
});

app.on("activate", () => {
  if (!win) {
    createWindow();
  }
});
