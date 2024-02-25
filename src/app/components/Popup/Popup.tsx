import React from 'react';
import './Popup.scss';

interface PopupProps {
  timeResult: string | null;
  onShareClick: () => void;
  onRetryClick: () => void;
}

const Popup: React.FC<PopupProps> = ({ timeResult, onShareClick, onRetryClick }) => {
  return (
    <div className="popup">
      <div className="congrats-msg">
        <p>Congratulations! You completed the challenge.</p>
      </div>

      <div className="time-result">
        <p>Time taken: {timeResult} seconds</p>
      </div>

      <button className="share-btn" onClick={onShareClick}>
        Share
      </button>

      <button className="retry-btn" onClick={onRetryClick}>
        Retry
      </button>
    </div>
  );
};

export default Popup;
