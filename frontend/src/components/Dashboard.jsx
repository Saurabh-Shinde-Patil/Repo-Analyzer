import { FolderTree, PlayCircle, Network, ArrowRight, ShieldAlert, FileCode, CheckCircle, BrainCircuit, FileSearch, BookOpen, Flame, ArrowDown, Globe, KeyRound, Home } from 'lucide-react';

export default function Dashboard({ data, onReset }) {
  // Expected structure based on new JSON schema from backend
  const { summary, b2, m1, m2, m3, criticalFiles, bugs, apiEndpoints, envVars } = data;

  const panelClass = "bg-white dark:bg-[#0f172a]/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-white/10 transition-colors duration-500";
  const headerClass = "text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100";
  const subTextClass = "text-slate-600 dark:text-slate-400 text-sm sm:text-base";
  const iconClass = "text-slate-400 dark:text-slate-500";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 md:gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-10 sm:pb-20">
      
      {/* Back to Home Button */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 hover:-translate-y-0.5"
        >
          <Home size={18} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          Analyze Another Repo
        </button>
      </div>
      
      {/* --- B3: HEADER SUMMARIES & DESIGN DECISIONS --- */}
      <div className={`${panelClass} flex flex-col gap-6`}>
        
        {/* Pills / Tags */}
        <div className="flex flex-wrap items-center gap-3">
          {summary?.techStack?.map((tech, idx) => (
            <span key={idx} className="px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold border border-blue-100 dark:border-blue-500/20 shadow-sm transition-colors duration-500">
              {tech}
            </span>
          ))}
        </div>

        {/* Core Summary Text */}
        <p className={`${subTextClass} leading-relaxed text-sm sm:text-base md:text-lg transition-colors duration-500`}>
          {summary?.summary}
        </p>

        {/* Architecture Pill */}
        {summary?.architecture && (
          <div className="inline-flex w-fit items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 transition-colors duration-500">
            <BookOpen size={16} className={iconClass} />
            <span>{summary.architecture} Architecture</span>
          </div>
        )}

        {/* Key Design Decisions */}
        {summary?.keyDesignDecisions && summary.keyDesignDecisions.length > 0 && (
          <div className="mt-4 p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl transition-colors duration-500">
            <h4 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-3">
              <Flame size={18} />
              Key Design Decisions
            </h4>
            <ul className="list-disc list-inside text-amber-700 dark:text-amber-200/80 space-y-2 text-sm">
              {summary.keyDesignDecisions.map((decision, idx) => (
                <li key={idx} className="leading-relaxed">{decision}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* --- M1: FOLDER STRUCTURE --- */}
      <div className={panelClass}>
        <div className="flex items-center gap-3 mb-8">
          <FolderTree size={24} className={iconClass} />
          <h3 className={headerClass}>Folder Structure</h3>
        </div>
        <div className="flex flex-col gap-5">
          {m1?.map((item, idx) => (
            <div key={idx} className="flex flex-col border-l-[3px] border-blue-400 dark:border-blue-500 pl-6 py-1 relative hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-r-xl transition-colors">
              <div className="absolute w-4 h-4 bg-white dark:bg-slate-900 border-4 border-blue-400 dark:border-blue-500 rounded-full -left-[10px] top-2 shadow-sm transition-colors duration-500"></div>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-3 mb-1">
                <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2 rounded-lg transition-colors duration-500">
                  <FolderTree size={20} />
                </div>
                {item.folder}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed ml-[52px] transition-colors duration-500">{item.description}</p>
            </div>
          ))}
          {(!m1 || m1.length === 0) && <p className="text-slate-500 dark:text-slate-400 italic">No folder structure available.</p>}
        </div>
      </div>

      {/* --- M2: ENTRY POINT & LIFECYCLE --- */}
      <div className={panelClass}>
        <div className="flex items-center gap-3 mb-8">
          <PlayCircle size={24} className={iconClass} />
          <h3 className={headerClass}>Entry Point & Flow</h3>
        </div>
        <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-700 dark:text-purple-300 font-semibold mb-4 sm:mb-8 shadow-sm transition-colors duration-500 text-sm sm:text-base break-all">
          <PlayCircle size={20} />
          {m2?.entryFile || 'Unknown Entry Point'}
        </div>

        <div className="flex flex-col items-center w-full px-4">
          {m2?.steps?.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center w-full">
              <div className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500/50 rounded-2xl p-5 flex items-center gap-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold shrink-0 transition-colors duration-500">
                  {idx + 1}
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-[15px] flex-1 leading-relaxed transition-colors duration-500">{step}</div>
              </div>
              {idx < m2.steps.length - 1 && (
                <div className="h-6 w-0.5 bg-gradient-to-b from-purple-200 to-purple-400 dark:from-purple-500/30 dark:to-purple-500/60 my-1"></div>
              )}
            </div>
          ))}
          {(!m2?.steps || m2.steps.length === 0) && <p className="text-slate-500 dark:text-slate-400 italic">No execution steps found.</p>}
        </div>
      </div>

      {/* --- B2: RUNTIME REQUEST FLOW --- */}
      <div className={panelClass}>
        <div className="flex items-center gap-3 mb-8">
          <Network size={24} className={iconClass} />
          <h3 className={headerClass}>Runtime Request Flow</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-0 sm:px-4">
          {b2?.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-2 rounded-lg text-emerald-800 dark:text-emerald-300 font-medium shadow-sm flex items-center gap-2 transition-colors duration-500">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                {step}
              </div>
              {idx < b2.length - 1 && (
                <ArrowRight size={20} className="text-emerald-300 dark:text-emerald-500/50" />
              )}
            </div>
          ))}
          {(!b2 || b2.length === 0) && <p className="text-slate-500 dark:text-slate-400 italic">No request flow available.</p>}
        </div>
      </div>

      {/* --- M3: DEPENDENCY MAPPING --- */}
      <div className={panelClass}>
        <div className="flex items-center gap-3 mb-8">
          <Network size={24} className={iconClass} />
          <h3 className={headerClass}>Dependency Mapping</h3>
        </div>
        <div className="flex flex-col gap-8 w-full">
          {m3 && m3.length > 0 ? (() => {
            const grouped = m3.reduce((acc, curr) => {
              const source = curr.source || curr.file || 'Unknown';
              const target = curr.target || curr.dependsOn;
              if (!acc[source]) acc[source] = [];
              if (target && !acc[source].includes(target)) {
                acc[source].push(target);
              }
              return acc;
            }, {});
            
            return Object.entries(grouped).map(([source, targets], idx) => (
              <div key={idx} className="flex flex-col w-full bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-6 border border-slate-100 dark:border-white/5 transition-colors duration-500">
                <div className="font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-5 py-2.5 rounded-xl w-fit flex items-center gap-3 shadow-sm mb-4 transition-colors duration-500">
                  <BookOpen size={20} className="text-emerald-500"/>
                  {source}
                </div>
                <div className="flex flex-col border-l-2 border-emerald-200 dark:border-emerald-500/30 pl-8 ml-5 gap-4 relative">
                  {targets.map((t, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-4 relative w-full">
                      <div className="absolute w-8 border-t-2 border-emerald-200 dark:border-emerald-500/30 -left-8"></div>
                      <div className="bg-white dark:bg-slate-800 border text-[14px] font-mono border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 shadow-sm w-full max-w-lg hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-colors">
                        {t}
                      </div>
                    </div>
                  ))}
                  {targets.length === 0 && <span className="text-slate-400 dark:text-slate-500 italic text-sm">No child dependencies</span>}
                </div>
              </div>
            ));
          })() : <p className="text-slate-500 dark:text-slate-400 italic">No dependencies mapped.</p>}
        </div>
      </div>

      {/* --- B1: CRITICAL FILES --- */}
      <div className={panelClass}>
        <div className="flex items-center gap-3 mb-8">
          <Flame size={24} className={iconClass} />
          <h3 className={headerClass}>Critical Files</h3>
        </div>
        
        <div className="flex flex-col gap-6">
          {criticalFiles?.map((crit, idx) => (
            <div key={idx} className="flex flex-col gap-2 border-b border-slate-50 dark:border-white/5 pb-6 last:border-0 last:pb-0 transition-colors duration-500">
              <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-mono text-sm bg-red-50 dark:bg-red-500/10 w-fit px-3 py-1 rounded transition-colors duration-500">
                <BookOpen size={16} />
                {crit.file}
              </div>
              <p className="text-slate-600 dark:text-slate-300 pl-1 transition-colors duration-500">{crit.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- BUG FINDER (EXTRA FEATURE) --- */}
      <div className={panelClass}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldAlert size={24} className="text-red-500" />
            <h3 className={headerClass}>Security & Bug Scan</h3>
          </div>
          <span className="px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-bold border border-red-100 dark:border-red-500/20 uppercase tracking-wide transition-colors duration-500">Beta Feature</span>
        </div>

        {bugs && bugs.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {bugs.map((bug, idx) => {
              const severityColor = bug.severity?.toLowerCase() === 'high' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400' : 
                                  bug.severity?.toLowerCase() === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400' : 
                                  'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400';

              return (
                <div key={idx} className={`border rounded-xl p-5 shadow-sm flex flex-col gap-3 transition-transform hover:-translate-y-1 ${severityColor} duration-500`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold bg-white/50 dark:bg-black/20 px-2 py-1 rounded transition-colors duration-500">
                      <FileCode size={14} />
                      {bug.file}
                    </div>
                    <span className="uppercase text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 transition-colors duration-500">
                      {bug.severity}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{bug.issue}</p>
                  <div className="mt-auto pt-3 border-t border-black/5 dark:border-white/5 transition-colors duration-500">
                    <p className="text-xs italic"><span className="font-bold">Fix: </span>{bug.suggestion}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-3 shadow-inner transition-colors duration-500">
            <CheckCircle size={20} />
            <span className="font-medium animate-pulse">No obvious bugs or vulnerabilities detected in context!</span>
          </div>
        )}
      </div>

      {/* --- API ENDPOINTS MAP --- */}
      <div className={panelClass}>
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Globe size={24} className={iconClass} />
          <h3 className={headerClass}>API Endpoints Map</h3>
        </div>

        {apiEndpoints && apiEndpoints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Method</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Route</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden sm:table-cell">Handler</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody>
                {apiEndpoints.map((ep, idx) => {
                  const methodColor = {
                    'GET': 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
                    'POST': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
                    'PUT': 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
                    'PATCH': 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
                    'DELETE': 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
                  }[ep.method?.toUpperCase()] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                  return (
                    <tr key={idx} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2 sm:px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${methodColor} transition-colors duration-500`}>
                          {ep.method}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-4 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 transition-colors duration-500">{ep.path}</td>
                      <td className="py-3 px-2 sm:px-4 font-mono text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell transition-colors duration-500">{ep.handler}</td>
                      <td className="py-3 px-2 sm:px-4 text-slate-600 dark:text-slate-400 text-xs hidden md:table-cell transition-colors duration-500">{ep.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic text-sm">No API endpoints detected in this repository.</p>
        )}
      </div>

      {/* --- ENVIRONMENT VARIABLES GUIDE --- */}
      <div className={panelClass}>
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <KeyRound size={24} className={iconClass} />
          <h3 className={headerClass}>Environment Variables</h3>
        </div>

        {envVars && envVars.length > 0 ? (
          <div className="flex flex-col gap-3">
            {envVars.map((ev, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 transition-colors duration-500">
                <code className="text-sm font-bold font-mono text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-3 py-1 rounded-lg w-fit transition-colors duration-500">
                  {ev.name}
                </code>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">→</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 transition-colors duration-500">{ev.usedIn}</span>
                <span className="text-sm text-slate-600 dark:text-slate-300 sm:ml-auto transition-colors duration-500">{ev.description}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic text-sm">No environment variables detected in this repository.</p>
        )}
      </div>

    </div>
  );
}
