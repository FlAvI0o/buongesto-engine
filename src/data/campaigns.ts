import type { Campaign, CampaignBlock } from '@/types/campaign';

export const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    title: 'Riforestazione Appennini',
    organizer: 'GreenTech APS',
    description: 'Help us reforest the Apennine Mountains. Every block represents a tree planted.',
    brandColor: '#2ecc71',
    gridShape: 'hexagon',
    gridSize: 12,
    goal: 50000,
    raised: 23500,
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    topDonors: [
      { name: 'Flavio', amount: 5000 },
      { name: 'Marco Rossi', amount: 3200 },
      { name: 'Anna Verde', amount: 2800 },
    ],
    blocks: [
      {
        id: 'b1',
        x: 20,
        y: 30,
        z: 8,
        color: '#2ecc71',
        owner: 'Flavio',
        message: 'For a greener future.',
        amount: 500,
        timestamp: Date.now() - 86400000,
        gridX: 2,
        gridY: 3,
      },
      {
        id: 'b2',
        x: 45,
        y: 60,
        z: 2,
        color: '#27ae60',
        owner: 'Marco',
        message: 'Nature healing nature.',
        amount: 300,
        timestamp: Date.now() - 43200000,
        gridX: 5,
        gridY: 6,
      },
      {
        id: 'b3',
        x: 70,
        y: 20,
        z: 5,
        color: '#229954',
        owner: 'Anna',
        message: 'Planting hope.',
        amount: 250,
        timestamp: Date.now() - 3600000,
        gridX: 8,
        gridY: 2,
      },
    ],
  },
  {
    id: 'c2',
    title: 'Tech for Public Schools',
    organizer: 'DevCommunity',
    description: 'Fund technology and digital literacy programs in underfunded schools.',
    brandColor: '#3498db',
    gridShape: 'spiral',
    gridSize: 10,
    goal: 35000,
    raised: 18750,
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    topDonors: [
      { name: 'Sara', amount: 2000 },
      { name: 'Luca', amount: 1500 },
      { name: 'Flavio', amount: 1200 },
    ],
    blocks: [
      {
        id: 'b4',
        x: 30,
        y: 40,
        z: 3,
        color: '#3498db',
        owner: 'Sara',
        message: 'Education for all.',
        amount: 200,
        timestamp: Date.now() - 172800000,
        gridX: 0,
        gridY: 0,
      },
    ],
  },
  {
    id: 'c3',
    title: 'Medical Relief Mission',
    organizer: 'Doctors Without Borders',
    description: 'Emergency medical supplies and support for affected communities.',
    brandColor: '#e74c3c',
    gridShape: 'circle',
    gridSize: 15,
    goal: 100000,
    raised: 67200,
    startDate: '2026-05-10',
    endDate: '2026-06-10',
    topDonors: [
      { name: 'Anonymous', amount: 10000 },
      { name: 'Tech Foundation', amount: 8000 },
      { name: 'Global Health Inc', amount: 6500 },
    ],
    blocks: [],
  },
];

/**
 * Get campaign by ID
 */
export const getCampaignById = (id: string): Campaign | undefined => {
  return SAMPLE_CAMPAIGNS.find((c) => c.id === id);
};

/**
 * Add a block to a campaign (simulated)
 */
export const addBlockToCampaign = (
  campaign: Campaign,
  block: CampaignBlock
): Campaign => {
  return {
    ...campaign,
    blocks: [...campaign.blocks, block],
    raised: campaign.raised + block.amount,
  };
};
