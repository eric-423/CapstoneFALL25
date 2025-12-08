'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tam-tac.com';

export async function printBillAction(orderId: number) {
    console.log('[Server Action] Bắt đầu in hóa đơn cho order:', orderId);
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        console.log('[Server Action] Token:', token ? 'Có token' : 'Không có token');

        if (!token) {
            console.error('[Server Action] Không có token');
            return { success: false, error: 'Unauthorized - No token found' };
        }

        const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
        const url = `${baseUrl}/orders/${orderId}/bill/download`;

        console.log('[Server Action] Đang fetch từ URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': '*/*',
            },
            cache: 'no-store',
        });

        console.log('[Server Action] Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Server Action] Error downloading bill:', errorText);
            return { success: false, error: 'Không thể tải hóa đơn từ server' };
        }

        const contentType = response.headers.get('content-type') || 'application/pdf';
        console.log('[Server Action] Content-Type:', contentType);

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log('[Server Action] File size:', buffer.length, 'bytes');

        const printerIP = process.env.PRINTER_IP || '192.168.1.100';
        const printerPort = parseInt(process.env.PRINTER_PORT || '9100');

        console.log('[Server Action] Đang gửi đến máy in:', printerIP, ':', printerPort);

        if (contentType.includes('pdf')) {
            console.log('[Server Action] Dùng PDF printer');
            return await printPDFToThermalPrinter(buffer, printerIP, printerPort);
        } else {
            console.log('[Server Action] Dùng Raw printer');
            return await printRawToThermalPrinter(buffer, printerIP, printerPort);
        }
    } catch (error) {
        console.error('[Server Action] Print Bill Action Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi in hóa đơn'
        };
    }
}

async function printPDFToThermalPrinter(pdfBuffer: Buffer, printerIP: string, printerPort: number) {
    try {
        const { Socket } = await import('net');

        return new Promise<{ success: boolean; error?: string }>((resolve) => {
            const client = new Socket();
            let resolved = false;

            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    client.destroy();
                    console.error('Printer connection timeout');
                    resolve({ success: false, error: `Timeout khi kết nối máy in tại ${printerIP}:${printerPort}` });
                }
            }, 5000);

            client.connect(printerPort, printerIP, () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    console.log('✅ Đã kết nối máy in, đang gửi dữ liệu...');
                    client.write(pdfBuffer);
                    client.end();
                    resolve({ success: true });
                }
            });

            client.on('error', (error: Error) => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    console.error('❌ Printer connection error:', error.message);
                    resolve({
                        success: false,
                        error: `Không thể kết nối máy in tại ${printerIP}:${printerPort}. ` +
                            `Kiểm tra: IP máy in, kết nối mạng, hoặc máy in đã bật chưa?`
                    });
                }
            });

            client.on('close', () => {
                console.log('Printer connection closed');
            });
        });
    } catch (error) {
        console.error('PDF print error:', error);
        return { success: false, error: 'Lỗi khi gửi PDF đến máy in' };
    }
}

async function printRawToThermalPrinter(rawBuffer: Buffer, printerIP: string, printerPort: number) {
    try {
        const { Socket } = await import('net');

        return new Promise<{ success: boolean; error?: string }>((resolve) => {
            const client = new Socket();
            let resolved = false;

            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    client.destroy();
                    console.error('Printer connection timeout');
                    resolve({ success: false, error: `Timeout khi kết nối máy in tại ${printerIP}:${printerPort}` });
                }
            }, 5000);

            client.connect(printerPort, printerIP, () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    console.log('✅ Đã kết nối máy in, đang gửi dữ liệu...');
                    client.write(rawBuffer);
                    client.end();
                    resolve({ success: true });
                }
            });

            client.on('error', (error: Error) => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    console.error('❌ Printer connection error:', error.message);
                    resolve({
                        success: false,
                        error: `Không thể kết nối máy in tại ${printerIP}:${printerPort}. ` +
                            `Kiểm tra: IP máy in, kết nối mạng, hoặc máy in đã bật chưa?`
                    });
                }
            });

            client.on('close', () => {
                console.log('Printer connection closed');
            });
        });
    } catch (error) {
        console.error('Raw print error:', error);
        return { success: false, error: 'Lỗi khi gửi dữ liệu đến máy in' };
    }
}

