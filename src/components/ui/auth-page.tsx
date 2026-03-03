'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
	AppleIcon,
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
				<div className="z-20 mt-auto pb-12">
					<motion.blockquote
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
						className="space-y-6"
					>
						<p className="text-4xl font-black tracking-tighter text-white leading-[0.9]">
							&ldquo;The modern system <br /> that <span className="text-zinc-700 font-normal">redefined</span> my professional career.&rdquo;
						</p>
						<footer className="font-bold text-zinc-600 text-[10px] uppercase tracking-[0.4em] opacity-40">
							— Sofia Davis, Software Engineer
						</footer>
					</motion.blockquote>
				</div>
				<div className="absolute inset-0 z-0 grayscale opacity-40">
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

					<div className="space-y-4">
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
							className="w-full h-14 rounded-2xl bg-white border-2 border-transparent text-black font-bold flex items-center justify-center gap-3 transition-all hover:bg-zinc-100 shadow-xl"
						>
							<GoogleIcon className="size-6" />
							Continue with Google
						</button>
						<button
							onClick={async () => {
								const { createClient } = await import('@/lib/supabase/client');
								const supabase = createClient();
								await supabase.auth.signInWithOAuth({
									provider: 'apple',
									options: {
										redirectTo: `${window.location.origin}/auth/callback`,
									},
								});
							}}
							className="w-full h-14 rounded-2xl bg-white border-2 border-transparent text-black font-bold flex items-center justify-center gap-3 transition-all hover:bg-zinc-100 shadow-xl"
						>
							<AppleIcon className="size-6" />
							Continue with Apple
						</button>
					</div>

					<AuthSeparator />

					<form action={action} className="space-y-6">
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
								className="h-14 rounded-2xl bg-white border-none text-black font-medium placeholder:text-zinc-400 focus:ring-2 focus:ring-white/20 transition-all shadow-lg"
							/>
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between ml-1">
								<Label htmlFor="password" className="text-white font-bold">Password</Label>
								{isSignIn && (
									<Link href="#" className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors">
										Forgot password?
									</Link>
								)}
							</div>
							<Input
								id="password"
								name="password"
								type="password"
								required
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
							<Link href="#" className="underline">Terms of Service</Link>{' '}
							and{' '}
							<Link href="#" className="underline">Privacy Policy</Link>.
						</p>
					)}
				</div>
			</div>
		</main>
	);
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
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
