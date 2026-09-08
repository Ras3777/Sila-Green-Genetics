import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Bovine Genetics Management - Livestock Registry, Genomics & Genetic Evaluations',
  description: 'Comprehensive Bovine Livestock Registry, Farm Operations, Pedigree Analytics, Contemporary Groups, Genomics & Genetic Evaluation (EBVs/EPDs) System.',
  openGraph: {
    title: 'Bovine Genetics Management - Livestock Registry, Genomics & Genetic Evaluations',
    description: 'Comprehensive Bovine Livestock Registry, Farm Operations, Pedigree Analytics, Contemporary Groups, Genomics & Genetic Evaluation (EBVs/EPDs) System.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bovine Genetics Management - Livestock Registry, Genomics & Genetic Evaluations',
    description: 'Comprehensive Bovine Livestock Registry, Farm Operations, Pedigree Analytics, Contemporary Groups, Genomics & Genetic Evaluation (EBVs/EPDs) System.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
