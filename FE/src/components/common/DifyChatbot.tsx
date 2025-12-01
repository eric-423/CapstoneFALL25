'use client';

import { useEffect } from 'react';
import { useAuth } from '@/utils/hooks';

declare global {
    interface Window {
        difyChatbotConfig?: {
            conversation_id?: string;
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
const STORAGE_KEY_PATTERN = /udify|dify|conversationIdInfo/i;

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

const removeExistingChatbot = () => {
    if (typeof window === 'undefined') return;

    // Remove existing script
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
        existingScript.remove();
    }

    // Remove existing iframe (nếu Dify nhúng iframe vào DOM)
    const existingIframe = document.querySelector('iframe[src*="udify"]');
    if (existingIframe?.parentElement) {
        existingIframe.parentElement.removeChild(existingIframe);
    }

    // Clear persisted storage (conversationIdInfo, v.v.)
    clearPersistedChat();
};

export default function DifyChatbot() {
    const { user } = useAuth();     

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // If user is not CUSTOMER, remove chatbot and exit
        if (user?.role?.toUpperCase() !== 'CUSTOMER') {
            removeExistingChatbot();
            return;
        }

        const initChatbot = async () => {
            removeExistingChatbot();  // This now includes clearing storage

            const inputs: Record<string, string> = {};
            if (user?.id) {
                inputs.external_user_id = user.id.toString();
            }

            // Reset to new conversation (server-side)
            if (user?.id) {
                try {
                    await fetch('/api/dify/reset', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ externalUserId: user.id.toString() }),
                    });
                } catch (error) {
                    console.warn('Error resetting Dify conversation:', error);
                }
            }

            // Fetch JWT token
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

            // Lấy conversation_id chính thức từ backend (dùng /v1/chatbot/token với external_user_id)
            let conversationId: string | undefined;
            if (user?.id) {
                try {
                    const convRes = await fetch(`/api/dify/conversations?user=${user.id.toString()}`, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (convRes.ok) {
                        const convData = await convRes.json();
                        if (convData?.latestConversationId) {
                            conversationId = convData.latestConversationId as string;
                        }
                    } else {
                        console.warn('Failed to fetch Dify conversation_id from backend');
                    }
                } catch (error) {
                    console.warn('Error fetching Dify conversation_id:', error);
                }
            }

            // Set config
            window.difyChatbotConfig = {
                // conversation_id lấy từ /v1/chatbot/token (backend), gắn với external_user_id
                conversation_id: conversationId,
                token: DIFY_TOKEN,
                dynamicScript: true,
                systemVariables: {},
                userVariables: {},
                inputs,
            };

            // Append script if not already present
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

        // Cleanup on unmount
        return removeExistingChatbot;
    }, [user?.id, user?.role]);

    return null;
}