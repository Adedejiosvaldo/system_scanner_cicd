import { SystemInfo } from "../types/scan";

export async function scanSystem(): Promise<SystemInfo> {
  // In a real application, this would make an API call to the backend
  // For demonstration, we'll return mock data
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

  return {
    cpu: {
      model: "Intel Core i7-10700K",
      cores: 8,
      speed: 3.8,
      maxSpeed: 5.1,
      baseSpeed: 3.8,
    },
    ram: {
      total: 32,
      free: 16,
    },
    storage: {
      total: 1000,
      free: 500,
      type: "SSD",
    },
    gpu: {
      model: "NVIDIA GeForce RTX 3070",
      memory: 8,
    },
  };
}
