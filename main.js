const Positioner = require('electron-positioner')
const {
  app,
  BrowserWindow,
  Menu
} = require('electron')

let aspect = require("electron-aspectratio");
let path = require('path')
let url = require('url')
var positioner;

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
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
    positioner.move('center')
    mainWindow.show()
  })

  mainWindowHandler = new aspect(mainWindow);
  mainWindowHandler.setRatio(16, 9, 10);

  var template = [{
      label: "Application",
      submenu: [{
          label: "About Application",
          selector: "orderFrontStandardAboutPanel:"
        },
        {
          type: "separator"
        },
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
  mainWindow.loadURL('https://app.plex.tv/desktop');

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
