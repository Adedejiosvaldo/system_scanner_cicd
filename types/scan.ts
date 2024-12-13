export interface SystemInfo {
  cpu: {
    model: string;
    cores: number;
    speed: number;
    maxSpeed: number;
    baseSpeed: number;
  };
  ram: {
    total: number;
    free: number;
  };
  storage: {
    total: number;
    type: "HDD" | "SSD";
  };
  gpus: {
    model: string;
    memory: number;
  }[];
  os: {
    platform: string;
    distro: string;
    release: string;
  };
}

export interface SoftwareRecommendation {
  name: string;
  version: string;
}
