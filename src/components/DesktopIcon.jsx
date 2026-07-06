import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

const DesktopIcon = ({
  label,
  icon,
  selected,
  onClick,
  onDoubleClick,
  position,
  layoutEpoch,
  highlight = false,
}) => {
  const nodeRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const dragStartPos = useRef(null);
  const [pos, setPos] = useState(position);

  // Reset to the layout position whenever the layout recomputes (derived
  // state during render, per React docs, instead of a cascading effect).
  const [layoutKey, setLayoutKey] = useState({ layoutEpoch, x: position.x, y: position.y });
  if (
    layoutKey.layoutEpoch !== layoutEpoch ||
    layoutKey.x !== position.x ||
    layoutKey.y !== position.y
  ) {
    setLayoutKey({ layoutEpoch, x: position.x, y: position.y });
    setPos(position);
  }

  const handleDragStart = (e, data) => {
    dragStartPos.current = { x: data.x, y: data.y };
  };

  const handleDragStop = (e, data) => {
    if (!dragStartPos.current) return;
    const dx = data.x - dragStartPos.current.x;
    const dy = data.y - dragStartPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) {
      onClick();
      if (isMobile && onDoubleClick) {
        onDoubleClick();
      }
    } else {
      setPos({ x: data.x, y: data.y });
    }
    dragStartPos.current = null;
  };

  const isImageIcon =
    typeof icon === 'string' &&
    (icon.startsWith('/') ||
      icon.startsWith('./') ||
      icon.startsWith('../') ||
      icon.endsWith('.png') ||
      icon.endsWith('.svg') ||
      icon.endsWith('.gif'));

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      grid={[20, 20]}
      position={pos}
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      <div
        ref={nodeRef}
        className={`icon-container ${selected ? 'selected' : ''}${highlight ? ' icon-container--beacon' : ''}`}
        onDoubleClick={onDoubleClick}
      >
        <div className="icon-box">
          {isImageIcon ? <img src={icon} alt={label} className="desktop-icon-image" /> : icon}
        </div>
        <div className="icon-label">{label}</div>
      </div>
    </Draggable>
  );
};

export default DesktopIcon;
