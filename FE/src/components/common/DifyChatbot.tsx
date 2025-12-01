'use client';

import { useEffect } from 'react';
import { useAuth } from '@/utils/hooks';

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
const SCRIPT_ID = DIFY_TOKEN;
const SCRIPT_URL = 'https://udify.app/embed.min.js';

const removeExistingChatbot = () => {
    if (typeof window === 'undefined') return;

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) existingScript.remove();

    const existingIframe = document.querySelector('iframe[src*="udify"]');
    if (existingIframe) existingIframe.remove();
};

export default function DifyChatbot() {
    const { user } = useAuth();

    useEffect(() => {
        if (typeof window === 'undefined' || user?.role?.toUpperCase() !== 'CUSTOMER') {
            removeExistingChatbot();
            return;
        }

        const initChatbot = () => {
            removeExistingChatbot();

            const inputs: Record<string, string> = {};
            if (user?.id) {
                inputs.external_user_id = user.id.toString();
            }

            window.difyChatbotConfig = {
                token: DIFY_TOKEN,
                dynamicScript: true,
                inputs,
                systemVariables: {
                    user_id: user?.id?.toString() ?? '',
                },
                userVariables: {},
            };
            if (!document.getElementById(SCRIPT_ID)) {
                const script = document.createElement('script');
                script.src = SCRIPT_URL;
                script.id = SCRIPT_ID;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
        };

        initChatbot();

        return removeExistingChatbot;
    }, [user?.id, user?.role]);

    return null;
}