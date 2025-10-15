'use client';

import image from '@/assets/images/Home - Banner.jpg';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import StyledHeading from '@/components/common/styled-heading';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import useScrollTop from '@/utils/hooks/useScrollTop';
import { useSampleProducts, useSampleProductTypes, useSampleBranches } from '@/utils/hooks/useSampleData';
import { ProductType } from '@/apis/product.api';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import BranchList from './components/branch-list';
import FeaturedProduct from './components/featured-product';
import ProductList from './components/product-list';
import ProductTypeList from './components/product-type-list';

export default function MenuPage() {
    useScrollTop();
    const [productType, setProductType] = useState<ProductType>({ id: 0, name: 'Tất cả' });
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    
    // Use sample data hooks
    const {
        products: productList,
        isLoading: isLoadingProducts,
        nextPage,
        hasMore,
        totalElements,
    } = useSampleProducts({
        size: 12,
        productType: productType.id,
    });

    const { productTypes, isLoading: isLoadingProductTypes } = useSampleProductTypes();
    const { branches, isLoading: isLoadingBranches } = useSampleBranches();

    useEffect(() => {
        if (branches && !selectedBranch) {
            setSelectedBranch(branches[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branches]);

    useEffect(() => {
        document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
    }, [productType, selectedBranch]);

    return (
        <div className='min-h-screen'>
            {/* Hero Section */}

            {isLoadingBranches || isLoadingProductTypes ? (
                <div className='flex items-center justify-center min-h-screen'>
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <div id='hero-section' className='relative h-64 md:h-80 overflow-hidden'>
                        <Image src={image} alt='Tấm Tắc Menu' fill className='object-cover' />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex items-center justify-center'>
                            <div className='text-center'>
                                <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
                                    <StyledHeading text='Thực đơn Tấm Tắc' />
                                </h1>
                                <p className='text-white/90 max-w-2xl mx-auto px-4'>
                                    <span className='text-background font-medium'>Tấm Tắc</span> là chuỗi hệ thống cơm tấm với mong muốn
                                    mang đến cho sinh viên những bữa cơm tấm chất lượng với giá cả hợp lý, đảm bảo vệ sinh an toàn thực
                                    phẩm
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='container mx-auto px-10 md:px-10 pt-8 py-20'>
                        <div className='flex flex-col lg:flex-row gap-8'>
                            {/* Sidebar */}
                            <div className='lg:w-1/4'>
                                <div className='bg-white rounded-xl shadow-sm p-6 sticky top-24'>
                                    <h2 className='text-xl font-bold mb-6'>Danh mục</h2>

                                    <div className='space-y-6'>
                                        {/* Categories */}
                                        <ProductTypeList
                                            productTypes={productTypes || []}
                                            productType={productType}
                                            setProductType={setProductType}
                                        />

                                        {/* Locations */}
                                        <div>
                                            <h3 className='text-sm uppercase text-gray-500 font-medium mb-3'>Cửa hàng</h3>
                                            <BranchList
                                                branches={branches || []}
                                                selectedBranch={selectedBranch}
                                                setSelectedBranch={setSelectedBranch}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}

                            <div className='lg:w-3/4' id='menu-content'>
                                {/* Featured Product */}
                                {productList?.length > 0 && productType.id === 0 && <FeaturedProduct product={productList[0]} />}
                                {/* Menu Grid */}
                                <div>
                                    <div className='flex items-center justify-between mb-6'>
                                        <h2 className='text-xl font-bold'>
                                            {selectedBranch?.branchName ? (
                                                <>
                                                    {selectedBranch.branchName} <span className='font-normal text-base'>- {productType.name}</span>
                                                </>
                                            ) : (
                                                productType.name
                                            )}
                                        </h2>
                                    </div>

                                    {isLoadingProducts ? (
                                        <div className='flex items-center justify-center'>
                                            <LoadingSpinner className='my-10 h-8 w-8 animate-spin' />
                                        </div>
                                    ) : (
                                        <>
                                            <ProductList products={productList} />
                                            <div>
                                                <InfiniteScroll hasMore={hasMore} isLoading={isLoadingProducts} next={nextPage}>
                                                    {isLoadingProducts && <LoadingSpinner className='my-10 h-8 w-8 animate-spin' />}
                                                </InfiniteScroll>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
