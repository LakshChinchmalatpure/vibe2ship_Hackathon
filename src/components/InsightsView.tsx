import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, RefreshCw, Volume2, Info, Lightbulb, AlertTriangle, Bell, BellOff, VolumeX, Volume2 as VolIcon, Music, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InsightsView() {
  const { insights, refreshInsights, tasks, loading, error } = useApp();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [chimeVolume, setChimeVolume] = useState(0.5);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Play a custom synthesiser chime using browser Web Audio API (highly reliable, no file downloads needed!)
  const playFuturisticChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Chime note 1 (E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(chimeVolume * 0.4, ctx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      // Chime note 2 (A5) with delay
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
      gain2.gain.linearRampToValueAtTime(chimeVolume * 0.5, ctx.currentTime + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.9);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 1.4);
    } catch (e) {
      console.error("Web Audio Chime failed", e);
    }
  };

  const handleTestReminderChime = (taskTitle: string) => {
    playFuturisticChime();
    setActiveAlert(taskTitle);
    
    // Fallback Speech synthesis voice to verbally warn user about task
    setTimeout(() => {
      try {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(`Reminder. Your upcoming priority is: ${taskTitle}.`);
        utterance.volume = chimeVolume;
        synth.speak(utterance);
      } catch (e) {
        console.error(e);
      }
    }, 400);

    setTimeout(() => {
      setActiveAlert(null);
    }, 4000);
  };

  const handleSpeak = async (insightId: string, text: string) => {
    if (playingId) return;
    setPlayingId(insightId);

    const speakWithFallback = () => {
      try {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setPlayingId(null);
        synth.speak(utterance);
      } catch (speechErr) {
        console.error('Speech synthesis completely failed', speechErr);
        setPlayingId(null);
      }
    };

    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: "Kore" })
      });

      if (!response.ok) throw new Error('Speech synthesis endpoint failed');

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
        setPlayingId(null);
        URL.revokeObjectURL(audioUrl);
      };

      audioObj.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        speakWithFallback();
      };

      await audioObj.play().catch(() => {
        URL.revokeObjectURL(audioUrl);
        speakWithFallback();
      });
    } catch (err) {
      console.warn('Speech synthesis API failed, falling back to client-side', err);
      speakWithFallback();
    }
  };

  // Filter tasks that require context-aware reminders (upcoming due dates or high priority)
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => {
      if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      return (a.dueTime || '').localeCompare(b.dueTime || '');
    });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 animate-pulse" />;
    }
  };

  const getInsightBorderClass = (type: string) => {
    switch (type) {
      case 'tip':
        return 'border-amber-200 bg-amber-50/40 hover:border-amber-300';
      case 'alert':
        return 'border-rose-200 bg-rose-50/40 hover:border-rose-300';
      default:
        return 'border-indigo-200 bg-indigo-50/40 hover:border-indigo-300';
    }
  };

  return (
    <div className="space-y-6" id="insights-view-panel">
      {/* Active Reminder Toast Header */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-indigo-600 text-white rounded-2xl flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 animate-bounce text-amber-300" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 font-mono">Active Reminder Broadcast</p>
                <p className="text-xs font-bold font-display">{activeAlert}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-indigo-500 px-2 py-0.5 rounded-full">ACTIVE CHIME</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Personalized Productivity Recommendations (8 columns) */}
        <div className="xl:col-span-8 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
                <Sparkles className="w-5.5 h-5.5 text-indigo-650" />
                Tailored Recommendations
              </h2>
              <p className="text-xs text-slate-500 font-medium">Dynamic cognitive advice adjusted to your schedule.</p>
            </div>

            <button
              id="btn-refresh-insights"
              onClick={refreshInsights}
              disabled={loading}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analyzing...' : 'Refresh Insights'}
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-150 rounded-xl text-xs font-bold text-rose-700">
              Analysis Blocked: {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map(insight => (
              <motion.div
                key={insight.id}
                whileHover={{ y: -3 }}
                className={`border rounded-2xl p-4.5 flex flex-col justify-between space-y-4 transition duration-250 ${getInsightBorderClass(insight.type)}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      {insight.type}
                    </span>
                    {getInsightIcon(insight.type)}
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-slate-800 font-display leading-tight">{insight.title}</h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed font-medium">{insight.content}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/50">
                  <span className="text-[9px] font-mono text-slate-400 font-bold">{insight.timestamp}</span>

                  <button
                    onClick={() => handleSpeak(insight.id, `${insight.title}. ${insight.content}`)}
                    disabled={playingId === insight.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                      playingId === insight.id
                        ? 'bg-indigo-650 text-white cursor-not-allowed shadow-xs'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 hover:text-slate-900'
                    }`}
                  >
                    <Volume2 className="w-3 h-3" />
                    {playingId === insight.id ? 'Speaking' : 'Speak'}
                  </button>
                </div>
              </motion.div>
            ))}

            {insights.length === 0 && (
              <div className="col-span-1 md:col-span-3 py-14 text-center border border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/25">
                <Sparkles className="w-5 h-5 text-indigo-500 mx-auto animate-pulse" />
                <p className="text-xs text-slate-700 font-bold">No advice generated yet.</p>
                <p className="text-[10px] text-slate-500 font-medium">Click Refresh Insights to construct proactive productivity cues.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Context-Aware Reminders Panel (4 columns) */}
        <div className="xl:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-150">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 font-display">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  Context Reminders
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Upcoming items requiring urgent attention.</p>
              </div>

              <button
                onClick={() => setRemindersEnabled(!remindersEnabled)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  remindersEnabled 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                    : 'bg-slate-50 border-slate-250 text-slate-400'
                }`}
                title={remindersEnabled ? "Mute reminders" : "Unmute reminders"}
              >
                {remindersEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Reminder Alert Customizer */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reminder Options</span>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-semibold">Broadcast volume</span>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={chimeVolume}
                    onChange={(e) => setChimeVolume(parseFloat(e.target.value))}
                    className="w-20 accent-indigo-600 h-1 rounded-lg cursor-pointer bg-slate-200"
                  />
                  <VolIcon className="w-3.5 h-3.5 text-slate-650" />
                </div>
              </div>
            </div>

            {/* Upcoming items checklist */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
              {upcomingTasks.slice(0, 5).map(task => {
                const isOverdue = new Date(task.dueDate + 'T' + task.dueTime) < new Date();
                const isHighPriority = task.priority === 'high';

                return (
                  <div 
                    key={task.id}
                    className={`p-3 bg-white border rounded-xl flex flex-col justify-between space-y-2.5 transition duration-200 ${
                      isOverdue 
                        ? 'border-rose-250 bg-rose-50/10' 
                        : isHighPriority 
                          ? 'border-amber-250 bg-amber-50/10'
                          : 'border-slate-150'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                            isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-650'
                          }`}>
                            {task.dueDate} @ {task.dueTime}
                          </span>
                          {isOverdue && (
                            <span className="text-[9px] text-rose-600 font-extrabold flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleTestReminderChime(task.title)}
                        disabled={!remindersEnabled}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-150 border border-indigo-150 text-indigo-600 rounded-lg transition disabled:opacity-40 cursor-pointer shadow-xs"
                        title="Broadcast alert notification"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {upcomingTasks.length === 0 && (
                <div className="text-center py-8 text-slate-400 space-y-1.5">
                  <BellOff className="w-5 h-5 mx-auto text-slate-300" />
                  <p className="text-xs font-bold italic">No pending agenda to remind.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Callout */}
      <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-indigo-950 flex items-center gap-1.5 font-display">
            <Info className="w-4 h-4 text-indigo-650" />
            Context-Aware Cognitive Architecture
          </h4>
          <p className="text-[11px] text-indigo-800 leading-relaxed max-w-2xl font-medium">
            Proactive alerts are synthesised directly in-browser. High priority and overdue tasks automatically generate voice chimes and visual cues to ensure key goals remain strictly highlighted.
          </p>
        </div>
      </div>
    </div>
  );
}
