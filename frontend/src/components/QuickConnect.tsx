import { Phone, Video, MessageCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface Contact {
  id: string;
  name: string;
  relation: string;
  color: string;
  icon: string;
}

interface QuickConnectProps {
}

export function QuickConnect() {
  const contacts: Contact[] = [
    { 
      id: '1', 
      name: 'Anu', 
      relation: 'Daughter',
      color: 'from-pink-500 to-rose-500',
      icon: '👧'
    },
    { 
      id: '2', 
      name: 'Ravi', 
      relation: 'Son',
      color: 'from-blue-500 to-cyan-500',
      icon: '👨'
    },
    { 
      id: '3', 
      name: 'Emergency', 
      relation: '911',
      color: 'from-red-600 to-orange-600',
      icon: '🚨'
    },
  ];

  const handleCall = (contact: Contact, type: string) => {
    // Call initiated
  };

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <Phone className="w-10 h-10 text-green-600" />
        <h2 className="text-[2.5rem]">Call Someone</h2>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="group">
            <div className={`bg-gradient-to-r ${contact.color} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all`}>
              <div className="flex items-center gap-6 mb-4">
                <div className="text-[3rem]">{contact.icon}</div>
                <div className="flex-1 text-white">
                  <p className="text-[2rem]">{contact.name}</p>
                  <p className="text-[1.3rem] opacity-90">{contact.relation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="lg"
                  onClick={() => handleCall(contact, 'video call')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/50 h-auto py-4 transition-all"
                >
                  <Video className="w-6 h-6 mr-2" />
                  <span className="text-[1.3rem]">Video</span>
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleCall(contact, 'phone call')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/50 h-auto py-4 transition-all"
                >
                  <Phone className="w-6 h-6 mr-2" />
                  <span className="text-[1.3rem]">Call</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}