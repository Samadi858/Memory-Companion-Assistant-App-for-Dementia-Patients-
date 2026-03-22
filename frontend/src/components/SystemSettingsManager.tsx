import { useEffect, useState } from 'react';
import { Lock, Moon, Globe, Bell, Shield, Phone, User, Users, Heart, Upload, Camera } from 'lucide-react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { settingsService } from '../services/settingsService';
import { authService } from '../services/authService';

export function SystemSettingsManager() {
  // Patient Profile Settings
  const [patientName, setPatientName] = useState(() => {
    return localStorage.getItem('dementia-care-patient-name') || '';
  });
  const [primaryCaregiverName, setPrimaryCaregiverName] = useState(() => {
    return localStorage.getItem('dementia-care-primary-caregiver-name') || '';
  });
  const [caregiverRelationship, setCaregiverRelationship] = useState(() => {
    return localStorage.getItem('dementia-care-caregiver-relationship') || '';
  });
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(() => {
    return localStorage.getItem('dementia-care-emergency-contact') || '';
  });
  const [patientPhotoUrl, setPatientPhotoUrl] = useState(() => {
    return localStorage.getItem('dementia-care-patient-photo') || '';
  });

  const [fontSize, setFontSize] = useState([100]);
  const [highContrast, setHighContrast] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  // Notification Settings
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [visualAlerts, setVisualAlerts] = useState(true);
  const [reminderVolume, setReminderVolume] = useState([70]);
  const [snoozeEnabled, setSnoozEnabled] = useState(true);
  const [snoozeDuration, setSnoozeDuration] = useState('5');

  // Language Settings
  const [language, setLanguage] = useState('english');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [dateFormat, setDateFormat] = useState('mdy');

  // Security Settings
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState('5');
  const [requirePasswordForSettings, setRequirePasswordForSettings] = useState(true);
  const [activityLogging, setActivityLogging] = useState(true);

  // Emergency Contact Settings
  const [caregiverPhone, setCaregiverPhone] = useState(() => {
    return localStorage.getItem('dementia-care-caregiver-phone') || '';
  });
  const [caregiverName, setCaregiverName] = useState(() => {
    return localStorage.getItem('dementia-care-caregiver-name') || '';
  });
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getSystemSettings();

        setPatientName(settings.patient_name || '');
        setPrimaryCaregiverName(settings.primary_caregiver_name || '');
        setCaregiverRelationship(settings.caregiver_relationship || '');
        setEmergencyContactNumber(settings.emergency_contact_number || '');
        setPatientPhotoUrl(settings.patient_photo_url || '');
        setCaregiverName(settings.caregiver_name || '');
        setCaregiverPhone(settings.caregiver_phone || '');

        setFontSize([settings.font_size ?? 100]);
        setHighContrast(Boolean(settings.high_contrast));
        setNightMode(Boolean(settings.night_mode));
        setAnimations(Boolean(settings.animations));

        setAudioAlerts(Boolean(settings.audio_alerts));
        setVisualAlerts(Boolean(settings.visual_alerts));
        setReminderVolume([settings.reminder_volume ?? 70]);
        setSnoozEnabled(Boolean(settings.snooze_enabled));
        setSnoozeDuration(settings.snooze_duration || '5');

        setLanguage(settings.language || 'english');
        setTimeFormat(settings.time_format || '12h');
        setDateFormat(settings.date_format || 'mdy');

        setAutoLockEnabled(Boolean(settings.auto_lock_enabled));
        setAutoLockTime(settings.auto_lock_time || '5');
        setRequirePasswordForSettings(Boolean(settings.require_password_for_settings));
        setActivityLogging(Boolean(settings.activity_logging));
      } catch {
        // Keep local/default values if loading from backend fails.
      }
    };

    void loadSettings();
  }, []);

  const handleSaveSettings = () => {
    setStatusMessage('');
    // Save patient profile info to localStorage
    localStorage.setItem('dementia-care-patient-name', patientName);
    localStorage.setItem('dementia-care-primary-caregiver-name', primaryCaregiverName);
    localStorage.setItem('dementia-care-caregiver-relationship', caregiverRelationship);
    localStorage.setItem('dementia-care-emergency-contact', emergencyContactNumber);
    localStorage.setItem('dementia-care-patient-photo', patientPhotoUrl);
    // Save caregiver contact info to localStorage
    localStorage.setItem('dementia-care-caregiver-phone', caregiverPhone);
    localStorage.setItem('dementia-care-caregiver-name', caregiverName);
    void settingsService
      .updateSystemSettings({
        patient_name: patientName,
        primary_caregiver_name: primaryCaregiverName,
        caregiver_relationship: caregiverRelationship,
        emergency_contact_number: emergencyContactNumber,
        patient_photo_url: patientPhotoUrl,
        caregiver_name: caregiverName,
        caregiver_phone: caregiverPhone,
        font_size: fontSize[0],
        high_contrast: highContrast,
        night_mode: nightMode,
        animations,
        audio_alerts: audioAlerts,
        visual_alerts: visualAlerts,
        reminder_volume: reminderVolume[0],
        snooze_enabled: snoozeEnabled,
        snooze_duration: snoozeDuration,
        language,
        time_format: timeFormat,
        date_format: dateFormat,
        auto_lock_enabled: autoLockEnabled,
        auto_lock_time: autoLockTime,
        require_password_for_settings: requirePasswordForSettings,
        activity_logging: activityLogging,
      })
      .then(() => setStatusMessage('Settings saved successfully'))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to save settings';
        setStatusMessage(message);
      });
  };

  const handleResetToDefaults = () => {
    setFontSize([100]);
    setHighContrast(false);
    setNightMode(false);
    setAnimations(true);
    setAudioAlerts(true);
    setVisualAlerts(true);
    setReminderVolume([70]);
    setLanguage('english');
  };

  const handleUpdatePassword = async () => {
    const trimmedPassword = newPassword.trim();
    if (!trimmedPassword) {
      setStatusMessage('Please enter a new password');
      return;
    }

    setIsUpdatingPassword(true);
    setStatusMessage('');
    try {
      await authService.changePassword({
        newPassword: trimmedPassword,
        confirmPassword: trimmedPassword,
      });
      setNewPassword('');
      setStatusMessage('Password updated successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update password';
      setStatusMessage(message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPatientPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 sm:gap-4">
        <Lock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
        <h2 className="text-2xl sm:text-3xl lg:text-4xl">System Settings</h2>
      </div>

      {/* Patient Profile Settings */}
      <Card className="p-4 sm:p-8 space-y-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-8 h-8 text-primary" />
          <h3 className="text-xl sm:text-2xl lg:text-3xl">Patient Profile</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Photo Section */}
          <div className="lg:col-span-1 flex flex-col items-center space-y-4">
            <div className="w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-200 to-purple-200 border-4 border-white shadow-xl flex items-center justify-center">
              {patientPhotoUrl ? (
                <img
                  src={patientPhotoUrl}
                  alt="Patient"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-400" />
              )}
            </div>
            <div className="space-y-3 w-full">
              <Label className="text-sm sm:text-base lg:text-lg">Upload Photo</Label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-base px-3 py-4 h-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Or enter photo URL below
              </p>
              <Input
                type="text"
                placeholder="Photo URL"
                value={patientPhotoUrl}
                onChange={(e) => setPatientPhotoUrl(e.target.value)}
                className="text-base px-3 py-3 h-auto"
              />
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm sm:text-base lg:text-xl flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Name
              </Label>
              <Input
                type="text"
                placeholder="Enter patient's full name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-3 sm:py-6 h-auto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm sm:text-base lg:text-xl flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Primary Caregiver
                </Label>
                <Input
                  type="text"
                  placeholder="Caregiver's name"
                  value={primaryCaregiverName}
                  onChange={(e) => setPrimaryCaregiverName(e.target.value)}
                  className="text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-3 sm:py-6 h-auto"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm sm:text-base lg:text-xl flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Relationship
                </Label>
                <Select value={caregiverRelationship} onValueChange={setCaregiverRelationship}>
                  <SelectTrigger className="text-sm sm:text-base lg:text-lg h-12 sm:h-14">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse" className="text-sm sm:text-base lg:text-lg">Spouse</SelectItem>
                    <SelectItem value="daughter" className="text-sm sm:text-base lg:text-lg">Daughter</SelectItem>
                    <SelectItem value="son" className="text-sm sm:text-base lg:text-lg">Son</SelectItem>
                    <SelectItem value="sibling" className="text-sm sm:text-base lg:text-lg">Sibling</SelectItem>
                    <SelectItem value="parent" className="text-sm sm:text-base lg:text-lg">Parent</SelectItem>
                    <SelectItem value="friend" className="text-sm sm:text-base lg:text-lg">Friend</SelectItem>
                    <SelectItem value="professional" className="text-sm sm:text-base lg:text-lg">Professional Caregiver</SelectItem>
                    <SelectItem value="other" className="text-sm sm:text-base lg:text-lg">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm sm:text-base lg:text-xl flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Emergency Contact Number
              </Label>
              <Input
                type="tel"
                placeholder="Enter emergency contact number"
                value={emergencyContactNumber}
                onChange={(e) => setEmergencyContactNumber(e.target.value)}
                className="text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-3 sm:py-6 h-auto"
              />
              <p className="text-sm text-muted-foreground">
                This number will be used for quick emergency calls
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
          <p className="text-base text-blue-900">
            ℹ️ <strong>Note:</strong> Patient profile information helps personalize the care experience and ensures caregivers can be reached quickly in case of emergency.
          </p>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-4 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-8 h-8 text-primary" />
          <h3 className="text-xl sm:text-2xl lg:text-3xl">Notification Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm sm:text-base lg:text-xl">Audio Alerts</Label>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Play sounds for reminders
              </p>
            </div>
            <Switch
              checked={audioAlerts}
              onCheckedChange={setAudioAlerts}
              className="scale-110 md:scale-125 lg:scale-150"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm sm:text-base lg:text-xl">Visual Alerts</Label>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Show popup notifications
              </p>
            </div>
            <Switch
              checked={visualAlerts}
              onCheckedChange={setVisualAlerts}
              className="scale-110 md:scale-125 lg:scale-150"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm sm:text-base lg:text-xl">Alert Volume</Label>
              <span className="text-xl text-muted-foreground">{reminderVolume[0]}%</span>
            </div>
            <Slider
              value={reminderVolume}
              onValueChange={setReminderVolume}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm sm:text-base lg:text-xl">Enable Snooze</Label>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Allow delaying reminders
              </p>
            </div>
            <Switch
              checked={snoozeEnabled}
              onCheckedChange={setSnoozEnabled}
              className="scale-110 md:scale-125 lg:scale-150"
            />
          </div>

          {snoozeEnabled && (
            <div className="space-y-3">
              <Label className="text-sm sm:text-base lg:text-xl">Snooze Duration (minutes)</Label>
              <Select value={snoozeDuration} onValueChange={setSnoozeDuration}>
                <SelectTrigger className="text-sm sm:text-base lg:text-lg h-10 sm:h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5" className="text-sm sm:text-base lg:text-lg">5 minutes</SelectItem>
                  <SelectItem value="10" className="text-sm sm:text-base lg:text-lg">10 minutes</SelectItem>
                  <SelectItem value="15" className="text-sm sm:text-base lg:text-lg">15 minutes</SelectItem>
                  <SelectItem value="30" className="text-sm sm:text-base lg:text-lg">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>

      {/* Language & Regional Settings */}
      <Card className="p-4 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-primary" />
          <h3 className="text-xl sm:text-2xl lg:text-3xl">Language & Regional</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm sm:text-base lg:text-xl">Interface Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="text-sm sm:text-base lg:text-lg h-10 sm:h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english" className="text-sm sm:text-base lg:text-lg">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base lg:text-xl">Time Format</Label>
            <Select value={timeFormat} onValueChange={setTimeFormat}>
              <SelectTrigger className="text-sm sm:text-base lg:text-lg h-10 sm:h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h" className="text-sm sm:text-base lg:text-lg">12-hour (2:30 PM)</SelectItem>
                <SelectItem value="24h" className="text-sm sm:text-base lg:text-lg">24-hour (14:30)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base lg:text-xl">Date Format</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger className="text-sm sm:text-base lg:text-lg h-10 sm:h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mdy" className="text-sm sm:text-base lg:text-lg">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy" className="text-sm sm:text-base lg:text-lg">DD/MM/YYYY</SelectItem>
                <SelectItem value="ymd" className="text-sm sm:text-base lg:text-lg">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-4 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h3 className="text-xl sm:text-2xl lg:text-3xl">Security Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm sm:text-base lg:text-xl">Auto-lock Caregiver Mode</Label>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Return to patient view after inactivity
              </p>
            </div>
            <Switch
              checked={autoLockEnabled}
              onCheckedChange={setAutoLockEnabled}
              className="scale-110 md:scale-125 lg:scale-150"
            />
          </div>

          {autoLockEnabled && (
            <div className="space-y-3">
              <Label className="text-sm sm:text-base lg:text-xl">Auto-lock Time (minutes)</Label>
              <Select value={autoLockTime} onValueChange={setAutoLockTime}>
                <SelectTrigger className="text-sm sm:text-base lg:text-lg h-10 sm:h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2" className="text-sm sm:text-base lg:text-lg">2 minutes</SelectItem>
                  <SelectItem value="5" className="text-sm sm:text-base lg:text-lg">5 minutes</SelectItem>
                  <SelectItem value="10" className="text-sm sm:text-base lg:text-lg">10 minutes</SelectItem>
                  <SelectItem value="15" className="text-sm sm:text-base lg:text-lg">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <Label className="text-sm sm:text-base lg:text-xl">Password Protection</Label>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Require password to access settings
              </p>
            </div>
            <Switch
              checked={requirePasswordForSettings}
              onCheckedChange={setRequirePasswordForSettings}
              className="scale-110 md:scale-125 lg:scale-150"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base lg:text-xl">Change Caregiver Password</Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-3 sm:py-6 h-auto"
              />
              <Button
                variant="outline"
                size="lg"
                className="text-sm sm:text-base lg:text-lg px-3 sm:px-6"
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm sm:text-base lg:text-xl">Activity Logging</Label>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Record patient activities for review
              </p>
            </div>
            <Switch
              checked={activityLogging}
              onCheckedChange={setActivityLogging}
              className="scale-110 md:scale-125 lg:scale-150"
            />
          </div>
        </div>
      </Card>

      {/* Emergency Contact Settings */}
      <Card className="p-4 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="w-8 h-8 text-primary" />
          <h3 className="text-xl sm:text-2xl lg:text-3xl">Emergency Contact</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm sm:text-base lg:text-xl">Caregiver Name</Label>
            <Input
              type="text"
              placeholder="Enter caregiver name"
              value={caregiverName}
              onChange={(e) => setCaregiverName(e.target.value)}
              className="text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-3 sm:py-6 h-auto"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base lg:text-xl">Caregiver Phone Number</Label>
            <Input
              type="tel"
              placeholder="Enter caregiver phone number"
              value={caregiverPhone}
              onChange={(e) => setCaregiverPhone(e.target.value)}
              className="text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-3 sm:py-6 h-auto"
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
        <Button
          size="lg"
          onClick={handleSaveSettings}
          className="text-sm sm:text-base lg:text-xl px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 flex-1"
        >
          Save All Settings
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleResetToDefaults}
          className="text-sm sm:text-base lg:text-xl px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 flex-1"
        >
          Reset to Defaults
        </Button>
      </div>

      <Card className="p-6 bg-accent/30">
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
          💡 <strong>Tip:</strong> Changes take effect immediately, but some settings may require restarting the application.
        </p>
        {statusMessage && (
          <p className={`text-base mt-3 ${statusMessage.includes('Failed') ? 'text-red-600' : 'text-green-700'}`}>
            {statusMessage}
          </p>
        )}
      </Card>
    </div>
  );
}
