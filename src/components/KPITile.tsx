import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface KPITileProps {
  label: string;
  value: string | number;
  data: { value: number }[];
  color?: string;
}

export function KPITile({
  label,
  value,
  data,
  color = "#2563eb",
}: KPITileProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col min-h-40">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="text-2xl font-semibold mt-1">{value}</p>

      {mounted && (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "none",
                fontSize: 12,
              }}
              labelFormatter={() => ""}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
