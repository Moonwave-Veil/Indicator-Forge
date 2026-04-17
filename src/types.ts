/**
 * Core types for Indicator Forge AI
 */

export type PlatformId = 
  | 'thinkscript' 
  | 'pinescript' 
  | 'ninjascript' 
  | 'mql4' 
  | 'mql5' 
  | 'python' 
  | 'javascript';

export interface Platform {
  id: PlatformId;
  name: string;
  language: string;
  extension: string;
  description: string;
}

export type ProjectType = 
  | 'indicator' 
  | 'strategy' 
  | 'alert' 
  | 'scanner' 
  | 'watchlist';

export interface ProjectTypeInfo {
  id: ProjectType;
  name: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  internalPrompt?: string; // The stage-1 prompt
}

export interface Session {
  id: string;
  title: string;
  platformId: PlatformId;
  projectType: ProjectType;
  messages: ChatMessage[];
  lastCode?: string;
  updatedAt: number;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'platform' | 'template' | 'workflow' | 'utility' | 'ui';
  enabled: boolean;
  author?: string;
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic';

export type UserPlan = 'starter' | 'pro' | 'power';

export interface UserSubscription {
  plan: UserPlan;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: number;
}

export interface UserProfile {
  name: string;
  email?: string;
  favoritePlatform?: PlatformId;
  selectedProvider: AIProvider;
  subscription?: UserSubscription;
  apiKeys: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
  };
}

export interface ScriptVersion {
  id: string;
  scriptId: string;
  code: string;
  note: string;
  timestamp: number;
  platformId: PlatformId;
  isAutoFixed?: boolean;
}

export interface ScriptProject {
  id: string;
  userId: string;
  title: string;
  description?: string;
  platformId: PlatformId;
  projectType: ProjectType;
  currentCode: string;
  versions: ScriptVersion[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  sessions: Session[];
  currentSessionId: string | null;
  profile: UserProfile;
  modules: Module[];
  isWelcomeScreen: boolean;
  projects: ScriptProject[];
  activeView: 'welcome' | 'workspace' | 'modules' | 'pricing' | 'settings' | 'library' | 'gallery' | 'wizard';
  pendingPrompt?: string;
}

export interface PromptHelperData {
  timeframe?: string;
  entryConditions?: string;
  exitConditions?: string;
  riskManagement?: string;
  visuals?: string;
}
