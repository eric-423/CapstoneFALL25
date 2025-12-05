export const getKioskMode = (): boolean => {
    if (typeof window === 'undefined') return false;

    const forceKiosk = process.env.NEXT_PUBLIC_FORCE_KIOSK_MODE === 'true';
    if (forceKiosk) {
        return true;
    }

    const userAgent = window.navigator.userAgent;
    const chrome = (window as Window & { chrome?: { runtime?: unknown; app?: unknown } }).chrome;

    const hasChromeRuntime = chrome?.runtime !== undefined;
    const hasChromeApp = chrome?.app !== undefined;
    const hasChrome = chrome !== undefined;
    const urlHasKiosk = window.location.search.includes('kiosk=true');
    const isKioskUserAgent = userAgent.includes('Kiosk') || userAgent.includes('kiosk');

    return hasChromeRuntime || hasChromeApp || hasChrome || urlHasKiosk || isKioskUserAgent;
};




