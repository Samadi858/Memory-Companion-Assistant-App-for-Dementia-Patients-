import { Phone, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

export function QuickConnect() {
  const { t } = useLanguage();
  const [isCalling, setIsCalling] = useState(false);
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [caregiverName, setCaregiverName] = useState('');

  useEffect(() => {
    // Load caregiver contact from localStorage
    const phone = localStorage.getItem('dementia-care-caregiver-phone') || '';
    const name = localStorage.getItem('dementia-care-caregiver-name') || '';
    setCaregiverPhone(phone);
    setCaregiverName(name);
  }, []);

  const handleEmergencyCall = () => {
    if (!caregiverPhone.trim()) {
      setIsCalling(false);
      return;
    }

    setIsCalling(true);
    // Log activity
    try {
      const activityLog = JSON.parse(localStorage.getItem('dementia-care-activity-log') || '[]');
      activityLog.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'emergency',
        action: 'Emergency call initiated',
        details: `Calling ${caregiverName || 'caregiver'}: ${caregiverPhone || 'Not set'}`,
      });
      localStorage.setItem('dementia-care-activity-log', JSON.stringify(activityLog));
    } catch (e) {
      console.error('Failed to log activity:', e);
    }

    const normalizedNumber = caregiverPhone.replace(/[^\d+]/g, '');
    window.location.href = `tel:${normalizedNumber}`;

    // Keep brief visual feedback, then reset.
    setTimeout(() => {
      setIsCalling(false);
    }, 3000);
  };

  return (
    <Card className="p-4 sm:p-6 lg:p-8 bg-white/90 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <AlertCircle className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-red-600" />
        <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem]">{t('connect.emergency')}</h2>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-4 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-4xl sm:text-5xl lg:text-6xl">🚨</span>
            </div>
          </div>

          <p className="text-[1rem] sm:text-[1.3rem] lg:text-[1.5rem] text-muted-foreground mb-6">
            Press the button below if you need immediate help
          </p>

          <Button
            size="lg"
            onClick={handleEmergencyCall}
            disabled={isCalling}
            className={`w-full h-14 sm:h-20 lg:h-24 text-[1.1rem] sm:text-[1.6rem] lg:text-[2rem] font-bold transition-all ${
              isCalling
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
            }`}
          >
            {isCalling ? (
              <>
                <Phone className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3 animate-bounce" />
                {t('connect.calling')}
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3" />
                Call {caregiverName || 'Caregiver'}
              </>
            )}
          </Button>

          {!caregiverPhone && !isCalling && (
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
              <p className="text-[0.9rem] sm:text-[1rem] lg:text-[1.1rem] text-amber-800">
                ⚠️ No caregiver number set. Please ask your caregiver to set their contact number in settings.
              </p>
            </div>
          )}

          {caregiverPhone && !isCalling && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <p className="text-[1rem] sm:text-[1.1rem] lg:text-[1.3rem] text-blue-900 font-semibold break-all">
                Calling: {caregiverPhone}
              </p>
            </div>
          )}

          {isCalling && (
            <div className="mt-6 p-4 bg-green-50 rounded-xl border-2 border-green-200 animate-in fade-in duration-300">
              <p className="text-[1rem] sm:text-[1.1rem] lg:text-[1.3rem] text-green-700">
                ✓ Calling {caregiverName || 'caregiver'}
              </p>
              <p className="text-[0.9rem] sm:text-[1rem] lg:text-[1.1rem] text-green-600 mt-1 break-all">
                {caregiverPhone ? `Dialing ${caregiverPhone}...` : 'Please set caregiver number in settings.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] text-blue-900 font-semibold mb-2">
                When to use Emergency Call:
              </p>
              <ul className="text-[0.9rem] sm:text-[1rem] lg:text-[1.1rem] text-blue-800 space-y-1">
                <li>• You feel very sick or in pain</li>
                <li>• You've fallen and can't get up</li>
                <li>• You feel confused or scared</li>
                <li>• You need immediate help</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
