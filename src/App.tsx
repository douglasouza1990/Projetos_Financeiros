import React, { useEffect, useMemo, useState } from 'react';
import type { UserRecord } from './types';

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
const sheetTab = 'base';

const extractSheetId = (url: string) => {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? '';
};

const buildSheetApiUrl = (url: string) => {
  const sheetId = extractSheetId(url);
  if (!sheetId) {
    return '';
  }
  const params = new URLSearchParams({
    tqx: 'out:json',
    sheet: sheetTab
  });
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?${params.toString()}`;
};

const normalizeHeader = (value: string) => value.trim().toLowerCase();

const mapRowToUser = (headers: string[], row: Array<{ v?: string }>) => {
  const record: Record<string, string> = {};
  headers.forEach((header, index) => {
    record[normalizeHeader(header)] = row[index]?.v?.toString().trim() ?? '';
  });
  return {
    id: record.id || `u-${record.email || Math.random().toString(36).slice(2, 7)}`,
    name: record.nome || record.name || '',
    email: record.email || '',
    status: (record.status || record.status_usuario || 'active') as UserRecord['status'],
    role: (record.role || record.perfil || 'user') as UserRecord['role'],
    password: record.password || record.senha || 'inteliger2024'
  } as UserRecord;
};

const parseGvizResponse = (text: string) => {
  const match = text.match(/google\\.visualization\\.Query\\.setResponse\\((.*)\\);/s);
  if (!match) {
    throw new Error('Resposta inesperada da planilha.');
  }
  const json = JSON.parse(match[1]);
  const headers = json.table.cols.map((col: { label: string }) => col.label);
  const rows = json.table.rows.map((row: { c: Array<{ v?: string } | null> }) =>
    row.c.map(cell => cell ?? { v: '' })
  );
  return rows
    .map((row: Array<{ v?: string }>) => mapRowToUser(headers, row))
    .filter(user => user.email);
};

const suggestSheetFix = (status: number | undefined, body: string) => {
  if (status === 403) {
    return 'Sugestão: torne a planilha pública ou use “Publicar na web” nas configurações do Google Sheets.';
  }
  if (status === 404) {
    return 'Sugestão: confirme se a URL da planilha está correta e acessível.';
  }
  if (status === 400) {
    return 'Sugestão: confirme se a guia se chama “base” e se a planilha está publicada na web.';
  }
  if (body.toLowerCase().includes('access denied')) {
    return 'Sugestão: verifique as permissões de compartilhamento da planilha.';
  }
  if (body.toLowerCase().includes('google visualization')) {
    return 'Sugestão: publique a planilha na web para habilitar o acesso via GViz.';
  }
  return 'Sugestão: verifique se a planilha está publicada na web e a guia “base” existe.';
};

function App() {
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [users, setUsers] = useState<UserRecord[]>(sheetUsers);
  const [sheetStatus, setSheetStatus] = useState('Base carregada localmente.');
  const [isSyncing, setIsSyncing] = useState(false);
  const [sheetInputUrl, setSheetInputUrl] = useState(sheetsUrl ?? '');
  const [sheetSuggestion, setSheetSuggestion] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [filterUserId, setFilterUserId] = useState('all');

  const isAdmin = currentUser?.role === 'admin';

  const syncSheetUsers = async () => {
    if (!sheetInputUrl) {
      setSheetStatus('Informe a URL da planilha para sincronizar.');
      return;
    }

    const apiUrl = buildSheetApiUrl(sheetInputUrl);
    if (!apiUrl) {
      setSheetStatus('URL inválida. Verifique o link da planilha.');
      return;
    }

    setIsSyncing(true);
    setSheetStatus('Sincronizando com o Google Sheets...');
    setSheetSuggestion('');

    let lastStatus: number | undefined;
    let lastBody = '';

    try {
      const response = await fetch(apiUrl);
      lastStatus = response.status;
      lastBody = await response.text();
      if (!response.ok) {
        throw new Error(
          `Falha ao buscar dados do Google Sheets (HTTP ${lastStatus}).`
        );
      }
      const text = lastBody;
      const parsedUsers = parseGvizResponse(text);
      if (!Array.isArray(parsedUsers) || parsedUsers.length === 0) {
        throw new Error('Planilha retornou dados inválidos.');
      }
      setUsers(parsedUsers);
      setSheetStatus('Base sincronizada com sucesso.');
      setSheetSuggestion('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao sincronizar.';
      setSheetStatus(`Não foi possível sincronizar. ${message}`);
      setSheetSuggestion(suggestSheetFix(lastStatus, lastBody));
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (sheetsUrl) {
      void syncSheetUsers();
    } else {
      setSheetStatus('Informe a URL da planilha para sincronizar.');
    }
  }, [sheetsUrl]);

  const adminUsers = useMemo(() => users.filter(user => user.role === 'admin'), [users]);

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
            <h2 className="text-lg font-semibold">Conexão com Google Sheets</h2>
            <p className="text-sm text-slate-300">
              Configure a integração para sincronizar automaticamente usuários e apontamentos.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Endpoint atual
                </p>
                <p className="mt-2 break-words text-slate-100">
                  {sheetInputUrl || 'Nenhuma URL configurada.'}
                </p>
                <p className="mt-3 text-xs text-slate-400">Endpoint gerado</p>
                <p className="mt-1 break-words text-xs text-slate-200">
                  {sheetInputUrl ? buildSheetApiUrl(sheetInputUrl) || 'URL inválida.' : '—'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
                <p className="mt-2 text-slate-100">{sheetStatus}</p>
                {sheetSuggestion ? (
                  <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                    {sheetSuggestion}
                  </div>
                ) : null}
                <label className="mt-4 block text-sm text-slate-300">
                  URL do Google Sheets
                  <input
                    value={sheetInputUrl}
                    onChange={event => setSheetInputUrl(event.target.value)}
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                  />
                </label>
                <button
                  type="button"
                  onClick={syncSheetUsers}
                  disabled={isSyncing}
                  className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSyncing ? 'Sincronizando...' : 'Testar conexão'}
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Passos rápidos</p>
                <ol className="mt-3 space-y-2 text-slate-200">
                  <li>1. Publique a planilha na web com acesso público.</li>
                  <li>
                    2. Garanta que a guia se chame <strong>{sheetTab}</strong>.
                  </li>
                  <li>3. Cole a URL completa da planilha acima.</li>
                  <li>4. Clique em “Testar conexão” para validar a integração.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold">Usuários sincronizados</h2>
              <p className="text-sm text-slate-300">
                Visualize a lista carregada diretamente da planilha conectada.
              </p>
              <div className="mt-5 space-y-3">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
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

            {isAdmin ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-lg font-semibold">Administradores conectados</h2>
                <p className="text-sm text-slate-300">
                  Monitore quem possui acesso total aos dashboards globais.
                </p>
                <div className="mt-5 space-y-3">
                  {adminUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">
                        Administrador
                      </span>
                    </div>
                  ))}
                  {adminUsers.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      Nenhum administrador encontrado na planilha.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {isAdmin ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Gestão de acessos</h2>
                <p className="text-sm text-slate-300">
                  Garanta que apenas usuários ativos estejam liberados.
                </p>
              </div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Filtrar por status
                <select
                  value={filterUserId}
                  onChange={event => setFilterUserId(event.target.value)}
                  className="mt-2 block rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-white"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </label>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {users
                .filter(user => (filterUserId === 'all' ? true : user.status === filterUserId))
                .map(user => (
                  <div
                    key={user.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{user.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
                      <span>{user.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default App;
