const { app, BrowserWindow, dialog, Notification, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    // icon:path.join(__dirname, 'icon.png'),
    autoHideMenuBar:true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      partition: 'persist:teams'
    },
  });

  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
  mainWindow.webContents.setUserAgent(userAgent);

  mainWindow.loadURL('https://teams.live.com/v2');

  // Handle permission requests
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log('Permission requested:', permission);
    if (['notifications', 'openExternal', 'window', 'media'].includes(permission)) {
      callback(true);
    } else {
      callback(false);
    }
  });

  // Handle new window requests
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    console.log('[Intercepted new-window]', url);
    // Instead of opening a new window, redirect the main window
    mainWindow.loadURL(url);
    // if (url.startsWith('http:') || url.startsWith('https:')) {
    //   console.log(url);
    //   shell.openExternal(url);
    //   event.preventDefault();
    // }
  });

  // mainWindow.webContents.on("did-create-window", (childWindow, urlObj) => {
  //   if (urlObj.url.startsWith('http:') || urlObj.url.startsWith('https:')) {
  //     console.log(urlObj.url);
  //     mainWindow.loadURL(urlObj.url);
  //   }
  // })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      console.log(url);
      mainWindow.loadURL(url);
    }
    return { action: 'deny' };
  })

  // Handle file selection dialog
  mainWindow.webContents.on('select-file', (event, callback) => {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'openDirectory', 'multiSelections'],
    }).then(result => {
      if (!result.canceled) {
        callback(result.filePaths);
      } else {
        callback([]);
      }
    }).catch(err => {
      console.error('Error in file dialog:', err);
      callback([]);
    });
  });

  mainWindow.webContents.on('notify', ({ title, body }) => {
    new Notification({
      title,
      body,
      timeoutType: 'never' // Try to keep notification visible
    }).show();
  });

  // Create system tray icon
  tray = new Tray(path.join(__dirname, 'icon1.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Teams', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Microsoft Teams');
  tray.setContextMenu(contextMenu);

  // Flash tray icon for notifications
  let flashInterval = null;
  function flashTray() {
    if (flashInterval) return; // Prevent multiple intervals
    let useAltIcon = false;
    const defaultIcon = nativeImage.createFromPath(path.join(__dirname, 'icon1.png'));
    const altIcon = nativeImage.createFromPath(path.join(__dirname, 'icon1.png')); // Optional alternate icon
    flashInterval = setInterval(() => {
      tray.setImage(useAltIcon ? defaultIcon : altIcon);
      useAltIcon = !useAltIcon;
    }, 500);
    setTimeout(() => {
      clearInterval(flashInterval);
      flashInterval = null;
      tray.setImage(defaultIcon);
    }, 5000); // Flash for 5 seconds
  }

  // Enable desktop notifications and intercept Teams notifications
  if (Notification.isSupported()) {
    // Test notification on load
    // mainWindow.webContents.on('did-finish-load', () => {
    //   new Notification({
    //     title: 'Teams Electron App',
    //     body: 'Microsoft Teams is ready!',
    //     timeoutType: 'never' // Try to keep notification visible
    //   }).show();
    // });

    // Intercept Notification API calls from Teams
    mainWindow.webContents.executeJavaScript(`
      (function() {
        const OriginalNotification = window.Notification;
        window.Notification = function(title, options) {
          const notification = new OriginalNotification(title, options);
          window.electronAPI.notify({ title, body: options.body });
          return notification;
        };
        window.Notification.requestPermission = OriginalNotification.requestPermission;
        window.Notification.permission = 'granted';
      })();
    `).catch(err => console.error('Failed to inject notification script:', err));

    // Handle notification clicks to show the app
    mainWindow.webContents.on('notification-shown', () => {
      tray.setToolTip('New Teams message!');
      flashTray();
    });
  }

  // Minimize to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Restore window on tray click
  tray.on('click', () => {
    mainWindow.show();
  });

  // Open DevTools for debugging (optional, comment out in production)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  // Keep app running in background for tray
});

app.on('before-quit', () => {
  app.isQuitting = true;
});