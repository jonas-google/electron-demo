import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// 新增窗口控制的 API
const windowControl = {
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),
  restore: () => ipcRenderer.send('restore-window'),
  close: () => ipcRenderer.send('close-window'),
  isMaximized: () => ipcRenderer.invoke('is-window-maximized')
}

// Use `contextBridge` APIs to expose Electron APIs to renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('windowControl', windowControl) // 暴露自定义的窗口控制方法
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.windowControl = windowControl // Fallback in non-isolated context
}
