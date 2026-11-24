import type { Metadata } from 'next';

import PluginsFolderPage from './PluginsFolderPage';

export const metadata: Metadata = {
  title: 'Plugins | Rashidverse',
  description: 'One-click project file folder experience.',
};

export default function PluginsPage() {
  return <PluginsFolderPage />;
}
