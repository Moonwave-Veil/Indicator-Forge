import React from 'react';
import { 
  Package, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  Shield,
  Anvil,
  Layout,
  FileCode,
  PlusCircle,
  Code,
  ShieldCheck
} from 'lucide-react';
import { Module } from '../types';

interface ModuleManagerProps {
  modules: Module[];
  onToggleModule: (id: string) => void;
}

export const ModuleManager: React.FC<ModuleManagerProps> = ({ modules, onToggleModule }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-bg-dark">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <header className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Module Manager</h2>
          <p className="text-sm text-text-dim">Install and manage specialized trading platform engines and logic modules.</p>
        </header>

        <div className="grid grid-cols-1 gap-4 mb-12">
          {modules.map(module => (
            <div 
              key={module.id}
              className={`p-5 bg-bg-panel border rounded-xl transition-all ${
                module.enabled ? 'border-brand-primary/30' : 'border-border-muted opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    module.enabled ? 'bg-brand-primary/10 text-brand-primary' : 'bg-white/5 text-text-dim'
                  }`}>
                    {module.category === 'platform' && <Anvil className="w-5 h-5" />}
                    {module.category === 'template' && <FileCode className="w-5 h-5" />}
                    {module.category === 'ui' && <Layout className="w-5 h-5" />}
                    {module.category === 'utility' && <Shield className="w-5 h-5" />}
                    {module.category === 'workflow' && <Package className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{module.name}</h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-bg-dark border border-border-muted text-text-dim">v{module.version}</span>
                    </div>
                    <p className="text-xs text-text-dim mb-3 max-w-xl">{module.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-text-dim flex items-center gap-1 uppercase tracking-tighter">
                        <Code className="w-3 h-3" /> {module.category}
                      </span>
                      {module.enabled && (
                        <span className="text-[10px] text-brand-primary flex items-center gap-1 uppercase tracking-tighter font-bold">
                          <ShieldCheck className="w-3 h-3" /> Active Specialist
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleModule(module.id)}
                  className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                    module.enabled 
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20' 
                      : 'bg-white/5 text-text-dim border border-border-muted hover:bg-white/10'
                  }`}
                >
                  {module.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Install New Module */}
        <div className="p-12 border-2 border-dashed border-border-muted rounded-2xl flex flex-col items-center justify-center text-center group hover:border-brand-primary/30 transition-all">
          <div className="w-16 h-16 rounded-full bg-bg-panel flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-8 h-8 text-text-dim group-hover:text-brand-primary" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Install New Module</h3>
          <p className="text-xs text-text-dim max-w-xs mb-6">
            Drag and drop your module .zip file here or click to browse your local machine.
          </p>
          <button className="px-6 py-2 bg-bg-active border border-border-muted text-text-main rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
            Browse Files
          </button>
        </div>
      </div>
    </div>
  );
};
