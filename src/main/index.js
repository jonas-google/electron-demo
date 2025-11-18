import { app, shell, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let tray = null // 用于存储托盘实例
let mainWindow = null // 用于存储主窗口

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    frame: false,
    show: false, // 默认不显示窗口
    autoHideMenuBar: true, // 隐藏标题栏下的菜单栏，配置修改了重启才有效
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show() // 当内容准备好后显示窗口
  })

  // 跟窗口设置有关 start 1
  // 最大化窗口
  ipcMain.on('maximize-window', () => {
    mainWindow.maximize()
  })

  // 恢复窗口
  ipcMain.on('restore-window', () => {
    mainWindow.restore()
  })

  // 关闭窗口
  ipcMain.on('close-window', () => {
    mainWindow.close()
  })

  // 判断窗口是否最大化
  ipcMain.handle('is-window-maximized', () => {
    return mainWindow.isMaximized()
  })
  // end 1

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url) // 拦截并通过外部浏览器打开链接
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // 加载远程URL用于开发，或者加载本地HTML文件用于生产环境
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // 也可以创建一个全新的子窗口,相当于这个地方多了一个新的地址
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 托盘菜单配置
  tray = new Tray(icon) // 设置托盘图标
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开窗口', // 菜单项: 打开窗口
      click: () => {
        mainWindow.show() // 显示主窗口
      }
    },
    {
      label: '退出', // 菜单项: 退出应用
      click: () => {
        app.quit() // 退出应用
      }
    }
  ])

  tray.setToolTip('我的托盘应用') // 设置托盘图标的提示文字
  tray.setContextMenu(contextMenu) // 设置右键菜单

  // 点击托盘图标时，切换窗口的显示和隐藏
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide() // 隐藏窗口
    } else {
      mainWindow.show() // 显示窗口
    }
  })
}

// Electron 启动后，初始化应用窗口和托盘
app.whenReady().then(() => {
  // 设置Windows平台的应用程序ID
  electronApp.setAppUserModelId('com.electron')

  // 默认通过F12打开开发者工具，在开发时自动处理快捷键
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC测试，主进程与渲染进程的通信
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  // 在 macOS 上点击 Dock 图标时，如果没有打开窗口，重新创建窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口关闭时退出应用，除了 macOS 平台
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
