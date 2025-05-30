// Caminho: utils/supabaseClient.ts (ou o que você escolheu)
import { createClient } from '@supabase/supabase-js';

// Obtém a URL e a Chave Anônima do Supabase das variáveis de ambiente
// Você precisará configurar estas variáveis no seu ambiente Bolt.new
// Para desenvolvimento local, você pode criar um arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verifique se as variáveis de ambiente foram carregadas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL or Anon Key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);