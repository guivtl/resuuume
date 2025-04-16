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
import { Linkedin, Github, Instagram, Globe, Download, CheckCircle } from 'lucide-react';

interface PreDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadStart: () => void;
}

// Standardized social links data
const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/guivtl', icon: Linkedin },
  { name: 'GitHub', url: 'https://github.com/guivtl', icon: Github },
  { name: 'Instagram', url: 'https://instagram.com/guivtl', icon: Instagram },
  { name: 'Website', url: 'https://guivital.com', icon: Globe },
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
      return () => {};
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, countdown, onClose, onDownloadStart]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-popover text-popover-foreground border-border rounded-lg sm:max-w-sm p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-2xl font-semibold text-foreground">Quase lá!</DialogTitle>
        </DialogHeader>

        <div className="text-center my-6">
          <p className="text-sm text-muted-foreground mb-1">
            {countdown > 0 ? 'Seu download começa em' : 'Download iniciado!'}
          </p>
          <div className="flex justify-center items-center h-24">
            {countdown > 0 ? (
              <p className="text-7xl font-bold text-primary">{countdown}</p>
            ) : (
              <CheckCircle className="h-20 w-20 text-primary" />
            )}
          </div>
        </div>

        <div className="text-center space-y-3 my-6">
          <p className="text-sm text-muted-foreground">
            Gostou da ferramenta? Me siga nas redes! 😊
          </p>
          <div className="flex justify-center items-center gap-3">
            {socialLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full hover:bg-accent"
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="text-primary hover:text-primary/80 transition-colors">
                  <link.icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-6 border-t border-border pt-4">
           <p className="text-xs text-muted-foreground text-center w-full">
             Você pode fechar este modal a qualquer momento.
           </p>
         </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreDownloadModal; 