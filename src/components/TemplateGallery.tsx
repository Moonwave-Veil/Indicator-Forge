import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  LineChart, 
  TrendingUp, 
  Activity, 
  Layers,
  Target,
  BarChart3,
  Eye
} from 'lucide-react';
import { PlatformId, ProjectType } from '../types';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: any;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  platforms: PlatformId[];
  type: ProjectType;
  prompt: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'ema-cross',
    title: 'EMA Crossover',
    description: 'Classic trend-following signal using two exponential moving averages.',
    icon: TrendingUp,
    difficulty: 'Beginner',
    platforms: ['pinescript', 'thinkscript', 'ninjascript'],
    type: 'indicator',
    prompt: 'I want to build a classic EMA Crossover indicator with a fast EMA (9) and a slow EMA (21). Can you plot signals when they cross?'
  },
  {
    id: 'vwap-bands',
    title: 'VWAP Standard Deviation Bands',
    description: 'Volume-weighted average price with dynamic volatility bands.',
    icon: Activity,
    difficulty: 'Intermediate',
    platforms: ['pinescript', 'thinkscript'],
    type: 'indicator',
    prompt: 'Can you help me build a VWAP indicator that includes standard deviation bands for 1, 2, and 3 deviations? It should reset daily.'
  },
  {
    id: 'orb-strategy',
    title: 'Opening Range Breakout',
    description: 'Strategy logic for trading the first 15-30 minutes of market open.',
    icon: Target,
    difficulty: 'Intermediate',
    platforms: ['pinescript', 'ninjascript'],
    type: 'strategy',
    prompt: 'I need an Opening Range Breakout strategy for the first 30 minutes of trading. Buy on a break above high and sell on a break below low.'
  },
  {
    id: 'rsi-div',
    title: 'RSI Divergence Detector',
    description: 'Automatically identifies bullish and bearish divergences on RSI.',
    icon: LineChart,
    difficulty: 'Advanced',
    platforms: ['pinescript', 'thinkscript', 'mql5'],
    type: 'indicator',
    prompt: 'Create an RSI Divergence indicator that automatically identifies and highlights bullish and bearish divergences on the chart.'
  },
  {
    id: 'vol-spike',
    title: 'Volume Spike Alert',
    description: 'Triggers alerts when volume exceeds a standard deviation threshold.',
    icon: BarChart3,
    difficulty: 'Beginner',
    platforms: ['pinescript', 'thinkscript', 'ninjascript'],
    type: 'alert',
    prompt: 'I want a volume spike alert that triggers when the current volume is 200% higher than the 20-period average volume.'
  },
  {
    id: 'mtf-conf',
    title: 'Multi-Timeframe Confirmation',
    description: 'Overlay trend status from higher timeframes on your current chart.',
    icon: Layers,
    difficulty: 'Advanced',
    platforms: ['pinescript', 'thinkscript'],
    type: 'indicator',
    prompt: 'Build a multi-timeframe trend indicator that shows the trend status of the Daily and 4-Hour timeframes on my current chart.'
  }
];

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-bg-dark">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" /> Curated Library
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Template Gallery</h2>
          <p className="text-text-dim max-w-2xl mx-auto">
            Start with a professional foundation. Select a template to customize it with your specific logic and parameters.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map(template => (
            <div 
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="group p-8 bg-bg-panel border border-border-muted rounded-3xl hover:border-brand-primary/40 hover:bg-bg-active transition-all cursor-pointer relative"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-bg-dark border border-border-muted flex items-center justify-center group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-colors">
                  <template.icon className="w-6 h-6" />
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                  template.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                  template.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {template.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-brand-primary transition-colors">{template.title}</h3>
              <p className="text-xs text-text-dim leading-relaxed mb-8">
                {template.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {template.platforms.map(p => (
                  <span key={p} className="px-2 py-0.5 rounded bg-bg-dark border border-border-muted text-[8px] font-bold text-text-dim uppercase tracking-tighter">
                    {p}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border-muted">
                <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{template.type}</span>
                <ArrowRight className="w-4 h-4 text-text-dim group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
