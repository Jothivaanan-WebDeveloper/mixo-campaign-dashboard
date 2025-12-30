import { useEffect } from "react";
import { getCampaigns } from "./api/campaigns";
import Dashboard from "./pages/Dashboard";

function App() {
  useEffect(() => {
    getCampaigns().then(console.log).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        Campaign Monitoring Dashboard
      </h1>

      <Dashboard />
    </div>
  );
}

export default App;