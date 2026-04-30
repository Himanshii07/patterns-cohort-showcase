import './FloatingDoodles.css';

function FloatingDoodles() {
  return (
    <div className="floating-doodles-container">
      {/* Star doodle */}
      <svg className="floating-doodle doodle-1" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,5 L28,18 L40,18 L30,25 L34,38 L25,30 L16,38 L20,25 L10,18 L22,18 Z" 
              fill="none" stroke="#667eea" strokeWidth="2"/>
      </svg>

      {/* Squiggle */}
      <svg className="floating-doodle doodle-2" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,30 Q20,10 30,30 T50,30" 
              fill="none" stroke="#f093fb" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>

      {/* Circle with dots */}
      <svg className="floating-doodle doodle-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="15" fill="none" stroke="#ffd700" strokeWidth="2"/>
        <circle cx="25" cy="25" r="3" fill="#ffd700"/>
        <circle cx="15" cy="15" r="2" fill="#ffd700" opacity="0.6"/>
        <circle cx="35" cy="35" r="2" fill="#ffd700" opacity="0.6"/>
      </svg>

      {/* Arrow */}
      <svg className="floating-doodle doodle-4" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,30 L40,30 M40,30 L35,25 M40,30 L35,35" 
              fill="none" stroke="#764ba2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* Heart */}
      <svg className="floating-doodle doodle-5" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,40 C25,40 10,30 10,20 C10,15 13,12 17,12 C20,12 23,14 25,17 C27,14 30,12 33,12 C37,12 40,15 40,20 C40,30 25,40 25,40 Z" 
              fill="none" stroke="#f5576c" strokeWidth="2"/>
      </svg>

      {/* Lightning */}
      <svg className="floating-doodle doodle-6" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,5 L15,30 L25,30 L15,55 L30,25 L20,25 Z" 
              fill="none" stroke="#4ecdc4" strokeWidth="2" strokeLinejoin="round"/>
      </svg>

      {/* Spiral */}
      <svg className="floating-doodle doodle-7" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,25 Q30,20 30,25 Q30,30 25,30 Q20,30 20,25 Q20,18 28,18 Q36,18 36,26 Q36,34 28,34" 
              fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round"/>
      </svg>

      {/* Plus */}
      <svg className="floating-doodle doodle-8" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,5 L20,35 M5,20 L35,20" 
              stroke="#f093fb" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default FloatingDoodles;

// Made with Bob
