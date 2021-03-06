const Positioner  = require('electron-positioner')
const StateKeeper = require('electron-window-state');
const isReachable = require('is-reachable');


const {
  app,
  BrowserWindow,
  Menu
} = require('electron')

let positioner, mainWindow


function createWindow() {

  let WindowState = StateKeeper({
    defaultWidth: 1280,
    defaultHeight: 720
  });

  mainWindow = new BrowserWindow({
    x: WindowState.x,
    y: WindowState.y,
    width: WindowState.width,
    height: WindowState.height,
    show: false,
    frame: true,
    alwaysOnTop: true,
    backgroundColor: '#000',
    useContentSize: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
    }
  })

  mainWindow.setIgnoreMouseEvents(false)
  mainWindow.once('ready-to-show', () => {
    positioner = new Positioner(mainWindow)
    WindowState.manage(mainWindow);
    mainWindow.show()
  })

  var template = [{
      label: "Application",
      submenu: [
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]
    },

    {
      label: 'View',
      submenu: [{
          role: 'reload'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },

    {
      label: 'Window',
      submenu: [{
          role: 'minimize'
        },
        {
          type: 'checkbox',
          accelerator: "Command+K",
          checked: mainWindow.isAlwaysOnTop(),
          label: "Always on Top",
          click: function() {
            mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
          }
        },
      
        {
          type: 'checkbox',
          accelerator: "Command+L",
          checked: !mainWindow.resizable,
          label: "Lock Size",
          click: function() {
            mainWindow.resizable = !mainWindow.resizable
          }
        },

        {
          label: 'Size',
          submenu: [{
              label: '1920x1080',
              click: function() {
                mainWindow.setSize(1920, 1080)
              }
            },
            {
              label: '1280x720',
              click: function() {
                mainWindow.setSize(1280, 720)
              }
            },
            {
              label: '640x360',
              click: function() {
                mainWindow.setSize(640, 360)
              }
            },
            {
              label: '320x180',
              click: function() {
                mainWindow.setSize(320, 180)
              }
            }
          ]
        },
        {
          label: 'Position',
          submenu: [{
              label: 'Top Left',
              click: function() {
                positioner.move('topLeft')
              }
            },
            {
              label: 'Top Right',
              click: function() {
                positioner.move('topRight')
              }
            },
            {
              label: 'Bottom Left',
              click: function() {
                positioner.move('bottomLeft')
              }
            },
            {
              label: 'Bottom Right',
              click: function() {
                positioner.move('bottomRight')
              }
            }
          ]
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  (async () => {

    let url = (await isReachable('http://192.168.192.2:32400')) ? "http://192.168.192.2:32400/web/index.html" : "https://app.plex.tv/desktop"
    mainWindow.loadURL(url);

  })();

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
      html,
      body {
        -webkit-user-select: none;
        -webkit-app-region: drag;
      }
      a {
        -webkit-app-region: no-drag;
      }
    `);
  });

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})
