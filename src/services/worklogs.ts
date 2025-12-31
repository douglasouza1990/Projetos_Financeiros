import type { WorklogRecord } from '../types/worklog';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function fetchWorklogs(): Promise<WorklogRecord[]> {
  try {
    const response = await fetch(`${API_URL}/worklogs`);
    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados.');
    }
    const payload = await response.json();
    return payload.data ?? [];
  } catch (error) {
    if (error instanceof Error && error.message === 'Não foi possível carregar os dados.') {
      throw error;
    }
    throw new Error('Falha ao conectar com o backend. Verifique se a API está ativa.');
  }
}
