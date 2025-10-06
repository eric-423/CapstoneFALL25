import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/manager/',
                    '/api/',
                    '/checkout/',
                    '/profile/',
                    '/my-orders/',
                    '/payment-success/',
                    '/payment-failed/',
                    '/403',
                    '/_next/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}