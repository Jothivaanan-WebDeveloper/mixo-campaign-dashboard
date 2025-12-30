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
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Quick Filter
    const PAGE_SIZE = 5;

    const filteredCampaigns = campaigns.filter((campaign) => {
        const query = search.toLowerCase();

        return (
            campaign.name.toLowerCase().includes(query) ||
            campaign.status.toLowerCase().includes(query) ||
            campaign.platforms.some((p) => p.toLowerCase().includes(query))
        );
    });

    //Pagination
    const totalPages = Math.ceil(filteredCampaigns.length / PAGE_SIZE);

    const paginatedCampaigns = filteredCampaigns.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);


    useEffect(() => {
        getCampaigns()
            .then((res) => setCampaigns(res.campaigns))
            .catch(() => setError("Failed to load campaigns"))
            .finally(() => setLoading(false));
    }, []);

    const handleCampaignClick = (id: string) => {
        setSelectedCampaignId(id)
        setIsModalOpen(true);
    }

    if (loading) return <p>Loading campaigns...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <>
            <div className="bg-white rounded-md shadow overflow-x-auto">

                <div className="flex justify-between items-center">
                    <h3 className="font-medium mx-4">Campaign List</h3>

                    <input
                        type="text"
                        placeholder="Search Campaigns, Status, Platforms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
    m-2 w-80 rounded-md px-3 py-2 text-sm
    border-2 border-gray-100
    focus:outline-none
    focus:border-gray-300
    focus:ring-0
  "
                    />
                </div>

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
                        {paginatedCampaigns.map((campaign) => (
                            <tr key={campaign.id} className="border-t hover:bg-gray-50">
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

                    {/* Pagination */}

                </table>
                <div className="my-4 flex items-center justify-center gap-4">
                    <p className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="rounded border px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-none"
                        >
                            Prev
                        </button>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="rounded border px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-none"
                        >
                            Next
                        </button>
                    </div>
                </div>
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
        <th className="px-4 py-3 text-left font-medium text-gray-600 border-b border-gray-300">
            {children}
        </th>
    );
}

function Td({ children }: { children: React.ReactNode }) {
    return <td className="px-4 py-3 border-b border-gray-200">{children}</td>;
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