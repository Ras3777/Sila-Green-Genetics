'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DemoAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch('/api/auth/session', { credentials: 'include', cache: 'no-store' });
          if (response.ok) return true;
        } catch {
          // Retry transient cold-start or database wake-up failures.
        }
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500));
      }
      return false;
    };

    checkSession().then((authorized) => {
        if (!active) return;
        setIsAuthorized(authorized);
        setIsChecking(false);
        if (!authorized) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      });
    return () => { active = false; };
  }, [pathname, router]);

  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center text-stone-500">
        <div className="flex items-center gap-3 text-sm">
          <span className="h-4 w-4 rounded-full border-2 border-emerald-800 border-t-transparent animate-spin" />
          Checking demo access…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
