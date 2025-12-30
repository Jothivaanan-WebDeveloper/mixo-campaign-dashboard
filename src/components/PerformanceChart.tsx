import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { AggregateCampaignInsights } from "../types/campaign";

interface Props {
    insights: AggregateCampaignInsights;
}

export default function PerformanceChart({ insights }: Props) {
    const data = [
        { name: "Impressions", value: insights.total_impressions },
        { name: "Clicks", value: insights.total_clicks },
        { name: "Conversions", value: insights.total_conversions },
    ];

    return (
        <div className="bg-white rounded-md shadow p-4">
            <h3 className="font-medium mb-3">Overall Performance</h3>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}