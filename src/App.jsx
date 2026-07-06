import React, { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import BootScreen from './components/BootScreen';
import MenuBar from './components/MenuBar';
import DesktopIcon from './components/DesktopIcon';
import Window from './components/Window';
import MusicBar from './components/MusicBar';
import SocialDock from './components/SocialDock';
import SetupWizard from './components/SetupWizard';
import { AudioProvider } from './AudioProvider';
import { attachClickSounds } from './clickSounds';
import {
  getDesktopLayout,
  getLargeAppWindowSize,
  getResponsiveWindowSize,
  getViewportSize,
} from './desktopLayout';

const SpotifyApp = lazy(() => import('./components/SpotifyApp'));
const WorkApp = lazy(() => import('./components/WorkApp'));
const ReadmeResumeApp = lazy(() => import('./components/ReadmeResumeApp'));
const CVApp = lazy(() => import('./components/CVApp'));
const DoomApp = lazy(() => import('./components/DoomApp'));
const FinderApp = lazy(() => import('./components/FinderApp'));
const AimApp = lazy(() => import('./components/AimApp'));
const HelpWindow = lazy(() => import('./components/HelpWindow'));
const ContactPanel = lazy(() => import('./components/ContactPanel'));

/** Apple menu "About" box; clicking the apple three times is easter egg #5. */
function AboutMacDialog() {
  const [bites, setBites] = useState(0);
  const eaten = bites >= 3;
  return (
    <div className="mac-content-inner about-mac">
      <div className="about-mac-top">
        <img
          src="/apple-logo.svg"
          alt="Apple logo"
          className="about-mac-apple"
          onClick={() => setBites((n) => n + 1)}
        />
        <div>
          <p className="about-mac-title">{eaten ? 'About This Human' : 'Mac OS 9.2'}</p>
          <p className="about-mac-sub">
            {eaten
              ? 'powered by coffee and shipped code. you found a secret 🏆'
              : 'lovingly emulated in your browser'}
          </p>
        </div>
      </div>
      <div className="about-mac-rows">
        <div className="about-mac-row"><span>Built-in Memory:</span><span>640 K (enough for anybody)</span></div>
        <div className="about-mac-row"><span>Virtual Memory:</span><span>vibes</span></div>
        <div className="about-mac-row"><span>Largest Unused Block:</span><span>my free time</span></div>
        <div className="about-mac-row"><span>Made by:</span><span>Tyler Riccardi, Orlando FL</span></div>
      </div>
    </div>
  );
}

function LazyPane({ children, minHeight = 420 }) {
  return (
    <Suspense
      fallback={(
        <div className="mac-content-inner mac-lazy-loading" style={{ minHeight }}>
          <p>Loading…</p>
        </div>
      )}
    >
      {children}
    </Suspense>
  );
}

function App() {
  const [booted, setBooted] = useState(false);
  const [showAppStickies, setShowAppStickies] = useState(false);
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [finderViewMode, setFinderViewMode] = useState('icons');
  const [layoutVersion, setLayoutVersion] = useState(0);
  const [viewport, setViewport] = useState(getViewportSize);
  const [customFolders, setCustomFolders] = useState([]);
  const folderCounterRef = useRef(0);

  useEffect(() => {
    let timeoutId;
    const scheduleLayoutSync = (repositionIcons) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewport(getViewportSize());
        if (repositionIcons) setLayoutVersion((v) => v + 1);
      }, 80);
    };

    setViewport(getViewportSize());
    const onResize = () => scheduleLayoutSync(true);
    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('scroll', onResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('scroll', onResize);
    };
  }, []);

  useEffect(() => {
    if (!booted) return undefined;
    return attachClickSounds();
  }, [booted]);

  const openWindow = useCallback((id, title, content, isCentered = false, options = {}) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        return prev.map((w) => (
          w.id === id ? { ...w, title, content, minimized: false, ...options } : w
        ));
      }
      return [...prev, { id, title, content, isCentered, minimized: false, ...options }];
    });
    setActiveWindow(id);
  }, []);

  const closeWindowById = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindow((curr) => (curr === id ? null : curr));
  }, []);

  const openSetupWizard = useCallback(() => {
    const close = () => closeWindowById('wizard');
    const initialSize = getResponsiveWindowSize({ width: 648, height: 492 });
    openWindow(
      'wizard',
      'Setup Assistant',
      <SetupWizard onFinish={close} onCancel={close} />,
      true,
      { initialSize, autoFit: false }
    );
  }, [openWindow, closeWindowById]);

  const closeWindow = useCallback((id) => {
    if (id === 'finder') setShowAppStickies(false);
    closeWindowById(id);
  }, [closeWindowById]);

  const openAboutMac = useCallback(() => {
    openWindow('about-mac', 'About This Computer', <AboutMacDialog />, true, {
      initialSize: getResponsiveWindowSize({ width: 460, height: 260 }),
      autoFit: false,
    });
  }, [openWindow]);

  const rebootDesktop = useCallback(() => {
    setWindows([]);
    setActiveWindow(null);
    setShowAppStickies(false);
    setBooted(false);
  }, []);

  // Easter egg: the Konami code summons a very sorry system error.
  const openBombDialog = useCallback(() => {
    openWindow(
      'syserror',
      'System Error',
      <div className="mac-content-inner bomb-dialog">
        <div className="bomb-row">
          <span className="bomb-icon" aria-hidden="true">💣</span>
          <div>
            <p className="bomb-title">Sorry, a system error occurred.</p>
            <p className="bomb-body">
              &ldquo;konami code accepted&rdquo;
              <br />
              Error ID = -1984. Nothing is actually broken. Nice work, player one, 30 lives granted.
            </p>
          </div>
        </div>
        <div className="bomb-actions">
          <button type="button" className="retro-mac-btn" onClick={() => closeWindowById('syserror')}>
            Restart
          </button>
          <button type="button" className="retro-mac-btn" onClick={() => closeWindowById('syserror')}>
            Continue
          </button>
        </div>
      </div>,
      true,
      { initialSize: getResponsiveWindowSize({ width: 440, height: 220 }), autoFit: false }
    );
  }, [openWindow, closeWindowById]);

  useEffect(() => {
    const KONAMI = [
      'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
      'arrowleft', 'arrowright', 'arrowleft', 'arrowright',
      'b', 'a',
    ];
    let progress = 0;
    const onKeyDown = (event) => {
      const target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      const key = event.key.toLowerCase();
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        openBombDialog();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openBombDialog]);

  const focusWindow = useCallback((id) => {
    setActiveWindow(id);
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: false } : w)));
  }, []);

  const toggleMinimize = useCallback((id) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)));
  }, []);

  const handleBoot = () => {
    setBooted(true);
    setTimeout(() => {
      openSetupWizard();
    }, 500);
  };

  const openReadmeResume = useCallback(() => {
    openWindow('readme-resume', 'readme.txt', <LazyPane minHeight={360}><ReadmeResumeApp /></LazyPane>, true, {
      initialSize: getLargeAppWindowSize({ minWidth: 640, minHeight: 480, widthRatio: 0.62, heightRatio: 0.72 }),
      autoFit: false,
    });
  }, [openWindow]);

  const openAboutMe = useCallback(() => {
    openWindow(
      'about',
      'About Me',
      <div className="mac-content-inner">
        <p>Welcome to my classic space.</p>
        <p>I am a creative. I stand to Normalize Niche.</p>
        <p>Doing passions because I want to.</p>
        <hr style={{ border: 0, borderTop: '1px solid #8b8b8b', margin: '14px 0 10px' }} />
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Turning my penny stocks into vintage Carhartt jackets.</li>
          <li>Treating my closet of vintage tees like a diversified investment portfolio.</li>
          <li>Living life on my own terms (and wearing 90s denim).</li>
        </ul>
      </div>
    );
  }, [openWindow]);

  const openContact = useCallback(() => {
    openWindow('contact', 'Contact', <LazyPane minHeight={280}><ContactPanel /></LazyPane>, true, {
      initialSize: getLargeAppWindowSize({ minWidth: 480, minHeight: 380, widthRatio: 0.48, heightRatio: 0.55 }),
      autoFit: false,
    });
  }, [openWindow]);

  const openHD = useCallback(() => {
    openWindow(
      'hd',
      'Macintosh HD',
      <div className="mac-content-inner mac-hd-note">
        <p className="mac-hd-greeting">This is Mac&nbsp;OS&nbsp;9.</p>
        <p>I like old stuff - hope you like it too.</p>
        <p className="mac-hd-sig">- ty</p>
      </div>
    );
  }, [openWindow]);

  const desktopApps = useMemo(
    () => [
      {
        id: 'readme',
        label: 'readme.txt',
        shortName: 'Resume',
        kind: 'document',
        size: '84 K',
        icon: '/desktop-icons/readme.png',
        action: openReadmeResume,
      },
      {
        id: 'spotify',
        label: 'spotify.exe',
        shortName: 'Music',
        kind: 'application',
        size: '112 K',
        icon: '/desktop-icons/spotify.png',
        action: () =>
          openWindow('spotify', 'Spotify Player', <LazyPane minHeight={280}><SpotifyApp /></LazyPane>, true, {
            initialSize: getResponsiveWindowSize({ width: 300, height: 380 }),
            autoFit: false,
          }),
      },
      {
        id: 'about',
        label: 'About Me',
        shortName: 'About',
        kind: 'document',
        size: '14 K',
        icon: '/desktop-icons/about.png',
        action: openAboutMe,
      },
      {
        id: 'doom',
        label: 'Doom',
        shortName: 'Doom',
        kind: 'application',
        size: '2.1 MB',
        icon: '/desktop-icons/doom.png',
        action: () =>
          openWindow('doom', 'Doom', <LazyPane minHeight={520}><DoomApp /></LazyPane>, true, {
            initialSize: getLargeAppWindowSize({ minWidth: 760, minHeight: 560, widthRatio: 0.78 }),
            autoFit: false,
          }),
      },
      {
        id: 'hd',
        label: 'Macintosh HD',
        shortName: 'HD',
        kind: 'disk',
        size: '-',
        icon: '/desktop-icons/hd.png',
        action: openHD,
      },
      {
        id: 'aim',
        label: 'AOL',
        shortName: 'AOL',
        kind: 'application',
        size: '8 K',
        icon: '/desktop-icons/aim-runner-v2.svg',
        action: () =>
          openWindow('aim', 'AOL Instant Messenger', <LazyPane minHeight={480}><AimApp /></LazyPane>, true, {
            initialSize: getLargeAppWindowSize({
              minWidth: 460,
              minHeight: 560,
              widthRatio: 0.36,
              heightRatio: 0.78,
            }),
            autoFit: false,
          }),
      },
      {
        id: 'contact',
        label: 'Contact',
        shortName: 'Email',
        kind: 'document',
        size: '4 K',
        icon: '/desktop-icons/contact.png',
        action: openContact,
      },
      {
        id: 'work',
        label: 'Work',
        shortName: 'Work',
        kind: 'folder',
        size: '-',
        icon: '/desktop-icons/work.png',
        action: () =>
          openWindow('work', 'Work', <LazyPane minHeight={640}><WorkApp /></LazyPane>, true, {
            initialSize: getLargeAppWindowSize({ minWidth: 860, minHeight: 680 }),
            autoFit: false,
          }),
      },
      {
        id: 'cv',
        label: 'CV',
        shortName: 'CV',
        kind: 'document',
        size: '42 K',
        icon: '/desktop-icons/cv.png',
        action: () =>
          openWindow('cv', 'CV', <LazyPane minHeight={420}><CVApp /></LazyPane>, true, {
            initialSize: getLargeAppWindowSize({ minWidth: 680, minHeight: 540, widthRatio: 0.68, heightRatio: 0.75 }),
            autoFit: false,
          }),
      },
    ],
    [openWindow, openReadmeResume, openAboutMe, openContact, openHD]
  );

  const openFinder = useCallback(
    (modeOverride) => {
      const mode = modeOverride || finderViewMode;
      openWindow(
        'finder',
        'Applications',
        <LazyPane><FinderApp apps={desktopApps} viewMode={mode} /></LazyPane>,
        true
      );
    },
    [openWindow, desktopApps, finderViewMode]
  );

  useEffect(() => {
    const existing = windows.find((w) => w.id === 'finder');
    if (existing) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === 'finder'
            ? { ...w, content: <LazyPane><FinderApp apps={desktopApps} viewMode={finderViewMode} /></LazyPane> }
            : w
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finderViewMode, desktopApps]);

  const handleNewFolder = useCallback(() => {
    folderCounterRef.current += 1;
    const n = folderCounterRef.current;
    const id = `folder-${Date.now()}-${n}`;
    const label = n === 1 ? 'untitled folder' : `untitled folder ${n}`;
    setCustomFolders((prev) => [...prev, { id, label }]);
  }, []);

  const handleOpenSelected = useCallback(() => {
    if (!selectedIcon) return;
    const app = desktopApps.find((a) => a.id === selectedIcon);
    if (app) app.action();
  }, [selectedIcon, desktopApps]);

  const handlePrint = useCallback(() => {
    try {
      window.print();
    } catch {
      /* no-op */
    }
  }, []);

  const handleCloseActive = useCallback(() => {
    if (activeWindow) closeWindow(activeWindow);
    else if (windows.length > 0) closeWindow(windows[windows.length - 1].id);
  }, [activeWindow, windows, closeWindow]);

  const handleMinimizeActive = useCallback(() => {
    const target = activeWindow || (windows.length ? windows[windows.length - 1].id : null);
    if (target) toggleMinimize(target);
  }, [activeWindow, windows, toggleMinimize]);

  const handleBringAllToFront = useCallback(() => {
    setWindows((prev) => prev.map((w) => ({ ...w, minimized: false })));
    if (windows.length && !activeWindow) setActiveWindow(windows[windows.length - 1].id);
  }, [windows, activeWindow]);

  const execClipboard = useCallback((command) => {
    try {
      if (command === 'copy' && navigator.clipboard && window.getSelection) {
        const sel = window.getSelection().toString();
        if (sel) {
          navigator.clipboard.writeText(sel).catch(() => {});
          return;
        }
      }
      document.execCommand(command);
    } catch {
      /* no-op */
    }
  }, []);

  const handleClear = useCallback(() => {
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
    setSelectedIcon(null);
  }, []);

  const handleSetViewMode = useCallback(
    (mode) => {
      setFinderViewMode(mode);
      const hasFinder = windows.some((w) => w.id === 'finder');
      if (!hasFinder) openFinder(mode);
      else setActiveWindow('finder');
    },
    [windows, openFinder]
  );

  const handleCleanUp = useCallback(() => {
    setSelectedIcon(null);
    setLayoutVersion((v) => v + 1);
  }, []);

  const menuActions = useMemo(
    () => ({
      Apple: [
        { label: 'About This Computer…', onClick: openAboutMac },
        { divider: true },
        { label: 'Sleep', disabled: true },
        { label: 'Restart…', onClick: rebootDesktop },
        { label: 'Shut Down', onClick: rebootDesktop },
      ],
      File: [
        { label: 'New Folder', shortcut: '⌘N', onClick: handleNewFolder },
        {
          label: 'Open',
          shortcut: '⌘O',
          onClick: handleOpenSelected,
          disabled: !selectedIcon,
        },
        { label: 'Print…', shortcut: '⌘P', onClick: handlePrint },
        { label: 'Close Window', shortcut: '⌘W', onClick: handleCloseActive, disabled: !activeWindow && windows.length === 0 },
      ],
      Edit: [
        { label: 'Undo', shortcut: '⌘Z', onClick: () => execClipboard('undo') },
        { label: 'Cut', shortcut: '⌘X', onClick: () => execClipboard('cut') },
        { label: 'Copy', shortcut: '⌘C', onClick: () => execClipboard('copy') },
        { label: 'Paste', shortcut: '⌘V', onClick: () => execClipboard('paste') },
        { label: 'Clear', onClick: handleClear },
      ],
      View: [
        {
          label: 'as Icons',
          onClick: () => handleSetViewMode('icons'),
          checked: finderViewMode === 'icons',
        },
        {
          label: 'as List',
          onClick: () => handleSetViewMode('list'),
          checked: finderViewMode === 'list',
        },
        { label: 'Clean Up', onClick: handleCleanUp },
      ],
      Window: [
        { label: 'Minimize Window', shortcut: '⌘M', onClick: handleMinimizeActive, disabled: windows.length === 0 },
        { label: 'Bring All to Front', onClick: handleBringAllToFront, disabled: windows.length === 0 },
      ],
    }),
    [
      handleNewFolder,
      handleOpenSelected,
      handlePrint,
      handleCloseActive,
      activeWindow,
      windows.length,
      execClipboard,
      handleClear,
      handleSetViewMode,
      finderViewMode,
      handleCleanUp,
      openAboutMac,
      rebootDesktop,
      handleMinimizeActive,
      handleBringAllToFront,
      selectedIcon,
    ]
  );

  if (!booted) {
    return <BootScreen onBoot={handleBoot} />;
  }

  const layout = getDesktopLayout(viewport.width, viewport.height);
  const { leftColumnX, rightColumnX, iconY } = layout;

  // One-line Stickies blurbs for each desktop icon, toggled from Finder.
  const APP_STICKY_NOTES = {
    readme: 'the formal resume, Word 95 style. save or print it',
    spotify: 'lo-fi tunes while you browse, hit play',
    about: 'who I am, in one little window',
    doom: 'yes, it really runs. W/S to move, space to shoot',
    hd: 'the whole drive: poke through every file on this desktop',
    aim: 'AOL me. mini tyler is always online and talks back',
    contact: 'send me a note, I actually reply',
    work: 'the main event: everything I build lives in here',
    cv: 'the interactive CV: stats, timeline, the whole story',
  };

  const renderMiniSticky = (app, index, side) => {
    const note = APP_STICKY_NOTES[app.id];
    if (!note) return null;
    const left = side === 'left' ? leftColumnX + 88 : rightColumnX - 188;
    return (
      <button
        key={`sticky-${app.id}`}
        type="button"
        className={`desktop-sticky desktop-sticky--mini${index % 2 ? ' desktop-sticky--tilt-b' : ''}`}
        style={{ left, top: iconY(index) + 6, animationDelay: `${index * 0.07}s` }}
        onClick={(e) => {
          e.stopPropagation();
          app.action();
        }}
      >
        <span className="desktop-sticky-body">{note}</span>
      </button>
    );
  };

  const leftColumnIds = ['readme', 'spotify', 'about', 'doom'];
  const leftApps = leftColumnIds
    .map((id) => desktopApps.find((a) => a.id === id))
    .filter(Boolean);
  const rightApps = desktopApps.filter((a) => !leftColumnIds.includes(a.id));

  return (
    <AudioProvider>
      <MenuBar
        onOpenHelp={() => {
          openWindow('help', 'Wiz Tree', <LazyPane minHeight={320}><HelpWindow /></LazyPane>, true, {
            initialSize: getLargeAppWindowSize({ minWidth: 560, minHeight: 440, widthRatio: 0.58, heightRatio: 0.62 }),
            autoFit: false,
          });
          setShowAppStickies((value) => !value);
        }}
        onOpenFinder={() => {
          openFinder();
          setShowAppStickies((value) => !value);
        }}
        menuActions={menuActions}
      />
      <div className="desktop-area" onClick={() => setSelectedIcon(null)}>

        {leftApps.map((app, i) => (
          <DesktopIcon
            key={app.id}
            label={app.label}
            icon={app.icon}
            selected={selectedIcon === app.id}
            onClick={() => setSelectedIcon(app.id)}
            onDoubleClick={app.action}
            layoutEpoch={layoutVersion}
            position={{ x: leftColumnX, y: iconY(i) }}
          />
        ))}

        {rightApps.map((app, i) => (
          <DesktopIcon
            key={app.id}
            label={app.label}
            icon={app.icon}
            selected={selectedIcon === app.id}
            onClick={() => setSelectedIcon(app.id)}
            onDoubleClick={app.action}
            layoutEpoch={layoutVersion}
            position={{ x: rightColumnX, y: iconY(i) }}
            highlight={app.id === 'work'}
          />
        ))}

        {showAppStickies && !layout.isMobile && (
          <>
            {leftApps.map((app, i) => renderMiniSticky(app, i, 'left'))}
            {rightApps.map((app, i) => renderMiniSticky(app, i, 'right'))}
          </>
        )}

        {!layout.isMobile && !showAppStickies && (
          <button
            type="button"
            className="desktop-sticky"
            style={{
              left: rightColumnX - 258,
              top: iconY(rightApps.findIndex((a) => a.id === 'work')) - 4,
            }}
            onClick={(e) => {
              e.stopPropagation();
              desktopApps.find((a) => a.id === 'work')?.action();
            }}
          >
            <span className="desktop-sticky-title">read me first!</span>
            <span className="desktop-sticky-body">
              everything I&apos;ve built is in the <strong>Work</strong> folder: products,
              quant research &amp; open source
            </span>
            <span className="desktop-sticky-cta">click to open ▸</span>
            <span className="desktop-sticky-arrow" aria-hidden="true">→</span>
          </button>
        )}

        {customFolders.map((folder, i) => (
          <DesktopIcon
            key={folder.id}
            label={folder.label}
            icon="📁"
            selected={selectedIcon === folder.id}
            onClick={() => setSelectedIcon(folder.id)}
            onDoubleClick={() =>
              openWindow(
                folder.id,
                folder.label,
                <div className="mac-content-inner">
                  <p>This folder is empty.</p>
                  <p className="empty-folder-hint">(nothing here but us pixels)</p>
                </div>
              )
            }
            layoutEpoch={layoutVersion}
            position={{
              x: layout.isMobile ? leftColumnX + 90 : leftColumnX + 100,
              y: iconY(i),
            }}
          />
        ))}

        <div className="window-container">
          {windows.map((win, index) => (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              zIndex={activeWindow === win.id ? 1000 : 100 + index}
              onClick={() => focusWindow(win.id)}
              onClose={() => closeWindow(win.id)}
              minimized={win.minimized}
              onToggleMinimize={() => toggleMinimize(win.id)}
              initialSize={win.initialSize}
              autoFit={win.autoFit ?? true}
              centered={win.isCentered}
            >
              {win.content}
            </Window>
          ))}
        </div>

      </div>

      <div className="desktop-chrome" onClick={(e) => e.stopPropagation()}>
        <MusicBar />
        <SocialDock />
      </div>
    </AudioProvider>
  );
}

export default App;
