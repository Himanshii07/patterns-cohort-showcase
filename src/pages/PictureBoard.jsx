import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabase';
import './PictureBoard.css';

const DEFAULT_BOARD_NAME = 'Patterns 2025';
const STORAGE_BUCKET = 'pictures';

function PictureBoard() {
  const [pictures, setPictures] = useState([]);
  const [boardNames, setBoardNames] = useState([DEFAULT_BOARD_NAME]);
  const [currentBoard, setCurrentBoard] = useState(DEFAULT_BOARD_NAME);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingCaption, setEditingCaption] = useState(null);
  const [captionDraft, setCaptionDraft] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchPictures = async () => {
    const { data, error } = await supabase
      .from('pictures')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching pictures:', error);
      alert('Could not load shared pictures from Supabase.');
      return;
    }

    const fetchedPictures = data || [];
    setPictures(fetchedPictures);

    const uniqueBoards = [...new Set(fetchedPictures.map((picture) => picture.board_name).filter(Boolean))];

    if (uniqueBoards.length === 0) {
      setBoardNames([DEFAULT_BOARD_NAME]);
      setCurrentBoard((prev) => prev || DEFAULT_BOARD_NAME);
      return;
    }

    const nextBoards = uniqueBoards.includes(DEFAULT_BOARD_NAME)
      ? uniqueBoards
      : [DEFAULT_BOARD_NAME, ...uniqueBoards];

    setBoardNames(nextBoards);
    setCurrentBoard((prev) => (prev && nextBoards.includes(prev) ? prev : nextBoards[0]));
  };

  useEffect(() => {
    fetchPictures();
  }, []);

  const getCurrentBoardPictures = () => {
    return pictures.filter((picture) => picture.board_name === currentBoard);
  };

  const createNewBoard = () => {
    const trimmedName = newBoardName.trim();

    if (!trimmedName) return;

    if (boardNames.includes(trimmedName)) {
      alert('A board with this name already exists.');
      return;
    }

    setBoardNames((prev) => [...prev, trimmedName]);
    setCurrentBoard(trimmedName);
    setNewBoardName('');
    setShowNewBoardModal(false);
  };

  const getFileExtension = (file, fallback = 'jpg') => {
    if (file?.name?.includes('.')) {
      return file.name.split('.').pop().toLowerCase();
    }

    if (file?.type?.includes('/')) {
      return file.type.split('/').pop().toLowerCase();
    }

    return fallback;
  };

  const uploadImageToStorage = async (file) => {
    const fileExt = getFileExtension(file);
    const fileName = `${currentBoard}-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${currentBoard}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image to storage:', uploadError);
      alert('Could not upload image to Supabase Storage.');
      return null;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return { publicUrl: data.publicUrl, filePath };
  };

  const savePictureRecord = async (imageSrc, pictureType, pictureCaption = 'Untitled', storagePath = null) => {
    const { error } = await supabase.from('pictures').insert({
      board_name: currentBoard,
      src: imageSrc,
      caption: pictureCaption,
      timestamp: new Date().toISOString(),
      type: storagePath ? `${pictureType}:${storagePath}` : pictureType
    });

    if (error) {
      console.error('Error saving picture:', error);
      alert('Could not save picture to Supabase.');
      return false;
    }

    return true;
  };

  const deleteBoard = async (boardName) => {
    if (boardNames.length === 1) {
      alert('Cannot delete the last board!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this board and all its pictures?')) {
      const boardPictures = pictures.filter((picture) => picture.board_name === boardName);

      for (const picture of boardPictures) {
        const storagePath = picture.type?.includes(':') ? picture.type.split(':').slice(1).join(':') : null;

        if (storagePath) {
          await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
        }
      }

      const { error } = await supabase
        .from('pictures')
        .delete()
        .eq('board_name', boardName);

      if (error) {
        console.error('Error deleting board pictures:', error);
        alert('Could not delete the board.');
        return;
      }

      const nextBoards = boardNames.filter((name) => name !== boardName);
      setBoardNames(nextBoards);

      if (currentBoard === boardName) {
        setCurrentBoard(nextBoards[0] || DEFAULT_BOARD_NAME);
      }

      fetchPictures();
    }
  };

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
          videoRef.current.play().catch((err) => {
            console.error('Error playing video:', err);
          });
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert(`Could not access camera: ${err.message}\nPlease check permissions in your browser settings.`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
    setCaption('');
  };

  const playCameraSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const bufferSize = audioContext.sampleRate * 0.1;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise1 = audioContext.createBufferSource();
    noise1.buffer = buffer;
    const gain1 = audioContext.createGain();
    noise1.connect(gain1);
    gain1.connect(audioContext.destination);

    gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    noise1.start(audioContext.currentTime);
    noise1.stop(audioContext.currentTime + 0.05);

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

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      playCameraSound();

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  const saveCapturedPhoto = async () => {
    if (!capturedImage) return;

    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });

    const uploadResult = await uploadImageToStorage(file);

    if (!uploadResult) return;

    const success = await savePictureRecord(
      uploadResult.publicUrl,
      'camera',
      caption.trim() || 'Untitled',
      uploadResult.filePath
    );

    if (success) {
      stopCamera();
      fetchPictures();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const uploadResult = await uploadImageToStorage(file);

      if (!uploadResult) return;

      const success = await savePictureRecord(
        uploadResult.publicUrl,
        'upload',
        'Untitled',
        uploadResult.filePath
      );

      if (success) {
        fetchPictures();
      }
    }

    e.target.value = '';
  };

  const updateCaption = async (pictureId, newCaption) => {
    const { error } = await supabase
      .from('pictures')
      .update({ caption: newCaption })
      .eq('id', pictureId);

    if (error) {
      console.error('Error updating caption:', error);
      alert('Could not update caption.');
      return;
    }

    setEditingCaption(null);
    setCaptionDraft('');
    fetchPictures();
  };

  const deletePicture = async (pictureId) => {
    const pictureToDelete = pictures.find((picture) => picture.id === pictureId);
    const storagePath = pictureToDelete?.type?.includes(':')
      ? pictureToDelete.type.split(':').slice(1).join(':')
      : null;

    if (storagePath) {
      const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
      }
    }

    const { error } = await supabase.from('pictures').delete().eq('id', pictureId);

    if (error) {
      console.error('Error deleting picture:', error);
      alert('Could not delete picture.');
      return;
    }

    fetchPictures();
  };

  const currentBoardPictures = getCurrentBoardPictures();

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
                  {boardNames.map((boardName) => (
                    <div key={boardName} className="board-tab-wrapper">
                      <button
                        className={`board-tab ${currentBoard === boardName ? 'active' : ''}`}
                        onClick={() => setCurrentBoard(boardName)}
                      >
                        📁 {boardName} ({pictures.filter((p) => p.board_name === boardName).length})
                      </button>
                      {boardNames.length > 1 && (
                        <button
                          className="delete-board-btn"
                          onClick={() => deleteBoard(boardName)}
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
                <button onClick={createNewBoard} className="modal-btn primary">
                  Create
                </button>
                <button onClick={() => setShowNewBoardModal(false)} className="modal-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCamera && (
          <div className="camera-modal">
            <div className="camera-container">
              <div className="camera-header">
                <h3>
                  Say Cheese! <span className="header-icon" aria-hidden="true">📷</span>
                </h3>
                <button className="close-btn" onClick={stopCamera}>
                  ✕
                </button>
              </div>

              {!capturedImage ? (
                <>
                  <video ref={videoRef} autoPlay playsInline className="camera-video" />
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

        {currentBoardPictures.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">📷</span>
            <h2>No Pictures in {currentBoard} Yet!</h2>
            <p>Start capturing memories by taking a photo or uploading one</p>
          </div>
        ) : (
          <>
            <div className="pictures-count">
              <span className="count-badge">{currentBoardPictures.length}</span>
              <span className="count-text">
                {currentBoardPictures.length === 1 ? 'memory in' : 'memories in'} {currentBoard}
              </span>
            </div>

            <div className="pictures-grid">
              {currentBoardPictures.map((picture, index) => (
                <div
                  key={picture.id}
                  className="picture-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img src={picture.src} alt={picture.caption} />
                  <div className="picture-overlay">
                    <button className="delete-btn" onClick={() => deletePicture(picture.id)}>
                      🗑️
                    </button>
                  </div>
                  <div className="picture-caption-area">
                    {editingCaption === picture.id ? (
                      <input
                        type="text"
                        value={captionDraft}
                        onChange={(e) => setCaptionDraft(e.target.value)}
                        onBlur={() => updateCaption(picture.id, captionDraft.trim() || 'Untitled')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateCaption(picture.id, captionDraft.trim() || 'Untitled');
                          }
                          if (e.key === 'Escape') {
                            setEditingCaption(null);
                            setCaptionDraft('');
                          }
                        }}
                        autoFocus
                        className="caption-edit-input"
                      />
                    ) : (
                      <p
                        className="picture-caption"
                        onClick={() => {
                          setEditingCaption(picture.id);
                          setCaptionDraft(picture.caption || '');
                        }}
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
  const createNewBoard = () => {
    const trimmedName = newBoardName.trim();

    if (!trimmedName) return;

    if (boardNames.includes(trimmedName)) {
      alert('A board with this name already exists.');
      return;
    }

    setBoardNames((prev) => [...prev, trimmedName]);
    setCurrentBoard(trimmedName);
    setNewBoardName('');
    setShowNewBoardModal(false);
  };

  const getFileExtension = (file, fallback = 'jpg') => {
    if (file?.name?.includes('.')) {
      return file.name.split('.').pop().toLowerCase();
    }

    if (file?.type?.includes('/')) {
      return file.type.split('/').pop().toLowerCase();
    }

    return fallback;
  };

  const uploadImageToStorage = async (file) => {
    const fileExt = getFileExtension(file);
    const fileName = `${currentBoard}-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${currentBoard}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image to storage:', uploadError);
      alert('Could not upload image to Supabase Storage.');
      return null;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return { publicUrl: data.publicUrl, filePath };
  };

  const savePictureRecord = async (imageSrc, pictureType, pictureCaption = 'Untitled', storagePath = null) => {
    const { error } = await supabase.from('pictures').insert({
      board_name: currentBoard,
      src: imageSrc,
      caption: pictureCaption,
      timestamp: new Date().toISOString(),
      type: storagePath ? `${pictureType}:${storagePath}` : pictureType
    });

    if (error) {
      console.error('Error saving picture:', error);
      alert('Could not save picture to Supabase.');
      return false;
    }

    return true;
  };

  const deleteBoard = async (boardName) => {
    if (boardNames.length === 1) {
      alert('Cannot delete the last board!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this board and all its pictures?')) {
      const boardPictures = pictures.filter((picture) => picture.board_name === boardName);

      for (const picture of boardPictures) {
        const storagePath = picture.type?.includes(':') ? picture.type.split(':').slice(1).join(':') : null;

        if (storagePath) {
          await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
        }
      }

      const { error } = await supabase
        .from('pictures')
        .delete()
        .eq('board_name', boardName);

      if (error) {
        console.error('Error deleting board pictures:', error);
        alert('Could not delete the board.');
        return;
      }

      const nextBoards = boardNames.filter((name) => name !== boardName);
      setBoardNames(nextBoards);

      if (currentBoard === boardName) {
        setCurrentBoard(nextBoards[0] || DEFAULT_BOARD_NAME);
      }

      fetchPictures();
    }
  };

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
          videoRef.current.play().catch((err) => {
            console.error('Error playing video:', err);
          });
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert(`Could not access camera: ${err.message}\nPlease check permissions in your browser settings.`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
    setCaption('');
  };

  const playCameraSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const bufferSize = audioContext.sampleRate * 0.1;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise1 = audioContext.createBufferSource();
    noise1.buffer = buffer;
    const gain1 = audioContext.createGain();
    noise1.connect(gain1);
    gain1.connect(audioContext.destination);

    gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    noise1.start(audioContext.currentTime);
    noise1.stop(audioContext.currentTime + 0.05);

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

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      playCameraSound();

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  const saveCapturedPhoto = async () => {
    if (!capturedImage) return;

    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });

    const uploadResult = await uploadImageToStorage(file);

    if (!uploadResult) return;

    const success = await savePictureRecord(
      uploadResult.publicUrl,
      'camera',
      caption.trim() || 'Untitled',
      uploadResult.filePath
    );

    if (success) {
      stopCamera();
      fetchPictures();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const uploadResult = await uploadImageToStorage(file);

      if (!uploadResult) return;

      const success = await savePictureRecord(
        uploadResult.publicUrl,
        'upload',
        'Untitled',
        uploadResult.filePath
      );

      if (success) {
        fetchPictures();
      }
    }

    e.target.value = '';
  };

  const updateCaption = async (pictureId, newCaption) => {
    const { error } = await supabase
      .from('pictures')
      .update({ caption: newCaption })
      .eq('id', pictureId);

    if (error) {
      console.error('Error updating caption:', error);
      alert('Could not update caption.');
      return;
    }

    setEditingCaption(null);
    setCaptionDraft('');
    fetchPictures();
  };

  const deletePicture = async (pictureId) => {
    const pictureToDelete = pictures.find((picture) => picture.id === pictureId);
    const storagePath = pictureToDelete?.type?.includes(':')
      ? pictureToDelete.type.split(':').slice(1).join(':')
      : null;

    if (storagePath) {
      const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
      }
    }

    const { error } = await supabase.from('pictures').delete().eq('id', pictureId);

    if (error) {
      console.error('Error deleting picture:', error);
      alert('Could not delete picture.');
      return;
    }

    fetchPictures();
  };

  const currentBoardPictures = getCurrentBoardPictures();

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
                  {boardNames.map((boardName) => (
                    <div key={boardName} className="board-tab-wrapper">
                      <button
                        className={`board-tab ${currentBoard === boardName ? 'active' : ''}`}
                        onClick={() => setCurrentBoard(boardName)}
                      >
                        📁 {boardName} ({pictures.filter((p) => p.board_name === boardName).length})
                      </button>
                      {boardNames.length > 1 && (
                        <button
                          className="delete-board-btn"
                          onClick={() => deleteBoard(boardName)}
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
                <button onClick={createNewBoard} className="modal-btn primary">
                  Create
                </button>
                <button onClick={() => setShowNewBoardModal(false)} className="modal-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCamera && (
          <div className="camera-modal">
            <div className="camera-container">
              <div className="camera-header">
                <h3>
                  Say Cheese! <span className="header-icon" aria-hidden="true">📷</span>
                </h3>
                <button className="close-btn" onClick={stopCamera}>
                  ✕
                </button>
              </div>

              {!capturedImage ? (
                <>
                  <video ref={videoRef} autoPlay playsInline className="camera-video" />
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

        {currentBoardPictures.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">📷</span>
            <h2>No Pictures in {currentBoard} Yet!</h2>
            <p>Start capturing memories by taking a photo or uploading one</p>
          </div>
        ) : (
          <>
            <div className="pictures-count">
              <span className="count-badge">{currentBoardPictures.length}</span>
              <span className="count-text">
                {currentBoardPictures.length === 1 ? 'memory in' : 'memories in'} {currentBoard}
              </span>
            </div>

            <div className="pictures-grid">
              {currentBoardPictures.map((picture, index) => (
                <div
                  key={picture.id}
                  className="picture-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img src={picture.src} alt={picture.caption} />
                  <div className="picture-overlay">
                    <button className="delete-btn" onClick={() => deletePicture(picture.id)}>
                      🗑️
                    </button>
                  </div>
                  <div className="picture-caption-area">
                    {editingCaption === picture.id ? (
                      <input
                        type="text"
                        value={captionDraft}
                        onChange={(e) => setCaptionDraft(e.target.value)}
                        onBlur={() => updateCaption(picture.id, captionDraft.trim() || 'Untitled')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateCaption(picture.id, captionDraft.trim() || 'Untitled');
                          }
                          if (e.key === 'Escape') {
                            setEditingCaption(null);
                            setCaptionDraft('');
                          }
                        }}
                        autoFocus
                        className="caption-edit-input"
                      />
                    ) : (
                      <p
                        className="picture-caption"
                        onClick={() => {
                          setEditingCaption(picture.id);
                          setCaptionDraft(picture.caption || '');
                        }}
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
    const trimmedName = newBoardName.trim();

    if (!trimmedName) return;

    if (boardNames.includes(trimmedName)) {
      alert('A board with this name already exists.');
      return;
    }

    setBoardNames((prev) => [...prev, trimmedName]);
    setCurrentBoard(trimmedName);
    setNewBoardName('');
    setShowNewBoardModal(false);
  };

  const getFileExtension = (file, fallback = 'jpg') => {
    if (file?.name?.includes('.')) {
      return file.name.split('.').pop().toLowerCase();
    }

    if (file?.type?.includes('/')) {
      return file.type.split('/').pop().toLowerCase();
    }

    return fallback;
  };

  const uploadImageToStorage = async (file) => {
    const fileExt = getFileExtension(file);
    const fileName = `${currentBoard}-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${currentBoard}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image to storage:', uploadError);
      alert('Could not upload image to Supabase Storage.');
      return null;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return { publicUrl: data.publicUrl, filePath };
  };

  const savePictureRecord = async (imageSrc, pictureType, pictureCaption = 'Untitled', storagePath = null) => {
    const { error } = await supabase.from('pictures').insert({
      board_name: currentBoard,
      src: imageSrc,
      caption: pictureCaption,
      timestamp: new Date().toISOString(),
      type: storagePath ? `${pictureType}:${storagePath}` : pictureType
    });

    if (error) {
      console.error('Error saving picture:', error);
      alert('Could not save picture to Supabase.');
      return false;
    }

    return true;
  };

  const deleteBoard = async (boardName) => {
    if (boardNames.length === 1) {
      alert('Cannot delete the last board!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this board and all its pictures?')) {
      const boardPictures = pictures.filter((picture) => picture.board_name === boardName);

      for (const picture of boardPictures) {
        const storagePath = picture.type?.includes(':') ? picture.type.split(':').slice(1).join(':') : null;

        if (storagePath) {
          await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
        }
      }

      const { error } = await supabase
        .from('pictures')
        .delete()
        .eq('board_name', boardName);

      if (error) {
        console.error('Error deleting board pictures:', error);
        alert('Could not delete the board.');
        return;
      }

      const nextBoards = boardNames.filter((name) => name !== boardName);
      setBoardNames(nextBoards);

      if (currentBoard === boardName) {
        setCurrentBoard(nextBoards[0] || DEFAULT_BOARD_NAME);
      }

      fetchPictures();
    }
  };

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
          videoRef.current.play().catch((err) => {
            console.error('Error playing video:', err);
          });
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert(`Could not access camera: ${err.message}\nPlease check permissions in your browser settings.`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
    setCaption('');
  };

  const playCameraSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const bufferSize = audioContext.sampleRate * 0.1;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise1 = audioContext.createBufferSource();
    noise1.buffer = buffer;
    const gain1 = audioContext.createGain();
    noise1.connect(gain1);
    gain1.connect(audioContext.destination);

    gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    noise1.start(audioContext.currentTime);
    noise1.stop(audioContext.currentTime + 0.05);

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

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      playCameraSound();

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  const saveCapturedPhoto = async () => {
    if (!capturedImage) return;

    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });

    const uploadResult = await uploadImageToStorage(file);

    if (!uploadResult) return;

    const success = await savePictureRecord(
      uploadResult.publicUrl,
      'camera',
      caption.trim() || 'Untitled',
      uploadResult.filePath
    );

    if (success) {
      stopCamera();
      fetchPictures();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const uploadResult = await uploadImageToStorage(file);

      if (!uploadResult) return;

      const success = await savePictureRecord(
        uploadResult.publicUrl,
        'upload',
        'Untitled',
        uploadResult.filePath
      );

      if (success) {
        fetchPictures();
      }
    }

    e.target.value = '';
  };

  const updateCaption = async (pictureId, newCaption) => {
    const { error } = await supabase
      .from('pictures')
      .update({ caption: newCaption })
      .eq('id', pictureId);

    if (error) {
      console.error('Error updating caption:', error);
      alert('Could not update caption.');
      return;
    }

    setEditingCaption(null);
    fetchPictures();
  };

  const deletePicture = async (pictureId) => {
    const pictureToDelete = pictures.find((picture) => picture.id === pictureId);
    const storagePath = pictureToDelete?.type?.includes(':')
      ? pictureToDelete.type.split(':').slice(1).join(':')
      : null;

    if (storagePath) {
      const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
      }
    }

    const { error } = await supabase.from('pictures').delete().eq('id', pictureId);

    if (error) {
      console.error('Error deleting picture:', error);
      alert('Could not delete picture.');
      return;
    }

    fetchPictures();
  };

  const currentBoardPictures = getCurrentBoardPictures();

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
                  {boardNames.map((boardName) => (
                    <div key={boardName} className="board-tab-wrapper">
                      <button
                        className={`board-tab ${currentBoard === boardName ? 'active' : ''}`}
                        onClick={() => setCurrentBoard(boardName)}
                      >
                        📁 {boardName} ({pictures.filter((p) => p.board_name === boardName).length})
                      </button>
                      {boardNames.length > 1 && (
                        <button
                          className="delete-board-btn"
                          onClick={() => deleteBoard(boardName)}
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
                <button onClick={createNewBoard} className="modal-btn primary">
                  Create
                </button>
                <button onClick={() => setShowNewBoardModal(false)} className="modal-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCamera && (
          <div className="camera-modal">
            <div className="camera-container">
              <div className="camera-header">
                <h3>
                  Say Cheese! <span className="header-icon" aria-hidden="true">📷</span>
                </h3>
                <button className="close-btn" onClick={stopCamera}>
                  ✕
                </button>
              </div>

              {!capturedImage ? (
                <>
                  <video ref={videoRef} autoPlay playsInline className="camera-video" />
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

        {currentBoardPictures.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">📷</span>
            <h2>No Pictures in {currentBoard} Yet!</h2>
            <p>Start capturing memories by taking a photo or uploading one</p>
          </div>
        ) : (
          <>
            <div className="pictures-count">
              <span className="count-badge">{currentBoardPictures.length}</span>
              <span className="count-text">
                {currentBoardPictures.length === 1 ? 'memory in' : 'memories in'} {currentBoard}
              </span>
            </div>

            <div className="pictures-grid">
              {currentBoardPictures.map((picture, index) => (
                <div
                  key={picture.id}
                  className="picture-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img src={picture.src} alt={picture.caption} />
                  <div className="picture-overlay">
                    <button className="delete-btn" onClick={() => deletePicture(picture.id)}>
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
