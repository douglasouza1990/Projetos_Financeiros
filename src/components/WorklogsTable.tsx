import { useMemo, useState } from 'react';
import type { WorklogRecord } from '../types/worklog';

const PAGE_SIZES = [10, 20, 50];

const normalize = (value: string) => value.toLowerCase();

const findColumn = (columns: string[], keywords: string[]) =>
  columns.find((column) => keywords.some((keyword) => normalize(column).includes(keyword)));

const parseDate = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

interface WorklogsTableProps {
  data: WorklogRecord[];
}

export default function WorklogsTable({ data }: WorklogsTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const columns = useMemo(() => {
    if (data.length === 0) {
      return [];
    }
    return Object.keys(data[0]);
  }, [data]);

  const dateColumn = useMemo(
    () => findColumn(columns, ['data', 'date']),
    [columns]
  );
  const authorColumn = useMemo(
    () => findColumn(columns, ['autor', 'author', 'responsavel', 'responsável']),
    [columns]
  );
  const projectColumn = useMemo(
    () => findColumn(columns, ['projeto', 'project', 'cliente']),
    [columns]
  );

  const authorOptions = useMemo(() => {
    if (!authorColumn) {
      return [];
    }
    return Array.from(
      new Set(
        data
          .map((row) => row[authorColumn])
          .filter((value) => value !== null && value !== undefined)
          .map((value) => String(value))
      )
    ).sort();
  }, [authorColumn, data]);

  const projectOptions = useMemo(() => {
    if (!projectColumn) {
      return [];
    }
    return Array.from(
      new Set(
        data
          .map((row) => row[projectColumn])
          .filter((value) => value !== null && value !== undefined)
          .map((value) => String(value))
      )
    ).sort();
  }, [projectColumn, data]);

  const filteredData = useMemo(() => {
    const searchTerm = normalize(search.trim());
    return data.filter((row) => {
      if (searchTerm) {
        const found = Object.values(row).some((value) =>
          value !== null && value !== undefined
            ? normalize(String(value)).includes(searchTerm)
            : false
        );
        if (!found) {
          return false;
        }
      }

      if (authorColumn && authorFilter) {
        if (String(row[authorColumn] ?? '') !== authorFilter) {
          return false;
        }
      }

      if (projectColumn && projectFilter) {
        if (String(row[projectColumn] ?? '') !== projectFilter) {
          return false;
        }
      }

      if (dateColumn && (dateStart || dateEnd)) {
        const value = row[dateColumn];
        if (!value) {
          return false;
        }
        const dateValue = parseDate(String(value));
        if (!dateValue) {
          return false;
        }
        if (dateStart) {
          const start = new Date(dateStart);
          if (dateValue < start) {
            return false;
          }
        }
        if (dateEnd) {
          const end = new Date(dateEnd);
          end.setHours(23, 59, 59, 999);
          if (dateValue > end) {
            return false;
          }
        }
      }

      return true;
    });
  }, [
    data,
    search,
    authorColumn,
    authorFilter,
    projectColumn,
    projectFilter,
    dateColumn,
    dateStart,
    dateEnd,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const handlePageChange = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div className="flex-1 min-w-[220px]">
          <label className="text-sm font-medium text-gray-700">Busca global</label>
          <input
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            type="search"
            placeholder="Buscar em todas as colunas"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        {dateColumn ? (
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Data inicial</label>
              <input
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                type="date"
                value={dateStart}
                onChange={(event) => {
                  setDateStart(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Data final</label>
              <input
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                type="date"
                value={dateEnd}
                onChange={(event) => {
                  setDateEnd(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        ) : null}
        {authorColumn ? (
          <div className="min-w-[200px]">
            <label className="text-sm font-medium text-gray-700">Autor</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={authorFilter}
              onChange={(event) => {
                setAuthorFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos</option>
              {authorOptions.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {projectColumn ? (
          <div className="min-w-[200px]">
            <label className="text-sm font-medium text-gray-700">Projeto</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={projectFilter}
              onChange={(event) => {
                setProjectFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos</option>
              {projectOptions.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div>
          <label className="text-sm font-medium text-gray-700">Itens por página</label>
          <select
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-2 text-left font-semibold text-gray-700"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedData.map((row, index) => (
              <tr key={`${row[columns[0]] ?? 'row'}-${index}`}>
                {columns.map((column) => (
                  <td key={column} className="px-4 py-2 text-gray-700">
                    {row[column] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Exibindo {paginatedData.length} de {filteredData.length} registros
        </p>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {page} de {totalPages}
          </span>
          <button
            className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  );
}
