// Caminho: src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Acessa as variáveis de ambiente usando o padrão do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  console.error(errorMessage); // Loga o erro no console do servidor/build
  throw new Error(errorMessage); // Lança o erro para parar a execução se crítico
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);