// Caminho: src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Acessa as variáveis de ambiente usando o padrão do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Esta é a linha 4 neste bloco
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Esta é a linha 5

// Verifique se as variáveis de ambiente foram carregadas
if (!supabaseUrl || !supabaseAnonKey) {
  let errorMessage = 'Supabase URL or Anon Key is missing. ';
  if (!supabaseUrl) {
    errorMessage += 'VITE_SUPABASE_URL is not defined. ';
  }
  if (!supabaseAnonKey) {
    errorMessage += 'VITE_SUPABASE_ANON_KEY is not defined. ';
  }
  errorMessage += 'Make sure they are set in your .env file and Vite is correctly loading them.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);