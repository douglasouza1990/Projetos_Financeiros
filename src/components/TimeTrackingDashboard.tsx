import React from 'react';

const summaryCards = [
  {
    label: 'Horas do dia',
    value: '6h 20m',
    detail: 'Meta diária: 8h',
    status: 'Em andamento'
  },
  {
    label: 'Horas da semana',
    value: '31h 15m',
    detail: 'Meta semanal: 40h',
    status: '79% atingido'
  },
  {
    label: 'Horas do mês',
    value: '112h 40m',
    detail: 'Meta mensal: 168h',
    status: '67% atingido'
  },
  {
    label: 'Qualidade do apontamento',
    value: '92%',
    detail: 'Sem penalidades críticas',
    status: 'Excelente'
  }
];

const alerts = [
  {
    title: 'Horas acima da meta diária',
    description: 'Apontamento de ontem totalizou 9h 10m.',
    level: 'Alerta alto'
  },
  {
    title: 'Janela noturna detectada',
    description: 'Entrada registrada às 22:35 no dia 12/09.',
    level: 'Alerta médio'
  },
  {
    title: 'Meta parcial do mês',
    description: 'Você está 4h acima da meta proporcional.',
    level: 'Acompanhamento'
  }
];

const ruleHighlights = [
  'Meta padrão de 8h por dia útil com penalidade progressiva.',
  'Sábados e domingos geram alerta automático e registro de auditoria.',
  'Apontamentos entre 22:00 e 06:00 são classificados como críticos.',
  'Dois dias úteis consecutivos sem apontar disparam e-mail automático.',
  'Meta parcial mensal proporcional recalculada diariamente.'
];

const emailTriggers = [
  'Extrapolação da meta diária (8h) com sugestão de ajuste no dia seguinte.',
  'Ultrapassagem da meta parcial mensal com orientação de alinhamento.',
  '2 dias úteis consecutivos sem apontamentos com aviso de regularização.',
  'Registro fora do horário permitido (22:00 - 06:00).',
  'Apontamento em finais de semana com alerta de justificativa.'
];

const authHighlights = [
  {
    title: 'Login individual por e-mail',
    detail: 'Acesso único por usuário com senha criptografada.'
  },
  {
    title: 'Recuperação de senha',
    detail: 'Envio automático de link seguro para redefinição.'
  },
  {
    title: 'Provisionamento via Google Sheets',
    detail: 'Novos usuários na planilha são criados e ativados automaticamente.'
  },
  {
    title: 'Perfis e permissões',
    detail: 'ADM com visão global e colaboradores com dados próprios.'
  }
];

const weeklyHistory = [
  { day: 'Seg', hours: '8h', value: 80 },
  { day: 'Ter', hours: '7h 30m', value: 70 },
  { day: 'Qua', hours: '8h 10m', value: 85 },
  { day: 'Qui', hours: '6h 20m', value: 60 },
  { day: 'Sex', hours: '9h', value: 90 }
];

const auditEvents = [
  {
    title: 'Penalidade aplicada',
    detail: 'Horas acima de 8h em 12/09.',
    date: '13/09 • 09:12'
  },
  {
    title: 'Alerta de horário noturno',
    detail: 'Entrada registrada às 22:35.',
    date: '12/09 • 22:40'
  },
  {
    title: 'Meta parcial mensal',
    detail: 'Meta proporcional ultrapassada em 4h.',
    date: '10/09 • 18:05'
  }
];

const adminMetrics = [
  {
    label: 'Usuários sem apontar há 2 dias úteis',
    value: '4',
    detail: 'Última atualização: hoje'
  },
  {
    label: 'Apontamentos fora da regra',
    value: '12%',
    detail: 'Últimos 30 dias'
  },
  {
    label: 'Horas em finais de semana',
    value: '38h',
    detail: 'Últimos 30 dias'
  },
  {
    label: 'Horas fora do horário permitido',
    value: '21h',
    detail: 'Últimos 30 dias'
  }
];

const ranking = [
  {
    name: 'Larissa Souza',
    hours: '162h',
    quality: '98%'
  },
  {
    name: 'Caio Mendes',
    hours: '158h',
    quality: '94%'
  },
  {
    name: 'Rafaela Brito',
    hours: '152h',
    quality: '91%'
  },
  {
    name: 'Bruno Lima',
    hours: '149h',
    quality: '88%'
  }
];

const TimeTrackingDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Inteliger • Apontamentos</p>
            <h1 className="text-2xl font-semibold">Controle de horas e produtividade</h1>
            <p className="text-sm text-slate-500 mt-1">
              Visão individual simplificada e indicadores gerenciais centralizados em um único lugar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase text-slate-500">Usuário ativo</p>
              <p className="font-semibold">marina.silva@inteliger.com</p>
              <p className="text-xs text-slate-500">Perfil: Desenvolvedora</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-xs uppercase text-emerald-600">Administrador</p>
              <p className="font-semibold text-emerald-900">Visão ADM habilitada</p>
              <p className="text-xs text-emerald-700">Acesso total aos dashboards</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Autenticação e acesso</h2>
                <p className="text-sm text-slate-500">
                  Fluxo individual com login por e-mail e governança de permissões.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Seguro e auditável
              </span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {authHighlights.map(item => (
                <div key={item.title} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Acesso rápido</h2>
            <p className="text-sm text-slate-500">Entrada simplificada para colaboradores.</p>
            <div className="mt-4 space-y-3">
              <label className="flex flex-col gap-2 text-sm">
                E-mail corporativo
                <input
                  type="email"
                  className="rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="nome.sobrenome@inteliger.com"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                Senha
                <input
                  type="password"
                  className="rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="********"
                />
              </label>
              <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                Entrar
              </button>
              <button className="text-left text-xs font-semibold text-emerald-700">
                Esqueci minha senha
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map(card => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs uppercase text-slate-500">{card.label}</p>
                  <p className="text-2xl font-semibold mt-2">{card.value}</p>
                  <p className="text-sm text-slate-500 mt-2">{card.detail}</p>
                  <span className="inline-flex mt-3 items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {card.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Apontar horas</h2>
                  <p className="text-sm text-slate-500">
                    Registre seu dia de forma rápida. O total é calculado automaticamente.
                  </p>
                </div>
                <span className="text-xs text-emerald-600 font-semibold">Meta diária: 8h</span>
              </div>
              <div className="grid gap-4 mt-6 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm">
                  Data
                  <input
                    type="date"
                    className="rounded-lg border border-slate-200 px-3 py-2"
                    defaultValue="2024-09-14"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  Horário inicial
                  <input
                    type="time"
                    className="rounded-lg border border-slate-200 px-3 py-2"
                    defaultValue="09:10"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  Horário final
                  <input
                    type="time"
                    className="rounded-lg border border-slate-200 px-3 py-2"
                    defaultValue="18:15"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  Total de horas
                  <input
                    type="text"
                    className="rounded-lg border border-slate-200 px-3 py-2 bg-slate-50"
                    value="8h 45m"
                    readOnly
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm md:col-span-2">
                  Observação
                  <textarea
                    className="rounded-lg border border-slate-200 px-3 py-2 min-h-[96px]"
                    placeholder="Opcional: detalhar atividades ou justificativas."
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-3 mt-5">
                <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  Salvar apontamento
                </button>
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
                  Pré-visualizar impacto
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Histórico semanal</h2>
                  <p className="text-sm text-slate-500">
                    Visão rápida do total diário para ajuste de jornada.
                  </p>
                </div>
                <span className="text-xs text-slate-500">Semana atual</span>
              </div>
              <div className="mt-6 grid gap-3">
                {weeklyHistory.map(item => (
                  <div key={item.day} className="flex items-center gap-4">
                    <span className="w-10 text-sm text-slate-500">{item.day}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-lg font-semibold">Alertas ativos</h2>
              <p className="text-sm text-amber-700">
                Penalidades registradas impactam seu índice de qualidade.
              </p>
              <div className="mt-4 space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.title}
                    className="rounded-xl border border-amber-200 bg-white p-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{alert.description}</p>
                    <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                      {alert.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Qualidade do apontamento</h2>
              <p className="text-sm text-slate-500">Índice calculado por regularidade e conformidade.</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Índice atual</span>
                  <span className="font-semibold">92%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[92%] rounded-full bg-emerald-500"></div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Meta diária cumprida em 18 de 20 dias úteis.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Sem apontamentos em finais de semana no mês atual.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  Duas ocorrências de horário noturno nesta semana.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Registro de auditoria</h2>
              <p className="text-sm text-slate-500">
                Histórico das penalidades e alertas críticos.
              </p>
              <div className="mt-4 space-y-3">
                {auditEvents.map(event => (
                  <div key={event.title} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                      <span className="text-xs text-slate-400">{event.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{event.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Integração com Google Sheets</h2>
            <p className="text-sm text-slate-500">
              Base oficial de usuários e sincronização bidirecional de apontamentos.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs uppercase text-slate-500">Usuários sincronizados</p>
                <p className="text-2xl font-semibold mt-2">42</p>
                <p className="text-xs text-slate-500">Última atualização: há 15 min</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs uppercase text-slate-500">Apontamentos sincronizados</p>
                <p className="text-2xl font-semibold mt-2">1.284</p>
                <p className="text-xs text-slate-500">Sincronização em tempo real</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:col-span-2">
                <p className="text-sm font-semibold text-emerald-900">Fluxo automático de cadastro</p>
                <p className="text-xs text-emerald-700">
                  Novos registros na planilha geram usuários com acesso imediato e status ativo.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Regras e penalidades</h2>
            <p className="text-sm text-slate-500">
              Alertas visuais e auditoria automática de apontamentos.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {ruleHighlights.map(item => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Disparos automáticos de e-mail</h2>
              <p className="text-sm text-slate-500">
                Comunicação clara e objetiva quando regras são violadas.
              </p>
            </div>
            <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
              Configurar templates
            </button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emailTriggers.map(item => (
              <div key={item} className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600">Dashboard Administrador</p>
              <h2 className="text-xl font-semibold">Visão consolidada e filtros avançados</h2>
              <p className="text-sm text-slate-500">Acompanhe qualidade, volume e compliance do time.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option>Todos os usuários</option>
                <option>Equipe Mobile</option>
                <option>Equipe Web</option>
              </select>
              <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option>Setembro/2024</option>
                <option>Agosto/2024</option>
                <option>Julho/2024</option>
              </select>
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600">
                Intervalo personalizado
              </button>
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600">
                Filtrar intervalo
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {adminMetrics.map(metric => (
              <div key={metric.label} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs uppercase text-slate-500">{metric.label}</p>
                <p className="text-2xl font-semibold mt-2">{metric.value}</p>
                <p className="text-xs text-slate-500 mt-1">{metric.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700">Ranking por qualidade</h3>
              <div className="mt-4 space-y-3">
                {ranking.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold">{index + 1}. {item.name}</p>
                      <p className="text-xs text-slate-500">Horas apontadas: {item.hours}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">{item.quality}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700">Indicadores de compliance</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Apontamentos fora da regra</span>
                  <span className="font-semibold">12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Horas em fins de semana</span>
                  <span className="font-semibold">38h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ocorrências noturnas</span>
                  <span className="font-semibold">17</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Usuários em risco</span>
                  <span className="font-semibold">6</span>
                </div>
                <button className="mt-2 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                  Ver relatório detalhado
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TimeTrackingDashboard;
