import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import type { SpendTrendPoint, ToolRecommendation } from "@/hooks/useResultsPage";

type ResultsChartsSectionProps = {
  trend: SpendTrendPoint[];
  tools: ToolRecommendation[];
};

export function ResultsChartsSection({ trend, tools }: ResultsChartsSectionProps) {
  return (
    <div className="mt-8 grid lg:grid-cols-2 gap-6">
      <ChartCard title="Spend trajectory (12 months)">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="cur" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.24 22)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="oklch(0.65 0.24 22)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="opt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.18 155)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="oklch(0.78 0.18 155)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="m" stroke="rgba(255,255,255,0.4)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
            <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Area type="monotone" dataKey="current" stroke="oklch(0.65 0.24 22)" fill="url(#cur)" strokeWidth={2} name="Current" />
            <Area type="monotone" dataKey="optimized" stroke="oklch(0.78 0.18 155)" fill="url(#opt)" strokeWidth={2} name="Optimized" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Current vs Recommended (per tool)">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={tools} barCategoryGap={12}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="toolName" stroke="rgba(255,255,255,0.4)" fontSize={10} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
            <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Bar dataKey="current" fill="oklch(0.7 0.22 260)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="recommended" fill="oklch(0.78 0.18 155)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="text-sm font-semibold mb-3">{title}</div>
      {children}
    </div>
  );
}
