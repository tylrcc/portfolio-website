const CLICK_DOWN_URL = '/click-down.mp3';
const CLICK_UP_URL = '/click-release.mp3';
const POOL_SIZE = 6;

let audioContext = null;
let downBuffer = null;
let upBuffer = null;
let downPool = [];
let upPool = [];
let downPoolIndex = 0;
let upPoolIndex = 0;
let armed = false;
let decodeStarted = false;

function createPool(url, pool) {
  for (let i = 0; i < POOL_SIZE; i += 1) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    audio.load();
    pool.push(audio);
  }
}

function playFromPool(pool, getIndex, setIndex) {
  if (!pool.length) return;
  const idx = getIndex() % pool.length;
  setIndex(idx + 1);
  const audio = pool[idx];
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 0.55;
  void audio.play().catch(() => {});
}

function playBuffer(buffer) {
  if (!audioContext || !buffer) return false;
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
  return true;
}

async function decodeClickBuffers() {
  if (!audioContext || decodeStarted) return;
  decodeStarted = true;
  try {
    const [downRes, upRes] = await Promise.all([
      fetch(CLICK_DOWN_URL),
      fetch(CLICK_UP_URL),
    ]);
    const [downData, upData] = await Promise.all([downRes.arrayBuffer(), upRes.arrayBuffer()]);
    [downBuffer, upBuffer] = await Promise.all([
      audioContext.decodeAudioData(downData),
      audioContext.decodeAudioData(upData),
    ]);
  } catch {
    /* pool fallback remains active */
  }
}

/** Call on first user gesture (boot tap) so mobile browsers allow playback. */
export function armClickSounds() {
  if (armed) return;
  armed = true;

  createPool(CLICK_DOWN_URL, downPool);
  createPool(CLICK_UP_URL, upPool);

  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      audioContext = new Ctx();
      void decodeClickBuffers();
      if (audioContext.state === 'suspended') {
        void audioContext.resume();
      }
    }
  } catch {
    audioContext = null;
  }
}

export function playClickDown() {
  if (!armed) armClickSounds();
  if (!playBuffer(downBuffer)) {
    playFromPool(
      downPool,
      () => downPoolIndex,
      (next) => {
        downPoolIndex = next;
      }
    );
  }
}

export function playClickUp() {
  if (!armed) armClickSounds();
  if (!playBuffer(upBuffer)) {
    playFromPool(
      upPool,
      () => upPoolIndex,
      (next) => {
        upPoolIndex = next;
      }
    );
  }
}

const IGNORE_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

function shouldPlayForTarget(target) {
  if (!(target instanceof Element)) return true;
  return !target.closest(IGNORE_SELECTOR);
}

/**
 * Pointer-based UI clicks: down on press, up on release.
 * Touch taps fire a quick paired click so release audio is not delayed until finger lift.
 */
export function attachClickSounds() {
  const touchReleaseTimers = new Map();

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    if (!shouldPlayForTarget(event.target)) return;

    playClickDown();

    if (event.pointerType === 'touch') {
      const existing = touchReleaseTimers.get(event.pointerId);
      if (existing) clearTimeout(existing);
      const timer = window.setTimeout(() => {
        playClickUp();
        touchReleaseTimers.delete(event.pointerId);
      }, 28);
      touchReleaseTimers.set(event.pointerId, timer);
    }
  };

  const onPointerUp = (event) => {
    if (event.pointerType === 'touch') {
      const timer = touchReleaseTimers.get(event.pointerId);
      if (timer) {
        clearTimeout(timer);
        touchReleaseTimers.delete(event.pointerId);
      }
      return;
    }
    if (!shouldPlayForTarget(event.target)) return;
    playClickUp();
  };

  const onPointerCancel = (event) => {
    const timer = touchReleaseTimers.get(event.pointerId);
    if (timer) {
      clearTimeout(timer);
      touchReleaseTimers.delete(event.pointerId);
    }
  };

  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerCancel, { passive: true });

  return () => {
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);
    touchReleaseTimers.forEach((timer) => clearTimeout(timer));
    touchReleaseTimers.clear();
  };
}
