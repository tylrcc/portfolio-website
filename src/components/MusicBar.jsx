import React, { useContext } from 'react';
import { AudioContext } from '../AudioContext';

const MusicBar = () => {
  const { currentTrack, isPlaying, togglePlay, isMuted, toggleMute } = useContext(AudioContext);

  return (
    <div className="control-strip control-strip--music" onClick={(e) => e.stopPropagation()}>
      <div className="control-strip-handle"></div>
      <button 
        onClick={toggleMute}
        className="control-strip-btn"
        title="Toggle Mute"
      >
        {isMuted ? '🔇' : '🔉'}
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
        className="control-strip-btn" 
        title="Play/Pause"
        style={{ width: '44px', fontSize: '10px', fontWeight: 'bold' }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <div className="control-strip-module control-strip-module--track">
        <span className="control-strip-track-label">
          {currentTrack ? currentTrack.name : 'Ready'}
        </span>
      </div>
    </div>
  );
};

export default MusicBar;
