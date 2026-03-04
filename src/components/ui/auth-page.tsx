'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
	ChevronLeftIcon,
} from 'lucide-react';
import { Logo } from './logo';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { ShaderAnimation } from './shader-animation';
import AnimatedGenerateButton from './animated-generate-button';

interface AuthPageProps {
	type: 'signin' | 'signup';
	action: (formData: FormData) => Promise<any> | void;
	error?: string;
	message?: string;
}

export function AuthPage({ type, action, error, message }: AuthPageProps) {
	const isSignIn = type === 'signin';

	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-black">
			<div className="bg-black relative hidden h-full flex-col border-r border-white/5 p-12 lg:flex overflow-hidden">
				<div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
				<div className="z-20 flex items-center gap-4">
					<div className="h-12 w-12 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-3xl">
						<Logo className="h-6 w-6 text-white" />
					</div>
					<p className="text-2xl font-black tracking-tighter text-white">Novatypalcv</p>
				</div>
				<div className="z-20 flex-1 flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
						className="text-center space-y-6 px-8"
					>
						<p className="text-5xl font-black tracking-tighter text-white leading-[0.9] italic lowercase">
							Your career,<br /><span className="text-zinc-500 font-normal">elevated.</span>
						</p>
						<p className="text-zinc-600 text-sm font-black italic lowercase tracking-wide opacity-60 max-w-xs mx-auto">
							AI-crafted resumes that get you noticed by the right people.
						</p>
					</motion.div>
				</div>
				<div className="absolute inset-0 z-0">
					<ShaderAnimation />
				</div>
			</div>
			<div className="relative flex min-h-screen flex-col justify-center p-8 md:p-12 lg:p-16">
				<div
					aria-hidden
					className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
				>
					<div className="bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_70%)] absolute top-0 right-0 h-full w-full" />
				</div>

				<div className="absolute top-10 left-8 md:left-12">
					<AnimatedGenerateButton
						href="/"
						labelIdle="Return Home"
						size="sm"
						className="bg-transparent border-none text-zinc-600 hover:text-white px-0 h-auto font-black italic lowercase tracking-tight shadow-none"
						icon={<ChevronLeftIcon className="h-4 w-4" />}
					/>
				</div>

				<div className="mx-auto space-y-12 sm:w-[450px] relative z-10 px-6">
					<div className="flex flex-col space-y-2">
						<h1 className="text-5xl font-black text-white leading-tight">
							{isSignIn ? 'Welcome back' : 'Create an account'}
						</h1>
						<p className="text-zinc-500 font-medium text-lg">
							{isSignIn ? 'Enter your credentials to access your dashboard.' : 'Enter your details below to create your account.'}
						</p>
					</div>

					<div className="space-y-3">
						{/* Google Button - Official Google Design */}
						<button
							onClick={async () => {
								const { createClient } = await import('@/lib/supabase/client');
								const supabase = createClient();
								await supabase.auth.signInWithOAuth({
									provider: 'google',
									options: {
										redirectTo: `${window.location.origin}/auth/callback`,
									},
								});
							}}
							className="w-full h-12 rounded-full bg-white border border-[#dadce0] text-[#3c4043] text-sm font-medium flex items-center justify-center gap-3 transition-all hover:bg-[#f8f9fa] hover:shadow-md shadow-sm"
						>
							<GoogleIcon className="size-5" />
							Continue with Google
						</button>
					</div>

					<AuthSeparator />

					<form action={action} className="space-y-6" autoComplete="off">
						{!isSignIn && (
							<div className="space-y-3">
								<Label htmlFor="fullName" className="text-white font-bold ml-1">Full Name</Label>
								<Input
									id="fullName"
									name="fullName"
									placeholder="John Doe"
									required
									className="h-14 rounded-2xl bg-white border-none text-black font-medium placeholder:text-zinc-400 focus:ring-2 focus:ring-white/20 transition-all shadow-lg"
								/>
							</div>
						)}
						<div className="space-y-3">
							<Label htmlFor="email" className="text-white font-bold ml-1">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="name@example.com"
								required
								autoComplete="email"
								defaultValue=""
								className="h-14 rounded-2xl bg-white border-none text-black font-medium placeholder:text-zinc-400 focus:ring-2 focus:ring-white/20 transition-all shadow-lg"
							/>
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between ml-1">
								<Label htmlFor="password" className="text-white font-bold">Password</Label>
								{isSignIn && (
									<Link href="/auth/reset-password" className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors">
										Forgot password?
									</Link>
								)}
							</div>
							<Input
								id="password"
								name="password"
								type="password"
								required
								autoComplete="current-password"
								defaultValue=""
								className="h-14 rounded-2xl bg-white border-none text-black font-medium focus:ring-2 focus:ring-white/20 transition-all shadow-lg"
							/>
						</div>

						{!isSignIn && (
							<div className="space-y-3">
								<Label htmlFor="confirmPassword" className="text-white font-bold ml-1">Confirm Password</Label>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									required
									className="h-14 rounded-2xl bg-white border-none text-black font-medium focus:ring-2 focus:ring-white/20 transition-all shadow-lg"
								/>
							</div>
						)}

						{error && (
							<div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold">
								{error}
							</div>
						)}
						{message && (
							<div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl text-sm font-bold">
								{message}
							</div>
						)}

						<button
							type="submit"
							className="w-full h-14 rounded-2xl bg-[#111111] text-white font-bold transition-all hover:bg-zinc-800 shadow-2xl mt-4"
						>
							{isSignIn ? 'Sign In' : 'Create Account'}
						</button>
					</form>

					<div className="text-center pt-8 border-t border-white/10">
						<p className="text-zinc-500 font-medium">
							{isSignIn ? "Don't have an account? " : "Already have an account? "}
							<Link href={isSignIn ? "/auth/signup" : "/auth/signin"} className="text-blue-600 font-bold hover:text-blue-500">
								{isSignIn ? "Sign up today" : "Sign in"}
							</Link>
						</p>
					</div>

					{!isSignIn && (
						<p className="text-zinc-600 font-medium text-center text-xs px-8">
							By clicking create account, you agree to our{' '}
							<Link href="/terms" className="underline">Terms of Service</Link>{' '}
							and{' '}
							<Link href="/privacy" className="underline">Privacy Policy</Link>.
						</p>
					)}
				</div>
			</div>
		</main>
	);
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
		<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
		<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
		<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
		<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
	</svg>
);

const AuthSeparator = () => {
	return (
		<div className="flex w-full items-center justify-center py-6">
			<div className="bg-white/5 h-px w-full" />
			<span className="text-zinc-800 font-black px-4 text-[10px] italic tracking-[0.4em] uppercase opacity-40">OR</span>
			<div className="bg-white/5 h-px w-full" />
		</div>
	);
};
