import { fetcher } from "./http";
import { type Campaign, type CampaignInsights, type CampaignInsightsResponse, type CampaignListResponse } from "../types/campaign";

export const getCampaigns = () =>
  fetcher<CampaignListResponse>("/campaigns");

export const getCampaignInsights = () =>
  fetcher<CampaignInsightsResponse>("/campaigns/insights");

export const getCampaignById = (id: string) =>
  fetcher<{ campaign: Campaign }>(`/campaigns/${id}`);

export const getCampaignInsightsById = (id: string) =>
  fetcher<{ insights: CampaignInsights }>(
    `/campaigns/${id}/insights`
  );

