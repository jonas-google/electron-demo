// src/components/TitleBar/TitleBar.jsx
import React, { useState, useEffect } from 'react'
import './TitleBar.css' // 引入标题栏样式

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false)

  // 获取窗口是否最大化
  useEffect(() => {
    window.windowControl.isMaximized().then((maximized) => {
      setIsMaximized(maximized)
    })
  }, [])

  // 最小化窗口
  const minimizeWindow = () => {
    window.windowControl.minimize()
  }

  // 最大化/恢复窗口
  const toggleMaximizeWindow = () => {
    if (isMaximized) {
      window.windowControl.restore()
    } else {
      window.windowControl.maximize()
    }
    setIsMaximized(!isMaximized)
  }

  // 关闭窗口
  const closeWindow = () => {
    window.windowControl.close()
  }

  // 使窗口可以通过标题栏拖动
  useEffect(() => {
    const titlebar = document.getElementById('titlebar')
    const drag = () => {
      window.startDrag() // 启动拖拽
    }

    titlebar.addEventListener('mousedown', drag)

    return () => {
      titlebar.removeEventListener('mousedown', drag)
    }
  }, [])

  return (
    <div id="titlebar">
      <div id="title">My Custom Title</div>
      <div id="window-controls">
        <button onClick={minimizeWindow}>_</button>
        <button onClick={toggleMaximizeWindow}>{isMaximized ? '□' : '⬛'}</button>
        <button onClick={closeWindow}>X</button>
      </div>
    </div>
  )
}

export default TitleBar
