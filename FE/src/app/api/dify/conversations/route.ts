import { NextRequest, NextResponse } from 'next/server';

const DIFY_BASE_URL = process.env.DIFY_BASE_URL ?? 'https://api.dify.ai/v1';

export async function GET(request: NextRequest) {
    const apiKey = process.env.DIFY_API_KEY;
    const chatbotToken = process.env.DIFY_CHATBOT_TOKEN ?? process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'DIFY_API_KEY is not configured on the server.' },
            { status: 500 },
        );
    }

    if (!chatbotToken) {
        return NextResponse.json(
            { error: 'DIFY_CHATBOT_TOKEN is not configured on the server.' },
            { status: 500 },
        );
    }

    try {
        // Lấy query parameters
        const searchParams = request.nextUrl.searchParams;
        const externalUserId = searchParams.get('user');

        if (!externalUserId) {
            return NextResponse.json(
                { error: 'user parameter (external_user_id) is required.' },
                { status: 400 },
            );
        }

        // Sử dụng /chatbot/token endpoint để lấy conversation_id (giống như reset route)
        const tokenResponse = await fetch(`${DIFY_BASE_URL}/chatbot/token`, {
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
            const errorText = await tokenResponse.text();
            console.warn('[Dify Conversations] Failed to fetch token:', errorText);
            return NextResponse.json(
                {
                    error: 'Failed to fetch Dify token.',
                    details: errorText,
                },
                { status: tokenResponse.status },
            );
        }

        const tokenData = await tokenResponse.json();
        
        // Extract conversation_id từ response
        const conversationId =
            tokenData?.conversation_id ??
            tokenData?.data?.conversation_id ??
            tokenData?.conversation?.id;

        console.info(
            '[Dify Conversations] conversation_id resolved',
            conversationId ?? 'N/A',
            'for external_user_id',
            externalUserId,
        );

        return NextResponse.json({
            latestConversationId: conversationId,
            hasConversation: !!conversationId,
        });
    } catch (error) {
        console.error('[Dify Conversations] Error:', error);
        return NextResponse.json(
            {
                error: 'Unexpected error while fetching Dify conversation.',
                details: String(error),
            },
            { status: 500 },
        );
    }
}

