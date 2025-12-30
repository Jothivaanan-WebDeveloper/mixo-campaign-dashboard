import { useEffect, useState } from "react";
import { getCampaigns } from "../api/campaigns";
import type { Campaign } from "../types/campaign";
import CampaignDetailsModal from "./CampaignDetailsModal";

export default function CampaignTable() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCampaigns()
            .then((res) => setCampaigns(res.campaigns))
            .catch(() => setError("Failed to load campaigns"))
            .finally(() => setLoading(false));
    }, []);

    const handleCampaignClick = (id: string) => {
        console.log("id", id)
        setSelectedCampaignId(id)
        setIsModalOpen(true);
    }

    if (loading) return <p>Loading campaigns...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <>
            <div className="bg-white rounded-md shadow overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <Th>Campaign</Th>
                            <Th>Status</Th>
                            <Th>Budget</Th>
                            <Th>Daily Budget</Th>
                            <Th>Platforms</Th>
                            <Th>Created</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((campaign) => (
                            <tr key={campaign.id} className="border-t">
                                <Td>
                                    <span
                                        className="text-blue-500 hover:cursor-pointer"
                                        onClick={() => handleCampaignClick(campaign.id)}
                                    >
                                        {campaign.name}
                                    </span>
                                </Td>
                                <Td>
                                    <StatusBadge status={campaign.status} />
                                </Td>
                                <Td>${campaign.budget}</Td>
                                <Td>${campaign.daily_budget}</Td>
                                <Td>{campaign.platforms.join(", ")}</Td>
                                <Td>{new Date(campaign.created_at).toLocaleDateString()}</Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CampaignDetailsModal
                campaignId={selectedCampaignId}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedCampaignId(null);
                }}
            />
        </>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-4 py-3 text-left font-medium text-gray-600">
            {children}
        </th>
    );
}

function Td({ children }: { children: React.ReactNode }) {
    return <td className="px-4 py-3">{children}</td>;
}

function StatusBadge({ status }: { status: string }) {
    const color =
        status === "active"
            ? "bg-green-100 text-green-700"
            : status === "paused"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-700";

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}
        >
            {status}
        </span>
    );
}