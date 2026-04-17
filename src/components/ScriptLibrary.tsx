import React from 'react';
import { 
  Folder, 
  FileCode, 
  Search, 
  Plus, 
  MoreVertical, 
  Copy, 
  Trash2, 
  ExternalLink,
  Tag,
  Clock
} from 'lucide-react';
import { ScriptProject } from '../types';

interface ScriptLibraryProps {
  projects: ScriptProject[];
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
}

export const ScriptLibrary: React.FC<ScriptLibraryProps> = ({ projects, onSelectProject, onNewProject }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-bg-dark">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Script Library</h2>
            <p className="text-sm text-text-dim">Manage and organize your forged indicators and strategies.</p>
          </div>
          <button 
            onClick={onNewProject}
            className="px-6 py-2.5 bg-brand-primary text-bg-dark rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </header>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input 
              type="text" 
              placeholder="Search scripts, tags, or platforms..."
              className="w-full bg-bg-panel border border-border-muted rounded-xl pl-11 pr-4 py-3 text-sm text-text-main focus:outline-none focus:border-brand-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-bg-panel border border-border-muted rounded-xl text-text-dim hover:text-white transition-all">
              <Folder className="w-4 h-4" />
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="py-20 text-center bg-bg-panel border border-border-muted rounded-3xl border-dashed">
            <div className="w-16 h-16 bg-bg-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <FileCode className="w-8 h-8 text-text-dim" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Your library is empty</h3>
            <p className="text-sm text-text-dim max-w-xs mx-auto mb-8">Start forging indicators to see them appear in your personal workspace.</p>
            <button 
              onClick={onNewProject}
              className="px-6 py-2 bg-white/5 border border-border-muted text-text-main rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Forge Your First Script
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => onSelectProject(project.id)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onClick }: { project: ScriptProject; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="group p-6 bg-bg-panel border border-border-muted rounded-2xl hover:border-brand-primary/40 hover:bg-bg-active transition-all cursor-pointer relative overflow-hidden"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-bg-dark border border-border-muted flex items-center justify-center group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-colors">
        <FileCode className="w-5 h-5" />
      </div>
      <button className="p-1.5 text-text-dim hover:text-white transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>

    <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider truncate">{project.title}</h3>
    <p className="text-xs text-text-dim line-clamp-2 mb-4 h-8 leading-relaxed">
      {project.description || 'No description provided.'}
    </p>

    <div className="flex flex-wrap gap-2 mb-6">
      <span className="px-2 py-0.5 rounded bg-bg-dark border border-border-muted text-[9px] font-bold text-text-main uppercase tracking-tighter">
        {project.platformId}
      </span>
      {project.tags.map(tag => (
        <span key={tag} className="px-2 py-0.5 rounded bg-brand-primary/5 border border-brand-primary/10 text-[9px] font-bold text-brand-primary uppercase tracking-tighter">
          {tag}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-border-muted">
      <div className="flex items-center gap-1.5 text-[10px] text-text-dim uppercase tracking-tighter font-medium">
        <Clock className="w-3 h-3" />
        {new Date(project.updatedAt).toLocaleDateString()}
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-text-dim uppercase tracking-tighter font-medium">
        <Tag className="w-3 h-3" />
        {project.versions.length} Revisions
      </div>
    </div>
  </div>
);
