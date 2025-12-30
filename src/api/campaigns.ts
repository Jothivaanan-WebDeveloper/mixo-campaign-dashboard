import { fetcher } from "./http";
import { type Campaign, type CampaignInsights, type CampaignInsightsResponse, type CampaignListResponse } from "../types/campaign";

// Capaign list
export const getCampaigns = () =>
  fetcher<CampaignListResponse>("/campaigns");

// Get by campaign id
export const getCampaignById = (id: string) =>
  fetcher<{ campaign: Campaign }>(`/campaigns/${id}`);

// Campaign insight list
export const getCampaignInsights = () =>
  fetcher<CampaignInsightsResponse>("/campaigns/insights");

// Get campaign insight by id
export const getCampaignInsightsById = (id: string) =>
  fetcher<{ insights: CampaignInsights }>(
    `/campaigns/${id}/insights`
  );

