import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Portfolio from './components/Portfolio';
import NotFound from './components/NotFound';


function App() {
  return (
    <div className="CleanCryptoApp">
      <Router>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;