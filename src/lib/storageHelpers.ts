import { ResumeData } from "@/types/resume";

const STORAGE_KEY = "saved_resumes";

export interface SavedResume {
  id: string;
  name: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

/**
 * Obtém todos os currículos salvos no localStorage
 */
export const getSavedResumes = (): SavedResume[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (error) {
    console.error("Erro ao carregar currículos:", error);
    return [];
  }
};

/**
 * Salva um currículo no localStorage
 */
export const saveResume = (name: string, data: ResumeData): SavedResume => {
  try {
    const saved = getSavedResumes();
    const now = new Date().toISOString();
    
    // Verificar se já existe um com esse nome
    const existingIndex = saved.findIndex(resume => resume.name === name);
    
    const newResume: SavedResume = {
      id: existingIndex >= 0 ? saved[existingIndex].id : crypto.randomUUID(),
      name,
      data,
      createdAt: existingIndex >= 0 ? saved[existingIndex].createdAt : now,
      updatedAt: now
    };
    
    if (existingIndex >= 0) {
      // Atualizar existente
      saved[existingIndex] = newResume;
    } else {
      // Adicionar novo
      saved.push(newResume);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return newResume;
  } catch (error) {
    console.error("Erro ao salvar currículo:", error);
    throw new Error("Não foi possível salvar o currículo.");
  }
};

/**
 * Carrega um currículo pelo ID
 */
export const loadResume = (id: string): SavedResume | null => {
  try {
    const saved = getSavedResumes();
    const resume = saved.find(r => r.id === id);
    return resume || null;
  } catch (error) {
    console.error("Erro ao carregar currículo:", error);
    return null;
  }
};

/**
 * Exclui um currículo pelo ID
 */
export const deleteResume = (id: string): boolean => {
  try {
    const saved = getSavedResumes();
    const filtered = saved.filter(r => r.id !== id);
    
    if (filtered.length === saved.length) {
      return false; // Nada foi excluído
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Erro ao excluir currículo:", error);
    return false;
  }
};

/**
 * Retorna um resumo dos currículos salvos (sem os dados completos)
 */
export const getResumesList = (): Omit<SavedResume, "data">[] => {
  try {
    const saved = getSavedResumes();
    return saved.map(({ id, name, createdAt, updatedAt }) => ({
      id,
      name,
      createdAt,
      updatedAt
    }));
  } catch (error) {
    console.error("Erro ao listar currículos:", error);
    return [];
  }
}; 