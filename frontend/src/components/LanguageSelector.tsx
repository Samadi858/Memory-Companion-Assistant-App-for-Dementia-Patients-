import { Languages } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string; nativeLabel: string }[] = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
    { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  ];

  const currentLanguage = languages.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-md border border-input bg-background px-6 py-6 text-[1.3rem] shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
        <Languages className="w-8 h-8" />
        <span>{currentLanguage?.nativeLabel}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`text-[1.3rem] py-4 cursor-pointer ${
              language === lang.code ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>{lang.nativeLabel}</span>
              {language === lang.code && (
                <span className="text-primary">✓</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
