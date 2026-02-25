import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import { formatNumber } from "@/lib/utils";

interface Props {
  data: { date: string; total: number }[];
  loading: boolean;
}

const FundNetFlowChart = ({ data, loading }: Props) => {
  if (loading) {
    return (
      <div className="h-[220px] flex items-center justify-center text-white/60">
        Loading chart...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-white/40">
        No data available
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.04} />

          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            width={40}
            tickFormatter={(value) => formatNumber(value)}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            formatter={(value: number) => formatNumber(value)}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "12px",
            }}
          />

          <Area
            type="monotone"
            dataKey="total"
            stroke="none"
            fill="url(#netGradient)"
          />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#4ade80"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FundNetFlowChart;
