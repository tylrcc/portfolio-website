import React, { useEffect, useRef, useState } from 'react';

const BOT_NAME = 'Mini Tyler';
const YOUR_NAME = 'xXguestXx';

/** One unique line per 10% of warning, then the sign-off at 100%. */
const WARN_LINES = [
  'warned at 10%. cute.',
  "20%? I've survived worse. (dial-up)",
  '30% and rising. tyler would NEVER.',
  "40%. I'm telling the real Tyler about this.",
  'half warned. do you kiss your modem with that mouth?',
  '60%. my lawyer (also me) will be in touch.',
  '70%?? I literally helped you find easter eggs.',
  '80%. the running man is running out of patience.',
  "90%. one more and I'm gone. I mean it.",
  "I'm not answering any of your questions. *Mini Tyler has signed off*",
];

const pick = (options) => options[Math.floor(Math.random() * options.length)];

/** First matching rule wins, so put the specific stuff on top. */
const RULES = [
  {
    re: /f+u+c*k+\s*(you|u|off)/i,
    out: [
      'fuck you too, buddy 😤',
      'right back at you, champ. anyway, seen the Work folder?',
      "wow. fuck ME? no no. fuck YOU. ...ok we good? we good.",
    ],
  },
  {
    re: /(fuck|shit|bitch|asshole|dumbass|stupid|stfu|suck|trash)/i,
    out: [
      "watch it, I'm like 40% of a whole Tyler",
      'strong words for someone in MY buddy list',
      "I'd warn you but the Warn button is literally right there",
    ],
  },
  {
    re: /who\s*(is|'?s)?\s*(this|that|you|u)\b|who are (you|u)/i,
    out: [
      "hi, I'm a mini version of Tyler. the full-size one is busy shipping.",
      'MiniTylr. 100% of the charm, 4% of the compute.',
      "tyler's screen name from 1999. he never signed off.",
    ],
  },
  {
    re: /how (are|r) (you|u)|how'?s it going|what'?s up|wassup|wyd/i,
    out: [
      "living inside a menu bar, can't complain",
      'idling at 3 fps. you?',
      'waiting for the dial-up to reconnect, the usual',
    ],
  },
  {
    re: /^(hi|hello|hey|yo|sup|howdy|hola)\b/i,
    out: [
      'yo. welcome to 1999.',
      "hey hey. you've got mail. jk, it's just me.",
      'hi 👋 ask me anything, I have like nine answers total',
    ],
  },
  {
    re: /(work|project|portfolio|built|build|make)/i,
    out: [
      "double-click the Work folder. that's the good stuff.",
      'Fourseat, Glasskin, Racketfit, a quant algo... all in the Work folder',
    ],
  },
  {
    re: /(resume|cv|hire|job|intern)/i,
    out: [
      'open CV for the cool version, readme.txt for the formal PDF. very hireable either way.',
      'hiring? the Contact app goes straight to the real Tyler. I accept payment in RAM.',
    ],
  },
  { re: /fourseat/i, out: ["fourseat.dev: an AI boardroom that argues so you don't have to"] },
  {
    re: /glasskin/i,
    out: ["glasskin reads skincare labels so you don't rub endocrine disruptors on your face"],
  },
  {
    re: /(racketfit|tennis)/i,
    out: ['racketfit.vercel.app: your perfect racket in 60 seconds. no sign-up.'],
  },
  {
    re: /(doom|iddqd|idkfa)/i,
    out: [
      "psst... type IDDQD while playing Doom. you didn't hear it from me.",
      'IDKFA works too. rip and tear.',
    ],
  },
  {
    re: /(konami|easter egg|secret|cheat)/i,
    out: ['↑ ↑ ↓ ↓ ← → ← → B A. on the desktop. trust me.'],
  },
  {
    re: /(love|marry|cute|date)/i,
    out: ['aw. buddy list forever 💛', 'careful, I reboot and forget everything'],
  },
  { re: /(lol|lmao|haha|rofl)/i, out: ['i know right', "I'm hilarious for a for-loop"] },
  {
    re: /(how old|age|asl)/i,
    out: ['a/s/l? 26/bot/menu bar', 'old enough to remember dial-up. (I am dial-up)'],
  },
  {
    re: /(bye|goodbye|later|gtg|cya|good night)/i,
    out: ['*door slam sound* 🚪', 'later. away message is going up: "shipping."'],
  },
  {
    re: /(help|what can you do)/i,
    out: ['try: "who is this", "what do you build", "doom"... or insult me. I dare you.'],
  },
];

const FALLBACKS = [
  'brb, dial-up dropped',
  'interesting. and how does that make you feel?',
  'my whole brain is a for-loop, go easy on me',
  'hm. ask about the Work folder, doom, or just talk trash',
  "that's above my pay grade (I'm paid in RAM)",
  '*away message: out shipping. back never.*',
];

const replyTo = (text) => {
  const cleaned = text.trim();
  for (const rule of RULES) {
    if (rule.re.test(cleaned)) return pick(rule.out);
  }
  return pick(FALLBACKS);
};

const RunnerLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g stroke="#000000" strokeWidth="15">
        <path d="M33 20 L30 33" />
        <path d="M32 22 Q41 23 46 16" />
        <path d="M31 25 L22 30" />
        <path d="M30 33 Q39 34 43 43" />
        <path d="M30 33 Q22 40 13 44" />
      </g>
      <circle cx="37" cy="10" r="10" fill="#000000" />
      <g stroke="#ffd200" strokeWidth="8">
        <path d="M33 20 L30 33" />
        <path d="M32 22 Q41 23 46 16" />
        <path d="M31 25 L22 30" />
        <path d="M30 33 Q39 34 43 43" />
        <path d="M30 33 Q22 40 13 44" />
      </g>
      <circle cx="37" cy="10" r="6.5" fill="#ffd200" />
    </g>
  </svg>
);

const AimApp = () => {
  const [messages, setMessages] = useState([
    {
      who: 'bot',
      text: "yo. you've reached mini tyler. say hi, ask about the Work folder, or talk trash. I talk back.",
    },
  ]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [warnLevel, setWarnLevel] = useState(0);
  const [offline, setOffline] = useState(false);
  const logRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const node = logRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const botSays = (text, delay = 450 + Math.random() * 650) => {
    setTyping(true);
    timerRef.current = window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { who: 'bot', text }]);
    }, delay);
  };

  const send = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    setDraft('');
    setMessages((prev) => [...prev, { who: 'you', text }]);

    if (offline) {
      if (/sorry|apolog|my bad|forgive/i.test(text)) {
        setOffline(false);
        setWarnLevel(0);
        botSays("...fine. apology accepted. warning level reset. don't make it weird.");
      } else {
        setMessages((prev) => [
          ...prev,
          { who: 'bot', text: '*auto response from Mini Tyler: signed off. (an apology might work)*' },
        ]);
      }
      return;
    }

    botSays(replyTo(text));
  };

  const warn = () => {
    if (typing || offline) return;
    const next = Math.min(100, warnLevel + 10);
    setWarnLevel(next);
    botSays(WARN_LINES[next / 10 - 1]);
    if (next >= 100) setOffline(true);
  };

  const block = () => {
    if (typing || offline) return;
    botSays(pick([
      "you can't block me. I live here.",
      'blocked?? this is MY buddy list.',
      '*door slam* ...*door creaks back open* hi again.',
    ]));
  };

  return (
    <div className="mac-content-inner aim-app">
      <div className="aim-head">
        <RunnerLogo className="aim-runner" />
        <div className="aim-head-main">
          <div className="aim-buddy">
            <span className="aim-buddy-name">{BOT_NAME}</span>
            <span className={`aim-online${offline ? ' aim-online--off' : ''}`}>
              <span className="aim-online-dot" aria-hidden="true" /> {offline ? 'Offline' : 'Online'}
            </span>
          </div>
          <div className="aim-sub">
            Instant Message &middot; warning level: {warnLevel}%
          </div>
        </div>
        <div className="aim-head-actions">
          <button type="button" className="retro-mac-btn aim-mini-btn" onClick={warn}>
            Warn
          </button>
          <button type="button" className="retro-mac-btn aim-mini-btn" onClick={block}>
            Block
          </button>
        </div>
      </div>

      <div className="aim-log" ref={logRef} aria-live="polite">
        {messages.map((message, index) => (
          <p key={index} className="aim-msg">
            <span className={`aim-name ${message.who === 'bot' ? 'aim-name--them' : 'aim-name--you'}`}>
              {message.who === 'bot' ? BOT_NAME : YOUR_NAME}:
            </span>{' '}
            {message.text}
          </p>
        ))}
        {typing && <p className="aim-typing">{BOT_NAME} is typing&hellip;</p>}
      </div>

      <form className="aim-inputrow" onSubmit={send}>
        <input
          className="aim-input"
          type="text"
          value={draft}
          placeholder="type a message"
          maxLength={280}
          onChange={(event) => setDraft(event.target.value)}
          aria-label="Message"
        />
        <button type="submit" className="retro-mac-btn aim-send">
          Send
        </button>
      </form>
    </div>
  );
};

export default AimApp;
