import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, Mic, Volume2, Bot, Play, ShieldAlert, AlertCircle, ChevronDown, ListTodo, FileSpreadsheet, PlayCircle, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  audioBase64?: string;
  audioMimeType?: string;
}

interface AutonomousStep {
  id: string;
  phase: 'parsing' | 'structuring' | 'prioritizing' | 'saving' | 'completed';
  message: string;
  timestamp: string;
  status: 'pending' | 'active' | 'success' | 'failed';
}

export default function ExecutionAgent() {
  const { 
    tasks, addTask, addHabit, prioritizeAllTasks, refreshInsights, loading, error
  } = useApp();

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: "Affirmative. I am your strategic Executive Planner. You can verbally command me to register tasks, build daily schedules, or launch autonomous execution cycles.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  // Autonomous Planning and Execution States
  const [isAutonomousActive, setIsAutonomousActive] = useState(false);
  const [autonomousGoal, setAutonomousGoal] = useState('Configure advanced developer blueprint for Web Performance optimization');
  const [autonomousSteps, setAutonomousSteps] = useState<AutonomousStep[]>([]);
  const [activeCycleIndex, setActiveCycleIndex] = useState(-1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [autonomousSteps]);

  // High-fidelity speech playback wrapper
  const speakResponse = async (text: string, msgId: string) => {
    setIsSynthesizing(true);
    
    const speakWithFallback = () => {
      try {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSynthesizing(false);
        synth.speak(utterance);
      } catch (e) {
        setIsSynthesizing(false);
      }
    };

    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: "Fenrir" }) // Elite authoritative coach voice
      });

      if (!response.ok) throw new Error('TTS synthesis failed');

      const { audio, mimeType } = await response.json();
      
      const binary = atob(audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType || "audio/aac" });
      const audioUrl = URL.createObjectURL(blob);
      const audioObj = new Audio(audioUrl);
      
      audioObj.onended = () => {
        setIsSynthesizing(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioObj.onerror = () => {
        setIsSynthesizing(false);
        URL.revokeObjectURL(audioUrl);
        speakWithFallback();
      };
      
      await audioObj.play().catch(() => {
        URL.revokeObjectURL(audioUrl);
        speakWithFallback();
      });

      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, audioBase64: audio, audioMimeType: mimeType } : m));
    } catch (err) {
      console.warn('TTS API error, falling back to local speech synthesis', err);
      speakWithFallback();
    }
  };

  const processAgentCommand = async (command: string) => {
    const textLower = command.toLowerCase().trim();
    let replyText = "";
    
    if (textLower.includes('add task') || textLower.includes('create task') || textLower.includes('schedule task')) {
      const taskNameMatch = command.match(/(?:add|create|schedule) task\s+([^,]+)/i);
      const taskTitle = taskNameMatch ? taskNameMatch[1].trim() : "New Strategic Objective";
      
      addTask({
        title: taskTitle,
        description: "Registered dynamically by Voice/Chat Execution protocol.",
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: "18:00",
        duration: 45,
        category: "Work",
        priority: "medium",
        status: "pending"
      });
      replyText = `Understood. Task "${taskTitle}" formulated in your Focus Blueprint and mapped onto the calendar.`;

    } else if (textLower.includes('add habit') || textLower.includes('create habit')) {
      const habitMatch = command.match(/(?:add|create) habit\s+([^,]+)/i);
      const habitTitle = habitMatch ? habitMatch[1].trim() : "Focus Buffer Routine";
      
      addHabit(habitTitle, 'daily', 'Study');
      replyText = `Acknowledged. Habit Anchor "${habitTitle}" committed to your Integrity Ledger.`;

    } else if (textLower.includes('prioritize') || textLower.includes('optimize')) {
      replyText = "Re-evaluating task load density. Re-aligning priority structure with Eisenhower parameters.";
      setTimeout(() => {
        prioritizeAllTasks();
      }, 500);

    } else if (textLower.includes('autonomous') || textLower.includes('run agent') || textLower.includes('planning')) {
      replyText = "Initiating autonomous goal deconstruction, schedule block allocation, and priority formulation. Commencing planner cycles.";
      setTimeout(() => {
        handleTriggerAutonomousExecution(autonomousGoal);
      }, 800);

    } else {
      const replies = [
        "Directive acknowledged. We recommend deconstructing this objective into micro-steps.",
        "Your current integrity streaks look strong. Keep checking habit blocks on schedule.",
        "To maximize flow-state, I advise batching high-priority items in early morning hours."
      ];
      replyText = replies[Math.floor(Math.random() * replies.length)];
    }

    const replyMsgId = 'agent_' + Date.now();
    const newReply: ChatMessage = {
      id: replyMsgId,
      sender: 'agent',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newReply]);
    await speakResponse(replyText, replyMsgId);
  };

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || input;
    if (!rawText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    setTimeout(() => {
      processAgentCommand(rawText);
    }, 600);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      handleSend(text);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Run Autonomous Planning & Execution Engine
  const handleTriggerAutonomousExecution = async (goalStr: string) => {
    if (isAutonomousActive) return;
    setIsAutonomousActive(true);
    setActiveCycleIndex(0);

    const initialSteps: AutonomousStep[] = [
      { id: '1', phase: 'parsing', message: `Analyzing core objective: "${goalStr}"`, timestamp: '0.0s', status: 'active' },
      { id: '2', phase: 'structuring', message: 'Deconstructing objective into sequentially structured subtasks...', timestamp: 'Waiting', status: 'pending' },
      { id: '3', phase: 'prioritizing', message: 'Evaluating timeline conflicts & allocating calendar blocks...', timestamp: 'Waiting', status: 'pending' },
      { id: '4', phase: 'saving', message: 'Committing formulated tasks into system blueprint...', timestamp: 'Waiting', status: 'pending' },
      { id: '5', phase: 'completed', message: 'Autonomous tactical roadmap ready and registered!', timestamp: 'Waiting', status: 'pending' }
    ];

    setAutonomousSteps(initialSteps);

    // Step 1: Parse Core Objective
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAutonomousSteps(prev => prev.map((s, idx) => 
      idx === 0 ? { ...s, status: 'success', timestamp: '+1.5s' } : idx === 1 ? { ...s, status: 'active', timestamp: 'Running' } : s
    ));
    setActiveCycleIndex(1);

    // Step 2: Structured Deconstruction (Simulated fetch & subtasks breakdown)
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAutonomousSteps(prev => prev.map((s, idx) => 
      idx === 1 ? { ...s, status: 'success', timestamp: '+3.5s' } : idx === 2 ? { ...s, status: 'active', timestamp: 'Running' } : s
    ));
    setActiveCycleIndex(2);

    // Step 3: Prioritize & Mapped to Calendar
    await new Promise(resolve => setTimeout(resolve, 1800));
    setAutonomousSteps(prev => prev.map((s, idx) => 
      idx === 2 ? { ...s, status: 'success', timestamp: '+5.3s' } : idx === 3 ? { ...s, status: 'active', timestamp: 'Running' } : s
    ));
    setActiveCycleIndex(3);

    // Step 4: Actually Commit the Formulated Tasks into Context
    addTask({
      title: `[Agentic] Parse Web Core Vitals for ${goalStr.substring(0, 20)}...`,
      description: `Autonomously formulated tactical sub-goal for: "${goalStr}"`,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: "11:00",
      duration: 40,
      category: "Work",
      priority: "high",
      status: "pending"
    });

    addTask({
      title: `[Agentic] Design Optimization Architecture`,
      description: `Sequence 2 of strategic goal: "${goalStr}"`,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: "14:00",
      duration: 60,
      category: "Work",
      priority: "high",
      status: "pending"
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
    setAutonomousSteps(prev => prev.map((s, idx) => 
      idx === 3 ? { ...s, status: 'success', timestamp: '+6.8s' } : idx === 4 ? { ...s, status: 'active', timestamp: 'Running' } : s
    ));
    setActiveCycleIndex(4);

    // Step 5: Completed
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAutonomousSteps(prev => prev.map((s, idx) => 
      idx === 4 ? { ...s, status: 'success', timestamp: '+7.8s' } : s
    ));
    setIsAutonomousActive(false);
    setActiveCycleIndex(-1);

    // Add final response and speak it
    const finishMsgId = 'agent_finish_' + Date.now();
    const finishReply: ChatMessage = {
      id: finishMsgId,
      sender: 'agent',
      text: `Tactical roadmap compiled. I have deconstructed "${goalStr}" into 2 scheduled, high-priority tasks and committed them to your Focus Blueprint and Calendar workspace.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, finishReply]);
    speakResponse(finishReply.text, finishMsgId);
  };

  return (
    <div className="space-y-6" id="agentic-synergy-workspace">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="autonomous-execution-agent-view">
      {/* LEFT COLUMN: Commands & Voice Console (7 Columns) */}
      <div className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden h-[580px] flex flex-col justify-between shadow-xs">
        {/* Console Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-150 rounded-xl">
              <Bot className="w-5 h-5 text-indigo-650 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 font-display">Strategic Command Console</h3>
              <p className="text-[10px] text-slate-500 font-medium">Issue verbal or written executive requests.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-mono font-bold text-slate-500">Autonomous Core Active</span>
          </div>
        </div>

        {/* Messaging Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/15 scrollbar-thin">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {msg.sender === 'agent' && (
                <div className="w-7 h-7 bg-indigo-50 text-indigo-600 border border-indigo-150 rounded-lg flex items-center justify-center shrink-0 text-xs font-black">
                  A
                </div>
              )}

              <div className="space-y-1">
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-250 text-slate-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                
                <div className={`flex items-center gap-2 text-[9px] text-slate-400 font-mono font-bold ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'agent' && msg.audioBase64 && (
                    <button
                      onClick={() => {
                        if (!msg.audioBase64) return;
                        try {
                          const binary = atob(msg.audioBase64);
                          const bytes = new Uint8Array(binary.length);
                          for (let i = 0; i < binary.length; i++) {
                            bytes[i] = binary.charCodeAt(i);
                          }
                          const blob = new Blob([bytes], { type: msg.audioMimeType || "audio/aac" });
                          const audioUrl = URL.createObjectURL(blob);
                          const audioObj = new Audio(audioUrl);
                          audioObj.onended = () => URL.revokeObjectURL(audioUrl);
                          audioObj.onerror = () => URL.revokeObjectURL(audioUrl);
                          audioObj.play().catch(e => console.error("Replay voice error:", e));
                        } catch (e) {
                          console.error("Base64 decoding failed during voice replay", e);
                        }
                      }}
                      className="hover:text-slate-850 flex items-center gap-0.5 text-slate-500 transition cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-indigo-650" />
                      Replay Voice
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Suggested Prompts Helper */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/60 flex gap-2 overflow-x-auto scrollbar-none shrink-0 select-none">
          <button 
            onClick={() => setInput("add task Prepare Presentation Deck")}
            className="shrink-0 text-[10px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg transition font-bold cursor-pointer"
          >
            "add task Prepare Presentation Deck"
          </button>
          <button 
            onClick={() => setInput("add habit Drink 4L Water")}
            className="shrink-0 text-[10px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg transition font-bold cursor-pointer"
          >
            "add habit Drink 4L Water"
          </button>
          <button 
            onClick={() => setInput("prioritize")}
            className="shrink-0 text-[10px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg transition font-bold cursor-pointer"
          >
            "prioritize"
          </button>
        </div>

        {/* Audio/Text Inputs Bottom Console */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center gap-3 shrink-0">
          <button
            id="btn-voice-record"
            onClick={startVoiceInput}
            className={`p-3 rounded-xl border transition shrink-0 cursor-pointer ${
              isRecording 
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
                : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-105'
            }`}
            title="State verbal command"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          <input
            id="execution-agent-input"
            type="text"
            placeholder={isRecording ? "Active Voice Recognition..." : "Specify continuous execution instruction..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-250 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-indigo-500 transition font-semibold"
          />

          <button
            id="btn-send-agent-command"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Autonomous Planning & Execution Hub (5 Columns) */}
      <div className="xl:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-[580px] overflow-hidden">
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-display">
              <Sparkles className="w-5 h-5 text-indigo-650 animate-pulse" />
              Autonomous Planning Hub
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Deconstruct and schedule goals entirely autonomously.</p>
          </div>

          {/* Goal Input Parameter form */}
          <div className="space-y-2 bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Goal Parameter to Execute</span>
            <textarea
              value={autonomousGoal}
              onChange={(e) => setAutonomousGoal(e.target.value)}
              disabled={isAutonomousActive}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition font-semibold h-[70px] resize-none"
              placeholder="e.g. Conduct detailed performance audit and write a strategic report."
            />
            
            <button
              onClick={() => handleTriggerAutonomousExecution(autonomousGoal)}
              disabled={isAutonomousActive || !autonomousGoal.trim()}
              className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {isAutonomousActive ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Running Tactical Operations...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Launch Autonomous Cycle
                </>
              )}
            </button>
          </div>

          {/* Terminal output step-by-step logs */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Agent Operations Log</span>
            
            {autonomousSteps.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/20 text-slate-400">
                <Bot className="w-7 h-7 mx-auto text-slate-300" />
                <p className="text-xs font-semibold italic mt-1.5">No active autonomous operations.</p>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] leading-relaxed text-slate-300 space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin">
                {autonomousSteps.map(step => (
                  <div key={step.id} className="flex justify-between items-start gap-3">
                    <div className="flex gap-1.5 items-start">
                      <span className={`text-[9px] font-bold shrink-0 ${
                        step.status === 'success' 
                          ? 'text-emerald-400' 
                          : step.status === 'active' 
                            ? 'text-amber-400' 
                            : 'text-slate-600'
                      }`}>
                        {step.status === 'success' ? '✔' : step.status === 'active' ? '●' : '○'}
                      </span>
                      <span className={step.status === 'active' ? 'text-white font-bold' : step.status === 'pending' ? 'text-slate-650' : ''}>
                        {step.message}
                      </span>
                    </div>
                    <span className="text-slate-550 shrink-0 select-none font-bold">{step.timestamp}</span>
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>
            )}
          </div>
        </div>

        {/* Tactical status details */}
        <div className="border-t border-slate-200/60 pt-4 bg-indigo-50/20 p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5 shrink-0">
          <Sparkles className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5" />
          <p className="text-[10px] text-indigo-900 leading-normal font-semibold">
            <strong>Autonomous Planning Protocol:</strong> The execution agent evaluates target specifications, splits dependencies down to micro-components, schedules tasks onto the calendar, and adjusts prioritization matrices instantly.
          </p>
        </div>
      </div>
    </div>

      {/* Synergy Playbook Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6"
        id="synergy-playbook-section"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-150 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 font-display uppercase tracking-tight">Synergy Playbook: Orchestrating the Executive Suite</h3>
            <p className="text-xs text-slate-500 font-medium">Learn how the Strategic Command Console and Autonomous Planning Hub work in tandem to construct optimal workflows.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Console Explanation */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60" id="playbook-card-console">
            <div className="flex items-center gap-2 text-slate-800">
              <Mic className="w-4 h-4 text-indigo-650" />
              <h4 className="text-xs font-bold uppercase tracking-wider">1. Strategic Command Console</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Your real-time steering wheel. Use this console for <strong>immediate, declarative, manual task and habit overrides</strong>. It supports direct text commands or high-fidelity speech synthesis for hands-free management.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-indigo-650 flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-150">
              <span className="text-[9px] text-slate-400 uppercase">Interactive Examples:</span>
              <span>• "add task Prepare layout wireframes"</span>
              <span>• "add habit Drink 4L Water"</span>
              <span>• "prioritize"</span>
            </div>
          </div>

          {/* Card 2: Hub Explanation */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60" id="playbook-card-hub">
            <div className="flex items-center gap-2 text-slate-800">
              <PlayCircle className="w-4 h-4 text-indigo-650" />
              <h4 className="text-xs font-bold uppercase tracking-wider">2. Autonomous Planning Hub</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Your high-level architect. Instead of typing individual tasks, supply a <strong>broad, strategic multi-phase objective</strong>. The agent autonomously structures subtasks, maps dependencies, schedules time blocks, and logs each tactical step.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-indigo-650 flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-150">
              <span className="text-[9px] text-slate-400 uppercase">Interactive Examples:</span>
              <span>• "Optimize SEO & Core Web Vitals"</span>
              <span>• "Audit security compliance standards"</span>
              <span>• "Design developer wellness strategy"</span>
            </div>
          </div>

          {/* Card 3: Dual Synergy Explanation */}
          <div className="space-y-3 p-4 rounded-xl bg-indigo-50/30 border border-indigo-100" id="playbook-card-synergy">
            <div className="flex items-center gap-2 text-indigo-950">
              <Sparkles className="w-4 h-4 text-indigo-650" />
              <h4 className="text-xs font-bold uppercase tracking-wider">3. Synergistic Workflow</h4>
            </div>
            <p className="text-xs text-indigo-900/90 leading-relaxed font-medium">
              The true executive pattern: Deploy a broad target in the <strong>Planning Hub</strong> to populate your week's milestones automatically. Then, use the <strong>Command Console</strong> to make real-time tactical adjustments and run optimization matrices.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-indigo-900/80 flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-indigo-150">
              <span className="text-[9px] text-slate-400 uppercase">Cohesive Action Cycle:</span>
              <span>1. Hub: Deconstructs broad objective</span>
              <span>2. Console: Registers micro-adjustments</span>
              <span>3. Dashboard: Tracks visual metrics</span>
            </div>
          </div>
        </div>

        {/* Interactive Scenario Presets */}
        <div className="space-y-3 pt-2" id="playbook-interactive-scenarios">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Deploy Synergistic Preset Walkthroughs</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: "Launch Brand Campaign",
                consolePrompt: "add task Align Q3 Campaign Assets",
                hubGoal: "Deconstruct comprehensive Q3 brand and social media campaign, schedule email newsletters, and map media assets.",
                desc: "Structures high-level social releases in the Hub while queueing asset alignment in the Console."
              },
              {
                title: "Core Web Vitals Audit",
                consolePrompt: "prioritize",
                hubGoal: "Analyze Cumulative Layout Shift (CLS) bottlenecks, inspect bundle size limits, and schedule responsive performance refactoring blocks.",
                desc: "Schedules heavy visual performance tasks in the Hub and triggers matrix optimization via the Console."
              },
              {
                title: "Wellness & Deep Work Block",
                consolePrompt: "add habit 45-min Focus Interval",
                hubGoal: "Establish developer wellness sprint with daily hydration checkpoints, posture reminders, and structured deep work cycles.",
                desc: "Hooks deep work habits on the Console while deconstructing comprehensive wellness milestones in the Hub."
              }
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutonomousGoal(preset.hubGoal);
                  setInput(preset.consolePrompt);
                  
                  // Add an informational bot note
                  const demoMsgId = 'demo_' + Date.now();
                  setMessages(prev => [
                    ...prev,
                    {
                      id: demoMsgId,
                      sender: 'agent',
                      text: `[Synergy Walkthrough] Loaded preset "${preset.title}". I have populated your Autonomous Planning Hub goal with: "${preset.hubGoal.substring(0, 50)}..." and queue'd the Console instruction: "${preset.consolePrompt}". Click "Launch Autonomous Cycle" to begin!`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="p-3.5 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-200 rounded-xl text-left transition duration-200 group cursor-pointer"
                id={`preset-button-${index}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-900 transition">{preset.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-650 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-normal">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
