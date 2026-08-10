export const FOURSEAT_URL = 'https://fourseat.dev/';
export const GITHUB_PROFILE_URL = 'https://github.com/tylrcc';

export const FOURSEAT = {
  id: 'fourseat',
  name: 'Fourseat',
  kicker: 'Product',
  title: 'Fourseat',
  url: FOURSEAT_URL,
  logo: '/linkedin/fourseat.png',
  description:
    'Decision-intelligence workspace for founders and operators, connect your stack, surface cross-source anomalies, and convene a board of AI advisors that debate every signal into one actionable verdict.',
  roles: ['Strategist', 'Finance', 'Tech', 'Contrarian', 'Chair'],
  tech: ['React', 'Node.js', 'LLMs', 'Vercel'],
};

export const QUANT_ALGO = {
  id: 'quantalgo',
  name: 'quantalgo-propfirms',
  kicker: 'Quant research',
  title: 'Quant Algo',
  url: 'https://github.com/tylrcc/quantalgo-propfirms',
  description:
    'Prop-firm oriented research stack: walk-forward validation, rank IC and factor hygiene, CVaR objectives with turnover constraints, post-cost simulation, and regime-aware blends.',
  tech: ['Python', 'NumPy', 'SciPy', 'pandas'],
};

/** Pinned on github.com/tylrcc (excluding quantalgo, shown above). */
export const PINNED_OPENSOURCE = [
  {
    id: 'tremor-mesh',
    name: 'tremor-mesh',
    title: 'Tremor Mesh',
    url: 'https://github.com/tylrcc/tremor-mesh',
    description:
      'A $15 seismometer in every home, open-source distributed earthquake early-warning sensor mesh (ESP32 + MEMS).',
    language: 'Python',
    stars: 2,
    tech: ['Python', 'ESP32', 'IoT'],
    icon: '🌐',
  },
  {
    id: 'tapeline',
    name: 'tapeline',
    title: 'Tapeline',
    url: 'https://github.com/tylrcc/tapeline',
    description:
      'FPGA hardware that computes live price averages (moving average & VWAP) as trades arrive, so trading software doesn\'t have to.',
    language: 'Python',
    stars: 0,
    tech: ['Python', 'FPGA', 'HFT'],
    icon: '⚡',
  },
];

/** Everything else on github.com/tylrcc worth a look, shown as a Finder list. */
export const MORE_PROJECTS = [
  {
    id: 'racketfit',
    name: 'racketfit',
    title: 'Racketfit',
    url: 'https://github.com/tylrcc/racketfit',
    live: 'https://racketfit.vercel.app',
    description:
      'Take a quiz, get your complete tennis setup, racket, string, tension, and grip size. 158 rackets and 49 strings.',
    language: 'JavaScript',
    stars: 1,
    icon: '🎾',
    kind: 'Web app',
  },
  {
    id: 'glasskin',
    name: 'glasskin',
    title: 'Glasskin',
    url: null,
    live: 'https://glasskin.vercel.app',
    description:
      'Snap a photo of any skincare label and Glasskin decodes it, endocrine disruptors, pore-cloggers, allergens, and K-beauty actives in plain English.',
    language: 'TypeScript',
    stars: null,
    icon: '🧴',
    kind: 'Product',
    isPrivate: true,
  },
  {
    id: 'llmfit',
    name: 'llmfit',
    title: 'LLMfit',
    url: 'https://github.com/tylrcc/llmfit',
    description:
      'Right-size local LLMs for your hardware, what your machine can run, at what quant, how fast. 100% local.',
    language: 'Python',
    stars: 1,
    icon: '🧠',
    kind: 'CLI tool',
  },
  {
    id: 'hearth',
    name: 'hearth',
    title: 'Hearth',
    url: 'https://github.com/tylrcc/hearth',
    description:
      'Local-LLM tools for your terminal, redact secrets and PII, search code by meaning, 100% offline.',
    language: 'Python',
    stars: 0,
    icon: '🔥',
    kind: 'CLI tool',
  },
  {
    id: 'concourse',
    name: 'concourse',
    title: 'Concourse',
    url: 'https://github.com/tylrcc/concourse',
    live: 'https://starcourse.vercel.app',
    description:
      'The operating layer for group hospitality, venue marketplace, benchmarking insights, and a 14-market growth watchlist.',
    language: 'HTML',
    stars: 0,
    icon: '🥂',
    kind: 'Web app',
  },
  {
    id: 'pebble',
    name: 'pebble',
    title: 'Pebble',
    url: 'https://github.com/tylrcc/pebble',
    description:
      'A clean personal finance app with budgets, accounts, net worth, and proactive money moves.',
    language: 'TypeScript',
    stars: 0,
    icon: '🪙',
    kind: 'Web app',
  },
];

export const CONNECT_LINKS = [
  { label: 'GitHub', handle: '@tylrcc', href: GITHUB_PROFILE_URL },
  { label: 'LinkedIn', handle: 'in/tylerriccardi', href: 'https://www.linkedin.com/in/tylerriccardi/' },
  { label: 'Scholar', handle: 'Google Scholar', href: 'https://scholar.google.com/citations?user=LAJ_11MAAAAJ&hl=en' },
  { label: 'Site', handle: 'fourseat.dev', href: FOURSEAT_URL },
];
