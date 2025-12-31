import { useEffect, useState } from 'react';
import WorklogsTable from './WorklogsTable';
import { fetchWorklogs } from '../services/worklogs';
import type { WorklogRecord } from '../types/worklog';

export default function WorklogsPage() {
  const [data, setData] = useState<WorklogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const result = await fetchWorklogs();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erro inesperado.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">
            Worklogs - Google Sheets
          </h1>
          <p className="text-gray-600">
            Dados sincronizados em tempo real com a guia "Base" do Google Sheets.
          </p>
        </header>

        {loading ? (
          <div className="rounded-lg bg-white p-6 text-gray-600 shadow">
            Carregando dados da planilha...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 shadow">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          data.length > 0 ? (
            <WorklogsTable data={data} />
          ) : (
            <div className="rounded-lg bg-white p-6 text-gray-600 shadow">
              Nenhum registro encontrado na planilha.
            </div>
          )
        ) : null}
      </div>
    </main>
  );
}
