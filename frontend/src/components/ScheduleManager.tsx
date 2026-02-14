import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Clock, Pill, Activity, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../contexts/LanguageContext';
import { ScheduledItem, STORAGE_KEY } from './UnifiedScheduler';
import { reminderService } from '../services/reminderService';

interface ScheduleManagerProps {
}

export function ScheduleManager() {
  const [items, setItems] = useState<ScheduledItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduledItem>>({
    type: 'task',
    color: 'bg-blue-400',
    icon: '📋',
    enabled: true,
  });
  const { t } = useLanguage();

  // Load items from API
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const data = await reminderService.getReminders();
      // Map API data to ScheduledItem if necessary, or just use it if compatible
      // API returns: { id, time, name, type, color, icon, enabled }
      // ScheduledItem: { id, time, name, type, color, icon, enabled }
      // Perfect match except id type (number vs string).
      setItems(data as unknown as ScheduledItem[]);
    } catch (error) {
      console.error('Failed to load scheduled items:', error);
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.time) {
      return;
    }

    try {
      await reminderService.createReminder({
        name: formData.name,
        time: formData.time,
        type: formData.type,
        color: formData.color,
        icon: formData.type === 'task' ? formData.icon : undefined,
        enabled: true,
      });
      fetchReminders();
      setIsAdding(false);
      setFormData({ type: 'task', color: 'bg-blue-400', icon: '📋', enabled: true });
    } catch (error) {
      console.error('Failed to add reminder:', error);
    }
  };

  const handleEdit = (item: ScheduledItem) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.time) return;

    try {
      await reminderService.updateReminder(editingId, {
        name: formData.name,
        time: formData.time,
        type: formData.type,
        color: formData.color,
        icon: formData.icon,
        enabled: formData.enabled
      });
      fetchReminders();
      setEditingId(null);
      setFormData({ type: 'task', color: 'bg-blue-400', icon: '📋', enabled: true });
    } catch (error) {
      console.error('Failed to update reminder:', error);
    }
  };

  const handleDelete = async (id: string | number, name: string) => {
    try {
      await reminderService.deleteReminder(id);
      fetchReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  };

  const handleToggleEnabled = async (item: ScheduledItem) => {
    try {
      await reminderService.updateReminder(item.id, {
        enabled: !item.enabled
      });
      fetchReminders();
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
    }
  };

  const colorOptions = [
    { value: 'bg-red-400', label: 'Red' },
    { value: 'bg-orange-400', label: 'Orange' },
    { value: 'bg-yellow-400', label: 'Yellow' },
    { value: 'bg-green-400', label: 'Green' },
    { value: 'bg-blue-400', label: 'Blue' },
    { value: 'bg-purple-400', label: 'Purple' },
    { value: 'bg-pink-400', label: 'Pink' },
  ];

  const iconOptions = ['📋', '🍽️', '🚶', '🎵', '💊', '☕', '🌙', '📖', '🧘', '🏃'];

  const sortedItems = [...items].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">Schedule Manager</h2>
        <Button
          size="lg"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xl px-6 py-6"
        >
          <Plus className="w-6 h-6 mr-2" />
          Add Reminder
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="p-6 bg-blue-50 border-2 border-blue-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl">{editingId ? 'Edit Reminder' : 'Add New Reminder'}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ type: 'task', color: 'bg-blue-400', icon: '📋', enabled: true });
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-2">
                <Label className="text-lg">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as 'medication' | 'task' })}
                >
                  <SelectTrigger className="text-lg py-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medication" className="text-lg">
                      <div className="flex items-center gap-2">
                        <Pill className="w-5 h-5" />
                        Medication
                      </div>
                    </SelectItem>
                    <SelectItem value="task" className="text-lg">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Task/Activity
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label className="text-lg">Name/Description</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Take blood pressure pill"
                  className="text-lg py-6"
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label className="text-lg">Time</Label>
                <Input
                  type="time"
                  value={formData.time || ''}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="text-lg py-6"
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label className="text-lg">Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData({ ...formData, color: value })}
                >
                  <SelectTrigger className="text-lg py-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value} className="text-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 ${color.value} rounded-full`}></div>
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Icon (for tasks only) */}
              {formData.type === 'task' && (
                <div className="space-y-2">
                  <Label className="text-lg">Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger className="text-lg py-6">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon} className="text-2xl">
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                onClick={editingId ? handleUpdate : handleAdd}
                className="flex-1 text-xl py-6"
              >
                <Save className="w-6 h-6 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {sortedItems.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-2xl text-muted-foreground">No reminders scheduled yet</p>
          </Card>
        ) : (
          sortedItems.map((item) => (
            <Card
              key={item.id}
              className={`p-5 transition-all ${item.enabled
                ? 'bg-white hover:shadow-lg'
                : 'bg-gray-100 opacity-60'
                }`}
            >
              <div className="flex items-center gap-4">
                {/* Toggle Enabled */}
                <button
                  onClick={() => handleToggleEnabled(item)}
                  className="flex-shrink-0"
                >
                  {item.enabled ? (
                    <ToggleRight className="w-10 h-10 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-400" />
                  )}
                </button>

                {/* Icon/Type */}
                <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center shadow-md flex-shrink-0`}>
                  {item.type === 'medication' ? (
                    <Pill className="w-7 h-7 text-white" />
                  ) : (
                    <span className="text-2xl">{item.icon || '📋'}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-2xl text-primary">{item.time}</p>
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                      {item.type === 'medication' ? 'Medicine' : 'Task'}
                    </span>
                  </div>
                  <p className="text-xl truncate">{item.name}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleEdit(item)}
                    className="px-4 py-6"
                  >
                    <Edit2 className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => handleDelete(item.id, item.name)}
                    className="px-4 py-6"
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}