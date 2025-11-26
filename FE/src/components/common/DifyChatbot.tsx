'use client';

import JwtDecode from '@/utils/jwtDecode';
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

        const initChatbot = async () => {
            try {
                const response = await fetch('/api/auth/me/getToken', {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    const decode = JwtDecode(data.token);

                    console.log('Dify JWT:', data.token, 'UserId:', decode.id);

                    window.difyChatbotConfig = {
                        token: DIFY_TOKEN,
                        inputs: {
                            jwt_token: data.token,
                            external_user_id: decode.id.toString(),
                        },
                        systemVariables: {},
                        userVariables: {},
                    };

                } else {
                    window.difyChatbotConfig = {
                        token: DIFY_TOKEN,
                        inputs: {},
                        systemVariables: {},
                        userVariables: {},
                    };
                }

            } catch (error) {
                console.error('Error fetching JWT token for Dify:', error);
                window.difyChatbotConfig = {
                    token: DIFY_TOKEN,
                    inputs: {},
                    systemVariables: {},
                    userVariables: {},
                };
            }



            const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

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
                setTimeout(() => {
                    checkChatbotElements();

                    let checkCount = 0;
                    const maxChecks = 10;
                    const checkInterval = setInterval(() => {
                        checkCount++;
                        const { chatbotButton } = checkChatbotElements();

                        if (chatbotButton || checkCount >= maxChecks) {
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
                    } else if (document.body) {
                        document.body.appendChild(script);
                    }
                });
            }
        };

        initChatbot();

        return () => { };
    }, []);

    return null;
}

