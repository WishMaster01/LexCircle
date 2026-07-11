"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const trafficTrend = [
  { month: "Jan", reads: 18000, signups: 420, reports: 32 },
  { month: "Feb", reads: 22400, signups: 510, reports: 28 },
  { month: "Mar", reads: 24800, signups: 580, reports: 30 },
  { month: "Apr", reads: 29200, signups: 690, reports: 36 },
  { month: "May", reads: 33400, signups: 760, reports: 40 },
  { month: "Jun", reads: 38900, signups: 910, reports: 46 },
];

const contentMix = [
  { name: "Published", value: 68, color: "#d85f38" },
  { name: "Draft", value: 17, color: "#20403d" },
  { name: "Archived", value: 9, color: "#e2b261" },
  { name: "Scheduled", value: 6, color: "#77a8a0" },
];

const opsBreakdown = [
  { name: "New users", value: 420 },
  { name: "Active authors", value: 186 },
  { name: "Moderation actions", value: 64 },
  { name: "Resolved reports", value: 51 },
];

const moderationFlow = [
  { value: 96, name: "Submitted" },
  { value: 72, name: "Reviewed" },
  { value: 51, name: "Resolved" },
  { value: 18, name: "Escalated" },
];

export function AdminAnalyticsPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">Platform traffic and author growth</h2>
            <p className="mt-2 text-sm text-muted">
              Multi-month view of readership, signups, and moderation pressure.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:hidden">
          {trafficTrend.map((item) => (
            <div key={item.month} className="rounded-2xl bg-background/70 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.month}</span>
                <span className="text-muted">{item.reads.toLocaleString()} reads</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted">
                <span>{item.signups} signups</span>
                <span>{item.reports} reports</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 hidden h-80 sm:block sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficTrend}>
              <defs>
                <linearGradient id="readsGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#d85f38" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#d85f38" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="reads" stroke="#d85f38" fill="url(#readsGradient)" />
              <Area type="monotone" dataKey="signups" stroke="#20403d" fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-6">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">Content distribution</h2>
          <p className="mt-2 text-sm text-muted">
            Publication-state split across the current editorial pipeline.
          </p>
          <div className="mt-6 h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="42%"
                  outerRadius="70%"
                  paddingAngle={4}
                >
                  {contentMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {contentMix.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl bg-background/70 px-4 py-3 text-sm">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">Operational activity</h2>
        <p className="mt-2 text-sm text-muted">
          Team-level volume across acquisition, publishing, and moderation.
        </p>
        <div className="mt-4 grid gap-2 sm:hidden">
          {opsBreakdown.map((item) => (
            <div key={item.name} className="rounded-2xl bg-background/70 px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 hidden h-80 sm:block sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={opsBreakdown} margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-18}
                textAnchor="end"
                height={78}
              />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[14, 14, 0, 0]} fill="#20403d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">Moderation flow</h2>
        <p className="mt-2 text-sm text-muted">
          Funnel view of how reported content moves through the review system.
        </p>
        <div className="mt-4 grid gap-2 sm:hidden">
          {moderationFlow.map((item) => (
            <div key={item.name} className="rounded-2xl bg-background/70 px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 hidden h-80 sm:block">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={moderationFlow} isAnimationActive fill="#d85f38">
                <LabelList position="right" fill="var(--foreground)" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
