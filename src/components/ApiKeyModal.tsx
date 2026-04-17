import React, { useState } from 'react';
import { X, Shield, Key, CheckCircle2 } from 'lucide-react';
import { AIProvider } from '../types';

interface ApiKeyModalProps {
  provider: AIProvider;
  onSave: (key: string) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ provider, onSave, onClose }) => {
  const [key, setKey] = useState('');

  const providerNames: Record<AIProvider, string> = {
    gemini: 'Google Gemini',
    openai: 'OpenAI',
    anthropic: 'Anthropic'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-bg-panel border border-border-muted rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <header className="px-6 py-4 border-b border-border-muted flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-brand-primary" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Setup {providerNames[provider]}</h3>
          </div>
          <button onClick={onClose} className="text-text-dim hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 p-3 bg-brand-primary/5 border border-brand-primary/20 rounded-xl">
              <Shield className="w-5 h-5 text-brand-primary shrink-0" />
              <p className="text-[10px] text-text-dim leading-relaxed uppercase tracking-tighter">
                Your API key is stored <span className="text-white font-bold">locally</span> in your browser's vault. It is never sent to our servers.
              </p>
            </div>

            <label className="block text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2 ml-1">
              Enter {providerNames[provider]} API Key
            </label>
            <input
              autoFocus
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-bg-dark border border-border-muted rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-brand-primary/50 transition-all"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 border border-border-muted text-text-main rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-brand-primary text-bg-dark rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Key
            </button>
          </div>
        </form>

        <footer className="px-6 py-4 bg-bg-dark/50 border-t border-border-muted">
          <p className="text-[9px] text-text-dim text-center leading-relaxed">
            Don't have a key? Visit the <a href={provider === 'gemini' ? 'https://aistudio.google.com/app/apikey' : provider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://console.anthropic.com/'} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">provider's dashboard</a> to generate one.
          </p>
        </footer>
      </div>
    </div>
  );
};
