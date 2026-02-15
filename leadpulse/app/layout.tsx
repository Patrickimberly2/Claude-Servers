import './globals.css';

export const metadata = {
  title: 'LeadPulse',
  description: 'Lead management MVP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
