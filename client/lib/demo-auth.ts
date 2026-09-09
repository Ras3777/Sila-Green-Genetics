export const DEMO_EMAIL = 'j.miller@apexbovine.com';
export const DEMO_AUTH_STORAGE_KEY = 'bovine_demo_auth';

type DemoSession = {
  email: string;
  signedInAt: string;
};

export function isDemoEmail(value: string) {
  return value.trim().toLowerCase() === DEMO_EMAIL;
}

export function saveDemoSession(email: string) {
  if (typeof window === 'undefined') return;
  const session: DemoSession = {
    email: email.trim().toLowerCase(),
    signedInAt: new Date().toISOString(),
  };
  window.localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function hasDemoSession() {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as Partial<DemoSession>;
    return typeof session.email === 'string' && isDemoEmail(session.email);
  } catch {
    return false;
  }
}

export function clearDemoSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
}
