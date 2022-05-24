import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Home from './Pages/Home'
import Levels from './Pages/Levels';
import Start from './Pages/Start'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/start' element={<Start />} />
        <Route path='/levels' element={<Levels />} />
      </Routes>
    </Router>
  )
}

export default App