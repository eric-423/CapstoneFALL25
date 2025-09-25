'use client';

import { changePassword } from '@/apis/user.api';
import InputPassword from '@/components/common/input-password';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks';
import { AUTH_FORM_FIELDS } from '@/utils/constants';
import { setPasswordFormData, setPasswordSchema } from '@/utils/schema';

import { FieldPath, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function PasswordForm() {
  const { user } = useAuth();
  const formFields = [AUTH_FORM_FIELDS.password, AUTH_FORM_FIELDS.confirmPassword];
  const form = useForm<setPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: changePasswordMutate, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: { phoneNumber: string; password: string }) => changePassword(data),
    onSuccess: () => {
      toast.success('Mật khẩu của bạn đã được đổi thành công.');
      form.reset();
    },
    onError: () => {
      toast.error('Không thể đổi mật khẩu. Vui lòng thử lại sau.');
    },
  });

  const onSubmit = (data: setPasswordFormData) => {
    changePasswordMutate({
      phoneNumber: user?.phoneNumber ?? '',
      password: data.password ?? '',
    });
    // Handle password setting logic here
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          {formFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name as FieldPath<setPasswordFormData>}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <InputPassword field={{ ...formField }} placeholder={field.placeholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type='submit'
            variant={'secondary'}
            disabled={isChangingPassword}
            className='w-full py-5 rounded-lg text-base font-medium h-[40px] flex items-center justify-center mt-3 text-foreground'
          >
            {isChangingPassword ? <LoadingSpinner size='sm' /> : 'Đổi mật khẩu'}
          </Button>
        </form>
      </Form>
    </>
  );
}
