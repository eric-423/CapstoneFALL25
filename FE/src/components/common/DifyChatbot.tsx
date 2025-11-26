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

const DIFY_TOKEN = '7GpTLntBTKdzYSP7';
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
    const isCustomer = user?.role?.toUpperCase() === 'CUSTOMER';

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let aborted = false;

        const removeExistingChatbot = () => {
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

        const injectChatbotStyles = () => {
            // Inject CSS vào iframe sau khi chatbot load
            const styleId = 'dify-custom-styles';
            if (document.getElementById(styleId)) {
                return;
            }

            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* Chatbot background và text colors */
                body {
                    background-color: var(--card, #ffffff) !important;
                    color: var(--foreground, #1a1a1a) !important;
                }
                
                /* Chat container */
                [class*="chat-container"],
                [class*="chat-body"],
                [class*="chat-content"] {
                    background-color: var(--card, #ffffff) !important;
                }
                
                /* Messages */
                [class*="message"],
                [class*="bubble"],
                [class*="chat-message"] {
                    background-color: var(--muted, #f5f5f5) !important;
                    color: var(--foreground, #1a1a1a) !important;
                }
                
                /* Input field */
                input,
                textarea {
                    background-color: var(--card, #ffffff) !important;
                    color: var(--foreground, #1a1a1a) !important;
                    border-color: var(--border, #e5e5e5) !important;
                }
                
                /* Buttons */
                button {
                    background-color: var(--primary, #EC6426) !important;
                    color: var(--primary-foreground, #ffffff) !important;
                }
                
                button:hover {
                    opacity: 0.9 !important;
                }
            `;
            document.head.appendChild(style);

            // Cố gắng inject vào iframe sau khi nó load
            const tryInjectIntoIframe = () => {
                const iframe = document.querySelector('iframe[src*="udify"]') as HTMLIFrameElement;
                if (iframe && iframe.contentDocument) {
                    try {
                        const iframeStyle = iframe.contentDocument.createElement('style');
                        iframeStyle.textContent = style.textContent;
                        iframe.contentDocument.head.appendChild(iframeStyle);
                    } catch {
                        // Cross-origin error - không thể inject vào iframe
                        console.warn('Cannot inject styles into Dify iframe (cross-origin)');
                    }
                }
            };

            // Thử inject sau khi iframe load
            setTimeout(tryInjectIntoIframe, 1000);
            setTimeout(tryInjectIntoIframe, 3000);
        };

        const appendScript = () => {
            if (document.getElementById(SCRIPT_ID)) {
                return;
            }

            const script = document.createElement('script');
            script.src = SCRIPT_URL;
            script.id = SCRIPT_ID;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                // Inject styles sau khi script load
                setTimeout(injectChatbotStyles, 500);
            };

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

        // if (!isCustomer) {
        //     removeExistingChatbot();
        //     return;
        // }

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
    }, [user?.id, isCustomer]);

    return null;
}