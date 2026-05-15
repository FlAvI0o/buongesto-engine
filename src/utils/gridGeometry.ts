import type { GridShape } from '@/types/campaign';

interface GridPosition {
  gridX: number;
  gridY: number;
  x: number;
  y: number;
  z: number;
}

/**
 * Generates grid positions based on shape type
 * Returns positions for placing blocks in specific geometric patterns
 */
export const generateGridPositions = (shape: GridShape, gridSize: number): GridPosition[] => {
  const positions: GridPosition[] = [];

  switch (shape) {
    case 'hexagon':
      positions.push(...generateHexagonalGrid(gridSize));
      break;
    case 'spiral':
      positions.push(...generateSpiralGrid(gridSize));
      break;
    case 'circle':
      positions.push(...generateCircularGrid(gridSize));
      break;
    case 'wave':
      positions.push(...generateWaveGrid(gridSize));
      break;
    case 'organic':
      positions.push(...generateOrganicGrid(gridSize));
      break;
    case 'square':
    default:
      positions.push(...generateSquareGrid(gridSize));
      break;
  }

  return positions;
};

const generateSquareGrid = (size: number): GridPosition[] => {
  const positions: GridPosition[] = [];
  const cellSize = 80 / size;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      positions.push({
        gridX: x,
        gridY: y,
        x: (x - size / 2) * cellSize * 1.2,
        y: (y - size / 2) * cellSize * 1.2,
        z: Math.random() * 0.5,
      });
    }
  }

  return positions;
};

const generateHexagonalGrid = (size: number): GridPosition[] => {
  const positions: GridPosition[] = [];
  const radius = 3;

  for (let x = -size; x <= size; x++) {
    for (let y = -size; y <= size; y++) {
      const q = x;
      const r = y;
      const s = -q - r;

      if (Math.abs(q) <= size && Math.abs(r) <= size && Math.abs(s) <= size) {
        const gridX = x + size;
        const gridY = y + size;

        const posX = radius * (Math.sqrt(3) / 2 * q + Math.sqrt(3) / 2 * r);
        const posY = radius * (3 / 2 * r);

        positions.push({
          gridX,
          gridY,
          x: posX,
          y: posY,
          z: Math.sin(posX * 0.1) * 0.3,
        });
      }
    }
  }

  return positions;
};

const generateSpiralGrid = (size: number): GridPosition[] => {
  const positions: GridPosition[] = [];
  const cellCount = size * size;
  const spacing = 60 / size;

  for (let i = 0; i < cellCount; i++) {
    const angle = (i / cellCount) * Math.PI * 8;
    const radius = (i / cellCount) * 40;

    positions.push({
      gridX: i % size,
      gridY: Math.floor(i / size),
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: (i / cellCount) * 2,
    });
  }

  return positions;
};

const generateCircularGrid = (size: number): GridPosition[] => {
  const positions: GridPosition[] = [];
  const cellCount = size * size;
  const radius = 40;

  for (let i = 0; i < cellCount; i++) {
    const angle = (i / cellCount) * Math.PI * 2;
    const distance = (Math.random() * 0.3 + 0.7) * radius;

    positions.push({
      gridX: i % size,
      gridY: Math.floor(i / size),
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      z: Math.random() * 1,
    });
  }

  return positions;
};

const generateWaveGrid = (size: number): GridPosition[] => {
  const positions: GridPosition[] = [];
  const cellSize = 80 / size;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const wave = Math.sin((x + y) * 0.3) * 3;
      positions.push({
        gridX: x,
        gridY: y,
        x: (x - size / 2) * cellSize * 1.2,
        y: (y - size / 2) * cellSize * 1.2 + wave,
        z: Math.cos(x * 0.2 + y * 0.2) * 0.5,
      });
    }
  }

  return positions;
};

const generateOrganicGrid = (size: number): GridPosition[] => {
  const positions: GridPosition[] = [];

  for (let i = 0; i < size * size; i++) {
    const x = Math.random() * 80 - 40;
    const y = Math.random() * 80 - 40;
    const distance = Math.sqrt(x * x + y * y);

    if (distance < 45) {
      positions.push({
        gridX: i % size,
        gridY: Math.floor(i / size),
        x: x + Math.sin(i * 0.1) * 2,
        y: y + Math.cos(i * 0.1) * 2,
        z: Math.random() * 0.8,
      });
    }
  }

  return positions;
};

/**
 * Get the next available grid position
 */
export const getNextGridPosition = (
  positions: GridPosition[],
  usedPositions: Set<string>
): GridPosition | null => {
  for (const pos of positions) {
    const key = `${pos.gridX},${pos.gridY}`;
    if (!usedPositions.has(key)) {
      return pos;
    }
  }
  return null;
};

/**
 * Convert grid coordinates to world coordinates with smooth transitions
 */
export const gridToWorldCoordinates = (
  gridX: number,
  gridY: number,
  gridPositions: GridPosition[]
): { x: number; y: number; z: number } | null => {
  const pos = gridPositions.find((p) => p.gridX === gridX && p.gridY === gridY);
  return pos ? { x: pos.x, y: pos.y, z: pos.z } : null;
};
