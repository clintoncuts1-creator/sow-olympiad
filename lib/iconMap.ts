'use client';

import React from 'react';
import {
  IconSeedling,
  IconCompass,
  IconCalculator,
  IconPuzzle,
  IconSword,
  IconTrophy,
  IconHelp,
} from '@tabler/icons-react';

/**
 * Icon mapping for section tiers
 * Maps icon_name from database to React icon components
 */
export const ICON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  seedling: IconSeedling,
  compass: IconCompass,
  calculator: IconCalculator,
  puzzle: IconPuzzle,
  sword: IconSword,
  trophy: IconTrophy,
};

/**
 * Get the icon component for an icon name
 */
export function getIconComponent(iconName: string | undefined) {
  if (!iconName) return IconHelp;
  return ICON_COMPONENTS[iconName.toLowerCase()] || IconHelp;
}
