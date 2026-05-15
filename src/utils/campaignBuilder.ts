import type { Campaign, GridShape } from '@/types/campaign';

/**
 * Campaign Builder - Easy campaign configuration
 * Use this to create campaigns without editing code directly
 */

export interface CampaignConfig {
  title: string;
  organizer: string;
  description: string;
  brandColor: string;
  gridShape: GridShape;
  gridSize: number;
  goal: number;
  endDate: string;
}

/**
 * Pre-defined color palettes for campaigns
 */
export const COLOR_PALETTES = {
  environmental: {
    primary: '#2ecc71',
    accent: '#27ae60',
    light: '#d5f4e6',
  },
  healthcare: {
    primary: '#e74c3c',
    accent: '#c0392b',
    light: '#fadbd8',
  },
  education: {
    primary: '#3498db',
    accent: '#2980b9',
    light: '#d6eaf8',
  },
  technology: {
    primary: '#9b59b6',
    accent: '#8e44ad',
    light: '#ebdef0',
  },
  culture: {
    primary: '#f39c12',
    accent: '#e67e22',
    light: '#fdebd0',
  },
  social: {
    primary: '#1abc9c',
    accent: '#16a085',
    light: '#d1f2eb',
  },
};

/**
 * Create a new campaign from config
 */
export const createCampaign = (
  config: CampaignConfig,
  id: string = `campaign_${Date.now()}`
): Campaign => {
  return {
    id,
    title: config.title,
    organizer: config.organizer,
    description: config.description,
    brandColor: config.brandColor,
    gridShape: config.gridShape,
    gridSize: config.gridSize,
    goal: config.goal,
    raised: 0,
    blocks: [],
    topDonors: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: config.endDate,
  };
};

/**
 * Campaign templates for quick setup
 */
export const CAMPAIGN_TEMPLATES = {
  environmental: (): CampaignConfig => ({
    title: 'Reforestation Initiative',
    organizer: 'Green Earth Foundation',
    description: 'Help us plant trees and restore ecosystems.',
    brandColor: COLOR_PALETTES.environmental.primary,
    gridShape: 'hexagon',
    gridSize: 12,
    goal: 50000,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }),

  healthcare: (): CampaignConfig => ({
    title: 'Medical Relief Campaign',
    organizer: 'Health Without Borders',
    description: 'Emergency medical supplies for underserved communities.',
    brandColor: COLOR_PALETTES.healthcare.primary,
    gridShape: 'circle',
    gridSize: 14,
    goal: 100000,
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }),

  education: (): CampaignConfig => ({
    title: 'Tech Education for All',
    organizer: 'DevCommunity',
    description: 'Digital literacy and coding education for underprivileged youth.',
    brandColor: COLOR_PALETTES.education.primary,
    gridShape: 'spiral',
    gridSize: 10,
    goal: 35000,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }),

  culture: (): CampaignConfig => ({
    title: 'Cultural Preservation Project',
    organizer: 'Heritage Foundation',
    description: 'Preserve endangered cultural heritage and support local artists.',
    brandColor: COLOR_PALETTES.culture.primary,
    gridShape: 'wave',
    gridSize: 12,
    goal: 75000,
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }),

  social: (): CampaignConfig => ({
    title: 'Community Empowerment',
    organizer: 'Social Impact Network',
    description: 'Support local communities through education and resources.',
    brandColor: COLOR_PALETTES.social.primary,
    gridShape: 'organic',
    gridSize: 15,
    goal: 60000,
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }),
};

/**
 * Validate campaign configuration
 */
export const validateCampaignConfig = (config: CampaignConfig): string[] => {
  const errors: string[] = [];

  if (!config.title || config.title.trim().length === 0) {
    errors.push('Campaign title is required');
  }

  if (!config.organizer || config.organizer.trim().length === 0) {
    errors.push('Organizer name is required');
  }

  if (!config.description || config.description.trim().length === 0) {
    errors.push('Campaign description is required');
  }

  if (!config.brandColor || !/^#[0-9A-F]{6}$/i.test(config.brandColor)) {
    errors.push('Valid brand color is required (hex format)');
  }

  if (!['hexagon', 'spiral', 'circle', 'wave', 'organic', 'square'].includes(config.gridShape)) {
    errors.push('Invalid grid shape');
  }

  if (config.gridSize < 4 || config.gridSize > 20) {
    errors.push('Grid size must be between 4 and 20');
  }

  if (config.goal < 1000) {
    errors.push('Campaign goal must be at least €1,000');
  }

  if (new Date(config.endDate) <= new Date()) {
    errors.push('End date must be in the future');
  }

  return errors;
};

/**
 * Calculate campaign statistics
 */
export const calculateCampaignStats = (campaign: Campaign) => {
  const progressPercent = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const daysRemaining = Math.ceil(
    (new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const blockCount = campaign.blocks.length;
  const avgDonation = blockCount > 0 ? campaign.raised / blockCount : 0;

  return {
    progressPercent,
    daysRemaining,
    blockCount,
    avgDonation,
    uniqueDonors: new Set(campaign.blocks.map((b) => b.owner)).size,
    dailyAverage: campaign.raised / Math.max(1, Math.ceil((Date.now() - new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24))),
  };
};

/**
 * Export campaign as JSON for backup/sharing
 */
export const exportCampaignJSON = (campaign: Campaign): string => {
  return JSON.stringify(campaign, null, 2);
};

/**
 * Import campaign from JSON
 */
export const importCampaignJSON = (json: string): Campaign => {
  try {
    return JSON.parse(json) as Campaign;
  } catch (error) {
    throw new Error('Invalid campaign JSON');
  }
};
