import { useSyncExternalStore } from 'react';
import { mockStore } from '@/lib/mock-store';
import { useNavigate } from '@tanstack/react-router';
import { Bell, AlertTriangle, Phone, PhoneOff, Pill, Calendar, Eye, CheckCircle, X } from 'lucide-react';

const typeIcons = {
  red_case: AlertTriangle,
  human_review: Eye,
  no_answer: PhoneOff,
  medication: Pill,
  missed_appointment: Calendar,
};

const typeColors = {
  red_case: 'text-risk-red',
  human_review: 'text-risk-yellow',
  no_answer: 'text-muted-foreground',
  medication: 'text-purple-600',
  missed_appointment: 'text-blue-500',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ open, onClose }: Props) {
  const navigate = useNavigate();
  const notifications = useSyncExternalStore(mockStore.subscribe, mockStore.getTopNotifications, mockStore.getTopNotifications);
  const unread = notifications.filter(n => !n.read);

  if (!open) return null;

  const handleClick = (n: typeof notifications[0]) => {
    mockStore.markNotificationRead(n.id);
    if (n.patientId) {
      navigate({ to: '/patients/$patientId', params: { patientId: n.patientId } });
    } else if (n.aiResultId) {
      navigate({ to: '/ai-followup' });
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border bg-card shadow-xl max-h-96 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-bold">การแจ้งเตือน</h3>
          <div className="flex items-center gap-2">
            {unread.length > 0 && (
              <button onClick={() => mockStore.markAllNotificationsRead()} className="text-xs text-primary hover:underline">
                อ่านทั้งหมด
              </button>
            )}
            <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-72 divide-y">
          {notifications.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">ไม่มีการแจ้งเตือน</div>
          )}
          {notifications.slice(0, 10).map(n => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <button key={n.id} onClick={() => handleClick(n)}
                className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex gap-3 ${!n.read ? 'bg-teal-light/30' : ''}`}>
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${typeColors[n.type] || 'text-muted-foreground'}`} />
                <div className="min-w-0">
                  <p className={`text-sm ${!n.read ? 'font-semibold' : 'font-medium'}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.timestamp}</p>
                </div>
                {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
