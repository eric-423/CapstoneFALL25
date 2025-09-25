import { useState } from 'react';
import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

import { Input } from '../ui/input';

interface InputPasswordProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  placeholder: string;
}

const InputPassword = ({ field, placeholder }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className='relative'>
      <Input
        autoComplete='off'
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        {...field}
        className='pr-10'
      />
      {showPassword ? (
        <FaRegEye
          size={16}
          className='absolute top-1/2 right-3 -translate-y-1/2 text-foreground/50 cursor-pointer'
          onClick={handleTogglePassword}
        />
      ) : (
        <FaRegEyeSlash
          size={16}
          className='absolute top-1/2 right-3 -translate-y-1/2 text-foreground/30 cursor-pointer'
          onClick={handleTogglePassword}
        />
      )}
    </div>
  );
};

export default InputPassword;
