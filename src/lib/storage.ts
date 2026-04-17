import { AppState, Session, UserProfile, Module } from '../types';

const STORAGE_KEY = 'indicator_forge_state';

const DEFAULT_MODULES: Module[] = [
  {
    id: 'core-platforms',
    name: 'Core Platforms',
    description: 'Support for Thinkorswim, TradingView, and NinjaTrader.',
    version: '1.0.0',
    category: 'platform',
    enabled: true,
    author: 'Indicator Forge Team'
  },
  {
    id: 'advanced-scanners',
    name: 'Advanced Scanners',
    description: 'Modular scanner templates for multi-timeframe analysis.',
    version: '1.0.0',
    category: 'workflow',
    enabled: false,
    author: 'Indicator Forge Team'
  },
  {
    id: 'premium-templates',
    name: 'Premium Template Pack',
    description: 'High-performance templates for ORB, VWAP, and Liquidity Sweeps.',
    version: '1.0.0',
    category: 'template',
    enabled: false,
    author: 'Indicator Forge Team'
  },
  {
    id: 'conversational-intelligence',
    name: 'Conversational Intelligence',
    description: 'Enables advanced conversational abilities, allowing the AI to ask clarifying questions and discuss trading logic.',
    version: '1.0.0',
    category: 'utility',
    enabled: false,
    author: 'Indicator Forge Team'
  }
];

const INITIAL_STATE: AppState = {
  sessions: [],
  currentSessionId: null,
  profile: {
    name: 'Trader',
    selectedProvider: 'gemini',
    apiKeys: {}
  },
  modules: DEFAULT_MODULES,
  isWelcomeScreen: true,
  projects: [],
  activeView: 'welcome'
};

export const storageService = {
  saveState(state: AppState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  loadState(): AppState {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_STATE;
    try {
      const parsed = JSON.parse(saved);
      // Deep merge profile to ensure apiKeys exists
      return { 
        ...INITIAL_STATE, 
        ...parsed,
        profile: {
          ...INITIAL_STATE.profile,
          ...(parsed.profile || {}),
          apiKeys: {
            ...INITIAL_STATE.profile.apiKeys,
            ...(parsed.profile?.apiKeys || {})
          }
        }
      };
    } catch (e) {
      console.error('Failed to parse storage', e);
      return INITIAL_STATE;
    }
  },

  createSession(platformId: any, projectType: any): Session {
    const session: Session = {
      id: crypto.randomUUID(),
      title: `New ${projectType} - ${new Date().toLocaleDateString()}`,
      platformId,
      projectType,
      messages: [],
      updatedAt: Date.now(),
    };
    return session;
  },

  updateSession(sessionId: string, updates: Partial<Session>) {
    const state = this.loadState();
    const index = state.sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      state.sessions[index] = { ...state.sessions[index], ...updates, updatedAt: Date.now() };
      this.saveState(state);
    }
  },

  deleteSession(sessionId: string) {
    const state = this.loadState();
    state.sessions = state.sessions.filter(s => s.id !== sessionId);
    if (state.currentSessionId === sessionId) {
      state.currentSessionId = null;
    }
    this.saveState(state);
  }
};
