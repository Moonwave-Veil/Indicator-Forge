import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Monitor, 
  Zap, 
  LineChart, 
  Bell, 
  Search,
  Layout
} from 'lucide-react';
import { PlatformId, ProjectType, Module } from '../types';
import { PLATFORMS, PROJECT_TYPES } from '../lib/platforms';

interface ForgeWizardProps {
  onComplete: (data: any) => void;
  modules: Module[];
}

export const ForgeWizard: React.FC<ForgeWizardProps> = ({ onComplete, modules }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    platform: 'pinescript' as PlatformId,
    type: 'indicator' as ProjectType,
    style: 'overlay',
    behavior: '',
    timeframe: '5m',
    isBeginner: true
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="flex-1 overflow-y-auto bg-bg-dark">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= i ? 'bg-brand-primary text-bg-dark' : 'bg-bg-panel border border-border-muted text-text-dim'
                }`}>
                  {step > i ? <Check className="w-4 h-4" /> : i}
                </div>
                {i < 4 && (
                  <div className={`h-0.5 flex-1 mx-4 transition-all ${
                    step > i ? 'bg-brand-primary' : 'bg-border-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            {step === 1 && "Select Your Platform"}
            {step === 2 && "Choose Project Type"}
            {step === 3 && "Define Indicator Style"}
            {step === 4 && "Describe Market Behavior"}
          </h2>
          <p className="text-sm text-text-dim">
            {step === 1 && "Which trading terminal are you building for?"}
            {step === 2 && "What kind of script do you need today?"}
            {step === 3 && "How should the indicator appear on your chart?"}
            {step === 4 && "What specific market conditions should it detect?"}
          </p>
        </div>

        <div className="min-h-[400px]">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              {PLATFORMS.map(p => (
                <WizardCard 
                  key={p.id}
                  icon={<Monitor className="w-5 h-5" />}
                  title={p.name}
                  description={p.language}
                  selected={formData.platform === p.id}
                  onClick={() => setFormData({...formData, platform: p.id})}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {PROJECT_TYPES.filter(t => {
                if (t.id === 'scanner' || t.id === 'watchlist') {
                  return modules.find(m => m.id === 'advanced-scanners')?.enabled;
                }
                return true;
              }).map(t => (
                <WizardCard 
                  key={t.id}
                  icon={t.id === 'indicator' ? <LineChart className="w-5 h-5" /> : t.id === 'alert' ? <Bell className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                  title={t.name}
                  description={t.description}
                  selected={formData.type === t.id}
                  onClick={() => setFormData({...formData, type: t.id})}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              <WizardCard 
                icon={<Layout className="w-5 h-5" />}
                title="Overlay"
                description="Plots directly on the price chart (e.g. EMAs, Bands)"
                selected={formData.style === 'overlay'}
                onClick={() => setFormData({...formData, style: 'overlay'})}
              />
              <WizardCard 
                icon={<BarChart3 className="w-5 h-5" />}
                title="Sub-pane"
                description="Appears in a separate window below price (e.g. RSI, MACD)"
                selected={formData.style === 'subpane'}
                onClick={() => setFormData({...formData, style: 'subpane'})}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim ml-1">Market Behavior</label>
                <textarea 
                  value={formData.behavior}
                  onChange={(e) => setFormData({...formData, behavior: e.target.value})}
                  className="w-full bg-bg-panel border border-border-muted rounded-2xl px-6 py-4 text-sm text-text-main focus:outline-none focus:border-brand-primary/50 h-40 resize-none"
                  placeholder="e.g. I want to detect when price breaks above the 200 EMA while RSI is oversold..."
                />
              </div>
              <div className="flex items-center justify-between p-6 bg-bg-panel border border-border-muted rounded-2xl">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Beginner Defaults</h4>
                  <p className="text-[10px] text-text-dim">Use standard settings for common parameters.</p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, isBeginner: !formData.isBeginner})}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.isBeginner ? 'bg-brand-primary' : 'bg-border-muted'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isBeginner ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border-muted">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-2.5 text-text-dim hover:text-white transition-all flex items-center gap-2 disabled:opacity-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button 
            onClick={step === 4 ? () => onComplete(formData) : nextStep}
            className="px-8 py-2.5 bg-brand-primary text-bg-dark rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all flex items-center gap-2"
          >
            {step === 4 ? 'Forge Script' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const WizardCard = ({ icon, title, description, selected, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
      selected ? 'bg-brand-primary/10 border-brand-primary/40' : 'bg-bg-panel border-border-muted hover:border-white/20'
    }`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
      selected ? 'bg-brand-primary text-bg-dark' : 'bg-bg-dark text-text-dim'
    }`}>
      {icon}
    </div>
    <h3 className={`text-sm font-bold mb-1 uppercase tracking-wider ${selected ? 'text-brand-primary' : 'text-white'}`}>{title}</h3>
    <p className="text-[10px] text-text-dim leading-relaxed">{description}</p>
  </div>
);

const BarChart3 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
);
