import { useState } from 'react';
import { Lock, Moon, Globe, Bell, Shield, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function SystemSettingsManager() {
  // Display Settings
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

  const handleSaveSettings = () => {
    // Settings saved
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

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Lock className="w-12 h-12 text-primary" />
        <h2 className="text-4xl">System Settings</h2>
      </div>

      {/* Display Settings */}
      <Card className="p-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-8 h-8 text-primary" />
          <h3 className="text-3xl">Display Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xl">Text Size</Label>
              <span className="text-xl text-muted-foreground">{fontSize[0]}%</span>
            </div>
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              min={80}
              max={150}
              step={10}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-xl">High Contrast Mode</Label>
              <p className="text-lg text-muted-foreground">
                Enhanced visibility with stronger colors
              </p>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={setHighContrast}
              className="scale-150"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-xl">Night Mode</Label>
              <p className="text-lg text-muted-foreground">
                Darker theme for evening use
              </p>
            </div>
            <Switch
              checked={nightMode}
              onCheckedChange={setNightMode}
              className="scale-150"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-xl">Animations</Label>
              <p className="text-lg text-muted-foreground">
                Smooth transitions and effects
              </p>
            </div>
            <Switch
              checked={animations}
              onCheckedChange={setAnimations}
              className="scale-150"
            />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-8 h-8 text-primary" />
          <h3 className="text-3xl">Notification Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-xl">Audio Alerts</Label>
              <p className="text-lg text-muted-foreground">
                Play sounds for reminders
              </p>
            </div>
            <Switch
              checked={audioAlerts}
              onCheckedChange={setAudioAlerts}
              className="scale-150"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-xl">Visual Alerts</Label>
              <p className="text-lg text-muted-foreground">
                Show popup notifications
              </p>
            </div>
            <Switch
              checked={visualAlerts}
              onCheckedChange={setVisualAlerts}
              className="scale-150"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xl">Alert Volume</Label>
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
              <Label className="text-xl">Enable Snooze</Label>
              <p className="text-lg text-muted-foreground">
                Allow delaying reminders
              </p>
            </div>
            <Switch
              checked={snoozeEnabled}
              onCheckedChange={setSnoozEnabled}
              className="scale-150"
            />
          </div>

          {snoozeEnabled && (
            <div className="space-y-3">
              <Label className="text-xl">Snooze Duration (minutes)</Label>
              <Select value={snoozeDuration} onValueChange={setSnoozeDuration}>
                <SelectTrigger className="text-lg h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5" className="text-lg">5 minutes</SelectItem>
                  <SelectItem value="10" className="text-lg">10 minutes</SelectItem>
                  <SelectItem value="15" className="text-lg">15 minutes</SelectItem>
                  <SelectItem value="30" className="text-lg">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>

      {/* Language & Regional Settings */}
      <Card className="p-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-primary" />
          <h3 className="text-3xl">Language & Regional</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xl">Interface Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="text-lg h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english" className="text-lg">English</SelectItem>
                <SelectItem value="sinhala" className="text-lg">සිංහල (Sinhala)</SelectItem>
                <SelectItem value="tamil" className="text-lg">தமிழ் (Tamil)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-xl">Time Format</Label>
            <Select value={timeFormat} onValueChange={setTimeFormat}>
              <SelectTrigger className="text-lg h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h" className="text-lg">12-hour (2:30 PM)</SelectItem>
                <SelectItem value="24h" className="text-lg">24-hour (14:30)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-xl">Date Format</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger className="text-lg h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mdy" className="text-lg">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy" className="text-lg">DD/MM/YYYY</SelectItem>
                <SelectItem value="ymd" className="text-lg">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h3 className="text-3xl">Security Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-xl">Auto-lock Caregiver Mode</Label>
              <p className="text-lg text-muted-foreground">
                Return to patient view after inactivity
              </p>
            </div>
            <Switch
              checked={autoLockEnabled}
              onCheckedChange={setAutoLockEnabled}
              className="scale-150"
            />
          </div>

          {autoLockEnabled && (
            <div className="space-y-3">
              <Label className="text-xl">Auto-lock Time (minutes)</Label>
              <Select value={autoLockTime} onValueChange={setAutoLockTime}>
                <SelectTrigger className="text-lg h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2" className="text-lg">2 minutes</SelectItem>
                  <SelectItem value="5" className="text-lg">5 minutes</SelectItem>
                  <SelectItem value="10" className="text-lg">10 minutes</SelectItem>
                  <SelectItem value="15" className="text-lg">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-xl">Password Protection</Label>
              <p className="text-lg text-muted-foreground">
                Require password to access settings
              </p>
            </div>
            <Switch
              checked={requirePasswordForSettings}
              onCheckedChange={setRequirePasswordForSettings}
              className="scale-150"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xl">Change Caregiver Password</Label>
            <div className="flex gap-4">
              <Input
                type="password"
                placeholder="New password"
                className="text-lg px-4 py-6 h-auto"
              />
              <Button variant="outline" size="lg" className="text-lg px-6">
                Update
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-xl">Activity Logging</Label>
              <p className="text-lg text-muted-foreground">
                Record patient activities for review
              </p>
            </div>
            <Switch
              checked={activityLogging}
              onCheckedChange={setActivityLogging}
              className="scale-150"
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          size="lg"
          onClick={handleSaveSettings}
          className="text-xl px-8 py-8 flex-1"
        >
          Save All Settings
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleResetToDefaults}
          className="text-xl px-8 py-8 flex-1"
        >
          Reset to Defaults
        </Button>
      </div>

      <Card className="p-6 bg-accent/30">
        <p className="text-lg text-muted-foreground">
          💡 <strong>Tip:</strong> Changes take effect immediately, but some settings may require restarting the application.
        </p>
      </Card>
    </div>
  );
}
