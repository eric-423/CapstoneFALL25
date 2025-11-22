'use client';

import foodCourt from '@/assets/images/food-court.jpg';
import friends from '@/assets/images/friends.jpg';
import members from '@/assets/images/members.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/utils/hooks/use-mobile';
import useScrollTop from '@/utils/hooks/useScrollTop';
import { fadeInUp, staggerContainer } from '@/utils/animation';

import { motion } from 'framer-motion';
import { Eye, Handshake, Mail, MapPin, Phone, Send, Target, Users } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import CoreValuesContent from './components/core-values-content';
import MissionContent from './components/mission-content';

export default function AboutPage() {
    const isMobile = useIsMobile();

    const [isScrolled, setIsScrolled] = useState(false);

    useScrollTop();

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className='min-h-screen'>
            {/* Navigation */}
            <nav
                className={`${isMobile ? 'hidden' : ''} sticky top-16 z-50 transition-colors duration-300 ${isScrolled
                    ? 'bg-gradient-to-b from-background to-[#fff3ea] shadow-sm'
                    : 'bg-gradient-to-r from-white/50 to-secondary/20'
                    } py-4 px-4`}
            >
                <div className='container mx-auto max-w-6xl flex justify-center'>
                    <div className='flex items-center space-x-20 text-foreground'>
                        <a href='#about' className='font-medium hover:text-primary transition-colors'>
                            Về chúng tôi
                        </a>
                        <a href='#values' className='font-medium hover:text-primary transition-colors'>
                            Giá trị
                        </a>
                        <a href='#vision' className='font-medium hover:text-primary transition-colors'>
                            Tầm nhìn
                        </a>
                        <a href='#mission' className='font-medium hover:text-primary transition-colors'>
                            Sứ mệnh
                        </a>
                    </div>
                </div>
            </nav>
            {/* Hero Section */}
            <section className='py-16 px-4 bg-gradient-to-br from-white/50 to-secondary/70'>
                <div className='container mx-auto max-w-6xl'>
                    <div className='grid lg:grid-cols-2 gap-12 items-center'>
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <div className='mb-6'>
                                <span className='inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-4'>
                                    Câu chuyện của chúng tôi
                                </span>
                                <h1 className='text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight'>
                                    Về Tấm Tắc
                                    <br />
                                    <span className='text-primary'>&ldquo;Tấm ngon, Tắc nhớ!&rdquo;</span>
                                </h1>
                                <p className='text-lg text-foreground leading-relaxed'>
                                    Thương hiệu Cơm Tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên. Chúng tôi hiểu rõ nhu cầu
                                    của bạn về một bữa ăn ngon – bổ – rẻ, nhanh chóng nhưng vẫn đảm bảo chất lượng.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className='relative'
                        >
                            <div className='rounded-2xl overflow-hidden shadow-2xl'>
                                <Image src={foodCourt} alt='Tấm Tắc Story' className='w-full h-[400px] object-cover' />
                            </div>
                            <div className='absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg'>
                                <div className='text-center'>
                                    <div className='text-2xl font-bold text-primary'>2025</div>
                                    <div className='text-sm text-foreground'>Khởi đầu hành trình</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Who We Are Section */}
            <section id='about' className='py-20 px-4 bg-gradient-to-bl from-secondary/70 to-white/50'>
                <div className='container mx-auto max-w-6xl'>
                    <motion.div initial='initial' whileInView='animate' viewport={{ once: true }} variants={staggerContainer}>
                        <motion.div variants={fadeInUp} className='text-center mb-16'>
                            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>Chúng tôi là ai</h2>
                            <div className='w-24 h-1 bg-primary mx-auto'></div>
                        </motion.div>

                        <div className='grid lg:grid-cols-2 gap-16 items-center'>
                            <motion.div variants={fadeInUp}>
                                <div className='space-y-6 -mt-12'>
                                    <p className='text-lg font-regular text-foreground leading-relaxed'>
                                        Tấm Tắc là dự án khởi nghiệp F&B được sáng lập bởi một nhóm sinh viên với khát vọng xây dựng thương
                                        hiệu Cơm Tấm hàng đầu dành cho sinh viên tại TP.HCM.
                                    </p>
                                    <p className='text-lg text-foreground leading-relaxed'>
                                        Chúng tôi hiểu rõ nhu cầu thực tế của sinh viên: cần một bữa ăn{' '}
                                        <span className='font-semibold text-primary'>ngon – bổ – rẻ</span>, nhanh chóng nhưng vẫn đảm bảo
                                        chất lượng và vệ sinh.
                                    </p>
                                    <p className='text-lg text-foreground leading-relaxed'>
                                        Với tinh thần đó, Tấm Tắc không chỉ là nơi bán Cơm Tấm – mà là nơi mang đến trải nghiệm ẩm thực gần
                                        gũi, tiện lợi và hiện đại.
                                    </p>

                                    <div className='grid grid-cols-2 gap-6 mt-8'>
                                        <div className='text-center p-4 bg-background border-1 border-primary/80 shadow-md shadow-foreground/10 rounded-2xl'>
                                            <Users className='h-8 w-8 text-primary mx-auto mb-2' />
                                            <div className='text-sm text-foreground'>Tạo ra bởi</div>
                                            <div className='font-bold text-foreground'>Sinh viên</div>
                                        </div>
                                        <div className='text-center p-4 bg-background border-1 border-primary/80 shadow-md shadow-foreground/10 rounded-2xl'>
                                            <Target className='h-8 w-8 text-primary mx-auto mb-2' />
                                            <div className='text-sm text-foreground'>Phục vụ cho</div>
                                            <div className='font-bold text-foreground'>Sinh viên</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <div className='relative rounded-2xl overflow-hidden space-y-6 '>
                                    <Image
                                        src={members}
                                        alt='Nhóm sáng lập Tấm Tắc'
                                        className='w-full h-[500px] object-cover rounded-2xl shadow-lg'
                                    />
                                    {/* <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl'></div> */}
                                    <div className='w-full text-center text-foreground'>
                                        <h3 className='text-xl font-bold mb-2'>Đội ngũ sáng lập trẻ</h3>
                                        <p className='text-foreground'>Đam mê ẩm thực và công nghệ</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Values Section */}
            <section id='values' className='py-20 px-4 bg-gradient-to-bl from-secondary/20 via-white/50 to-primary/30'>
                <div className='container mx-auto max-w-6xl'>
                    <motion.div initial='initial' whileInView='animate' viewport={{ once: true }} variants={staggerContainer}>
                        <motion.div variants={fadeInUp} className='text-center mb-16'>
                            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>Giá trị cốt lõi</h2>
                            <div className='w-24 h-1 bg-primary mx-auto mb-6'></div>
                            <p className='text-lg text-foreground max-w-2xl mx-auto'>
                                Những giá trị định hướng mọi hoạt động của chúng tôi
                            </p>
                        </motion.div>
                    </motion.div>

                    <CoreValuesContent />
                </div>
            </section>

            {/* Vision Section */}
            <section id='vision' className='py-20 px-4 bg-gradient-to-br from-primary/30 via-white/50 to-white/20'>
                <div className='container mx-auto max-w-6xl'>
                    <motion.div initial='initial' whileInView='animate' viewport={{ once: true }} variants={staggerContainer}>
                        <div className='grid lg:grid-cols-2 gap-16 items-center'>
                            <motion.div variants={fadeInUp}>
                                <Image
                                    src={friends}
                                    alt='Tầm nhìn Tấm Tắc'
                                    className='w-full h-[600px] object-cover rounded-2xl shadow-lg'
                                />
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <div className='space-y-6'>
                                    <div>
                                        <span className='inline-block bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-medium mb-4'>
                                            <Eye className='h-4 w-4 inline mr-2' />
                                            Tầm nhìn
                                        </span>
                                        <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-6'>Hướng đến tương lai</h2>
                                    </div>

                                    <p className='text-lg text-foreground leading-relaxed'>
                                        Tấm Tắc hướng đến trở thành một{' '}
                                        <span className='font-semibold text-blue-800'>thương hiệu Cơm Tấm hiện đại</span>, dẫn đầu thị
                                        trường sinh viên tại TP.HCM và mở rộng ra toàn quốc.
                                    </p>

                                    <p className='text-lg text-foreground leading-relaxed'>
                                        Chúng tôi muốn biến món ăn truyền thống này thành một trải nghiệm dễ tiếp cận, dễ chia sẻ và dễ nhân
                                        rộng thông qua mô hình bán hàng trực tiếp kết hợp nhượng quyền thông minh.
                                    </p>

                                    <div className='grid grid-cols-3 gap-4 pt-6'>
                                        <div className='text-center p-4 bg-purple-50 rounded-lg'>
                                            <MapPin className='h-8 w-8 text-purple-600 mx-auto mb-2' />
                                            <div className='font-bold text-foreground text-sm'>TP.HCM</div>
                                            <div className='text-xs text-foreground'>Dẫn đầu</div>
                                        </div>
                                        <div className='text-center p-4 bg-blue-50 rounded-lg'>
                                            <Target className='h-8 w-8 text-blue-600 mx-auto mb-2' />
                                            <div className='font-bold text-foreground text-sm'>Toàn quốc</div>
                                            <div className='text-xs text-foreground'>Mở rộng</div>
                                        </div>
                                        <div className='text-center p-4 bg-green-50 rounded-lg'>
                                            <Handshake className='h-8 w-8 text-green-600 mx-auto mb-2' />
                                            <div className='font-bold text-foreground text-sm'>Franchise</div>
                                            <div className='text-xs text-foreground'>Thông minh</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section id='mission' className='py-20 px-4 bg-gradient-to-bl from-white/20 via-white/50 to-foreground/70'>
                <div className='container mx-auto max-w-6xl'>
                    <motion.div initial='initial' whileInView='animate' viewport={{ once: true }} variants={staggerContainer}>
                        <motion.div variants={fadeInUp} className='text-center mb-16'>
                            <span className='inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4'>
                                <Send className='h-4 w-4 inline mr-2' />
                                Sứ mệnh
                            </span>
                            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-6'>Cam kết của chúng tôi</h2>
                            <div className='w-24 h-1 bg-primary mx-auto'></div>
                        </motion.div>

                        <MissionContent />

                        {/* Current Status */}
                        <motion.div variants={fadeInUp}>
                            <Card className='bg-gradient-to-r from-primary/90 rounded-full to-secondary/80 text-white border-0 shadow-md'>
                                <CardContent className='p-8 text-center'>
                                    <MapPin className='h-12 w-12 mx-auto mb-4' />
                                    <h3 className='text-xl font-bold mb-2'>Tấm Tắc đã có mặt tại</h3>
                                    <p className='text-2xl mb-2'>
                                        <strong>Nhà Văn hóa Sinh viên TP.HCM</strong>
                                    </p>
                                    <p className='text-white/90 text-xl w-200 mx-auto'>
                                        Điểm pickup hoạt động từ ngày <strong>26/05/2025</strong> – đánh dấu bước khởi đầu trên hành trình
                                        tiếp cận rộng rãi hơn với sinh viên thành phố.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className='py-20 px-4 bg-gradient-to-r from-foreground/70 to-white/50 to-transparent text-white'>
                <div className='container mx-auto max-w-4xl'>
                    <motion.div initial='initial' whileInView='animate' viewport={{ once: true }} variants={staggerContainer}>
                        <motion.div variants={fadeInUp} className='text-center mb-12'>
                            <h2 className='text-3xl font-bold mb-4'>Liên hệ hợp tác & đầu tư</h2>
                            <div className='w-24 h-1 bg-primary mx-auto'></div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Card className='bg-white text-foreground border-0 shadow-xl'>
                                <CardContent className='p-8'>
                                    <div className='text-center mb-8'>
                                        <div className='w-20 h-20 bg-gradient-to-r from-primary to-[#FF8C42] rounded-full flex items-center justify-center mx-auto mb-4'>
                                            <Users className='h-10 w-10 text-white' />
                                        </div>
                                        <h3 className='text-xl font-bold mb-2'>Trần Nguyễn Thảo Nhi</h3>
                                        <p className='text-foreground'>Đại diện liên hệ hợp tác</p>
                                    </div>

                                    <div className='grid md:grid-cols-2 gap-6'>
                                        <div className='flex items-center p-4 bg-background/70 rounded-lg'>
                                            <Mail className='h-6 w-6 text-primary mx-4 mr-7' />
                                            <div>
                                                <p className='font-medium'>Email</p>
                                                <p className='text-foreground'>cskhtamtac@gmail.com</p>
                                            </div>
                                        </div>

                                        <div className='flex items-center p-4 bg-background/70 rounded-lg'>
                                            <Phone className='h-6 w-6 text-primary mx-4 mr-7' />
                                            <div>
                                                <p className='font-medium'>Điện thoại</p>
                                                <p className='text-foreground'>0828 024 246</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='text-center mt-8'>
                                        <Button className='bg-gradient-to-r from-primary/60 to-secondary/80 hover:from-[#B8621A] hover:to-[#E6791A] text-white px-8 py-3'>
                                            Liên hệ ngay
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
