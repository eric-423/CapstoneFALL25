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
const STORAGE_KEY_PATTERN = /https?:\/\/udify\.app|dify|udify/i;


const clearPersistedChat = () => {
    if (typeof window === 'undefined') return;

    const storages = [window.localStorage, window.sessionStorage];

    storages.forEach((storage) => {
        try {
            if (!storage) return;

            const keysToRemove: string[] = [];

            for (let i = 0; i < storage.length; i += 1) {
                const key = storage.key(i);
                if (key && STORAGE_KEY_PATTERN.test(key)) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach((key) => storage.removeItem(key));
        } catch (error) {
            console.warn('Failed to clear Dify chatbot storage', error);
        }
    });
};


export default function DifyChatbot() {
    const { user } = useAuth();

    const removeExistingChatbot = () => {
        if (typeof window === 'undefined') return;

        const existingScript = document.getElementById(SCRIPT_ID);
        if (existingScript) {
            existingScript.remove();
        }

        const existingIframe = document.querySelector('iframe[src*="udify"]');
        if (existingIframe?.parentElement) {
            existingIframe.parentElement.removeChild(existingIframe);
        }

        clearPersistedChat();
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (user && user.role && user.role.toUpperCase() !== 'CUSTOMER') {
            removeExistingChatbot();
        }
    }, [user, user?.role]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (user && user.role && user.role.toUpperCase() !== 'CUSTOMER') {
            return;
        }

        let aborted = false;

        const appendScript = () => {
            if (document.getElementById(SCRIPT_ID)) {
                return;
            }

            const script = document.createElement('script');
            script.src = SCRIPT_URL;
            script.id = SCRIPT_ID;
            script.async = true;
            script.defer = true;

            if (document.head) {
                document.head.appendChild(script);
            } else if (document.body) {
                document.body.appendChild(script);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    if (document.head) document.head.appendChild(script);
                    else if (document.body) document.body.appendChild(script);
                });
            }
        };

        const initChatbot = async () => {
            removeExistingChatbot();

            const inputs: Record<string, string> = {};
            if (user?.id) {
                inputs.external_user_id = user.id.toString();
            }

            try {
                const response = await fetch('/api/auth/me/getToken', {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data?.token) {
                        inputs.jwt_token = data.token;
                    }
                }
            } catch (error) {
                console.warn('Error fetching JWT token for Dify:', error);
            }

            if (aborted) return;

            window.difyChatbotConfig = {
                token: DIFY_TOKEN,
                dynamicScript: true,
                systemVariables: {},
                userVariables: {},
                inputs,
            };

            appendScript();
        };

        initChatbot();

        return () => {
            aborted = true;
            removeExistingChatbot();
        };
    }, [user, user?.id, user?.role]);

    return null;
}