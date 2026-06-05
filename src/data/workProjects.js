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
    'Decision-intelligence workspace for founders and operators — connect your stack, surface cross-source anomalies, and convene a board of AI advisors that debate every signal into one actionable verdict.',
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

/** Pinned on github.com/tylrcc (excluding quantalgo — shown above). */
export const PINNED_OPENSOURCE = [
  {
    id: 'tremor-mesh',
    name: 'tremor-mesh',
    title: 'Tremor Mesh',
    url: 'https://github.com/tylrcc/tremor-mesh',
    description:
      'A $15 seismometer in every home — open-source distributed earthquake early-warning sensor mesh (ESP32 + MEMS).',
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

export const CONNECT_LINKS = [
  { label: 'GitHub', handle: '@tylrcc', href: GITHUB_PROFILE_URL },
  { label: 'LinkedIn', handle: 'in/tylerriccardi', href: 'https://www.linkedin.com/in/tylerriccardi/' },
  { label: 'Site', handle: 'fourseat.dev', href: FOURSEAT_URL },
];
