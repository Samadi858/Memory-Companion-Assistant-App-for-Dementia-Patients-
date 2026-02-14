import { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Save, X, Heart, Upload } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  color: string;
  imageUrl?: string;
  phoneNumber?: string;
  notes?: string;
}

const PHOTO_STORAGE_KEY = 'dementia-care-family-members';

const defaultMembers: FamilyMember[] = [
  { id: '1', name: 'Sarah', relation: 'Daughter', color: 'from-pink-400 to-rose-500' },
  { id: '2', name: 'Michael', relation: 'Son', color: 'from-blue-400 to-indigo-500' },
  { id: '3', name: 'Emily', relation: 'Granddaughter', color: 'from-purple-400 to-pink-500' },
  { id: '4', name: 'Robert', relation: 'Brother', color: 'from-green-400 to-teal-500' },
  { id: '5', name: 'Lisa', relation: 'Friend', color: 'from-yellow-400 to-orange-500' },
  { id: '6', name: 'David', relation: 'Grandson', color: 'from-cyan-400 to-blue-500' },
];

export function PhotoDatabaseManager() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    color: 'from-blue-400 to-indigo-500',
  });

  // Load members from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(PHOTO_STORAGE_KEY);
    if (stored) {
      try {
        setMembers(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load family members:', e);
        setMembers(defaultMembers);
      }
    } else {
      setMembers(defaultMembers);
    }
  }, []);

  // Save members to localStorage
  const saveMembers = (newMembers: FamilyMember[]) => {
    setMembers(newMembers);
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(newMembers));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.relation) {
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: formData.name,
      relation: formData.relation,
      color: formData.color || 'from-blue-400 to-indigo-500',
      imageUrl: formData.imageUrl,
      phoneNumber: formData.phoneNumber,
      notes: formData.notes,
    };

    saveMembers([...members, newMember]);
    setIsAdding(false);
    setFormData({ color: 'from-blue-400 to-indigo-500' });
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingId(member.id);
    setFormData(member);
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name || !formData.relation) return;

    const updatedMembers = members.map(member =>
      member.id === editingId ? { ...member, ...formData } as FamilyMember : member
    );
    
    saveMembers(updatedMembers);
    setEditingId(null);
    setFormData({ color: 'from-blue-400 to-indigo-500' });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the photo database?`)) {
      saveMembers(members.filter(member => member.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Heart className="w-12 h-12 text-rose-500" />
        <h2 className="text-4xl">Photo Database</h2>
      </div>

      <Card className="p-6 bg-blue-50">
        <p className="text-lg text-muted-foreground">
          💡 <strong>Tip:</strong> Add photos and information about family members and friends. 
          These will appear in the "Your Loved Ones" section on the patient dashboard to help with recognition and memory.
        </p>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-xl text-muted-foreground">
          {members.length} {members.length === 1 ? 'person' : 'people'} in database
        </p>
        <Button
          size="lg"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xl px-6 py-6"
        >
          <Plus className="w-6 h-6 mr-2" />
          Add Person
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="p-6 bg-rose-50 border-2 border-rose-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl">{editingId ? 'Edit Person' : 'Add New Person'}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ color: 'from-blue-400 to-indigo-500' });
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-lg">Name *</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sarah Johnson"
                  className="text-lg py-6"
                />
              </div>

              {/* Relation */}
              <div className="space-y-2">
                <Label className="text-lg">Relationship *</Label>
                <Select 
                  value={formData.relation} 
                  onValueChange={(value) => setFormData({ ...formData, relation: value })}
                >
                  <SelectTrigger className="text-lg py-6">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationOptions.map((relation) => (
                      <SelectItem key={relation} value={relation} className="text-lg">
                        {relation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-lg">Phone Number (Optional)</Label>
                <Input
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="e.g., (555) 123-4567"
                  className="text-lg py-6"
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label className="text-lg">Display Color</Label>
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
                          <div className={`w-8 h-8 bg-gradient-to-br ${color.value} rounded-full`}></div>
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-lg">Photo (Optional)</Label>
                <div className="flex items-center gap-4">
                  {formData.imageUrl && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-lg text-muted-foreground">
                          {formData.imageUrl ? 'Change Photo' : 'Upload Photo'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.imageUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, imageUrl: undefined })}
                        className="mt-2"
                      >
                        Remove Photo
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-lg">Notes (Optional)</Label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any helpful notes or reminders about this person..."
                  className="w-full min-h-[100px] px-4 py-3 text-lg border rounded-md resize-y"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                onClick={editingId ? handleUpdate : handleAdd}
                className="flex-1 text-xl py-6"
                disabled={!formData.name || !formData.relation}
              >
                <Save className="w-6 h-6 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.length === 0 ? (
          <Card className="p-12 text-center col-span-full">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-2xl text-muted-foreground">No people in database yet</p>
            <p className="text-lg text-muted-foreground mt-2">Click "Add Person" to get started</p>
          </Card>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="p-5 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Photo/Avatar */}
                <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-md overflow-hidden`}>
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-20 h-20 text-white" />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-medium truncate">{member.name}</h3>
                  <p className="text-lg text-muted-foreground">{member.relation}</p>
                  {member.phoneNumber && (
                    <p className="text-lg text-muted-foreground">📞 {member.phoneNumber}</p>
                  )}
                  {member.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2 italic">
                      {member.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleEdit(member)}
                    className="flex-1 text-lg py-5"
                  >
                    <Edit2 className="w-5 h-5 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => handleDelete(member.id, member.name)}
                    className="px-5 py-5"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Export/Import Section */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-2xl mb-4">Backup & Restore</h3>
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const dataStr = JSON.stringify(members, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `family-photos-backup-${Date.now()}.json`;
              link.click();
            }}
            className="text-lg px-6 py-6"
          >
            <Save className="w-5 h-5 mr-2" />
            Export Data
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'application/json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    try {
                      const imported = JSON.parse(e.target?.result as string);
                      if (confirm('This will replace all current data. Continue?')) {
                        saveMembers(imported);
                      }
                    } catch (err) {
                      alert('Error importing file. Please check the file format.');
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
            className="text-lg px-6 py-6"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
