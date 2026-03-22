import { type ChangeEvent, useEffect, useState } from 'react';
import { Edit2, Heart, Loader2, Plus, Save, Trash2, Upload, User, X } from 'lucide-react';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { memoryService, MemoryItem } from '../services/memoryService';
import { API_BASE_URL } from '../services/api';

type MemoryFormState = {
  name: string;
  relationship: string;
  phone_number: string;
  display_color: string;
  notes: string;
};

const DEFAULT_COLOR = 'from-blue-400 to-indigo-500';

const relationOptions = [
  'Spouse',
  'Daughter',
  'Son',
  'Granddaughter',
  'Grandson',
  'Sister',
  'Brother',
  'Mother',
  'Father',
  'Friend',
  'Caregiver',
  'Neighbor',
  'Doctor',
  'Nurse',
  'Loved One',
];

const colorOptions = [
  { value: 'from-pink-400 to-rose-500', label: 'Pink Rose' },
  { value: 'from-blue-400 to-indigo-500', label: 'Blue Indigo' },
  { value: 'from-purple-400 to-pink-500', label: 'Purple Pink' },
  { value: 'from-green-400 to-teal-500', label: 'Green Teal' },
  { value: 'from-yellow-400 to-orange-500', label: 'Yellow Orange' },
  { value: 'from-cyan-400 to-blue-500', label: 'Cyan Blue' },
  { value: 'from-red-400 to-pink-500', label: 'Red Pink' },
  { value: 'from-indigo-400 to-purple-500', label: 'Indigo Purple' },
];

const emptyForm = (): MemoryFormState => ({
  name: '',
  relationship: '',
  phone_number: '',
  display_color: DEFAULT_COLOR,
  notes: '',
});

export function PhotoDatabaseManager() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MemoryFormState>(emptyForm());

  const loadMemories = async () => {
    try {
      const items = await memoryService.getMyMemories();
      setMemories(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memories');
    }
  };

  useEffect(() => {
    void loadMemories();
  }, []);

  const clearEditor = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData(emptyForm());
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : '');
  };

  const startAdd = () => {
    setError('');
    setEditingId(null);
    setIsAdding(true);
    setFormData(emptyForm());
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const startEdit = (item: MemoryItem) => {
    setError('');
    setIsAdding(false);
    setEditingId(item.id);
    setFormData({
      name: item.name,
      relationship: item.relationship,
      phone_number: item.phone_number || '',
      display_color: item.display_color || DEFAULT_COLOR,
      notes: item.notes || '',
    });
    setSelectedFile(null);
    setPreviewUrl(item.image_url ? `${API_BASE_URL}${item.image_url}` : '');
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.relationship.trim()) {
      setError('Please provide name and relationship');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await memoryService.uploadMemory(
        {
          name: formData.name.trim(),
          relationship: formData.relationship.trim(),
          phone_number: formData.phone_number.trim() || undefined,
          display_color: formData.display_color,
          notes: formData.notes.trim() || undefined,
        },
        selectedFile,
      );
      clearEditor();
      await loadMemories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.name.trim() || !formData.relationship.trim()) {
      setError('Name and relationship are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await memoryService.updateMemory(editingId, {
        name: formData.name.trim(),
        relationship: formData.relationship.trim(),
        phone_number: formData.phone_number.trim(),
        display_color: formData.display_color,
        notes: formData.notes.trim(),
      });
      clearEditor();
      await loadMemories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (item: MemoryItem) => {
    const ok = window.confirm(`Delete ${item.name}?`);
    if (!ok) return;

    setLoading(true);
    setError('');
    try {
      await memoryService.deleteMemory(item.id);
      await loadMemories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const editing = isAdding || editingId !== null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 sm:gap-4">
        <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-rose-500" />
        <h2 className="text-2xl sm:text-3xl lg:text-4xl">Photo Database</h2>
      </div>

      <Card className="p-4 sm:p-6 bg-blue-50">
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
          Add loved ones with photo, relationship, and notes. These appear in the patient home screen "Your Loved Ones".
        </p>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
          {memories.length} {memories.length === 1 ? 'person' : 'people'} in database
        </p>
        <Button size="lg" onClick={startAdd} className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-4 sm:py-5">
          <Plus className="w-5 h-5 mr-2" /> Add Person
        </Button>
      </div>

      {editing && (
        <Card className="p-4 sm:p-6 bg-rose-50 border-2 border-rose-300 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl lg:text-2xl">{editingId ? 'Edit Person' : 'Add New Person'}</h3>
            <Button variant="ghost" size="icon" onClick={clearEditor}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base lg:text-lg">Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Sarah Johnson"
                className="text-sm sm:text-base lg:text-lg py-3 sm:py-5"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base lg:text-lg">Relationship *</Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, relationship: value }))}
              >
                <SelectTrigger className="text-sm sm:text-base lg:text-lg py-3 sm:py-5">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationOptions.map((relation) => (
                    <SelectItem key={relation} value={relation} className="text-sm sm:text-base">
                      {relation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base lg:text-lg">Phone Number (Optional)</Label>
              <Input
                value={formData.phone_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
                placeholder="e.g., +94 77 123 4567"
                className="text-sm sm:text-base lg:text-lg py-3 sm:py-5"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base lg:text-lg">Display Color</Label>
              <Select
                value={formData.display_color}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, display_color: value }))}
              >
                <SelectTrigger className="text-sm sm:text-base lg:text-lg py-3 sm:py-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value} className="text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${color.value}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm sm:text-base lg:text-lg">Photo (Optional)</Label>
              <label className="cursor-pointer block">
                <div className="flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                  <span className="text-sm sm:text-base lg:text-lg text-muted-foreground truncate">
                    {selectedFile ? selectedFile.name : previewUrl ? 'Current photo selected' : 'Choose an image'}
                  </span>
                </div>
                <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              </label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm sm:text-base lg:text-lg">Notes (Optional)</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any helpful note about this person"
                className="text-sm sm:text-base lg:text-lg py-3 sm:py-5"
              />
            </div>
          </div>

          {previewUrl && (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border bg-gray-100">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}

          <Button
            size="lg"
            onClick={() => void (editingId ? handleUpdate() : handleAdd())}
            disabled={loading}
            className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-4 sm:py-5"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            {editingId ? 'Update Person' : 'Save Person'}
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl lg:text-2xl">Uploaded Memories</h3>

        {memories.length === 0 ? (
          <Card className="p-6 sm:p-8 text-center text-muted-foreground">No memories uploaded yet.</Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {memories.map((item) => (
              <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-md bg-gray-100">
                    {item.image_url ? (
                      <img src={`${API_BASE_URL}${item.image_url}`} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${item.display_color || DEFAULT_COLOR} flex items-center justify-center`}>
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg sm:text-xl font-medium truncate">{item.name}</h4>
                    <p className="text-sm sm:text-base text-muted-foreground truncate">{item.relationship}</p>
                    {item.phone_number ? <p className="text-sm text-muted-foreground truncate">📞 {item.phone_number}</p> : null}
                    {item.notes ? <p className="text-sm text-muted-foreground line-clamp-2 italic">{item.notes}</p> : null}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" className="flex-1 text-xs sm:text-sm" onClick={() => startEdit(item)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" className="flex-1 text-xs sm:text-sm" onClick={() => void deleteItem(item)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
