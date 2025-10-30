declare module 'web-vitals' {
  export type Metric = {
    name: string;
    value: number;
    id: string;
    delta: number;
    navigationType?: string;
  };

  export function getCLS(onReport: (metric: Metric) => void): void;
  export function getFID(onReport: (metric: Metric) => void): void;
  export function getFCP(onReport: (metric: Metric) => void): void;
  export function getLCP(onReport: (metric: Metric) => void): void;
  export function getTTFB(onReport: (metric: Metric) => void): void;
}


