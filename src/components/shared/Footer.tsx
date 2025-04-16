import React from 'react';
import { Github, Linkedin, Instagram, Globe } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-6 mt-12">
      <div className="container mx-auto flex flex-col sm:flex-row sm:justify-center items-center gap-4 text-sm text-muted-foreground">
        <span>© {currentYear} Guilherme Vital. Todos os direitos reservados.</span>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <a href="https://linkedin.com/in/guivtl" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <a href="https://github.com/guivtl" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-foreground hover:text-muted-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <a href="https://instagram.com/guivtl" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <a href="https://x.com/guivtl" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-foreground hover:text-muted-foreground transition-colors">
              <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <a href="https://guivital.com" target="_blank" rel="noopener noreferrer" aria-label="Website" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
              <Globe className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 