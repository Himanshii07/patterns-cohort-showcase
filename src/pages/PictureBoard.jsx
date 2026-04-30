import { useState, useRef, useEffect } from 'react';
import './PictureBoard.css';

function PictureBoard() {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingCaption, setEditingCaption] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load boards from localStorage on mount
  useEffect(() => {
    const savedBoards = localStorage.getItem('cohortBoards');
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards);
      setBoards(parsedBoards);
      if (parsedBoards.length > 0) {
        setCurrentBoard(parsedBoards[0].id);
      }
    } else {
      // Create default board
      const defaultBoard = {
        id: Date.now(),
        name: 'Patterns 2025',
        pictures: []
      };
      setBoards([defaultBoard]);
      setCurrentBoard(defaultBoard.id);
    }
  }, []);

  // Save boards to localStorage whenever they change
  useEffect(() => {
    if (boards.length > 0) {
      localStorage.setItem('cohortBoards', JSON.stringify(boards));
    }
  }, [boards]);

  const getCurrentBoardData = () => {
    return boards.find(b => b.id === currentBoard);
  };

  const createNewBoard = () => {
    if (newBoardName.trim()) {
      const newBoard = {
        id: Date.now(),
        name: newBoardName.trim(),
        pictures: []
      };
      setBoards([...boards, newBoard]);
      setCurrentBoard(newBoard.id);
      setNewBoardName('');
      setShowNewBoardModal(false);
    }
  };

  const deleteBoard = (boardId) => {
    if (boards.length === 1) {
      alert('Cannot delete the last board!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this board and all its pictures?')) {
      const newBoards = boards.filter(b => b.id !== boardId);
      setBoards(newBoards);
      if (currentBoard === boardId) {
        setCurrentBoard(newBoards[0].id);
      }
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert(`Could not access camera: ${err.message}\nPlease check permissions in your browser settings.`);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
    setCaption('');
  };

  // Play camera shutter sound
  const playCameraSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create white noise for shutter sound
    const bufferSize = audioContext.sampleRate * 0.1; // 100ms
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    // First click (shutter opening)
    const noise1 = audioContext.createBufferSource();
    noise1.buffer = buffer;
    const gain1 = audioContext.createGain();
    noise1.connect(gain1);
    gain1.connect(audioContext.destination);
    
    gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    noise1.start(audioContext.currentTime);
    noise1.stop(audioContext.currentTime + 0.05);
    
    // Second click (shutter closing) - slightly delayed
    const noise2 = audioContext.createBufferSource();
    noise2.buffer = buffer;
    const gain2 = audioContext.createGain();
    noise2.connect(gain2);
    gain2.connect(audioContext.destination);
    
    gain2.gain.setValueAtTime(0.25, audioContext.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.13);
    
    noise2.start(audioContext.currentTime + 0.08);
    noise2.stop(audioContext.currentTime + 0.13);
  };

  // Capture photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      // Play shutter sound
      playCameraSound();
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Flip the canvas horizontally to mirror the image
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  // Save captured photo
  const saveCapturedPhoto = () => {
    if (capturedImage) {
      const newPicture = {
        id: Date.now(),
        src: capturedImage,
        caption: caption.trim() || 'Untitled',
        timestamp: new Date().toISOString(),
        type: 'camera'
      };
      
      setBoards(boards.map(board => 
        board.id === currentBoard 
          ? { ...board, pictures: [newPicture, ...board.pictures] }
          : board
      ));
      
      stopCamera();
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPicture = {
          id: Date.now(),
          src: event.target.result,
          caption: 'Untitled',
          timestamp: new Date().toISOString(),
          type: 'upload'
        };
        
        setBoards(boards.map(board => 
          board.id === currentBoard 
            ? { ...board, pictures: [newPicture, ...board.pictures] }
            : board
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update caption
  const updateCaption = (pictureId, newCaption) => {
    setBoards(boards.map(board => 
      board.id === currentBoard 
        ? {
            ...board,
            pictures: board.pictures.map(pic =>
              pic.id === pictureId ? { ...pic, caption: newCaption } : pic
            )
          }
        : board
    ));
    setEditingCaption(null);
  };

  // Delete picture
  const deletePicture = (pictureId) => {
    setBoards(boards.map(board => 
      board.id === currentBoard 
        ? { ...board, pictures: board.pictures.filter(pic => pic.id !== pictureId) }
        : board
    ));
  };

  const currentBoardData = getCurrentBoardData();
  const pictures = currentBoardData?.pictures || [];

  return (
    <div className="picture-board-page">
      <div className="picture-board-content">
        <section className="board-hero">
          <header className="board-header">
            <h1 className="board-title">
              Our Vibe Check <span className="title-icon" aria-hidden="true">📷</span>
            </h1>
            <p className="board-subtitle">
              capture the moments, organize by cohort, add captions
            </p>
          </header>

          <div className="board-hero-layout">
            <div className="board-hero-card board-hero-card--actions">
              <p className="hero-kicker">Capture Corner</p>
              <h2 className="hero-card-title">Add a new memory</h2>
              <p className="hero-card-text">
                snap something live or upload from your gallery — both land right into your current board.
              </p>

              <div className="action-buttons action-buttons-creative">
                <button
                  className="action-btn camera-btn action-btn-large"
                  onClick={startCamera}
                  disabled={showCamera}
                >
                  <span className="action-btn-emoji" aria-hidden="true">📷</span>
                  <span>
                    <strong>Take a Photo</strong>
                    <small>open camera mode</small>
                  </span>
                </button>
                <button
                  className="action-btn upload-btn action-btn-large"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="action-btn-emoji" aria-hidden="true">🖼️</span>
                  <span>
                    <strong>Upload Photo</strong>
                    <small>pick from device</small>
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="board-hero-card board-hero-card--boards">
              <div className="board-hero-topline">
                <p className="hero-kicker">Boards</p>
                <button
                  className="board-tab new-board-btn hero-new-board-btn"
                  onClick={() => setShowNewBoardModal(true)}
                >
                  + New Board
                </button>
              </div>

              <h2 className="hero-card-title">Pick your vibe bucket</h2>
              <p className="hero-card-text">
                switch between boards to keep each cohort, mood, or memory collection neatly sorted.
              </p>

              <div className="board-selector board-selector-creative">
                <div className="board-tabs">
                  {boards.map(board => (
                    <div key={board.id} className="board-tab-wrapper">
                      <button
                        className={`board-tab ${currentBoard === board.id ? 'active' : ''}`}
                        onClick={() => setCurrentBoard(board.id)}
                      >
                        📁 {board.name} ({board.pictures.length})
                      </button>
                      {boards.length > 1 && (
                        <button
                          className="delete-board-btn"
                          onClick={() => deleteBoard(board.id)}
                          title="Delete board"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Board Modal */}
        {showNewBoardModal && (
          <div className="modal-overlay" onClick={() => setShowNewBoardModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Create New Board</h3>
              <input
                type="text"
                placeholder="e.g., Patterns 2026"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createNewBoard()}
                autoFocus
              />
              <div className="modal-actions">
                <button onClick={createNewBoard} className="modal-btn primary">Create</button>
                <button onClick={() => setShowNewBoardModal(false)} className="modal-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Camera Modal */}
        {showCamera && (
          <div className="camera-modal">
            <div className="camera-container">
              <div className="camera-header">
                <h3>Say Cheese! <span className="header-icon" aria-hidden="true">📷</span></h3>
                <button className="close-btn" onClick={stopCamera}>✕</button>
              </div>
              
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="camera-video"
                  />
                  <button className="capture-btn" onClick={capturePhoto}>
                    <span className="btn-icon" aria-hidden="true">📷</span> Capture
                  </button>
                </>
              ) : (
                <>
                  <img src={capturedImage} alt="Captured" className="captured-preview" />
                  <input
                    type="text"
                    placeholder="Add a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="caption-input"
                  />
                  <div className="preview-actions">
                    <button className="retake-btn" onClick={() => setCapturedImage(null)}>
                      🔄 Retake
                    </button>
                    <button className="save-btn" onClick={saveCapturedPhoto}>
                      ✅ Save
                    </button>
                  </div>
                </>
              )}
              
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>
        )}

        {/* Picture Grid */}
        {pictures.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">📷</span>
            <h2>No Pictures in {currentBoardData?.name} Yet!</h2>
            <p>Start capturing memories by taking a photo or uploading one</p>
          </div>
        ) : (
          <>
            <div className="pictures-count">
              <span className="count-badge">{pictures.length}</span>
              <span className="count-text">
                {pictures.length === 1 ? 'memory in' : 'memories in'} {currentBoardData?.name}
              </span>
            </div>
            
            <div className="pictures-grid">
              {pictures.map((picture, index) => (
                <div 
                  key={picture.id} 
                  className="picture-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img src={picture.src} alt={picture.caption} />
                  <div className="picture-overlay">
                    <button 
                      className="delete-btn"
                      onClick={() => deletePicture(picture.id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="picture-caption-area">
                    {editingCaption === picture.id ? (
                      <input
                        type="text"
                        value={picture.caption}
                        onChange={(e) => updateCaption(picture.id, e.target.value)}
                        onBlur={() => setEditingCaption(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingCaption(null)}
                        autoFocus
                        className="caption-edit-input"
                      />
                    ) : (
                      <p 
                        className="picture-caption"
                        onClick={() => setEditingCaption(picture.id)}
                        title="Click to edit"
                      >
                        {picture.caption}
                      </p>
                    )}
                    <span className="picture-date">
                      {new Date(picture.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PictureBoard;

// Made with Bob
