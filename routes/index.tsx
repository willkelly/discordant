/**
 * Main Route
 *
 * Root route for Discordant app - renders the main AppIsland.
 */

import { type RouteConfig } from 'fresh';
import AppIsland from '../islands/AppIsland.tsx';

export const config: RouteConfig = {
  skipAppWrapper: false,
  skipInheritedLayouts: false,
};

export default function Home() {
  return <AppIsland />;
}
