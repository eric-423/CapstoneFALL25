'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        difyChatbotConfig?: {
            token: string;
            inputs: Record<string, unknown>;
            systemVariables: Record<string, unknown>;
            userVariables: Record<string, unknown>;
        };
    }
}

const DIFY_TOKEN = '7GpTLntBTKdzYSP7';
const SCRIPT_ID = DIFY_TOKEN;
const SCRIPT_URL = 'https://udify.app/embed.min.js';

const checkChatbotElements = () => {
    const chatbotButton = document.getElementById('dify-chatbot-bubble-button');
    const chatbotWindow = document.getElementById('dify-chatbot-bubble-window');

    return { chatbotButton, chatbotWindow };
};

export default function DifyChatbot() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        window.difyChatbotConfig = {
            token: DIFY_TOKEN,
            inputs: {},
            systemVariables: {},
            userVariables: {},
        };

        const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement;

        if (existingScript) {
            setTimeout(() => {
                checkChatbotElements();

                let checkCount = 0;
                const maxChecks = 5;
                const checkInterval = setInterval(() => {
                    checkCount++;
                    const { chatbotButton } = checkChatbotElements();

                    if (chatbotButton || checkCount >= maxChecks) {
                        clearInterval(checkInterval);
                    }
                }, 1000);
            }, 1000);
            return;
        }

        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.id = SCRIPT_ID;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (!window.difyChatbotConfig) {
                window.difyChatbotConfig = {
                    token: DIFY_TOKEN,
                    inputs: {},
                    systemVariables: {},
                    userVariables: {},
                };
            }

            setTimeout(() => {
                checkChatbotElements();

                let checkCount = 0;
                const maxChecks = 10;
                const checkInterval = setInterval(() => {
                    checkCount++;
                    const { chatbotButton } = checkChatbotElements();

                    if (chatbotButton) {
                        clearInterval(checkInterval);
                    } else if (checkCount >= maxChecks) {
                        clearInterval(checkInterval);
                    }
                }, 500);
            }, 500);
        };

        if (document.head) {
            document.head.appendChild(script);
        } else if (document.body) {
            document.body.appendChild(script);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                if (document.head) {
                    document.head.appendChild(script);
                } else {
                    document.body.appendChild(script);
                }
            });
        }

        return () => {
        };
    }, []);

    return null;
}

