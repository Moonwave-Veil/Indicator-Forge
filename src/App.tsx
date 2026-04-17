import React, { useState, useEffect } from 'react';
import { AppState, Session, PlatformId, ProjectType, PromptHelperData, ChatMessage, AIProvider } from './types';
import { storageService } from './lib/storage';
import { aiService } from './lib/ai';
import { firestoreService } from './lib/firestoreService';
import { useFirebase } from './components/FirebaseProvider';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatWorkspace } from './components/ChatWorkspace';
import { ModuleManager } from './components/ModuleManager';
import { PricingPage } from './components/PricingPage';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ScriptLibrary } from './components/ScriptLibrary';
import { TemplateGallery } from './components/TemplateGallery';
import { ForgeWizard } from './components/ForgeWizard';
import { Key, ShieldCheck, Trash2 } from 'lucide-react';

export default function App() {
  const { user, profile: firebaseProfile, loading: authLoading, signIn, signOut } = useFirebase();
  const [state, setState] = useState<AppState>(storageService.loadState());
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<AIProvider | null>(null);

  // Save state whenever it changes (for local fallback)
  useEffect(() => {
    if (!user) {
      storageService.saveState(state);
    }
  }, [state, user]);

  // Sync profile from Firebase
  useEffect(() => {
    if (firebaseProfile) {
      setState(prev => ({ ...prev, profile: firebaseProfile }));
    }
  }, [firebaseProfile]);

  // Subscribe to sessions when logged in
  useEffect(() => {
    if (user) {
      const unsubscribe = firestoreService.subscribeToSessions(user.uid, (sessions) => {
        setState(prev => ({ ...prev, sessions }));
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Subscribe to messages when a session is active
  useEffect(() => {
    if (user && state.currentSessionId) {
      const unsubscribe = firestoreService.subscribeToMessages(user.uid, state.currentSessionId, (messages) => {
        setState(prev => {
          const sessionIndex = prev.sessions.findIndex(s => s.id === state.currentSessionId);
          if (sessionIndex === -1) return prev;
          const updatedSessions = [...prev.sessions];
          updatedSessions[sessionIndex] = { ...updatedSessions[sessionIndex], messages };
          return { ...prev, sessions: updatedSessions };
        });
      });
      return () => unsubscribe();
    }
  }, [user, state.currentSessionId]);

  // Subscribe to projects when logged in
  useEffect(() => {
    if (user) {
      const unsubscribe = firestoreService.subscribeToProjects(user.uid, (projects) => {
        setState(prev => ({ ...prev, projects }));
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleNewSession = async (platformId: PlatformId = 'pinescript', projectType: ProjectType = 'indicator', initialPrompt?: string) => {
    let sessionId: string | undefined;
    
    if (user) {
      sessionId = await firestoreService.createSession(user.uid, {
        title: initialPrompt ? `Forge: ${initialPrompt.slice(0, 30)}...` : `New ${projectType} - ${new Date().toLocaleDateString()}`,
        platformId,
        projectType,
        messages: [],
        updatedAt: Date.now()
      });
    } else {
      const newSession = storageService.createSession(platformId, projectType);
      if (initialPrompt) newSession.title = `Forge: ${initialPrompt.slice(0, 30)}...`;
      setState(prev => ({
        ...prev,
        sessions: [newSession, ...prev.sessions],
      }));
      sessionId = newSession.id;
    }

    if (sessionId) {
      setState(prev => ({
        ...prev,
        currentSessionId: sessionId!,
        isWelcomeScreen: false,
        activeView: 'workspace',
        pendingPrompt: initialPrompt
      }));
    }
  };

  const handleSelectSession = (id: string) => {
    setState(prev => ({ ...prev, currentSessionId: id, isWelcomeScreen: false, activeView: 'workspace' }));
    setStreamingContent('');
  };

  const handleNavigate = (view: any) => {
    setState(prev => ({ ...prev, activeView: view }));
    if (view === 'welcome') {
      setState(prev => ({ ...prev, isWelcomeScreen: true, currentSessionId: null }));
    }
  };

  const activeView = state.activeView;

  const currentSession = state.sessions.find(s => s.id === state.currentSessionId);

  const handleUpdateSessionPlatform = async (platformId: PlatformId) => {
    if (!state.currentSessionId) return;

    if (user) {
      await firestoreService.updateSession(user.uid, state.currentSessionId, { platformId });
    } else {
      storageService.updateSession(state.currentSessionId, { platformId });
      setState(prev => {
        const sessionIndex = prev.sessions.findIndex(s => s.id === state.currentSessionId);
        if (sessionIndex === -1) return prev;
        const updatedSessions = [...prev.sessions];
        updatedSessions[sessionIndex] = { ...updatedSessions[sessionIndex], platformId };
        return { ...prev, sessions: updatedSessions };
      });
    }
  };

  const handleSendMessage = async (content: string, helperData?: PromptHelperData, internalPromptOverride?: string) => {
    if (!currentSession) return;

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    const updatedMessages = [...currentSession.messages, userMsg];
    
    if (user) {
      await firestoreService.addMessage(user.uid, currentSession.id, userMsg);
    } else {
      storageService.updateSession(currentSession.id, { messages: updatedMessages });
      setState(storageService.loadState());
    }

    // 2. Build internal prompt (Stage 1)
    const context = updatedMessages.slice(-5).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const isConversational = state.modules.find(m => m.id === 'conversational-intelligence')?.enabled || false;
    
    const internalPrompt = internalPromptOverride || aiService.buildInternalPrompt(
      content,
      currentSession.platformId,
      currentSession.projectType,
      helperData,
      context,
      isConversational
    );

    // 3. Generate with AI (Stage 2)
    setIsGenerating(true);
    setStreamingContent('');
    setGenerationError(null);
    let fullResponse = '';

    const provider = state.profile.selectedProvider;
    const apiKey = state.profile.apiKeys[provider] || '';

    try {
      const stream = aiService.generateCodeStream(provider, apiKey, internalPrompt);
      const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
        
        // Real-time extraction for live preview
        const matches = [...fullResponse.matchAll(codeBlockRegex)];
        if (matches.length > 0) {
          const latestCode = matches[matches.length - 1][1];
          // We don't update state here to avoid too many re-renders, 
          // but we can pass it to ChatWorkspace via a prop if needed.
          // Actually, let's just let ChatWorkspace handle the extraction from streamingContent.
        }
      }

      // 4. Extract code if present
      const matches = [...fullResponse.matchAll(codeBlockRegex)];
      const lastCodeBlock = matches.length > 0 ? matches[matches.length - 1][1] : null;

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullResponse,
        timestamp: Date.now(),
        internalPrompt
      };

      if (user) {
        await firestoreService.addMessage(user.uid, currentSession.id, assistantMsg);
        await firestoreService.updateSession(user.uid, currentSession.id, {
          lastCode: lastCodeBlock || currentSession.lastCode
        });
      } else {
        storageService.updateSession(currentSession.id, { 
          messages: [...updatedMessages, assistantMsg],
          lastCode: lastCodeBlock || currentSession.lastCode // Keep old code if no new code found
        });
        setState(storageService.loadState());
      }
    } catch (error) {
      console.error("Failed to generate code", error);
      setGenerationError(error instanceof Error ? error.message : 'An unexpected error occurred during the forge process.');
    } finally {
      setIsGenerating(false);
      setStreamingContent('');
    }
  };

  const handleToggleModule = (id: string) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m)
    }));
  };

  const handleSelectProvider = (provider: AIProvider) => {
    // If key is missing for non-gemini or if gemini key is explicitly needed (though gemini has a fallback)
    if (provider !== 'gemini' && !state.profile.apiKeys[provider]) {
      setShowApiKeyModal(provider);
    } else {
      setState(prev => ({
        ...prev,
        profile: { ...prev.profile, selectedProvider: provider }
      }));
    }
  };

  const handleSaveApiKey = (key: string) => {
    if (showApiKeyModal) {
      setState(prev => ({
        ...prev,
        profile: { 
          ...prev.profile, 
          selectedProvider: showApiKeyModal,
          apiKeys: { ...prev.profile.apiKeys, [showApiKeyModal]: key } 
        }
      }));
      setShowApiKeyModal(null);
    }
  };

  const handleClearApiKey = (provider: AIProvider) => {
    setState(prev => {
      const newApiKeys = { ...prev.profile.apiKeys };
      delete newApiKeys[provider];
      return {
        ...prev,
        profile: {
          ...prev.profile,
          apiKeys: newApiKeys,
          selectedProvider: prev.profile.selectedProvider === provider ? 'gemini' : prev.profile.selectedProvider
        }
      };
    });
  };

  const handleSaveToLibrary = async (title: string, code: string) => {
    if (!user || !currentSession) return;
    
    await firestoreService.saveProject(user.uid, {
      userId: user.uid,
      title,
      platformId: currentSession.platformId,
      projectType: currentSession.projectType,
      currentCode: code,
      versions: [],
      tags: [],
      updatedAt: Date.now(),
      createdAt: Date.now()
    });
    
    alert('Project saved to library!');
  };

  useEffect(() => {
    (window as any).handleSaveToLibrary = handleSaveToLibrary;
  }, [user, currentSession]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-dark text-gray-200">
      <Sidebar 
        sessions={state.sessions}
        currentSessionId={state.currentSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={() => handleNewSession()}
        onNavigate={handleNavigate}
        activeView={activeView}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeView === 'welcome' && (
          <WelcomeScreen 
            onStart={handleNewSession} 
            recentSessionsCount={state.sessions.length} 
            selectedProvider={state.profile.selectedProvider}
            onSelectProvider={handleSelectProvider}
          />
        )}

        {activeView === 'workspace' && currentSession && (
          <ChatWorkspace 
            session={currentSession}
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
            streamingContent={streamingContent}
            generationError={generationError}
            selectedProvider={state.profile.selectedProvider}
            onSelectProvider={handleSelectProvider}
            onUpdateSessionPlatform={handleUpdateSessionPlatform}
            pendingPrompt={state.pendingPrompt}
            onClearPendingPrompt={() => setState(prev => ({ ...prev, pendingPrompt: undefined }))}
          />
        )}

        {activeView === 'workspace' && !currentSession && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-2xl font-bold text-white mb-4">No Active Session</h2>
            <p className="text-gray-500 mb-8">Select a session from the sidebar or start a new forge.</p>
            <button 
              onClick={() => handleNewSession()}
              className="px-6 py-3 bg-brand-primary text-black font-bold rounded-xl neon-glow"
            >
              Start New Forge
            </button>
          </div>
        )}

        {activeView === 'modules' && (
          <ModuleManager 
            modules={state.modules} 
            onToggleModule={handleToggleModule} 
          />
        )}

        {activeView === 'pricing' && (
          <PricingPage />
        )}

        {activeView === 'library' && (
          <ScriptLibrary 
            projects={state.projects} 
            onSelectProject={(id) => {
              const project = state.projects.find(p => p.id === id);
              if (project) {
                handleNewSession(project.platformId, project.projectType, `I want to continue working on my project: ${project.title}\n\nExisting Code:\n${project.currentCode}`);
              }
            }}
            onNewProject={() => handleNavigate('wizard')}
          />
        )}

        {activeView === 'gallery' && (
          state.modules.find(m => m.id === 'premium-templates')?.enabled ? (
            <TemplateGallery 
              onSelectTemplate={(template) => {
                handleNewSession(template.platforms[0], template.type, template.prompt);
              }}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-bg-dark p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
                <Key className="w-8 h-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Module Locked</h2>
              <p className="text-text-dim max-w-md mb-8">
                The Template Gallery requires the <span className="text-white font-bold">Premium Template Pack</span>. 
                Enable it in the Module Manager to access professional foundations.
              </p>
              <button 
                onClick={() => handleNavigate('modules')}
                className="px-8 py-3 bg-brand-primary text-bg-dark rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all"
              >
                Go to Module Manager
              </button>
            </div>
          )
        )}

        {activeView === 'wizard' && (
          <ForgeWizard 
            modules={state.modules}
            onComplete={(data) => {
              handleNewSession(data.platform, data.type, data.behavior);
            }}
          />
        )}

        {activeView === 'settings' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
            <div className="max-w-2xl space-y-8">
              <section className="p-6 rounded-2xl bg-white/5 border border-border-muted">
                <h3 className="text-lg font-bold text-white mb-4">Local Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={state.profile.name}
                      onChange={(e) => setState(prev => ({ ...prev, profile: { ...prev.profile, name: e.target.value } }))}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-brand-primary/50"
                    />
                  </div>
                </div>
              </section>

              <section className="p-6 rounded-2xl bg-white/5 border border-border-muted">
                <h3 className="text-lg font-bold text-white mb-4">AI Providers</h3>
                <div className="space-y-4">
                  <ProviderStatus 
                    name="Google Gemini" 
                    isConnected={!!(state.profile.apiKeys.gemini || process.env.GEMINI_API_KEY)} 
                    isDefault={state.profile.selectedProvider === 'gemini'}
                    onSetup={() => setShowApiKeyModal('gemini')}
                    onClear={() => handleClearApiKey('gemini')}
                    canClear={!!state.profile.apiKeys.gemini}
                  />
                  <ProviderStatus 
                    name="OpenAI" 
                    isConnected={!!state.profile.apiKeys.openai} 
                    isDefault={state.profile.selectedProvider === 'openai'}
                    onSetup={() => setShowApiKeyModal('openai')}
                    onClear={() => handleClearApiKey('openai')}
                    canClear={!!state.profile.apiKeys.openai}
                  />
                  <ProviderStatus 
                    name="Anthropic" 
                    isConnected={!!state.profile.apiKeys.anthropic} 
                    isDefault={state.profile.selectedProvider === 'anthropic'}
                    onSetup={() => setShowApiKeyModal('anthropic')}
                    onClear={() => handleClearApiKey('anthropic')}
                    canClear={!!state.profile.apiKeys.anthropic}
                  />
                </div>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                  Indicator Forge AI uses your local environment secrets or browser vault to securely connect to AI engines. Your API keys are never stored on our servers.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/5 border border-border-muted">
                <h3 className="text-lg font-bold text-white mb-4">Data Management</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Clear Local Vault</div>
                    <div className="text-xs text-gray-500">Permanently delete all sessions and settings.</div>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all local data?')) {
                        localStorage.removeItem('indicator_forge_state');
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-bold"
                  >
                    Clear Vault
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {showApiKeyModal && (
        <ApiKeyModal 
          provider={showApiKeyModal}
          onSave={handleSaveApiKey}
          onClose={() => setShowApiKeyModal(null)}
        />
      )}
    </div>
  );
}

const ProviderStatus = ({ name, isConnected, isDefault, onSetup, onClear, canClear }: any) => (
  <div className={`p-4 rounded-xl border flex items-center justify-between ${
    isDefault ? 'bg-brand-primary/5 border-brand-primary/20' : 'bg-white/5 border-border-muted'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-600'}`} />
      <div>
        <div className="font-bold text-white text-sm">{name}</div>
        <div className="text-[10px] text-text-dim uppercase tracking-widest">
          {isConnected ? 'Key Configured' : 'No Key Found'}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {isDefault && (
        <span className="px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary text-[9px] font-bold uppercase">Default</span>
      )}
      <div className="flex items-center gap-1">
        <button 
          onClick={onSetup}
          className="p-2 rounded-lg bg-white/5 text-text-dim hover:text-white transition-all"
          title="Update Key"
        >
          <Key className="w-4 h-4" />
        </button>
        {canClear && (
          <button 
            onClick={onClear}
            className="p-2 rounded-lg bg-white/5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Clear Key"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </div>
);
