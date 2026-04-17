import React from 'react';
import { Sparkles, ChevronDown, Anvil, Cpu, Brain } from 'lucide-react';
import { AIProvider } from '../types';

interface ModelSelectorProps {
  selectedProvider: AIProvider;
  onSelect: (provider: AIProvider) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedProvider, onSelect }) => {
  const providers: { id: AIProvider; name: string; icon: any; model: string }[] = [
    { id: 'gemini', name: 'Google Gemini', icon: Anvil, model: '2.0 Flash' },
    { id: 'openai', name: 'OpenAI', icon: Cpu, model: 'GPT-4o' },
    { id: 'anthropic', name: 'Anthropic', icon: Brain, model: 'Claude 3.5' }
  ];

  const activeProvider = providers.find(p => p.id === selectedProvider) || providers[0];
  const Icon = activeProvider.icon;

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-panel border border-border-muted rounded-lg cursor-pointer hover:border-brand-primary/40 transition-all">
        <Icon className="w-3.5 h-3.5 text-brand-primary" />
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-white uppercase tracking-tighter leading-none mb-0.5">
            {activeProvider.name}
          </span>
          <span className="text-[8px] text-text-dim uppercase tracking-widest leading-none">
            {activeProvider.model}
          </span>
        </div>
        <ChevronDown className="w-3 h-3 text-text-dim ml-1" />
      </div>

      <div className="absolute top-full right-0 mt-2 w-48 bg-bg-panel border border-border-muted rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
        <div className="p-2 border-b border-border-muted bg-bg-dark/50">
          <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest px-2">Select Engine</span>
        </div>
        <div className="p-1">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                selectedProvider === p.id 
                  ? 'bg-brand-primary/10 text-brand-primary' 
                  : 'text-text-main hover:bg-white/5'
              }`}
            >
              <p.icon className={`w-4 h-4 ${selectedProvider === p.id ? 'text-brand-primary' : 'text-text-dim'}`} />
              <div className="text-left">
                <div className="text-[11px] font-bold uppercase tracking-tight">{p.name}</div>
                <div className="text-[9px] text-text-dim uppercase tracking-tighter">{p.model}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
