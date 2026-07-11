"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sample = [
  { day: "Mon", views: 420, likes: 32 },
  { day: "Tue", views: 520, likes: 44 },
  { day: "Wed", views: 610, likes: 58 },
  { day: "Thu", views: 560, likes: 47 },
  { day: "Fri", views: 740, likes: 63 },
  { day: "Sat", views: 820, likes: 70 },
  { day: "Sun", views: 780, likes: 66 },
];

export function PerformanceChart() {
  return (
    <div className="h-72 rounded-3xl border border-border/80 bg-card/80 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sample}>
          <defs>
            <linearGradient id="views" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.45} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="views"
            stroke="var(--accent)"
            fill="url(#views)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
