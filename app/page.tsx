"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SystemInfo, SoftwareRecommendation } from "../types/scan";

export default function Home() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [recommendations, setRecommendations] = useState<
    SoftwareRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    setIsLoading(true);
    try {
      const { systemInfo, recommendations } = await fetch("/api/scanner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "scan" }),
      }).then((res) => res.json());
      setSystemInfo(systemInfo);
      setRecommendations(recommendations);
    } catch (error) {
      console.error("Failed to scan system:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setRecommendations([]);
    setSystemInfo(null);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">System Scanner</h1>
      <Button onClick={handleScan} disabled={isLoading}>
        {isLoading ? "Scanning..." : "Scan System"}
      </Button>
      <Button
        className="ml-5 bg-red-500 hover:bg-red-900"
        color="danger"
        onClick={handleClear}
        disabled={Boolean(!systemInfo)}
      >
        {"Clear"}
      </Button>
      {systemInfo && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">System Information</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(systemInfo, null, 2)}
          </pre>
        </div>
      )}
      {recommendations.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">
            Software Recommendations
          </h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(recommendations, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
