import { minLength, required } from '@/app/utils/form';
import { Button } from '@/components/ui/elements/Button';
import { InputError } from '@/components/ui/form/InputError';
import { Label } from '@/components/ui/form/Label';
import { Subtitle } from '@/components/ui/typography/Subtitle';
import { Title } from '@/components/ui/typography/Title';
import { AlertType, useAlert, useClearAlerts } from '@/store/alert';
import { AuthRequestInterface } from '@app/v2/dto/auth/request/AuthRequestInterface';
import { $auth } from '@plurali/api-client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthRequestInterface>();
  const alert = useAlert();
  const clearAlerts = useClearAlerts();
  const [submitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: AuthRequestInterface) => {
    clearAlerts();

    const res = await $auth.login(data);

    if (res.success) {
      router.push('/dashboard');
    } else {
      alert(res.error.message, AlertType.Danger);
    }
  };

  return (
    <>
      <div className="mb-5">
        <Title>Login</Title>
        <Subtitle>Login to your Plurali account</Subtitle>
      </div>

      <form className="mb-4 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3.5">
          <Label>Your username or email</Label>

          <input
            className="w-full p-2.5 border rounded-xl border-gray-400 outline-none focus:outline-none"
            placeholder="Your username"
            {...register('username', { required, minLength: minLength(4) })}
          />

          {errors.username && <InputError>{errors.username.message}</InputError>}
        </div>

        <div className="mb-3.5">
          <Label>Your password</Label>

          <input
            className="w-full p-2.5 border rounded-xl border-gray-400 outline-none focus:outline-none"
            placeholder="*************"
            type="password"
            {...register('password', { required, minLength: minLength(4) })}
          />

          {errors.password && <InputError>{errors.password.message}</InputError>}
        </div>

        <Button
          loading={submitting}
          disabled={submitting}
          type="submit"
          className="w-full border border-violet-700 text-violet-700 mb-3.5 inline-flex justify-between items-center"
        >
          <p>Login</p>
        </Button>

        <div className="inline-flex w-full justify-end items-center">
          <Link href="/auth/register" className="text-gray-500">
            Don't have an account yet?
          </Link>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
