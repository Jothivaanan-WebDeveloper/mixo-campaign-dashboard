import React, { useEffect, useState } from "react";
import type { Campaign } from "../types/campaign";
import { getCampaignById, getCampaignInsightsById } from "../api/campaigns";
import { useCampaignInsightsStream } from "../hooks/useCampaignInsightsStream";
import { LiveKPITiles } from "./LiveKPITiles";

interface CampaignDetailsModalProps {
  campaignId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface CampaignInsights {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
}

const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({
  campaignId,
  isOpen,
  onClose,
}) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [insights, setInsights] = useState<CampaignInsights | null>(null);

  const { data } = useCampaignInsightsStream(campaignId);

  useEffect(() => {
    if (!isOpen || !campaignId) return;
    setIsLoading(true);
    setIsError(null);
    setCampaign(null);
    setInsights(null);

    Promise.all([
      getCampaignById(campaignId),
      getCampaignInsightsById(campaignId),
    ])
      .then(([campaignRes, insightsRes]: [
        { campaign: Campaign },
        { insights: CampaignInsights }
      ]) => {
        setCampaign(campaignRes.campaign);
        setInsights(insightsRes.insights);
      })
      .catch(() => {
        setIsError("Failed to load campaign details");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [campaignId, isOpen]);

  if (!isOpen) return null;

  function InsightItem({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) {
    return (
      <div>
        <p className="text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-11/12 max-w-4xl p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {isLoading && (
          <div className="text-center py-10">Loading...</div>
        )}

        {isError && (
          <div className="text-center py-10 text-red-500">
            {isError}
          </div>
        )}

        {campaign && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-semibold">{campaign.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Campaign overview & live performance
              </p>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <InsightItem label="Campaign ID" value={campaign.id} />
                <InsightItem label="Brand ID" value={campaign.brand_id} />
                <InsightItem label="Status" value={campaign.status} />
                <InsightItem
                  label="Created"
                  value={new Date(campaign.created_at).toLocaleString()}
                />
                <InsightItem
                  label="Budget"
                  value={`$${campaign.budget.toLocaleString()}`}
                />
                <InsightItem
                  label="Daily Budget"
                  value={`$${campaign.daily_budget.toLocaleString()}`}
                />
              </div>

              {/* Platforms */}
              <div>
                <p className="font-medium mb-2">Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {p.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live KPI Tiles */}
            <div>
              <h3 className="font-semibold mb-4">Live Performance</h3>
              <LiveKPITiles insights={data} />
            </div>

            {/* Static Insights (optional fallback) */}
            {insights && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold mb-4">Summary Metrics</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <InsightItem label="Impressions" value={insights.impressions} />
                  <InsightItem label="Clicks" value={insights.clicks} />
                  <InsightItem label="Conversions" value={insights.conversions} />
                  <InsightItem label="Spend" value={`$${insights.spend}`} />
                  <InsightItem label="CTR" value={`${insights.ctr}%`} />
                  <InsightItem label="CPC" value={`$${insights.cpc}`} />
                  <InsightItem
                    label="Conversion Rate"
                    value={`${insights.conversion_rate}%`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default CampaignDetailsModal;
