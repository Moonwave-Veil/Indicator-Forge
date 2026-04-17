import React from 'react';
import { 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  Package, 
  CreditCard,
  History,
  TrendingUp,
  Anvil,
  Sparkles,
  LayoutDashboard,
  LogOut,
  LogIn,
  User as UserIcon
} from 'lucide-react';
import { Session } from '../types';
import { useFirebase } from './FirebaseProvider';

interface SidebarProps {
  sessions: Session[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onNavigate: (view: any) => void;
  activeView: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onNavigate,
  activeView
}) => {
  const { user, signIn, signOut } = useFirebase();

  return (
    <aside className="w-[240px] h-full bg-bg-panel flex flex-col border-r border-border-muted z-20">
      <div className="h-14 px-5 flex items-center gap-3 border-b border-border-muted">
        <div className="w-6 h-6 bg-brand-primary rounded flex items-center justify-center">
          <Anvil className="w-4 h-4 text-bg-dark fill-current" />
        </div>
        <h1 className="font-bold text-xs tracking-wider uppercase text-white">
          Indicator <span className="text-brand-primary">Forge</span>
        </h1>
      </div>

      <div className="p-4">
        <button 
          onClick={onNewSession}
          className="w-full py-2 px-4 bg-brand-primary text-bg-dark rounded font-bold text-xs uppercase tracking-wider hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Forge</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        <div className="px-3 py-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-text-dim">Main Terminal</span>
        </div>
        <NavItem 
          icon={<LayoutDashboard className="w-4 h-4" />} 
          label="AI Workspace" 
          active={activeView === 'welcome' || activeView === 'workspace'} 
          onClick={() => onNavigate('welcome')} 
        />
        <NavItem 
          icon={<History className="w-4 h-4" />} 
          label="Script Library" 
          active={activeView === 'library'} 
          onClick={() => onNavigate('library')} 
        />
        <NavItem 
          icon={<TrendingUp className="w-4 h-4" />} 
          label="Template Gallery" 
          active={activeView === 'gallery'} 
          onClick={() => onNavigate('gallery')} 
        />
        <NavItem 
          icon={<Sparkles className="w-4 h-4" />} 
          label="Forge Wizard" 
          active={activeView === 'wizard'} 
          onClick={() => onNavigate('wizard')} 
        />
        <NavItem 
          icon={<Package className="w-4 h-4" />} 
          label="Module Manager" 
          active={activeView === 'modules'} 
          onClick={() => onNavigate('modules')} 
        />
        <NavItem 
          icon={<CreditCard className="w-4 h-4" />} 
          label="Marketplace" 
          active={activeView === 'pricing'} 
          onClick={() => onNavigate('pricing')} 
        />

        <div className="pt-6 pb-2 px-3">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-text-dim">Recent Forge Projects</span>
        </div>

        {sessions.length === 0 ? (
          <div className="px-3 py-2 text-[11px] text-text-dim italic">No recent sessions</div>
        ) : (
          sessions.map(session => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left px-3 py-2 rounded text-[11px] transition-colors truncate ${
                currentSessionId === session.id 
                  ? 'bg-brand-primary/10 text-brand-primary font-medium' 
                  : 'text-text-dim hover:bg-white/5 hover:text-text-main'
              }`}
            >
              {session.title}
            </button>
          ))
        )}
      </nav>

      <div className="p-4 border-t border-border-muted space-y-2">
        {user ? (
          <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg border border-border-muted">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-3 h-3 text-brand-primary" />
              </div>
              <span className="text-[10px] font-bold text-white truncate">{user.displayName || 'Trader'}</span>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-1 text-text-dim hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signIn()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 transition-all"
          >
            <LogIn className="w-4 h-4" />
            Sign In with Google
          </button>
        )}
        <NavItem 
          icon={<Settings className="w-4 h-4" />} 
          label="Settings" 
          active={activeView === 'settings'} 
          onClick={() => onNavigate('settings')} 
        />
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-all ${
      active 
        ? 'bg-brand-primary/10 text-brand-primary' 
        : 'text-text-dim hover:bg-white/5 hover:text-text-main'
    }`}
  >
    {icon}
    {label}
  </button>
);
