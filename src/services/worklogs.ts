import type { WorklogRecord } from '../types/worklog';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function fetchWorklogs(): Promise<WorklogRecord[]> {
  const response = await fetch(`${API_URL}/worklogs`);
  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados.');
  }
  const payload = await response.json();
  return payload.data ?? [];
}
