export default function CriticalFilesView({ content }) {
  return (
    <div className="flex flex-col h-full bg-[#0B0C10] text-[#C5C6C7] rounded-b-2xl">
      <div className="px-6 py-4 border-b border-white/5 bg-brand-base/50">
        <h3 className="font-semibold text-brand-light flex items-center gap-2">
          Critical Files Identification
        </h3>
        <p className="text-sm text-brand-light/60 mt-1">Highlights the most important logic files (Auth, DB Config, API Controllers)</p>
      </div>
      <div className="flex-1 p-6 overflow-auto custom-scrollbar">
        {content ? (
          <pre className="text-[14px] font-mono leading-relaxed bg-transparent whitespace-pre-wrap">
            {content}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-brand-light/30">
            No critical files identified
          </div>
        )}
      </div>
    </div>
  );
}
