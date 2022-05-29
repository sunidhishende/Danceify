import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Home from './Pages/Home'
import Levels from './Pages/Levels';
import Level1 from './Pages/Level1'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/level/:id' element={<Level1 />} />
        <Route path='/levels' element={<Levels />} />
      </Routes>
    </Router>
  )
}

export default App