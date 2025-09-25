import { changePassword } from '@/apis/user.api';
import InputPassword from '@/components/common/input-password';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import configs from '@/configs';
import { useAuth } from '@/hooks';
import { FORM_CONTENTS, SET_FORM_FIELDS } from '@/pages/Login/components/form-contents';
import { removeCookie } from '@/utils/cookies';
import { setPasswordFormData, setPasswordSchema } from '@/utils/schema';

import { useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';

interface SetPasswordDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SetPasswordDialog = ({ open, onOpenChange }: SetPasswordDialogProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const { user } = useAuth();
  const formContents = FORM_CONTENTS['setPassword'];
  const formFields = SET_FORM_FIELDS['setPassword'];
  const form = useForm<setPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: createPasswordMutate, isPending: isCreatingPassword } = useMutation({
    mutationFn: (data: { phoneNumber: string; password: string }) => changePassword(data),
    onSuccess: () => {
      toast.success('Mật khẩu của bạn đã được tạo thành công.');
      removeCookie(configs.cookies.isNew);
      setIsOpen(false);
    },
    onError: () => {
      toast.error('Không thể tạo mật khẩu. Vui lòng thử lại sau.');
    },
  });

  const onSubmit = (data: setPasswordFormData) => {
    createPasswordMutate({
      phoneNumber: user?.phoneNumber ?? '',
      password: data.password ?? '',
    });
    // Handle password setting logic here
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {isCreatingPassword ? (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : (
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className='max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg '
          >
            <div className='flex flex-col items-center '>
              <DialogTitle className='text-lg font-semibold mb-2'>Đặt mật khẩu</DialogTitle>
              <p className='mb-0 text-foreground'>{formContents.description}</p>
            </div>
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
                  className='w-full py-4 bg-primary text-primary-foreground border-none rounded-lg text-lg font-medium h-[60px] flex items-center justify-center hover:opacity-90 transition-opacity'
                >
                  Đặt mật khẩu
                </Button>
              </form>
            </Form>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default SetPasswordDialog;
