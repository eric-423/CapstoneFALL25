'use client';

import { useEffect } from 'react';
import JwtDecode from '@/utils/jwtDecode';
import useAuth from '@/utils/hooks/useAuth.nextjs';

declare global {
    interface Window {
        difyChatbotConfig?: {
            token: string;
            dynamicScript?: boolean;
            inputs: Record<string, string>;
            systemVariables: Record<string, unknown>;
            userVariables: Record<string, unknown>;
        };
    }
}

const DIFY_TOKEN = 'zuJKSoxQFk62iEMg';
const SCRIPT_URL = 'https://udify.app/embed.min.js';

const removeExistingChatbot = () => {
    if (typeof window === 'undefined') return;

    const existingScript = document.getElementById(DIFY_TOKEN);
    if (existingScript) existingScript.remove();

    const existingIframe = document.querySelector('iframe[src*="udify"]');
    if (existingIframe) existingIframe.remove();
};

const getToken = async () => {
    try {
        const res = await fetch('/api/auth/me/getToken', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await res.json().catch(() => null);
        return data?.token ?? '';
    } catch (error) {
        console.error('Failed to fetch JWT token for Dify chatbot:', error);
        return null;
    }
};

const initChatbot = async () => {
    removeExistingChatbot();

    const inputs: Record<string, string> = {};
    const sva: Record<string, string> = {};
    const jwtToken = await getToken();
    const userId = jwtToken ? JwtDecode(jwtToken).i?.toString() : null;

    if (jwtToken && userId) {
        inputs.jwt_token = jwtToken;
        inputs.external_user_id = userId;

        sva.user_id = userId;

        window.difyChatbotConfig = {
            token: DIFY_TOKEN,
            dynamicScript: true,
            inputs,
            systemVariables: { ...sva },
            userVariables: {},
        };
    } else {
        removeExistingChatbot();
        const UUID = crypto.randomUUID();
        window.difyChatbotConfig = {
            token: DIFY_TOKEN,
            dynamicScript: true,
            inputs: {
                jwt_token: ' ',
                external_user_id: 'guest',
                user_id: UUID.toString(),
            },
            systemVariables: {
                user_id: UUID.toString(),
            },
            userVariables: {},
        };
    }

    if (!document.getElementById(DIFY_TOKEN)) {
        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.id = DIFY_TOKEN;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
};

export default function DifyChatbot() {
    const { isAuthenticated, isLoading, user } = useAuth();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isLoading) return;

        removeExistingChatbot();
        initChatbot();

        return removeExistingChatbot;
    }, [isAuthenticated, user?.id, isLoading]);

    return null;
}