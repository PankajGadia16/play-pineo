import React from 'react';
import Head from './Components/Head';
import Game from './Components/Game'
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

function App() {
  return (
    <Router>

      <div className="App">
        <header className="App-header">
          <p>
            Welcome to Pineo King!
          </p>
          <Routes>
            <Route exact path="/" element={<Head />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
