import React, { useEffect, useState } from "react";
import type { Campaign } from "../types/campaign";
import { getCampaignById, getCampaignInsightsById } from "../api/campaigns";

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

  useEffect(() => {
    if (!isOpen || !campaignId) return;
  console.log("🔥 effect fired", { campaignId, isOpen });
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


  useEffect(() => {
    if (!isOpen || !campaignId) return;

    setIsLoading(true);
    setIsError(null);
    setCampaign(null);

    getCampaignById(campaignId)
      .then((res) => {
        setCampaign(res.campaign); // ✅ FIXED
      })
      .catch(() => {
        setIsError("Failed to load campaign");
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
      <div className="relative bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600"
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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{campaign.name}</h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Campaign ID</p>
                <p>{campaign.id}</p>
              </div>
              <div>
                <p className="font-medium">Brand ID</p>
                <p>{campaign.brand_id}</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <p className="capitalize">{campaign.status}</p>
              </div>
              <div>
                <p className="font-medium">Created</p>
                <p>{new Date(campaign.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Budget</p>
                <p>${campaign.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Daily Budget</p>
                <p>${campaign.daily_budget.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-1">Platforms</p>
              <div className="flex gap-2">
                {campaign.platforms.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {p.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Insights */}
            {insights && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-3">Performance</h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
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
