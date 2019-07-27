import React from 'react'
import logo from './logo.svg'
import './App.css'
import HomePage from './pages/home/index'

import './styles/index'
import store from './pages/home/store'

const App: React.FC = () => {
  return (
    <div className="App">
      <HomePage title="123" store={store} />
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header> */}
    </div>
  )
}

export default App
