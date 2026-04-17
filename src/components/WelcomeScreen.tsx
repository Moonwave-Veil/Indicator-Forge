import React from 'react';
import { 
  Anvil, 
  ArrowRight, 
  Code, 
  LineChart, 
  ShieldCheck, 
  Cpu,
  Sparkles,
  Play,
  TrendingUp,
  LayoutDashboard,
  LogIn
} from 'lucide-react';
import { PLATFORMS, PROJECT_TYPES } from '../lib/platforms';
import { PlatformId, ProjectType, AIProvider } from '../types';
import { ModelSelector } from './ModelSelector';
import { useFirebase } from './FirebaseProvider';

interface WelcomeScreenProps {
  onStart: (platform: PlatformId, type: ProjectType) => void;
  recentSessionsCount: number;
  selectedProvider: AIProvider;
  onSelectProvider: (provider: AIProvider) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart, 
  recentSessionsCount,
  selectedProvider,
  onSelectProvider
}) => {
  const { user, signIn } = useFirebase();

  return (
    <div className="flex-1 overflow-y-auto bg-bg-dark">
      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
              v1.0.0-alpha
            </div>
            <div className="flex items-center gap-2 text-text-dim text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Secure Local Engine
            </div>
            <div className="ml-auto">
              <ModelSelector 
                selectedProvider={selectedProvider}
                onSelect={onSelectProvider}
              />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            The Professional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-primary/60">
              Indicator Forge
            </span>
          </h1>
          
          <p className="text-lg text-text-dim max-w-2xl leading-relaxed mb-8">
            The modular AI assistant for traders. Generate, refine, and deploy custom scripts for any major trading platform with professional precision.
          </p>

          {!user && (
            <button 
              onClick={() => signIn()}
              className="px-6 py-3 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary/20 transition-all flex items-center gap-2 w-fit"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Sync Your Forge
            </button>
          )}
        </div>

        {/* Quick Actions / Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => onStart(platform.id, 'indicator')}
              className="group relative p-6 bg-bg-panel border border-border-muted rounded-xl text-left transition-all hover:border-brand-primary/40 hover:bg-bg-active"
            >
              <div className="w-10 h-10 rounded-lg bg-bg-dark border border-border-muted flex items-center justify-center mb-4 group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-colors">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">{platform.name}</h3>
              <p className="text-xs text-text-dim leading-relaxed">
                Forge {platform.language} scripts for {platform.name} terminal.
              </p>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-brand-primary" />
              </div>
            </button>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-bg-panel border border-border-muted rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Modular Core</h3>
            </div>
            <p className="text-xs text-text-dim leading-relaxed mb-6">
              Install specialized platform packs and logic modules. Only pay for the specialists you need for your trading style.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded bg-bg-dark border border-border-muted text-[9px] font-bold text-text-main uppercase tracking-tighter">PineScript v5</span>
              <span className="px-2 py-1 rounded bg-bg-dark border border-border-muted text-[9px] font-bold text-text-main uppercase tracking-tighter">thinkScript</span>
              <span className="px-2 py-1 rounded bg-bg-dark border border-border-muted text-[9px] font-bold text-text-main uppercase tracking-tighter">MQL5</span>
            </div>
          </div>

          <div className="p-8 bg-bg-panel border border-border-muted rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Two-Stage Forge</h3>
            </div>
            <p className="text-xs text-text-dim leading-relaxed mb-6">
              Our unique architecture builds an internal structural prompt before generating code, ensuring logical consistency and fewer errors.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest">
              <Anvil className="w-3 h-3" /> Powered by {selectedProvider === 'gemini' ? 'Gemini 3.1 Pro' : selectedProvider === 'openai' ? 'GPT-4o' : 'Claude 3.5'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FeatureCard removed in favor of inline highlights
