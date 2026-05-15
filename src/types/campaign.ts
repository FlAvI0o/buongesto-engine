export type GridShape = 'hexagon' | 'spiral' | 'circle' | 'square' | 'wave' | 'organic';
export type PaymentMethod = 'card' | 'crypto' | 'bank';

export interface CampaignBlock {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  owner: string;
  message: string;
  amount: number;
  timestamp: number;
  gridX: number;
  gridY: number;
}

export interface Campaign {
  id: string;
  title: string;
  organizer: string;
  description: string;
  brandColor: string;
  gridShape: GridShape;
  gridSize: number;
  goal: number;
  raised: number;
  blocks: CampaignBlock[];
  startDate: string;
  endDate: string;
  topDonors: Array<{ name: string; amount: number }>;
  image?: string;
}

export interface DonationTransaction {
  id: string;
  campaignId: string;
  amount: number;
  color: string;
  donor: string;
  message: string;
  timestamp: number;
  paymentMethod: PaymentMethod;
}

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface WebGLContextData {
  camera?: THREE.Camera;
  scene?: THREE.Scene;
  renderer?: THREE.WebGLRenderer;
  controls?: any;
  particles: ParticleEffect[];
  selectedBlock: CampaignBlock | null;
  hoveredBlock: CampaignBlock | null;
}
