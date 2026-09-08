import type { Metadata } from 'next';
import TopographicContourSvg from '@/components/auth/TopographicContourSvg';

export const metadata: Metadata = {
  title: 'Farmer Portal & Account Access - Bovine Genetics Platform',
  description: 'Sign in to manage herd genetics, contemporary performance groups, pedigree certificates, and breeding stock portfolios.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#F8F7F2] relative overflow-hidden">
      <TopographicContourSvg />
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
