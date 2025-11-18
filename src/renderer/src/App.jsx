// src/App.js
import React from 'react'
import { Link } from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// 导入页面组件
import Home from './pages/Home'
import About from './pages/About'

// 引入自定义标题栏组件
import TitleBar from './components/TitleBar/TitleBar'

function App() {
  return (
    <Router>
      {/* 自定义标题栏组件 */}
      <TitleBar />

      {/* <nav>
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/about">关于我们</Link>
          </li>
        </ul>
      </nav> */}

      {/* 路由部分 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
