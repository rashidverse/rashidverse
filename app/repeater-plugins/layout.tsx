import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repeater Builder | ACF Repeater for Elementor',
  description:
    'Build dynamic ACF and SCF repeater layouts in Elementor with real-time preview, drag-and-drop controls, and flexible templates.',
};

export default function RepeaterPluginsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
