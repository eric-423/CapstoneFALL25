import Image from 'next/image';
import { SearchForm } from '@/components/common/search-form';
import { memo } from 'react';

const HeroSection = memo(() => {
    return (
        <section className="relative min-h-screen bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/Home - Banner.jpg"
                    alt="Cơm Tấm Tắc Background"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen">
                <div className="text-center mb-12 max-w-4xl">
                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                        Cơm Tấm Tắc
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-semibold text-orange-300 mb-6">
                        Tấm ngon, Tắc nhớ!
                    </h2>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-white/90 mb-12">
                        Thương hiệu cơm tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên
                    </p>

                    {/* Search Form */}
                    <SearchForm />
                </div>
            </div>
        </section>
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;