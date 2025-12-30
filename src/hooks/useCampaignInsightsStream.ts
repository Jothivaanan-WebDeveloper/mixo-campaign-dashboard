import { useEffect, useState } from "react";
import type { CampaignInsightsStream } from "../types/campaign";

const BASE_URL = "https://mixo-fe-backend-task.vercel.app";

export function useCampaignInsightsStream(campaignId: string | null) {
    const [data, setData] = useState<CampaignInsightsStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!campaignId) return;

        const eventSource = new EventSource(
            `${BASE_URL}/campaigns/${campaignId}/insights/stream`
        );

        eventSource.onopen = () => {
            setConnected(true);
            setError(null);
        };

        eventSource.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                setData(parsed);
            } catch {
                setError("Failed to parse stream data");
            }
        };

        eventSource.onerror = () => {
            setError("Connection lost");
            setConnected(false);
            eventSource.close();
        };

        return () => {
            eventSource.close();
            setConnected(false);
        };
    }, [campaignId]);

    return { data, error, connected };
}