// src/components/ClickableBox.jsx
import React from 'react';
// import "../styles/ClickableBox.css"

function ClickableBox({ to, imageSrc, title, onClick, className = '' }) {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (to) window.open(to, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`clickable-box ${className}`} onClick={handleClick}>
      <div className="image-container">
        {imageSrc && <img src={imageSrc} alt={title} />}
      </div>
      <div>{title}</div>
    </div>
  );
}

export default ClickableBox;

