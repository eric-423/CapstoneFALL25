import { sendOTP, signIn, signUp, verifyOTP } from '@/apis/user.api';
import bannerImage from '@/assets/images/Home - Banner.jpg';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useScrollTop from '@/hooks/useScrollTop';
import { setAccessToken, setRefreshToken } from '@/utils/cookies';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import JwtDecode from '@/utils/jwtDecode';

import { FORM_CONTENTS, FORM_RESOLVERS, SET_FORM_FIELDS } from './components/form-contents';
import FormItems from './components/form-items';
import { AuthFormValues } from './schema';

import { useMutation } from '@tanstack/react-query';
import { AuthResponse } from '@/types/auth.type';

type FormStep = 'phone' | 'login' | 'otp' | 'setPassword';

const Login = () => {
  useDocumentTitle('Tấm Tắc | Đăng nhập');
  const [formStep, setFormStep] = useState<FormStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessTokenTemp, setAccessTokenTemp] = useState('');
  const [isCreatingPassword, setIsCreatingPassword] = useState(false);
  const formFields = SET_FORM_FIELDS[formStep];
  const formContents = FORM_CONTENTS[formStep];
  useScrollTop();
  const form = useForm<AuthFormValues, any, AuthFormValues>({
    resolver: FORM_RESOLVERS[formStep],
    defaultValues: {
      phoneNumber: '',
      password: '',
      otp: '',
    },
    mode: 'onChange',
  });
  const { mutate: signUpMutate, isPending: isSigningUp } = useMutation({
    mutationFn: (phoneNumber: string) => signUp(phoneNumber),
    onSuccess: () => {
      sendOTPMutate(phoneNumber);
    },
    onError: (error: AxiosError) => {
      if (error.response?.data === 'Account is not verified yet') sendOTPMutate(phoneNumber);
      else setFormStep('login');
    },
  });

  const { mutate: sendOTPMutate, isPending: isSendingOTP } = useMutation({
    mutationFn: (phoneNumber: string) => sendOTP(phoneNumber),
    onSuccess: () => {
      setFormStep('otp');
    },
    onError: () => {
      toast.error('Gửi mã xác thực thất bại, xin vui lòng thử lại sau');
      setFormStep('phone');
    },
  });

  const { mutate: verifyOTPMutate, isPending: isVerifyingOTP } = useMutation({
    mutationFn: (data: { phoneNumber: string; otp: string }) => verifyOTP(data.phoneNumber, data.otp),
    onSuccess: (response) => {
      if (response.data.access_token) {
        setAccessTokenTemp(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
      }
      setFormStep('setPassword');
    },
    onError: (error) => {
      console.error('Error verifying OTP:', error);
      toast.error('Mã xác thực không đúng. Vui lòng thử lại.');
    },
  });

  const { mutate: signInMutate, isPending: isSigningIn } = useMutation({
    mutationFn: (data: { phoneNumber: string; password: string }) => signIn(data),
    onSuccess: (response: AuthResponse, _variables: { phoneNumber: string; password: string }, _context: unknown) => {
      toast.success('Đăng nhập thành công!');
      // Giải mã token và chuyển hướng theo role
      const token = response?.data?.access_token;
      const refreshToken = response?.data?.refresh_token;
      if (token) {
        const decoded = JwtDecode(token);
        const role = decoded.role ? decoded.role.toUpperCase() : '';
        if (role === 'MANAGER' || role === 'ADMIN') {
          localStorage.setItem('access_token', token);
        } else {
          setAccessToken(token);
          setRefreshToken(refreshToken);
        }
        if (role === 'MANAGER') {
          window.location.href = '/manager/dashboard';
        } else if (role === 'ADMIN') {
          window.location.href = '/admin/users';
        }
      }
    },
    onError: (_error: unknown) => {
      toast.error('Sai mật khẩu. Vui lòng thử lại.');
    },
  });

  const handlePasswordSubmit = async (pass: string) => {
    setIsCreatingPassword(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/customer/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenTemp}`,
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          password: pass,
        }),
      });
      if (response.ok) {
        setIsCreatingPassword(false);
        setAccessToken(accessTokenTemp);
        toast.success('Chào mừng bạn đến với Tấm Tắc!');
      }
    } catch (error) {
      setFormStep('phone');
      console.error('Error creating password:', error);
      toast.error('Không thể tạo mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsCreatingPassword(false);
    }
  };

  const isLoading = isSendingOTP || isVerifyingOTP || isSigningIn || isSigningUp || isCreatingPassword;

  const onSubmit = (data: AuthFormValues) => {
    if (formStep === 'phone') {
      // Save phone number for use in other steps
      setPhoneNumber(data.phoneNumber);
      // Check if user exists
      signUpMutate(data.phoneNumber);
    } else if (formStep === 'login') {
      // Try to login user
      signInMutate({
        phoneNumber: data.phoneNumber || phoneNumber,
        password: data.password ?? '',
      });
    } else if (formStep === 'otp') {
      // Verify OTP
      verifyOTPMutate({
        phoneNumber: phoneNumber,
        otp: data.otp ?? '',
      });
    } else if (formStep === 'setPassword') {
      // Create password for user
      handlePasswordSubmit(data.password ?? '');
    }
  };

  useEffect(() => {
    if (formStep === 'phone') {
      form.reset({ phoneNumber: '', password: '', otp: '' });
    } else if (formStep === 'login') {
      form.setValue('phoneNumber', phoneNumber);
      form.setValue('password', '');
    } else if (formStep === 'otp') {
      form.setValue('otp', '');
    }
  }, [formStep, form, phoneNumber]);

  return (
    <div className='min-h-screen w-full'>
      <div className='flex min-h-screen'>
        {/* Image Section */}
        <div className='hidden md:block md:w-2/3 relative overflow-hidden'>
          <img
            src={bannerImage || '/placeholder.svg'}
            alt='Cơm tấm banner'
            className='w-full h-full object-cover brightness-[0.8]'
          />
        </div>

        {/* Form Section */}
        {isLoading ? (
          <div className='flex items-center justify-center w-full h-screen md:w-1/2'>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className='w-full md:w-1/2 bg-background flex items-center justify-center p-8'>
              <div className='w-full max-w-[500px] px-2 md:px-4'>
                <div className='flex justify-between items-center mb-0'>
                  <h1 className='font-bold text-2xl md:text-3xl'>
                    <span className='text-primary'>Tấm</span> ngon, <span className='text-secondary'>Tắc</span> nhớ!
                  </h1>
                </div>
                <p className='mb-6 text-foreground'>{formContents.description}</p>

                {/* Form */}
                <Form {...form}>
                  <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormItems form={form} formFields={formFields} />

                    <Button
                      type='submit'
                      className='w-full py-4 bg-primary text-primary-foreground border-none rounded-lg text-lg font-medium h-[60px] flex items-center justify-center hover:opacity-90 transition-opacity'
                    >
                      {formStep === 'phone'
                        ? 'Tiếp tục'
                        : formStep === 'login'
                          ? 'Đăng nhập'
                          : formStep === 'otp'
                            ? 'Xác thực OTP'
                            : 'Tạo mật khẩu'}
                    </Button>

                    {/* <div className='relative flex items-center py-4'>
                      <div className='flex-grow border-t border-border'></div>
                      <span className='flex-shrink mx-4 text-muted-foreground'>Bạn là người nhà của Tấm Tắc?</span>
                      <div className='flex-grow border-t border-border'></div>
                    </div> */}
                  </form>

                  {formStep === 'phone' && (
                    <Button
                      type='button'
                      variant={'link'}
                      className='w-full py-8 hover:cursor-pointer'
                      onClick={() => (window.location.href = '/')}
                    >
                      Về trang chủ
                    </Button>
                  )}
                </Form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
