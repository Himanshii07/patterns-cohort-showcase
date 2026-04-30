import { useEffect, useRef, useState } from 'react';
import FloatingDoodles from '../components/FloatingDoodles';
import './Home.css';

function Home() {
  const drawCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#667eea');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set initial canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffd700', '#4ecdc4', '#ff6b6b', '#000000'];

  return (
    <div className="home-page">
      <FloatingDoodles />
      {/* PNG Doodles */}
      {/*<img src="/Pin.png" alt="pin" className="png-doodle png-pin" 
      <img src="/tattooo.png" alt="tattoo" className="png-doodle png-tattoo" />*/}
      
      <div className="home-content">
        {/* Top Section */}
        <div className="top-section">
          <img src="/Headphones.png" alt="Headphones" className="illustration illustration-headphones" />
          <div className="intro-box">
            <h1 className="main-title">IBM Patterns Cohort</h1>
            <p className="tagline">where gen z learned to adult in tech 💅</p>
            <p className="intro-text">
              we spent weeks learning how IBM actually builds stuff
              (spoiler: it's not just vibes and coffee ☕)
            </p>
          </div>
        </div>

        {/* Drawing Canvas Section */}
        <div className="drawing-section">
          <img src="/Drawsmile.png" alt="Draw smile" className="illustration illustration-pen" />
          <h2 className="canvas-title">✏️ doodle your thoughts here</h2>
          <p className="canvas-subtitle">because sometimes words aren't enough</p>
          
          <div className="canvas-container">
            <canvas
              ref={drawCanvasRef}
              className="drawing-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          <div className="drawing-controls">
            <div className="color-picker">
              <span className="control-label">colors:</span>
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-btn ${currentColor === color && !isEraser ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setCurrentColor(color);
                    setIsEraser(false);
                  }}
                  title={color}
                />
              ))}
            </div>

            <div className="brush-controls">
              <span className="control-label">size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="brush-slider"
              />
              <span className="brush-size-display">{brushSize}px</span>
            </div>

            <div className="tool-buttons">
              <button
                className={`tool-btn ${isEraser ? 'active' : ''}`}
                onClick={() => setIsEraser(!isEraser)}
              >
                🧹 eraser
              </button>
              <button className="tool-btn clear-btn" onClick={clearCanvas}>
                🗑️ clear all
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="info-cards">
            <div className="info-card">
              <svg className="card-doodle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M20,50 Q30,20 50,30 T80,50" stroke="#667eea" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <circle cx="25" cy="45" r="8" fill="#f093fb" opacity="0.6"/>
                <circle cx="75" cy="55" r="6" fill="#ffd700" opacity="0.6"/>
                <path d="M40,60 L45,70 L50,65 L55,75" stroke="#764ba2" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
              <h3>Design Patterns</h3>
              <p>learned how to make things pretty AND functional</p>
            </div>

            <div className="info-card">
              <svg className="card-doodle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="30" stroke="#667eea" strokeWidth="3" fill="none"/>
                <path d="M35,50 L45,60 L65,40" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="30" cy="30" r="5" fill="#f093fb" opacity="0.6"/>
                <circle cx="70" cy="70" r="4" fill="#ffd700" opacity="0.6"/>
              </svg>
              <h3>Accessibility</h3>
              <p>turns out not everyone uses a mouse? mind = blown 🤯</p>
            </div>

            <div className="info-card">
              <svg className="card-doodle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="60" width="15" height="30" fill="#667eea" opacity="0.7" rx="2"/>
                <rect x="42" y="40" width="15" height="50" fill="#764ba2" opacity="0.7" rx="2"/>
                <rect x="64" y="25" width="15" height="65" fill="#f093fb" opacity="0.7" rx="2"/>
                <path d="M15,20 Q50,10 85,20" stroke="#ffd700" strokeWidth="2" fill="none" strokeDasharray="3,3"/>
              </svg>
              <h3>IBM Framework</h3>
              <p>PDLC, EDT, TTV... so many acronyms</p>
            </div>

            <div className="info-card">
              <svg className="card-doodle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M20,70 L30,60 L40,65 L50,50 L60,55 L70,40 L80,45" stroke="#667eea" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="70" r="4" fill="#f093fb"/>
                <circle cx="50" cy="50" r="4" fill="#ffd700"/>
                <circle cx="80" cy="45" r="4" fill="#4ecdc4"/>
                <path d="M25,30 Q35,25 45,30 T65,30" stroke="#764ba2" strokeWidth="2" fill="none"/>
              </svg>
              <h3>Storytelling</h3>
              <p>data without a story is just... numbers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

// Made with Bob
