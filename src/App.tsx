import React, { useEffect, useMemo, useState } from 'react';
import type { TimeEntry, UserRecord } from './types';

const sheetUsers: UserRecord[] = [
  {
    id: 'u-1',
    name: 'Paula Souza',
    email: 'paula.souza@inteliger.com',
    status: 'active',
    role: 'user',
    password: 'inteliger2024'
  },
  {
    id: 'u-2',
    name: 'Bruno Lima',
    email: 'bruno.lima@inteliger.com',
    status: 'active',
    role: 'user',
    password: 'inteliger2024'
  },
  {
    id: 'u-4',
    name: 'Douglas P. Souza',
    email: 'douglasp.souza23@gmail.com',
    status: 'active',
    role: 'user',
    password: 'dp3010190'
  },
  {
    id: 'u-3',
    name: 'Admin Inteliger',
    email: 'admin@inteliger.com',
    status: 'active',
    role: 'admin',
    password: 'admin2024'
  }
];

const sheetsUrl = import.meta.env.VITE_SHEETS_URL as string | undefined;

const initialEntries: TimeEntry[] = [
  {
    id: 't-100',
    userId: 'u-1',
    date: '2024-10-14',
    project: 'Portal Cliente',
    hours: 7.5,
    description: 'Ajustes no fluxo de onboarding.'
  },
  {
    id: 't-101',
    userId: 'u-2',
    date: '2024-10-14',
    project: 'Integrações ERP',
    hours: 6,
    description: 'Mapeamento de eventos e testes de carga.'
  },
  {
    id: 't-102',
    userId: 'u-3',
    date: '2024-10-13',
    project: 'Gestão de Horas',
    hours: 5,
    description: 'Revisão do backlog e priorização.'
  }
];

const formatHours = (value: number) => value.toFixed(1).replace('.', ',');

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

function App() {
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [users, setUsers] = useState<UserRecord[]>(sheetUsers);
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries);
  const [sheetStatus, setSheetStatus] = useState('Base carregada localmente.');
  const [isSyncing, setIsSyncing] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [filterUserId, setFilterUserId] = useState('all');
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    project: '',
    hours: 0,
    description: ''
  });

  const isAdmin = currentUser?.role === 'admin';

  const syncSheetUsers = async () => {
    if (!sheetsUrl) {
      setSheetStatus('Configure VITE_SHEETS_URL para sincronizar com o Google Sheets.');
      return;
    }

    setIsSyncing(true);
    setSheetStatus('Sincronizando com o Google Sheets...');

    try {
      const response = await fetch(sheetsUrl);
      if (!response.ok) {
        throw new Error('Falha ao buscar dados do Google Sheets.');
      }
      const data = (await response.json()) as UserRecord[];
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Planilha retornou dados inválidos.');
      }
      setUsers(data);
      setSheetStatus('Base sincronizada com sucesso.');
    } catch (error) {
      setSheetStatus('Não foi possível sincronizar. Mantendo base local.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    void syncSheetUsers();
  }, []);

  const visibleEntries = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    if (isAdmin) {
      return filterUserId === 'all'
        ? entries
        : entries.filter(entry => entry.userId === filterUserId);
    }
    return entries.filter(entry => entry.userId === currentUser.id);
  }, [currentUser, entries, filterUserId, isAdmin]);

  const totalHours = useMemo(() => {
    return visibleEntries.reduce((acc, entry) => acc + entry.hours, 0);
  }, [visibleEntries]);

  const weeklyHours = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    return visibleEntries
      .filter(entry => parseDate(entry.date) >= weekStart)
      .reduce((acc, entry) => acc + entry.hours, 0);
  }, [visibleEntries]);

  const monthlyHours = useMemo(() => {
    const now = new Date();
    return visibleEntries
      .filter(entry => {
        const date = parseDate(entry.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((acc, entry) => acc + entry.hours, 0);
  }, [visibleEntries]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError('');

    const sheetUser = users.find(
      user => user.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!sheetUser || sheetUser.status !== 'active') {
      setLoginError('Usuário não encontrado ou inativo.');
      return;
    }

    if (!loginPassword.trim()) {
      setLoginError('Informe a senha para continuar.');
      return;
    }

    if (sheetUser.password !== loginPassword.trim()) {
      setLoginError('Senha inválida. Tente novamente.');
      return;
    }

    setCurrentUser(sheetUser);
    setLoginPassword('');
  };

  const handleResetPassword = (event: React.FormEvent) => {
    event.preventDefault();
    const sheetUser = users.find(
      user => user.email.toLowerCase() === resetEmail.trim().toLowerCase()
    );

    if (!sheetUser) {
      setResetMessage('Email não encontrado na base conectada.');
      return;
    }

    setResetMessage('Enviamos um link de redefinição para o email informado.');
  };

  const handleAddEntry = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) {
      return;
    }

    setEntries(prev => [
      {
        id: `t-${prev.length + 200}`,
        userId: currentUser.id,
        date: newEntry.date,
        project: newEntry.project,
        hours: Number(newEntry.hours),
        description: newEntry.description
      },
      ...prev
    ]);

    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      project: '',
      hours: 0,
      description: ''
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setFilterUserId('all');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Inteliger · Acompanhamento de Horas
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">
              Entrar no controle de apontamentos
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-300">
              Acesso individual por email. Cada desenvolvedor visualiza apenas seus registros,
              enquanto o administrador acompanha a operação completa.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <form
              onSubmit={handleLogin}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Login</h2>
                <span className="rounded-full bg-emerald-500/10 px-4 py-1 text-sm text-emerald-300">
                  Acesso seguro
                </span>
              </div>

              <div className="mt-8 space-y-5">
                <label className="block text-sm text-slate-300">
                  Email corporativo
                  <input
                    value={loginEmail}
                    onChange={event => setLoginEmail(event.target.value)}
                    type="email"
                    required
                    placeholder="nome@inteliger.com"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Senha
                  <input
                    value={loginPassword}
                    onChange={event => setLoginPassword(event.target.value)}
                    type="password"
                    required
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                  />
                </label>

                {loginError ? (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {loginError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Entrar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowReset(true);
                    setResetMessage('');
                    setResetEmail(loginEmail);
                  }}
                  className="w-full text-sm text-slate-300 underline underline-offset-4"
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="text-lg font-semibold">Usuários sincronizados</h3>
                <p className="mt-2 text-sm text-slate-300">
                  A base de usuários é criada automaticamente a partir do Google Sheets conectado.
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  {users.map(user => (
                    <li key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-slate-400">{user.email}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          user.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-200'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
                  <p>{sheetStatus}</p>
                  <button
                    type="button"
                    onClick={syncSheetUsers}
                    disabled={isSyncing}
                    className="mt-3 w-full rounded-xl border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar agora'}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-800/40 p-6">
                <h3 className="text-lg font-semibold">Visão gerencial</h3>
                <p className="mt-2 text-sm text-slate-300">
                  O administrador acessa todos os registros, dashboards globais e status das equipes.
                </p>
                <div className="mt-4 grid gap-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-slate-400">Acompanhamento diário</p>
                    <p className="mt-1 text-lg font-semibold">Consolidação automática</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-slate-400">Alertas por email</p>
                    <p className="mt-1 text-lg font-semibold">Recuperação de senha integrada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showReset ? (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 px-6">
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recuperação de senha</h3>
                <button
                  type="button"
                  onClick={() => setShowReset(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Fechar
                </button>
              </div>

              <form onSubmit={handleResetPassword} className="mt-5 space-y-4">
                <label className="block text-sm text-slate-300">
                  Email
                  <input
                    value={resetEmail}
                    onChange={event => setResetEmail(event.target.value)}
                    type="email"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                  />
                </label>

                {resetMessage ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {resetMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Enviar link
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Inteliger</p>
            <h1 className="text-2xl font-semibold text-white">
              Acompanhamento de Apontamentos de Horas
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="text-xs text-slate-400">
                {currentUser.role === 'admin' ? 'Administrador' : 'Desenvolvedor'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">Novo apontamento</h2>
            <p className="text-sm text-slate-300">
              Registre rapidamente o esforço diário para manter o acompanhamento atualizado.
            </p>

            <form onSubmit={handleAddEntry} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Data
                  <input
                    value={newEntry.date}
                    onChange={event => setNewEntry(prev => ({ ...prev, date: event.target.value }))}
                    type="date"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Horas trabalhadas
                  <input
                    value={newEntry.hours}
                    onChange={event => setNewEntry(prev => ({ ...prev, hours: Number(event.target.value) }))}
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  />
                </label>
              </div>

              <label className="block text-sm text-slate-300">
                Projeto
                <input
                  value={newEntry.project}
                  onChange={event => setNewEntry(prev => ({ ...prev, project: event.target.value }))}
                  type="text"
                  required
                  placeholder="Projeto ou squad"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Descrição
                <textarea
                  value={newEntry.description}
                  onChange={event => setNewEntry(prev => ({ ...prev, description: event.target.value }))}
                  required
                  rows={3}
                  placeholder="Atividades realizadas"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Salvar apontamento
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold">Resumo</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Últimos 7 dias
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {formatHours(weeklyHours)}h
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Mês atual
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {formatHours(monthlyHours)}h
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total visível</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {formatHours(totalHours)}h
                  </p>
                </div>
              </div>
            </div>

            {isAdmin ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-lg font-semibold">Filtros administrativos</h2>
                <p className="text-sm text-slate-300">
                  Acompanhe o desempenho individual ou global.
                </p>
                <label className="mt-4 block text-sm text-slate-300">
                  Filtrar por usuário
                  <select
                    value={filterUserId}
                    onChange={event => setFilterUserId(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  >
                    <option value="all">Todos os usuários</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Apontamentos registrados</h2>
              <p className="text-sm text-slate-300">
                {isAdmin
                  ? 'Visão consolidada para administração e controle.'
                  : 'Somente seus registros aparecem aqui.'}
              </p>
            </div>
            <span className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
              {visibleEntries.length} registros
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Projeto</th>
                  <th className="px-4 py-3">Horas</th>
                  <th className="px-4 py-3">Descrição</th>
                  {isAdmin ? <th className="px-4 py-3">Usuário</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {visibleEntries.map(entry => {
                  const user = users.find(item => item.id === entry.userId);
                  return (
                    <tr key={entry.id} className="bg-slate-950/40">
                      <td className="px-4 py-3 text-slate-200">{entry.date}</td>
                      <td className="px-4 py-3 text-slate-100">{entry.project}</td>
                      <td className="px-4 py-3 text-slate-100">{formatHours(entry.hours)}h</td>
                      <td className="px-4 py-3 text-slate-300">{entry.description}</td>
                      {isAdmin ? (
                        <td className="px-4 py-3 text-slate-200">{user?.name ?? '—'}</td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {isAdmin ? (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold">Dashboard global</h2>
              <p className="text-sm text-slate-300">
                Consolidação automática de esforço por desenvolvedor.
              </p>
              <div className="mt-5 space-y-4">
                {users.map(user => {
                  const userHours = entries
                    .filter(entry => entry.userId === user.id)
                    .reduce((acc, entry) => acc + entry.hours, 0);

                  return (
                    <div
                      key={user.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
                        <p className="text-lg font-semibold text-emerald-300">
                          {formatHours(userHours)}h
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold">Gestão de acessos</h2>
              <p className="text-sm text-slate-300">
                Usuários liberados automaticamente via Google Sheets.
              </p>
              <div className="mt-5 space-y-3">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.role === 'admin' ? 'Administrador' : 'Desenvolvedor'}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        user.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-200'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default App;
