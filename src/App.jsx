import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import TheGlowUp from './pages/TheGlowUp';
import Learnings from './pages/Learnings';
import PictureBoard from './pages/PictureBoard';
import AboutMe from './pages/AboutMe';
import './App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-brand">
            <span className="brand-text">patterns.cohort</span>
            <span className="brand-emoji">✨</span>
          </div>
          
          <button 
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>home</Link></li>
            <li><Link to="/glow-up" onClick={() => setMenuOpen(false)}>the glow up </Link></li>
            <li><Link to="/learnings" onClick={() => setMenuOpen(false)}>what i actually learned </Link></li>
            <li><Link to="/picture-board" onClick={() => setMenuOpen(false)}>our vibe check </Link></li>
            <li><Link to="/about-me" onClick={() => setMenuOpen(false)}>about me</Link></li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/glow-up" element={<TheGlowUp />} />
          <Route path="/learnings" element={<Learnings />} />
          <Route path="/picture-board" element={<PictureBoard />} />
          <Route path="/about-me" element={<AboutMe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// Made with Bob
