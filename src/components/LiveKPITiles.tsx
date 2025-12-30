import { useEffect, useState } from "react";
import { KPITile } from "./KPITile";
import type { CampaignInsightsStream } from "../types/campaign";

interface Props {
    insights: CampaignInsightsStream | null;
}

type Point = { value: number };

const MAX_POINTS = 20;

function pushPoint(prev: Point[], value: number): Point[] {
    const next = [...prev, { value }];
    return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
}

export function LiveKPITiles({ insights }: Props) {
    const [impressions, setImpressions] = useState<Point[]>([]);
    const [clicks, setClicks] = useState<Point[]>([]);
    const [spend, setSpend] = useState<Point[]>([]);
    const [ctr, setCtr] = useState<Point[]>([]);

    useEffect(() => {
        if (!insights) return;

        setImpressions((p) => pushPoint(p, insights.impressions));
        setClicks((p) => pushPoint(p, insights.clicks));
        setSpend((p) => pushPoint(p, insights.spend));
        setCtr((p) => pushPoint(p, insights.ctr));
    }, [insights]);

    if (!insights) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-32 bg-gray-100 animate-pulse rounded-xl"
                    />
                ))}
            </div>
        );
    }

    return (
        <>
            {
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPITile
                        label="Impressions"
                        value={insights.impressions.toLocaleString()}
                        data={impressions}
                        color="#2563eb"
                    />

                    <KPITile
                        label="Clicks"
                        value={insights.clicks.toLocaleString()}
                        data={clicks}
                        color="#16a34a"
                    />

                    <KPITile
                        label="Spend"
                        value={`$${insights.spend.toFixed(2)}`}
                        data={spend}
                        color="#f59e0b"
                    />

                    <KPITile
                        label="CTR"
                        value={`${insights.ctr.toFixed(2)}%`}
                        data={ctr}
                        color="#9333ea"
                    />
                </div>
            }
        </>
    );
}