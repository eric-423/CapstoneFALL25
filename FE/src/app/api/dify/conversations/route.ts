import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-handler';

export async function GET(request: NextRequest) {
    const apiKey = process.env.DIFY_API_KEY;
    const chatbotToken = process.env.DIFY_CHATBOT_TOKEN ?? process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN;

    if (!apiKey) {
        return createErrorResponse(new Error('DIFY_API_KEY is not configured on the server.'));
    }

    if (!chatbotToken) {
        return createErrorResponse(new Error('DIFY_CHATBOT_TOKEN is not configured on the server.'));
    }

    try {
        const searchParams = request.nextUrl.searchParams;
        const externalUserId = searchParams.get('user');

        if (!externalUserId) {
            return NextResponse.json(
                { error: 'user parameter (external_user_id) is required.' },
                { status: 400 },
            );
        }

        const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_DIFY_BASE_URL}/chatbot/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                external_user_id: externalUserId,
                chatbot_token: chatbotToken,
            }),
            cache: 'no-store',
        });

        if (!tokenResponse.ok) {
            return createErrorResponse(new Error('Failed to fetch Dify token.'));
        }

        return NextResponse.json(await tokenResponse.json());
    } catch (error) {
        console.error('Error fetching Dify conversation:', error);
        return createErrorResponse(error as Error);
    }
}
