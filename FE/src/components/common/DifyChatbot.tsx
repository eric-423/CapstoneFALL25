'use client';

import { useEffect } from 'react';
import JwtDecode from '@/utils/jwtDecode';
import useAuth from '@/utils/hooks/useAuth.nextjs';
import { Role } from '@/utils/enum';

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

    const existingIframes = document.querySelectorAll('iframe[src*="udify"], iframe[src*="dify"]');
    existingIframes.forEach(iframe => {
        const htmlIframe = iframe as HTMLElement;
        htmlIframe.style.display = 'none';
        iframe.remove();
    });

    const chatbotContainers = document.querySelectorAll('[id*="dify"], [class*="dify"], [class*="chatbot"], [data-dify]');
    chatbotContainers.forEach(container => {
        const htmlContainer = container as HTMLElement;
        const parent = container.parentElement;
        if (parent && (parent.id?.includes('dify') || parent.className?.includes('dify') || parent.getAttribute('data-dify'))) {
            const htmlParent = parent as HTMLElement;
            htmlParent.style.display = 'none';
            parent.remove();
        } else {
            htmlContainer.style.display = 'none';
            container.remove();
        }
    });

    const widgetElements = document.querySelectorAll('[id^="dify-widget"], [class*="dify-widget"]');
    widgetElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.display = 'none';
        el.remove();
    });

    const allDivs = document.querySelectorAll('div');
    allDivs.forEach(div => {
        if (div.id?.includes('dify') || div.className?.includes('dify-widget') || div.className?.includes('chatbot-widget')) {
            div.style.display = 'none';
            div.remove();
        }
    });

    if (window.difyChatbotConfig) {
        delete window.difyChatbotConfig;
    }
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

        const isCustomer = !isAuthenticated || (user && user.role === Role.USER);

        if (!isCustomer) {
            removeExistingChatbot();
            const checkInterval = setInterval(() => {
                removeExistingChatbot();
            }, 100);
            return () => {
                clearInterval(checkInterval);
                removeExistingChatbot();
            };
        }

        removeExistingChatbot();
        initChatbot();

        return () => {
            removeExistingChatbot();
        };
    }, [isAuthenticated, user, isLoading]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isLoading) return;

        if (isAuthenticated && user && user.role !== Role.USER) {
            removeExistingChatbot();
            const interval = setInterval(() => {
                removeExistingChatbot();
            }, 200);
            return () => clearInterval(interval);
        }
    }, [user, isAuthenticated, isLoading]);

    return null;
}