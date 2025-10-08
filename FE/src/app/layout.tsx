import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tấm Tắc - Cơm Tấm Ngon",
    template: "%s | Tấm Tắc"
  },
  description: "Thương hiệu Cơm Tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên. Đặt món online, giao hàng nhanh, giá cả phải chăng.",
  keywords: [
    "cơm tấm",
    "đồ ăn sinh viên",
    "giao hàng tận nơi",
    "đặt món online",
    "thức ăn nhanh",
    "Tấm Tắc",
    "cơm tấm ngon",
    "đồ ăn giá rẻ"
  ],
  authors: [{ name: "Tấm Tắc Team" }],
  creator: "Tấm Tắc",
  publisher: "Tấm Tắc",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title: 'Tấm Tắc - Cơm Tấm Ngon',
    description: 'Thương hiệu Cơm Tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên',
    siteName: 'Tấm Tắc',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tấm Tắc - Cơm Tấm Ngon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tấm Tắc - Cơm Tấm Ngon',
    description: 'Thương hiệu Cơm Tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
