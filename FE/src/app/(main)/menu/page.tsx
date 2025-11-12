'use client';

import image from '@/assets/images/Home - Banner.jpg';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import StyledHeading from '@/components/common/styled-heading';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import useScrollTop from '@/utils/hooks/useScrollTop';
import useGetProductSearch from '@/utils/hooks/useGetProductSearch';
import { ProductType } from '@/apis/product.api';
import { getCustomerInformation } from '@/apis/user.api';
import { getNearbyBranches } from '@/apis/branch.api';
import { useAuth } from '@/utils/hooks';
import { useSampleProductTypes, useSampleBranches } from '@/utils/hooks/useSampleData';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import BranchList from './components/branch-list';
import FeaturedProduct from './components/featured-product';
import ProductList from './components/product-list';
import ProductTypeList from './components/product-type-list';

type Branch = {
    branchId: number;
    branchName: string;
    address: string;
    phone: string;
    isActive: boolean;
    distanceText?: string;
};

export default function MenuPage() {
    useScrollTop();
    const { user } = useAuth();
    const [productType, setProductType] = useState<ProductType>({ id: 0, name: 'Tất cả' });
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const { productTypes, isLoading: isLoadingProductTypes } = useSampleProductTypes();
    const { branches: sampleBranches, isLoading: isLoadingSampleBranches } = useSampleBranches();

    const { data: customerInformationData = [], isLoading: isLoadingCustomerInfos } = useQuery({
        queryKey: ['customer-informations', user?.id],
        queryFn: () => getCustomerInformation(user?.id || 0),
        enabled: Boolean(user?.id),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const customerInformations = useMemo(() => {
        if (Array.isArray(customerInformationData?.data)) return customerInformationData.data;
        if (Array.isArray(customerInformationData)) return customerInformationData;
        return [];
    }, [customerInformationData]);

    const primaryAddress = useMemo(() => {
        if (!customerInformations.length) return '';
        const defaultInfo = customerInformations.find((info: any) => info.isDefault);
        return (defaultInfo ?? customerInformations[0])?.address || '';
    }, [customerInformations]);

    const { data: nearbyBranchesData = [], isLoading: isLoadingNearbyBranches } = useQuery({
        queryKey: ['nearby-branches', primaryAddress],
        queryFn: () => getNearbyBranches(primaryAddress, 20),
        enabled: Boolean(primaryAddress),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const nearbyBranches = useMemo(() => {
        if (!Array.isArray(nearbyBranchesData)) return [];
        return nearbyBranchesData.map((branch: any) => ({
            branchId: branch.branchId,
            branchName: branch.name,
            address: branch.address,
            phone: branch.phoneNumber,
            isActive: true,
            distanceText: branch.distanceText,
        } as Branch));
    }, [nearbyBranchesData]);

    const displayBranches = useMemo(() => {
        if (nearbyBranches.length) {
            return nearbyBranches;
        }
        return (sampleBranches || []).map((branch: any) => ({
            branchId: branch.branchId,
            branchName: branch.branchName,
            address: branch.address,
            phone: branch.phone ?? branch.phoneNumber ?? '',
            isActive: branch.isActive,
        })) as Branch[];
    }, [nearbyBranches, sampleBranches]);

    const {
        products: productList,
        isLoading: isLoadingProducts,
        nextPage,
        hasMore,
        resetAndRefetch,
    } = useGetProductSearch({
        size: 12,
        productTypeId: productType.id === 0 ? undefined : productType.id,
        branchId: selectedBranch?.branchId || 1,
        isActive: true,
    });

    const isLoadingBranches = isLoadingSampleBranches || isLoadingProductTypes || isLoadingCustomerInfos || isLoadingNearbyBranches;

    useEffect(() => {
        if (isLoadingBranches) return;
        if (!displayBranches.length) return;

        setSelectedBranch((prev) => {
            if (prev && displayBranches.some((branch) => branch.branchId === prev.branchId)) {
                return prev;
            }
            const firstBranch = displayBranches[0];
            if (typeof window !== 'undefined') {
                localStorage.setItem('selectedBranch', JSON.stringify(firstBranch));
            }
            return firstBranch;
        });
    }, [displayBranches, isLoadingBranches]);

    useEffect(() => {
        document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
    }, [productType, selectedBranch]);

    return (
        <div className='min-h-screen'>
            {isLoadingBranches ? (
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
                            <div className='lg:w-1/4'>
                                <div className='bg-white rounded-xl shadow-sm p-6 sticky top-24'>
                                    <h2 className='text-xl font-bold mb-6'>Danh mục</h2>
                                    <div className='space-y-6'>
                                        <ProductTypeList
                                            productTypes={productTypes || []}
                                            productType={productType}
                                            setProductType={setProductType}
                                            resetAndRefetch={resetAndRefetch}
                                        />
                                        <div>
                                            <h3 className='text-sm uppercase text-gray-500 font-medium mb-3'>Cửa hàng</h3>
                                            <BranchList
                                                branches={displayBranches}
                                                selectedBranch={selectedBranch}
                                                setSelectedBranch={setSelectedBranch}
                                                resetAndRefetch={resetAndRefetch}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='lg:w-3/4' id='menu-content'>
                                {productList?.length > 0 && productType.id === 0 && <FeaturedProduct product={productList[0]} />}
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

