import { useState } from 'react';
import { Users, Plus, Trash2, Upload, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Person {
  id: string;
  name: string;
  relationship: string;
  imageUrl?: string;
}

interface FaceDatabaseManagerProps {
  onSpeak: (text: string) => void;
}

export function FaceDatabaseManager({ onSpeak }: FaceDatabaseManagerProps) {
  const [people, setPeople] = useState<Person[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Daughter',
      imageUrl: undefined,
    },
    {
      id: '2',
      name: 'Michael Johnson',
      relationship: 'Son',
      imageUrl: undefined,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      relationship: 'Nurse',
      imageUrl: undefined,
    },
  ]);

  const [newPerson, setNewPerson] = useState({
    name: '',
    relationship: '',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPerson = () => {
    if (!newPerson.name || !newPerson.relationship) {
      onSpeak('Please enter both name and relationship');
      return;
    }

    const person: Person = {
      id: Date.now().toString(),
      name: newPerson.name,
      relationship: newPerson.relationship,
    };

    setPeople([...people, person]);
    setNewPerson({ name: '', relationship: '' });
    setIsDialogOpen(false);
    onSpeak(`Added ${person.name} to the database`);
  };

  const handleDeletePerson = (id: string, name: string) => {
    setPeople(people.filter(p => p.id !== id));
    onSpeak(`Removed ${name} from the database`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Users className="w-12 h-12 text-primary" />
          <h2 className="text-4xl">Face Database</h2>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="text-xl px-6 py-6">
              <Plus className="w-6 h-6 mr-2" />
              Add New Person
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl">Add New Person</DialogTitle>
              <DialogDescription className="text-xl">
                Add a new person to the face database.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-2xl">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  className="text-xl px-4 py-6 h-auto"
                  placeholder="Enter person's name"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="relationship" className="text-2xl">
                  Relationship
                </Label>
                <Input
                  id="relationship"
                  value={newPerson.relationship}
                  onChange={(e) => setNewPerson({ ...newPerson, relationship: e.target.value })}
                  className="text-xl px-4 py-6 h-auto"
                  placeholder="e.g., Daughter, Son, Nurse"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-2xl">Photo (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                  <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                  <p className="text-xl text-muted-foreground">
                    Upload a photo for better recognition
                  </p>
                  <Button variant="outline" size="lg" className="text-lg">
                    Choose File
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    (Photo upload feature - demo only)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={handleAddPerson}
                  className="flex-1 text-xl px-6 py-6"
                >
                  Add Person
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewPerson({ name: '', relationship: '' });
                  }}
                  className="flex-1 text-xl px-6 py-6"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-8">
        <p className="text-xl text-muted-foreground mb-6">
          {people.length} {people.length === 1 ? 'person' : 'people'} in database
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {people.map((person) => (
            <Card key={person.id} className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={person.imageUrl} />
                  <AvatarFallback className="text-2xl">
                    <UserCircle className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl">{person.name}</h3>
                  <p className="text-lg text-muted-foreground">{person.relationship}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePerson(person.id, person.name)}
                  className="text-lg px-4 py-2"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Added to database • Training data ready
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-8 bg-accent/30">
        <h3 className="text-2xl mb-4">Tips for Better Recognition</h3>
        <ul className="space-y-3 text-lg text-muted-foreground">
          <li>• Use clear, well-lit photos with the person's face clearly visible</li>
          <li>• Add multiple photos of the same person from different angles</li>
          <li>• Update photos regularly as appearance changes</li>
          <li>• Include photos with and without glasses if applicable</li>
        </ul>
      </Card>
    </div>
  );
}