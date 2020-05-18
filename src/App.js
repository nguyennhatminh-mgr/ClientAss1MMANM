import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import './App.css';
import Header from './components/Header';
import MyRouter from './components/MyRouter';

function App() {
  return (
    <Router>
      <div>
        <Header/>
        <MyRouter/>
      </div>
    </Router>
  );
}

export default App;
