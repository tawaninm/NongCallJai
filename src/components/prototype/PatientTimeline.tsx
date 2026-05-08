interface TimelineEntry {
  title: string;
  description: string;
  timestamp: string;
  type?: 'red' | 'teal' | 'blue' | 'muted';
  onClick?: () => void;
}

export function PatientTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="space-y-0">
      {entries.map((entry, i) => (
        <div key={i} className={`flex gap-4 ${entry.onClick ? 'cursor-pointer hover:bg-muted/30 rounded-lg' : ''}`} onClick={entry.onClick}>
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center pt-1">
            <div className={`timeline-dot timeline-dot-${entry.type || 'teal'}`} />
            {i < entries.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
          </div>
          {/* Content */}
          <div className="pb-6 flex-1 min-w-0">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold">{entry.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{entry.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground">{entry.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
