import { Platform, ProjectTypeInfo } from '../types';

export const PLATFORMS: Platform[] = [
  {
    id: 'thinkscript',
    name: 'Thinkorswim',
    language: 'thinkScript',
    extension: 'ts',
    description: 'Charles Schwab / TD Ameritrade trading platform.'
  },
  {
    id: 'pinescript',
    name: 'TradingView',
    language: 'Pine Script',
    extension: 'pine',
    description: 'Modern web-based charting and social trading platform.'
  },
  {
    id: 'ninjascript',
    name: 'NinjaTrader',
    language: 'NinjaScript (C#)',
    extension: 'cs',
    description: 'Professional grade trading platform for futures and forex.'
  },
  {
    id: 'mql4',
    name: 'MetaTrader 4',
    language: 'MQL4',
    extension: 'mq4',
    description: 'Legacy standard for forex trading automation.'
  },
  {
    id: 'mql5',
    name: 'MetaTrader 5',
    language: 'MQL5',
    extension: 'mq5',
    description: 'Modern multi-asset platform for automated trading.'
  },
  {
    id: 'python',
    name: 'Python',
    language: 'Python',
    extension: 'py',
    description: 'Data science and backtesting with Pandas, Backtrader, etc.'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    language: 'JavaScript',
    extension: 'js',
    description: 'Web-based trading logic or Node.js automation.'
  }
];

export const PROJECT_TYPES: ProjectTypeInfo[] = [
  {
    id: 'indicator',
    name: 'Indicator',
    description: 'Visual study plotted on charts (e.g., RSI, MACD).'
  },
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'Automated entry and exit logic with backtesting.'
  },
  {
    id: 'alert',
    name: 'Alert',
    description: 'Notification logic based on specific price conditions.'
  },
  {
    id: 'scanner',
    name: 'Scanner',
    description: 'Filter logic to find symbols matching criteria.'
  },
  {
    id: 'watchlist',
    name: 'Watchlist Column',
    description: 'Custom data column for real-time watchlists.'
  }
];
