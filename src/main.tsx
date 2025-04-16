import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// --- Lógica de Detecção de Tema ---
const applyTheme = () => {
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Aplica o tema inicial
applyTheme();

// Ouve mudanças na preferência do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
// --- Fim da Lógica de Tema ---

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
