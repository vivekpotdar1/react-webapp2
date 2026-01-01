// main.jsx is the first JavaScript file the browser runs.
// It "mounts" (attaches) our React app into the <div id="root"> in index.html.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* StrictMode helps catch common mistakes while developing. */}
    <App />
  </React.StrictMode>
)
