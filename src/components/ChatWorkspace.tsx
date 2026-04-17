import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Terminal, 
  Eye, 
  EyeOff, 
  Settings2, 
  ChevronDown,
  Sparkles,
  RefreshCw,
  Copy,
  Download,
  Check,
  Anvil,
  Code,
  AlertCircle,
  Wand2,
  FileText,
  ArrowLeftRight,
  Save
} from 'lucide-react';
import { Session, ChatMessage, PromptHelperData, AIProvider, PlatformId } from '../types';
import { PLATFORMS, PROJECT_TYPES } from '../lib/platforms';
import { motion, AnimatePresence } from 'motion/react';
import { ModelSelector } from './ModelSelector';
import Markdown from 'react-markdown';

interface ChatWorkspaceProps {
  session: Session;
  onSendMessage: (message: string, helperData?: PromptHelperData, internalPromptOverride?: string) => void;
  isGenerating: boolean;
  streamingContent: string;
  generationError: string | null;
  selectedProvider: AIProvider;
  onSelectProvider: (provider: AIProvider) => void;
  onUpdateSessionPlatform: (platformId: PlatformId) => void;
  pendingPrompt?: string;
  onClearPendingPrompt: () => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  session,
  onSendMessage,
  isGenerating,
  streamingContent,
  generationError,
  selectedProvider,
  onSelectProvider,
  onUpdateSessionPlatform,
  pendingPrompt,
  onClearPendingPrompt
}) => {
  const [input, setInput] = useState('');
  const [showHelper, setShowHelper] = useState(false);
  const [showInternalPrompt, setShowInternalPrompt] = useState(false);
  const [internalPrompt, setInternalPrompt] = useState('');
  const [helperData, setHelperData] = useState<PromptHelperData>({});
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPlatformDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(scrollToBottom, [session.messages, streamingContent]);

  useEffect(() => {
    if (pendingPrompt) {
      setInput(pendingPrompt);
      onClearPendingPrompt();
    }
  }, [pendingPrompt, onClearPendingPrompt]);

  const handleSend = () => {
    if (!input.trim() && !showInternalPrompt) return;
    onSendMessage(input, helperData, showInternalPrompt ? internalPrompt : undefined);
    setInput('');
    setInternalPrompt('');
    setShowInternalPrompt(false);
  };

  return (
    <div className="flex-1 flex h-full bg-bg-dark overflow-hidden">
      <div className="flex-1 flex flex-col border-r border-border-muted">
        {/* Header */}
        <header className="h-[56px] border-b border-border-muted px-5 flex items-center justify-between bg-bg-panel z-10">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-bold text-white">
                  {session.title}
                </h2>
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                    className="px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[9px] uppercase tracking-tighter flex items-center gap-1 hover:bg-brand-primary/20 transition-all"
                  >
                    {session.platformId}
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showPlatformDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showPlatformDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 mt-1 w-32 bg-bg-panel border border-border-muted rounded-lg shadow-xl overflow-hidden z-20"
                      >
                        {PLATFORMS.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              onUpdateSessionPlatform(p.id);
                              setShowPlatformDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              session.platformId === p.id 
                                ? 'bg-brand-primary/10 text-brand-primary' 
                                : 'text-text-dim hover:bg-white/5 hover:text-text-main'
                            }`}
                          >
                            {p.id}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ModelSelector 
              selectedProvider={selectedProvider}
              onSelect={onSelectProvider}
            />
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowHelper(!showHelper)}
                className={`p-1.5 rounded transition-all ${showHelper ? 'text-brand-primary' : 'text-text-dim hover:text-text-main'}`}
                title="Prompt Helper"
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowInternalPrompt(!showInternalPrompt)}
                className={`p-1.5 rounded transition-all ${showInternalPrompt ? 'text-brand-primary' : 'text-text-dim hover:text-text-main'}`}
                title="Toggle Internal Prompt"
              >
                {showInternalPrompt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-bg-dark">
          {session.messages.length === 0 && !streamingContent && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-30">
              <Sparkles className="w-12 h-12 text-brand-primary mb-4" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Ready to Forge</h3>
              <p className="text-xs text-text-dim">
                Describe the {session.projectType} you want to build for {session.platformId}.
              </p>
            </div>
          )}

          {session.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {(isGenerating || streamingContent) && !generationError && (
            <div className="flex gap-4 max-w-[90%] ai-msg">
              <div className="flex-1 bubble bg-transparent border-l-2 border-brand-primary pl-4">
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-text-dim italic flex items-center gap-3">
                  <FlippingSlash />
                  <span className="animate-pulse">Forging code sequence...</span>
                </div>
              </div>
            </div>
          )}

          {generationError && (
            <div className="flex gap-4 max-w-[90%] ai-msg">
              <div className="flex-1 bubble bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                <div className="flex items-center gap-3 text-red-400 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Forge Error</span>
                </div>
                <p className="text-xs text-red-300/80 leading-relaxed">
                  {generationError}
                </p>
                <button 
                  onClick={() => onSendMessage(session.messages[session.messages.length - 1]?.content || '')}
                  className="mt-4 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-bold uppercase rounded transition-all"
                >
                  Retry Forge
                </button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-border-muted bg-bg-panel">
          <AnimatePresence>
            {showHelper && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 rounded-lg bg-bg-dark border border-border-muted grid grid-cols-2 gap-4">
                  <HelperInput label="Timeframe" value={helperData.timeframe} onChange={(v: string) => setHelperData({...helperData, timeframe: v})} placeholder="e.g. 5m, Daily" />
                  <HelperInput label="Visuals" value={helperData.visuals} onChange={(v: string) => setHelperData({...helperData, visuals: v})} placeholder="e.g. Blue clouds, Red dots" />
                  <HelperInput label="Entry Logic" value={helperData.entryConditions} onChange={(v: string) => setHelperData({...helperData, entryConditions: v})} placeholder="e.g. RSI < 30 and Price > EMA 200" className="col-span-2" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showInternalPrompt && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 rounded-lg bg-bg-dark border border-brand-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Internal Prompt Editor</label>
                  </div>
                  <textarea 
                    value={internalPrompt}
                    onChange={(e) => setInternalPrompt(e.target.value)}
                    className="w-full h-32 bg-transparent border-none rounded p-0 text-xs font-mono text-text-dim focus:outline-none"
                    placeholder="Auto-generated prompt..."
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-bg-dark border border-border-muted rounded-lg p-3 mb-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Refine the current code or start a new prompt..."
              className="w-full bg-transparent border-none text-text-main font-sans text-sm resize-none outline-none h-[60px]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <select className="bg-bg-active border border-border-muted text-text-dim px-2.5 py-1 rounded text-[11px] outline-none">
              <option>Indicator Builder</option>
              <option>Strategy Tester</option>
              <option>Alert Scripter</option>
            </select>
            
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-text-dim">Preview Prompt [OFF]</span>
              <button
                onClick={handleSend}
                disabled={isGenerating || (!input.trim() && !showInternalPrompt)}
                className="px-6 py-2 bg-brand-primary text-bg-dark rounded font-bold text-xs uppercase tracking-wider hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? 'Forging...' : 'Forge Code'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Code Panel */}
      <div className="w-[450px] bg-bg-panel flex flex-col border-l border-border-muted">
        <header className="h-[56px] border-b border-border-muted px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anvil className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Live Output</span>
          </div>
          <div className="px-2 py-0.5 bg-border-muted rounded text-[9px] font-bold text-text-main uppercase tracking-tighter">
            {PLATFORMS.find(p => p.id === session.platformId)?.language}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-5 font-mono text-[12px] leading-relaxed text-[#C1C2C5] whitespace-pre bg-[#08090B]">
          {(() => {
            const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
            const matches = [...streamingContent.matchAll(codeBlockRegex)];
            const streamingCode = matches.length > 0 ? matches[matches.length - 1][1] : null;
            
            return streamingCode || session.lastCode || (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <Code className="w-10 h-10 mb-4" />
                <p className="text-[10px] uppercase tracking-widest">No code forged yet</p>
              </div>
            );
          })()}
        </div>
        <div className="p-3 border-t border-border-muted grid grid-cols-2 gap-2">
          <button 
            onClick={() => {
              const code = streamingContent || session.lastCode;
              if (code) onSendMessage(`Explain this script in plain English:\n\n${code}`);
            }}
            className="flex items-center justify-center gap-2 py-2 bg-bg-active text-text-main border border-border-muted rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            <FileText className="w-3 h-3" />
            Explain Logic
          </button>
          <button 
            onClick={() => {
              const code = streamingContent || session.lastCode;
              if (code) onSendMessage(`Check this script for errors and fix them:\n\n${code}`);
            }}
            className="flex items-center justify-center gap-2 py-2 bg-bg-active text-text-main border border-border-muted rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            <Wand2 className="w-3 h-3" />
            Auto-Fix
          </button>
          <button 
            onClick={() => {
              const code = streamingContent || session.lastCode;
              if (code) {
                // Trigger save
                const title = prompt("Enter a title for your script:", session.title);
                if (title) {
                  // We'll pass this up to App.tsx
                  (window as any).handleSaveToLibrary?.(title, code);
                }
              }
            }}
            className="flex items-center justify-center gap-2 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary/20 transition-all"
          >
            <Save className="w-3 h-3" />
            Save to Library
          </button>
          <button 
            className="flex items-center justify-center gap-2 py-2 bg-bg-active text-text-main border border-border-muted rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
            onClick={() => {
              const code = streamingContent || session.lastCode;
              if (code) navigator.clipboard.writeText(code);
            }}
          >
            <Copy className="w-3 h-3" />
            Copy Code
          </button>
          <button 
            className="flex items-center justify-center gap-2 py-2 bg-bg-active text-text-main border border-border-muted rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
            onClick={() => {
              const code = streamingContent || session.lastCode;
              if (!code) return;
              
              const platform = PLATFORMS.find(p => p.id === session.platformId);
              const extension = platform?.extension || 'txt';
              const filename = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;
              
              const blob = new Blob([code], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = filename;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-3 h-3" />
            Export Script
          </button>
        </div>
      </div>
    </div>
  );
};

const FlippingSlash = () => {
  const [frame, setFrame] = useState(0);
  const frames = ['/', '-', '\\', '|'];

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-block w-3 font-mono text-brand-primary font-bold drop-shadow-[0_0_5px_rgba(0,255,194,0.5)]">
      {frames[frame]}
    </span>
  );
};

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`message ${isUser ? 'user-msg ml-auto flex-row-reverse' : 'ai-msg'} flex gap-4 max-w-[90%]`}>
      {!isUser && (
        <div className="w-1.5 bg-brand-primary shrink-0 rounded-full" />
      )}
      <div className={`bubble flex-1 p-3 rounded-lg text-sm leading-relaxed ${
        isUser 
          ? 'bg-bg-active border border-border-muted text-text-main' 
          : 'bg-transparent text-text-main pl-1'
      }`}>
        <div className="markdown-body">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  );
};

const HelperInput = ({ label, value, onChange, placeholder, className = '' }: any) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">{label}</label>
    <input 
      type="text" 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-primary/50"
    />
  </div>
);
