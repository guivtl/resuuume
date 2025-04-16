import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, Instagram, Globe, Download } from 'lucide-react';

interface PreDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadStart: () => void;
}

// Simplified social links data
const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/guivtl', icon: Linkedin, colorClasses: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' },
  { name: 'GitHub', url: 'https://github.com/guivtl', icon: Github, colorClasses: 'text-foreground hover:text-muted-foreground' },
  { name: 'Instagram', url: 'https://instagram.com/guivtl', icon: Instagram, colorClasses: 'text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300' },
  { name: 'Website', url: 'https://guivital.com', icon: Globe, colorClasses: 'text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300', highlighted: true },
];

const PreDownloadModal: React.FC<PreDownloadModalProps> = ({ isOpen, onClose, onDownloadStart }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      return;
    }
    if (countdown <= 0) {
      onDownloadStart();
      onClose();
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, countdown, onClose, onDownloadStart]);

  const handleDownloadNow = () => {
    onDownloadStart();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-popover text-popover-foreground border-border rounded-lg sm:max-w-sm p-6">
        {/* Header */}
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-2xl font-semibold text-foreground">Quase lá!</DialogTitle>
        </DialogHeader>

        {/* Countdown */}
        <div className="text-center my-6">
          <p className="text-sm text-muted-foreground mb-1">Seu download começa em</p>
          <p className="text-7xl font-bold text-primary">{countdown}</p>
        </div>

        {/* Social Prompt & Icons */}
        <div className="text-center space-y-3 my-6">
          <p className="text-sm text-muted-foreground">
            Gostou da ferramenta? Conecte-se comigo:
          </p>
          <div className="flex justify-center items-center gap-3">
            {socialLinks.map((link) => (
              <Button
                key={link.name}
                variant={link.highlighted ? 'outline' : 'ghost'}
                size="icon"
                asChild
                className={`rounded-full ${link.highlighted ? 'border-primary/50 hover:bg-primary/10' : 'hover:bg-accent'}`}
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name} className={`${link.colorClasses} transition-colors`}>
                  <link.icon className="h-5 w-5" /> {/* Slightly smaller icons for cleaner look */}
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <DialogFooter className="mt-6 sm:justify-center">
          <Button
            onClick={handleDownloadNow}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" /> Baixar Currículo Agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreDownloadModal; 