import React, { useState } from 'react';
import { 
  BookOpen, FileText, CheckCircle2, ShieldAlert, Sparkles, Code, 
  Layers, Volume2, HelpCircle, Copy, Cpu, ArrowRight, Check, Play, Mic, PlayCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ProjectBlueprintView() {
  const [copied, setCopied] = useState(false);
  const [selectedExample, setSelectedExample] = useState<'by' | 'with'>('with');

  const copyToClipboard = () => {
    const markdownContent = `AI PRODUCTIVITY COMPANION — PROJECT DESCRIPTION PORTFOLIO

=========================================
1. PROBLEM STATEMENT SELECTED: THE CHAOS OF FRAGMENTED PRODUCTIVITY
=========================================
Modern knowledge workers, developers, and students face severe cognitive overload and tool fatigue. 
The current productivity ecosystem is deeply fragmented:
* Scattered State: Tasks live in one app, calendar schedules live in another, daily habits are tracked on mobile devices, and conceptual notes are trapped in text documents. This lack of centralized context leads to visual noise and constant context switching.
* Execution Paralysis: Having a long list of tasks does not equate to an active daily plan. Users struggle to prioritize effectively (e.g., separating urgent fire drills from long-term, non-urgent yet important goals) and fail to break down complex, multi-phase objectives into executable milestones.
* Tactical-Strategic Disconnect: Standard planners are either purely tactical (adding a single task) or purely strategic (writing a high-level goal). There is no active bridge connecting daily tactical overrides (instant adjustments) with automated high-level strategic planning.

=========================================
2. SOLUTION OVERVIEW
=========================================
The AI Productivity Companion is an elite, full-stack, AI-powered workspace designed to unify tactical scheduling, autonomous strategy formulation, habit mechanics, and auditory guidance into a cohesive single-screen environment.

At the heart of the solution is the Synergetic Executive Loop, which bridges the gap between:
* Immediate Tactical Action: Managed via the Strategic Command Console (supporting voice-to-text, quick overrides, and spoken voice syntheses).
* Autonomous Strategic Design: Managed via the Autonomous Planning Hub (driven by the server-side Gemini API to break down high-level objectives into multi-phase schedules).

By pairing these two paradigms, the application automates cognitive layout (via the Eisenhower Matrix), recommends optimal calendar time-blocks, and provides real-time spoken coaching, ensuring knowledge workers stay in deep focus.

=========================================
3. KEY FEATURES
=========================================
1. Eisenhower Priority Matrix: Automatically classifies tasks into four high-contrast quadrants (Urgent-Important, Urgent-Not Important, Important-Not Urgent, Not Urgent-Not Important) with AI-generated reasoning.
2. Autonomous Planning Hub: Inputs broad strategic targets (e.g., "Build and deploy Q3 product catalog") and outputs structured multi-phase subtasks, durations, and dependencies.
3. Strategic Command Console: A terminal-inspired interface supporting direct text instruction ingestion or hands-free voice coaching.
4. Interactive Timeline Calendar: Generates recommended daily agendas, highlighting dedicated deep work blocks, breaks, and buffer periods.
5. Habit & Streak Tracker: Tracks recurring behaviors with visual streak logs, motivating users to build consistent daily flywheels.
6. Double-Engine Text-To-Speech (TTS): Seamlessly synthesizes spoken feedback from Gemini-generated insights, switching to client-side SpeechSynthesis if rate limits or network issues arise.

=========================================
4. THE SYNERGETIC INTERACTIVE CYCLE (USE OF BOTH, BY, AND WITH)
=========================================
The application leverages BOTH systems in tandem to deliver strategic flow:

A. Running the Planning Hub WITH the Command Console
* Concept: The Planning Hub decomposes a massive, ambiguous goal into structured phases. By working with the Command Console, these generated phases are immediately streamed into the tactical environment as active, editable task nodes.
* Real-World Example: 
  1. The user enters a strategic milestone in the Planning Hub: "Optimize CSS performance & Bundle size".
  2. The Hub uses Gemini to generate a 3-step technical schedule (Audit bundle, Tree-shake legacy modules, Configure code splitting).
  3. These steps are loaded WITH the Command Console's listener. The user can immediately say "prioritize" in the Command Console, triggering an active re-sorting of these newly generated subtasks on the Kanban board.
  4. The Console then reads out the structured plan via voice synthesis.

B. Driving the Planning Hub BY the Command Console
* Concept: The user can control and override the Strategic Planning Hub BY issuing declarative micro-instructions through the Command Console, circumventing the need to navigate multiple forms or menus.
* Real-World Example:
  1. The user is in the middle of executing an autonomous plan.
  2. They realize an urgent distraction has appeared.
  3. Instead of manually editing the plan, they type in the Command Console: "add task Align layout wireframes" or "add habit Drink 4L Water".
  4. This command instantly intercepts the active planning state, updates the Eisenhower matrix, recalculates calendar availability, and informs the Planning Hub's AI engine to shift upcoming tasks forward.

=========================================
5. TECHNOLOGIES USED
=========================================
* Frontend UI Engine: React 18, Vite (Hot Module Replacement disabled for persistent preview state).
* Aesthetic Styling: Tailwind CSS (optimized for responsive desktop/mobile scaling, featuring a high-contrast slate-indigo visual palette).
* Motion & Physics: motion (imported from motion/react) for smooth, micro-animated tab shifts and card slide-ins.
* Icons: lucide-react (uniform SVG icon library).
* State Management: React Context (AppContext.tsx) with local storage persistence for user-created task nodes, habits, and execution logs.

=========================================
6. GOOGLE TECHNOLOGIES UTILIZED
=========================================
* Server-Side Gemini API Integration: We utilize the server-side Gemini API (specifically powered by models/gemini-3.5-flash or models/gemini-3.1-flash) to drive all intelligent features, including high-fidelity goal decomposition, Eisenhower quadrant sorting, and priority justifications.
* Gemini 3.1 Text-to-Speech (TTS): Dynamic Vocalization of goals and insight logs using gemini-3.1-flash-tts-preview, with a resilient client-side SpeechSynthesis fallback redirection on server resource rate limits.`;

    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="project-blueprint-view-root">
      {/* Blueprint Header Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
            Project Deliverable Bundle
          </span>
          <h2 className="text-xl font-black text-slate-900 font-display mt-2 uppercase tracking-tight">Project Portfolio & System Blueprint</h2>
          <p className="text-xs text-slate-500 font-medium">Complete structured documentation ready to be exported directly for your Google Doc submission.</p>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          id="copy-blueprint-to-clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Google Doc Content'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COMPANION: Documentation Structure */}
        <div className="lg:col-span-8 space-y-6">
          {/* Problem Statement Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4" id="blueprint-problem-statement">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-red-50 text-red-650 border border-red-150 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 font-display uppercase tracking-tight">1. Problem Statement Selected</h3>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">The Chaos of Fragmented Productivity</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Modern knowledge workers, developers, and students navigate an environment of extreme <strong>cognitive overload</strong>. Because task managers, time-trackers, scheduling calendars, and notes software exist in separate silos, users suffer from <strong>tool fatigue</strong> and constant context-switching.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <li className="p-3 rounded-xl bg-slate-50 border border-slate-150 text-slate-700">
                  <span className="text-xs font-extrabold text-slate-900 block mb-1">Scattered State</span>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Tasks, timelines, habits, and advisor feedback are spread across disconnected platforms.</p>
                </li>
                <li className="p-3 rounded-xl bg-slate-50 border border-slate-150 text-slate-700">
                  <span className="text-xs font-extrabold text-slate-900 block mb-1">Execution Paralysis</span>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Long static todo lists are paralyzing because they fail to schedule or prioritize items dynamically.</p>
                </li>
                <li className="p-3 rounded-xl bg-slate-50 border border-slate-150 text-slate-700">
                  <span className="text-xs font-extrabold text-slate-900 block mb-1">Tactical-Strategic Gap</span>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">No direct communication loop between real-time micro-overrides and high-level macro planning.</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Overview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4" id="blueprint-solution-overview">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-50 text-indigo-650 border border-indigo-150 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 font-display uppercase tracking-tight">2. Solution Overview</h3>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                The <strong>AI Productivity Companion</strong> is an elite, full-stack unified ecosystem that resolves tool fragmentation. It introduces a closed-loop system where high-level vision meets daily execution natively. 
              </p>
              <div className="p-4 rounded-xl bg-indigo-50/20 border border-indigo-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-extrabold text-indigo-950 block">Strategic Command Console</span>
                  <p className="text-[11px] text-indigo-900/85 leading-relaxed font-medium">Operates as the day-to-day tactical command center, enabling immediate overrides, manual inserts, and spoken-word interaction.</p>
                </div>
                <div className="hidden md:flex items-center text-indigo-400">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-extrabold text-indigo-950 block">Autonomous Planning Hub</span>
                  <p className="text-[11px] text-indigo-900/85 leading-relaxed font-medium">Operates as the architectural scheduler, decomposing broad objectives into timed subtask grids and scheduling them onto the calendar.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4" id="blueprint-key-features">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-emerald-50 text-emerald-650 border border-emerald-150 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 font-display uppercase tracking-tight">3. Key Features</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Eisenhower Matrix Quadrants",
                  desc: "Intelligent layout separating tasks by Urgency and Importance, complete with AI justifications."
                },
                {
                  title: "Autonomous Planner Nodes",
                  desc: "High-level goal breakdown engine creating structured timelines and multi-phase tasks."
                },
                {
                  title: "Strategic Voice Console",
                  desc: "Command input panel taking spoken audio or written cues and speaking back action logs."
                },
                {
                  title: "Calendar Timeline Sync",
                  desc: "Interactive visual calendar plotting task blocks, deep work sprints, and rest breaks."
                },
                {
                  title: "Goal & Habit Streak Tracking",
                  desc: "Streaks and daily checklist loggers to keep user momentum and building focus loops."
                },
                {
                  title: "Dual-Engine Text-to-Speech",
                  desc: "Seamless failover between Gemini TTS server generation and client-side web SpeechSynthesis."
                }
              ].map((feature, i) => (
                <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div className="p-1 bg-white border border-slate-200 rounded-lg text-emerald-600 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800">{feature.title}</h5>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COMPANION: Synergy & Technology */}
        <div className="lg:col-span-4 space-y-6">
          {/* Interactive Synergy Playbook */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4" id="blueprint-synergy-loop">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-violet-50 text-violet-650 border border-violet-150 rounded-xl">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-black text-slate-900 font-display uppercase tracking-tight">Synergy: "By" & "With"</h3>
            </div>
            
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              How the <strong>Command Console</strong> and the <strong>Planning Hub</strong> integrate together:
            </p>

            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
              <button
                onClick={() => setSelectedExample('with')}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  selectedExample === 'with' ? 'bg-white shadow-xs text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Hub WITH Console
              </button>
              <button
                onClick={() => setSelectedExample('by')}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  selectedExample === 'by' ? 'bg-white shadow-xs text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Hub BY Console
              </button>
            </div>

            {selectedExample === 'with' ? (
              <div className="space-y-3 bg-violet-50/20 p-3.5 rounded-xl border border-violet-100" id="synergy-with-card">
                <span className="text-[10px] font-mono font-bold text-violet-750 uppercase">Scenario</span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Deconstructing a complex strategy <strong>with</strong> instant tactical activation.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-700 space-y-1">
                  <span className="text-slate-400">1. INPUT HUB STRATEGY:</span>
                  <p className="text-slate-900 font-bold">"Audit system latency & optimize DB queries"</p>
                  <span className="text-slate-400">2. ACTIVATION NODE:</span>
                  <p className="text-indigo-650 font-bold">• 3 tasks loaded into Eisenhower Kanban</p>
                  <p className="text-indigo-650 font-bold">• Text-To-Speech reads out schedule</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-violet-50/20 p-3.5 rounded-xl border border-violet-100" id="synergy-by-card">
                <span className="text-[10px] font-mono font-bold text-violet-750 uppercase">Scenario</span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Steering and editing active schedules <strong>by</strong> speaking immediate command overrides.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-700 space-y-1">
                  <span className="text-slate-400">1. LIVE COMMAND OVERRIDE:</span>
                  <p className="text-slate-900 font-bold">"add task Align layout wireframes"</p>
                  <span className="text-slate-400">2. SYSTEM INTERCEPT:</span>
                  <p className="text-indigo-650 font-bold">• Instantly queues task into urgent grid</p>
                  <p className="text-indigo-650 font-bold">• Shakes active timeline calendar outward</p>
                </div>
              </div>
            )}
          </div>

          {/* Google Technologies Utilized Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4" id="blueprint-google-technologies">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-indigo-50 text-indigo-650 border border-indigo-150 rounded-xl">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-black text-slate-900 font-display uppercase tracking-tight">Google Technologies</h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <h5 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-650" />
                  Gemini-3.5-Flash API
                </h5>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Processes and deconstructs messy strategic inputs into structured arrays of nested steps, calculates precise durations, and maps priorities.
                </p>
              </div>
              <div className="space-y-1 border-t border-slate-100 pt-3.5">
                <h5 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-650" />
                  Gemini TTS & Resilient Fallback
                </h5>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Utilizes <code>gemini-3.1-flash-tts-preview</code> for server-synthesized vocal updates, supported by a browser SpeechSynthesis fallback proxy.
                </p>
              </div>
            </div>
          </div>

          {/* Technologies Used Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4" id="blueprint-technologies-used">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl">
                <Code className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-black text-slate-900 font-display uppercase tracking-tight">Technical Stack</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['React 18', 'Vite', 'TypeScript', 'Tailwind CSS', 'Motion', 'Express', 'Lucide Icons'].map((tech, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-150 text-[9px] font-mono font-bold text-slate-600 rounded-md">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
