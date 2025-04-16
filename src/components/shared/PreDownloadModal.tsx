import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Instagram, ExternalLink } from 'lucide-react'; // Usando Twitter como ícone para X

interface PreDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadStart: () => void;
}

const PreDownloadModal: React.FC<PreDownloadModalProps> = ({ isOpen, onClose, onDownloadStart }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5); // Reset countdown quando o modal fecha
      return;
    }

    if (countdown <= 0) {
      onDownloadStart();
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    // Limpa o timer quando o componente desmonta ou o modal fecha
    return () => clearInterval(timer);

  }, [isOpen, countdown, onClose, onDownloadStart]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700 rounded-none sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Antes de baixar...</DialogTitle>
          <DialogDescription className="text-center text-gray-400 pt-2">
            Se você gostou deste projeto, considere me seguir nas redes sociais!
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="flex justify-center gap-4">
            <a href="https://linkedin.com/in/guivtl" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-sm border-gray-600 hover:bg-gray-700">
                <Linkedin className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://x.com/guivtl" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-sm border-gray-600 hover:bg-gray-700">
                <Twitter className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://instagram.com/guivtl" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-sm border-gray-600 hover:bg-gray-700">
                <Instagram className="h-5 w-5" />
              </Button>
            </a>
          </div>
          <p className="text-center text-gray-500 text-sm">
            Obrigado pelo apoio! 😊
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-300">
              Seu download começará em...
            </p>
            <p className="text-6xl font-bold text-yellow-400"> {/* Usando amarelo como destaque */}
              {countdown}
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreDownloadModal; 