import React, { useContext } from 'react';
import { AudioContext } from '../AudioContext';
import { AUDIO_TRACKS } from '../data/audioTracks';

const SpotifyApp = () => {
  const {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    selectTrack,
    seek,
    volume,
    setVolume,
  } = useContext(AudioContext);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSliderChange = (e) => {
    seek(Number(e.target.value));
  };

  return (
    <div className="mac-content-inner spotify-app">
      <div className="winamp-player">
        <div className="winamp-menu">
          <span className="winamp-menu-item"><span className="ul">D</span>isc</span>
          <span className="winamp-menu-item"><span className="ul">V</span>iew</span>
          <span className="winamp-menu-item"><span className="ul">O</span>ptions</span>
          <span className="winamp-menu-item"><span className="ul">H</span>elp</span>
        </div>

        <div className="winamp-main">
          <div
            className="winamp-visualizer"
            style={{ backgroundColor: currentTrack?.color || '#9fae48' }}
          />

          <div className="winamp-controls-wrapper">
            <div className="winamp-top-row">
              <div className="winamp-toggles">
                <button className="retro-mac-btn" type="button" title="Shuffle" style={{ fontSize: '11px' }}>SHF</button>
                <button className="retro-mac-btn" type="button" title="Repeat" style={{ fontSize: '11px' }}>RPT</button>
              </div>
              <div className="winamp-volume-container">
                <div className="winamp-volume-icon">🔉</div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="winamp-volume-slider"
                />
                <div className="winamp-volume-icon">🔊</div>
              </div>
            </div>

            <div className="winamp-playback-row">
              <button className="retro-mac-btn" type="button" onClick={prevTrack} title="Previous Track">|&lt;</button>
              <button
                className="retro-mac-btn winamp-play-btn"
                type="button"
                onClick={togglePlay}
                title="Play/Pause"
              >
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button className="retro-mac-btn" type="button" onClick={nextTrack} title="Next Track">&gt;|</button>
            </div>

            <div className="winamp-info-blocks">
              <div className="winamp-info-field">{currentTrack ? currentTrack.name : 'No track'}</div>
              <div className="winamp-info-field">Local Audio Player</div>
            </div>
          </div>
        </div>

        <div className="winamp-bottom-row">
          <span className="winamp-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="winamp-slider"
            min="0"
            max={duration || 100}
            value={currentTime || 0}
            onChange={handleSliderChange}
          />
          <span className="winamp-time">{formatTime(duration)}</span>
        </div>

        <div className="winamp-playlist" aria-label="Playlist">
          <div className="winamp-playlist-head">Playlist</div>
          <ul className="winamp-playlist-list">
            {AUDIO_TRACKS.map((track, index) => (
              <li key={track.src}>
                <button
                  type="button"
                  className={`winamp-playlist-item${index === currentTrackIndex ? ' winamp-playlist-item--active' : ''}`}
                  onClick={() => selectTrack(index)}
                >
                  <span
                    className="winamp-playlist-swatch"
                    style={{ backgroundColor: track.color }}
                    aria-hidden="true"
                  />
                  <span className="winamp-playlist-name">{track.name}</span>
                  {index === currentTrackIndex && isPlaying && (
                    <span className="winamp-playlist-now" aria-hidden="true">▶</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpotifyApp;
