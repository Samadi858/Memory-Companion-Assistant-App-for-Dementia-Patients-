import { useEffect, useState } from 'react';
import { Bell, Clock, X, Activity, Pill } from 'lucide-react';

import { API_BASE_URL } from '../services/api';
import { Button } from './ui/button';

export interface ScheduledItem {
  id: string;
  type: 'medication' | 'task';
  name: string;
  time: string;
  frequency?: 'daily' | 'weekdays' | 'weekends' | string;
  image_url?: string;
  color: string;
  icon?: string;
  days?: number[];
  enabled?: boolean;
}

interface ActiveAlert {
  has_alert?: boolean;
  alert_id: number;
  reminder_id: number;
  title: string;
  time: string;
  type: string;
  icon: string;
  image_url?: string | null;
  color: string;
  triggered_at: string;
}

const STORAGE_KEY = 'dementia-app-scheduled-items';

export function UnifiedScheduler() {
  const [activeAlert, setActiveAlert] = useState<ActiveAlert | null>(null);

  useEffect(() => {
    const checkAlerts = async () => {
      const token = localStorage.getItem('access_token');
      const userId = getStoredAuthUserId();

      try {
        let response: Response | null = null;
        if (token) {
          response = await fetch(`${API_BASE_URL}/alerts/active`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        // Fallback to patient-scoped endpoint when token is missing/expired.
        if (!response || response.status === 401 || response.status === 403) {
          const url = new URL(`${API_BASE_URL}/alerts/patient/active`);
          if (typeof userId === 'number') {
            url.searchParams.set('user_id', String(userId));
          }
          response = await fetch(url.toString());
        }

        if (!response.ok) {
          setActiveAlert(null);
          return;
        }

        const data = (await response.json()) as ActiveAlert;
        if (data.has_alert === false) {
          setActiveAlert(null);
          return;
        }
        if (!data.alert_id) {
          setActiveAlert(null);
          return;
        }
        setActiveAlert(data);
      } catch {
        setActiveAlert(null);
        // Fail silently in UI when backend is unreachable.
      }
    };

    void checkAlerts();
    const interval = setInterval(() => {
      void checkAlerts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDone = async () => {
    if (!activeAlert) {
      return;
    }

    const token = localStorage.getItem('access_token');
    const userId = getStoredAuthUserId();

    try {
      let doneOk = false;
      if (token) {
        const response = await fetch(`${API_BASE_URL}/alerts/${activeAlert.alert_id}/done`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        doneOk = response.ok;
      }

      if (!doneOk) {
        const url = new URL(`${API_BASE_URL}/alerts/patient/${activeAlert.alert_id}/done`);
        if (typeof userId === 'number') {
          url.searchParams.set('user_id', String(userId));
        }
        const response = await fetch(url.toString(), {
          method: 'POST',
        });
        if (!response.ok) {
          return;
        }
        doneOk = true;
      }

      if (doneOk) {
        setActiveAlert(null);
      }
    } catch {
      // keep current alert open if backend update fails
    }
  };

  const resolveImageUrl = (value?: string | null) => {
    if (!value) {
      return undefined;
    }
    if (value.startsWith('data:') || value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    return `${API_BASE_URL}${value}`;
  };

  useEffect(() => {
    console.log('[UnifiedScheduler] activeAlert state:', activeAlert);
  }, [activeAlert]);

  if (!activeAlert) {
    return null;
  }

  const imageUrl = resolveImageUrl(activeAlert.image_url);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999999,
        width: '100%',
        maxWidth: '42rem',
        padding: '0 1rem'
      }}
    >
      <div className={`rounded-3xl shadow-2xl p-8 border-4 border-white relative animate-in fade-in slide-in-from-bottom-10 duration-500 ${activeAlert.type === 'medication'
          ? 'bg-gradient-to-r from-orange-500 to-red-500'
          : 'bg-gradient-to-r from-blue-500 to-purple-500'
        }`}>
        <button
          onClick={() => void handleDone()}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          aria-label="Dismiss reminder"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center">
                {activeAlert.type === 'medication' ? (
                  <Bell className="w-12 h-12 text-red-600 animate-pulse" />
                ) : (
                  <Activity className="w-12 h-12 text-blue-600 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 text-white">
            <h3 className="text-[2.5rem] mb-4">
              {activeAlert.type === 'medication' ? 'Medication' : 'Task'}
            </h3>

            <div className="flex items-center gap-4 mb-6">
              {imageUrl ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full shadow-lg border-2 border-white/60">
                  <img src={imageUrl} alt={activeAlert.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div
                  className={`w-16 h-16 ${activeAlert.color || 'bg-blue-400'} rounded-full flex items-center justify-center shadow-lg`}
                >
                  {activeAlert.type === 'medication' ? (
                    <Pill className="w-8 h-8 text-white" />
                  ) : (
                    <span className="text-3xl">{activeAlert.icon || '📋'}</span>
                  )}
                </div>
              )}
              <div>
                <p className="text-[2rem]">{activeAlert.title}</p>
                <div className="flex items-center gap-2 text-[1.3rem] opacity-90">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{activeAlert.time}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => void handleDone()}
                className="flex-1 bg-white text-blue-600 hover:bg-gray-100 text-[1.5rem] py-6 h-auto"
              >
                ✓ Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStoredAuthUserId(): number | undefined {
  const raw = localStorage.getItem('auth_user');
  if (!raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as { id?: unknown };
    if (typeof parsed.id === 'number') {
      return parsed.id;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export { STORAGE_KEY };
