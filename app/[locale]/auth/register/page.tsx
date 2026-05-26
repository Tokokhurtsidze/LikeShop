'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/lib/validations/user'
import { registerUser } from '@/actions/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const ka = locale === 'ka'
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    setServerError('')
    const result = await registerUser(data)
    if (!result.success) {
      setServerError(result.error ?? 'Registration failed')
      return
    }
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    router.push(`/${locale}/dashboard`)
    router.refresh()
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            {ka ? 'ანგარიშის შექმნა' : 'Create Account'}
          </h1>

          {serverError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label={ka ? 'სახელი და გვარი' : 'Full Name'}
              type="text"
              id="name"
              autoComplete="name"
              placeholder={ka ? 'გიორგი მაისურაძე' : 'John Smith'}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label={ka ? 'ელ-ფოსტა' : 'Email Address'}
              type="email"
              id="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={ka ? 'პაროლი' : 'Password'}
              type="password"
              id="password"
              autoComplete="new-password"
              placeholder={ka ? 'მინ. 8 სიმბოლო' : 'Min. 8 characters'}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label={ka ? 'ტელეფონი (სურვილისამებრ)' : 'Phone (optional)'}
              type="tel"
              id="phone"
              autoComplete="tel"
              placeholder="+995 555 000 000"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-2">
              {ka ? 'რეგისტრაცია' : 'Create Account'}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">{ka ? 'ან' : 'or'}</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: `/${locale}/dashboard` })}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {ka ? 'Google-ით რეგისტრაცია' : 'Sign up with Google'}
          </Button>

          <p className="mt-5 text-center text-sm text-gray-600">
            {ka ? 'უკვე გაქვს ანგარიში?' : 'Already have an account?'}{' '}
            <Link
              href={`/${locale}/auth/login`}
              className="font-medium text-blue-600 hover:underline"
            >
              {ka ? 'შედი' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
