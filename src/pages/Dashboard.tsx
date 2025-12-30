import { useEffect, useState } from "react";
import { getCampaignInsights } from "../api/campaigns";
import type { AggregateCampaignInsights } from "../types/campaign";
import CampaignTable from "../components/CampaignTable";
import PerformanceChart from "../components/PerformanceChart";

export default function Dashboard() {
    const [insights, setInsights] = useState<AggregateCampaignInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCampaignInsights()
            .then((res) => setInsights(res.insights))
            .catch(() => setError("Failed to load insights. Please try again later."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading insights...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!insights) return null;

    return (
        <div className="space-y-4 mt-2">
            <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Impressions" value={insights.total_impressions} />
                <StatCard title="Clicks" value={insights.total_clicks} />
                <StatCard title="Spend" value={`$${insights.total_spend}`} />
                <StatCard title="Avg CTR" value={`${insights.avg_ctr}%`} />
            </div>
            {/* Chart */}
            {insights && <PerformanceChart insights={insights} />}
            {/* Campaign table */}
            <CampaignTable />
        </div>
    );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="bg-white rounded-md shadow p-4">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1 text-gray-700">{value}</p>
        </div>
    );
}
