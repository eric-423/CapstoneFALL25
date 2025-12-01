import { NextRequest, NextResponse } from 'next/server';

const DIFY_BASE_URL = process.env.NEXT_PUBLIC_DIFY_BASE_URL ?? 'https://api.dify.ai/v1';

export async function POST(request: NextRequest) {
    const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
    const chatbotToken = process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN ?? process.env.DIFY_CHATBOT_TOKEN;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'NEXT_PUBLIC_DIFY_API_KEY is not configured on the server.' },
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
        const body = await request.json().catch(() => null);
        const externalUserId =
            body?.externalUserId ?? body?.external_user_id ?? body?.user;
        const conversationId = body?.conversationId ?? body?.conversation_id;

        if (!externalUserId) {
            return NextResponse.json(
                { error: 'externalUserId (or external_user_id) is required.' },
                { status: 400 },
            );
        }

        let targetConversationId = conversationId;

        // Nếu không có conversationId, tìm conversation của user này
        if (!targetConversationId) {
            try {
                // Dùng /conversations?user=<external_user_id> để lấy đúng conversation của user
                const conversationsResponse = await fetch(
                    `${DIFY_BASE_URL}/conversations?user=${externalUserId}&limit=100`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${apiKey}`,
                        },
                        cache: 'no-store',
                    },
                );

                if (conversationsResponse.ok) {
                    const conversationsData = await conversationsResponse.json().catch(() => null);
                    const conversations = conversationsData?.data ?? conversationsData?.items ?? [];

                    // Tìm conversation có external_user_id phù hợp
                    const userConversation = conversations.find(
                        (conv: { inputs?: { external_user_id?: string }; id?: string }) => {
                            return conv?.inputs?.external_user_id === externalUserId && conv?.id;
                        },
                    );

                    if (userConversation?.id) {
                        targetConversationId = userConversation.id;
                    } else if (conversations.length > 0 && conversations[0]?.id) {
                        // Nếu không tìm thấy theo external_user_id, lấy conversation đầu tiên
                        targetConversationId = conversations[0].id;
                    }
                }
            } catch (error) {
                console.warn('[Dify Reset] Failed to fetch conversations list:', error);
            }
        }

        // Xóa conversation cũ nếu có
        if (targetConversationId) {
            const deleteResponse = await fetch(
                `${DIFY_BASE_URL}/conversations/${targetConversationId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                    cache: 'no-store',
                },
            );

            if (!deleteResponse.ok) {
                const errorText = await deleteResponse.text().catch(() => null);
                console.warn('[Dify Reset] Failed to delete conversation:', {
                    status: deleteResponse.status,
                    conversationId: targetConversationId,
                    body: errorText,
                });
                // Không return error, tiếp tục tạo conversation mới
            } else {
                console.info(
                    '[Dify Reset] Conversation deleted successfully',
                    'external_user_id:',
                    externalUserId,
                    'conversation_id:',
                    targetConversationId,
                );
            }
        }

        // Sau khi xóa (hoặc không có conversation cũ), tạo conversation MỚI bằng /chatbot/token
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
            console.warn('[Dify Reset] Failed to create new conversation:', errorText);
            return NextResponse.json(
                {
                    error: 'Failed to create new Dify conversation.',
                    details: errorText,
                },
                { status: tokenResponse.status },
            );
        }

        const tokenData = await tokenResponse.json();
        const newConversationId =
            tokenData?.conversation_id ??
            tokenData?.data?.conversation_id ??
            tokenData?.conversation?.id;

        console.info(
            '[Dify Reset] New conversation created',
            'external_user_id:',
            externalUserId,
            'new_conversation_id:',
            newConversationId,
        );

        return NextResponse.json({
            success: true,
            message: 'Conversation reset successfully. New conversation created.',
            external_user_id: externalUserId,
            deletedConversationId: targetConversationId ?? null,
            newConversationId,
        });
    } catch (error) {
        console.error('[Dify Reset] Error:', error);
        return NextResponse.json(
            {
                error: 'Unexpected error while resetting Dify conversation.',
                details: String(error),
            },
            { status: 500 },
        );
    }
}