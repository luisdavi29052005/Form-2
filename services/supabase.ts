import { createClient } from '@supabase/supabase-js';
import type { Lead } from '../types';


// Suas credenciais do Supabase permanecem as mesmas
const supabaseUrl = 'https://qenetqqwujznoexlvvvm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbmV0cXF3dWp6bm9leGx2dnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc0NDYsImV4cCI6MjA3NDM4MzQ0Nn0.mNAwxUGbm44EgrG8lJ2nz4EfbE3Bq1aNc7G-5oRmamk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Busca a geolocalização de um endereço IP.
 * @param ip - O endereço IP do usuário.
 * @returns Um objeto com os dados de geolocalização ou null em caso de erro.
 */
const getGeolocation = async (ip: string) => {
  try {
    // Usamos 'no-cors' para evitar problemas de CORS em ambiente de desenvolvimento.
    // Para produção, o ideal é fazer essa chamada a partir de uma Edge Function no Supabase.
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation data.');
    }
    const data = await response.json();
    if (data.status === 'success') {
      return {
        country: data.country,
        region: data.regionName,
        city: data.city,
      };
    }
    return null;
  } catch (error) {
    console.error('Geolocation fetch error:', error);
    return null; // Retorna nulo para não quebrar o processo principal
  }
};


/**
 * Salva um novo lead com informações de geolocalização na tabela 'leads' do Supabase.
 * @param lead - Um objeto contendo o nome, email e IP do lead.
 * @returns Uma promessa que resolve para os dados inseridos ou lança um erro.
 */
export const saveLead = async (lead: Lead): Promise<any> => {
  let leadWithGeo: Lead = { ...lead };

  if (lead.ip_address) {
    const geoData = await getGeolocation(lead.ip_address);
    if (geoData) {
      leadWithGeo = { ...leadWithGeo, ...geoData };
    }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([
      {
        name: leadWithGeo.name,
        email: leadWithGeo.email,
        ip_address: leadWithGeo.ip_address,
        country: leadWithGeo.country,
        region: leadWithGeo.region,
        city: leadWithGeo.city,
      },
    ])
    .select();

  if (error) {
    console.error('Erro ao salvar lead no Supabase:', error);
    throw new Error(error.message);
  }

  return data;
};


/*
  ... o restante do arquivo (instruções SQL) permanece o mesmo ...
*/