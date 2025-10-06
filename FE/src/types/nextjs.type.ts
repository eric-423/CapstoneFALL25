import { NextRequest } from 'next/server';

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export interface PageProps {
    params: { [key: string]: string | string[] };
    searchParams: { [key: string]: string | string[] | undefined };
}

export interface LayoutProps {
    children: React.ReactNode;
    params: { [key: string]: string | string[] };
}

export interface RouteParams {
    [key: string]: string | string[];
}

export interface SearchParams {
    [key: string]: string | string[] | undefined;
}