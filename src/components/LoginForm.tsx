"use client";
import React, { useState } from 'react';
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

const FormSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters")
});

type FormValue = z.infer<typeof FormSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit = async (data: FormValue) => {
    if (loading) return; // Prevent duplicate submissions
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        console.log('Login successful, redirecting to dashboard');
        router.push('/Overview');
      } else {
        const response = await res.json();
        setError(response.error || 'Invalid Credentials');
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Error occurred while trying to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <Card className='w-[90%] md:w-1/2'>
        <CardHeader>
          <CardTitle className='text-center text-5xl font-sans py-5'>Admin Panel</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='email' className='text-xl '>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email address'
                  required
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-red-500 text-xs'>{errors.email.message}</p>
                )}
              </div>

              <div className='space-y-1'>
                <Label htmlFor='password' className='text-xl'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  required
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-red-500 text-xs'>{errors.password.message}</p>
                )}
              </div>

              {error && ( // ✅ Fix: Only show error when it exists
                <p className='text-red-500 mt-4 text-xs'>{error}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
