const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// Disable HTTP cache globally for all network requests to ensure fresh content every time
app.commandLine.appendSwitch('disable-http-cache');

// Clear the default session cache once the app is ready
app.once('ready', () => {
  session.defaultSession.clearCache();
});

// Function to create the main application window
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,      // Set initial window width
    height: 800,      // Set initial window height
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration in renderer for security
      contextIsolation: true, // Enable context isolation for better security
    },
  });

  // Load the main HTML file of the app from the 'dist' folder
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

// When Electron is ready, create the main window
app.whenReady().then(createWindow);

// Quit the app when all windows are closed, except on macOS where apps usually stay active
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
