import React from 'react';
import { 
  Check, 
  Send,
  Sparkles
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-bg-dark">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" /> Professional Grade
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Expand Your Forge</h2>
          <p className="text-text-dim max-w-2xl mx-auto">
            Indicator Forge AI is free to use locally. Purchase specialized module packs or commission custom logic engines for your specific trading strategy.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Starter */}
          <div className="p-8 bg-bg-panel border border-border-muted rounded-2xl flex flex-col">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-text-dim uppercase tracking-widest mb-2">Starter</h3>
              <div className="text-4xl font-bold text-white mb-1">$29</div>
              <p className="text-[10px] text-text-dim uppercase tracking-tighter">Per Month • Single Platform</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <PricingFeature text="10 Generations / Month" />
              <PricingFeature text="1 Platform Specialist" />
              <PricingFeature text="Plain-English Explanations" />
              <PricingFeature text="Basic Validation Checks" />
              <PricingFeature text="Cloud Script Library" />
            </ul>
            <button className="w-full py-3 bg-white/5 border border-border-muted text-text-main rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              Choose Starter
            </button>
          </div>

          {/* Pro */}
          <div className="p-8 bg-bg-panel border-2 border-brand-primary/30 rounded-2xl flex flex-col relative neon-glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-primary text-bg-dark text-[9px] font-bold uppercase tracking-widest rounded-full">
              Best Value
            </div>
            <div className="mb-8">
              <h3 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-2">Pro</h3>
              <div className="text-4xl font-bold text-white mb-1">$59</div>
              <p className="text-[10px] text-text-dim uppercase tracking-tighter">Per Month • All Platforms</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <PricingFeature text="50 Generations / Month" />
              <PricingFeature text="All Supported Platforms" />
              <PricingFeature text="Auto-Debug & Auto-Fix" />
              <PricingFeature text="Script Conversion Suite" />
              <PricingFeature text="Version History & Forks" />
              <PricingFeature text="Full Template Gallery" />
            </ul>
            <button className="w-full py-3 bg-brand-primary text-bg-dark rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all">
              Go Pro
            </button>
          </div>

          {/* Power User */}
          <div className="p-8 bg-bg-panel border border-border-muted rounded-2xl flex flex-col">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-text-dim uppercase tracking-widest mb-2">Power User</h3>
              <div className="text-4xl font-bold text-white mb-1">$99</div>
              <p className="text-[10px] text-text-dim uppercase tracking-tighter">Per Month • High Usage</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <PricingFeature text="Unlimited Generations" />
              <PricingFeature text="Strategy & Backtest Logic" />
              <PricingFeature text="Advanced Parameter Presets" />
              <PricingFeature text="Priority Processing Queue" />
              <PricingFeature text="1-on-1 Architect Support" />
            </ul>
            <button className="w-full py-3 bg-white/5 border border-border-muted text-text-main rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              Choose Power
            </button>
          </div>
        </div>

        {/* Custom Commission Form Section */}
        <div className="max-w-3xl mx-auto p-10 bg-bg-panel border border-border-muted rounded-3xl">
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-white mb-2">Commission a Specialist</h3>
            <p className="text-sm text-text-dim">Need a proprietary indicator or a complex strategy engine? Our architects can build it as a private module for your Forge.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim ml-1">Your Name</label>
              <input type="text" className="w-full bg-bg-dark border border-border-muted rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-brand-primary/50" placeholder="Trader Joe" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim ml-1">Contact Email</label>
              <input type="email" className="w-full bg-bg-dark border border-border-muted rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-brand-primary/50" placeholder="joe@trading.com" />
            </div>
          </div>
          
          <div className="space-y-2 mb-8">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim ml-1">Project Requirements</label>
            <textarea className="w-full bg-bg-dark border border-border-muted rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-brand-primary/50 h-32 resize-none" placeholder="Describe the logic or platform you need..."></textarea>
          </div>
          
          <button className="w-full py-3 bg-brand-primary text-bg-dark rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Submit Inquiry
          </button>
        </div>
      </div>
    </div>
  );
};

const PricingFeature = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-xs text-text-main">
    <Check className="w-3.5 h-3.5 text-brand-primary" /> {text}
  </li>
);
