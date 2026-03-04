import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RotateCcw, Copy, LinkIcon, CheckIcon, Sparkles, Globe, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button';

const LinkShortenerWidget = () => {
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = useCallback((url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  // Simulates an API call to a link shortening service
  const simulateShortenLink = useCallback(async (link: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const uniqueCode = Math.random().toString(36).substring(2, 8);
        resolve(`https://novatypal.cv/${uniqueCode}`); // Dummy short URL
      }, 1500); // Simulate network delay
    });
  }, []);

  const handleShorten = async () => {
    setError(null);
    setIsCopied(false);
    setShortLink(''); // Clear previous short link

    if (!longLink.trim()) {
      setError('Please enter a link to shorten.');
      return;
    }

    if (!isValidUrl(longLink)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    setIsLoading(true);
    try {
      const generatedShortLink = await simulateShortenLink(longLink);
      setShortLink(generatedShortLink);
      toast.success('Protocol Executed!', {
        description: 'Your career node link has been successfully synthesized.',
      });
    } catch (err) {
      setError('Failed to shorten link. Please try again.');
      toast.error('Error', {
        description: 'Failed to shorten link. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortLink) {
      try {
        await navigator.clipboard.writeText(shortLink);
        setIsCopied(true);
        toast.success('Copied!', {
          description: 'Short link copied to clipboard.',
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy short link: ', err);
        toast.error('Copy Failed', {
          description: 'Could not copy link to clipboard.',
        });
      }
    }
  };

  const handleRestart = () => {
    setLongLink('');
    setShortLink('');
    setIsCopied(false);
    setError(null);
  };

  // Framer Motion Variants for animations
  const cardVariants: any = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const resultVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="max-w-md w-full mx-auto p-4"
    >
      <Card className="rounded-[2.5rem] border border-white/5 bg-black/40 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden p-2">
        <CardHeader className="pb-8 pt-10 px-8">
          <CardTitle className="text-2xl font-black flex items-center gap-4 text-white italic lowercase tracking-tighter">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
              <Link2 className="h-6 w-6 text-white opacity-40" />
            </div>
            node synthesizer
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="long-link" className="text-zinc-600 font-black italic lowercase tracking-tight opacity-60">
                target professional URL
              </Label>
              <Input
                id="long-link"
                type="url"
                placeholder="https://linkedin.com/in/architect..."
                value={longLink}
                onChange={(e) => {
                  setLongLink(e.target.value);
                  setError(null);
                }}
                className="h-14 rounded-2xl bg-white/[0.02] border border-white/5 focus:border-white/10 transition-all font-black text-white italic lowercase placeholder:text-zinc-800"
                disabled={isLoading}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    className="text-red-500/60 font-black italic lowercase text-[10px] tracking-widest mt-2 uppercase"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <AnimatedGenerateButton
              onClick={handleShorten}
              labelIdle="Shorten Protocol"
              labelActive="Synthesizing..."
              generating={isLoading}
              disabled={isLoading || !longLink.trim()}
              className="w-full h-14 rounded-2xl font-black italic lowercase shadow-2xl"
            />

            <AnimatePresence>
              {shortLink && (
                <motion.div
                  variants={resultVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6 pt-8 border-t border-white/5"
                >
                  <div className="space-y-3">
                    <Label htmlFor="short-link" className="text-zinc-600 font-black italic lowercase tracking-tight opacity-60">
                      architected node link
                    </Label>
                    <div className="relative group">
                      <Input
                        id="short-link"
                        type="text"
                        value={shortLink}
                        readOnly
                        className="h-14 pr-16 bg-white/[0.05] border-white/10 rounded-2xl font-black italic text-white lowercase select-text cursor-text"
                      />
                      <button
                        className="absolute right-3 top-3 h-8 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        onClick={handleCopy}
                        aria-label="Copy short link"
                      >
                        {isCopied ? (
                          <CheckIcon className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-zinc-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="w-full h-12 flex items-center justify-center gap-3 text-zinc-700 hover:text-white font-black italic lowercase transition-colors text-sm border border-white/5 rounded-2xl"
                  >
                    <RotateCcw className="h-4 w-4" /> initiate new protocol
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LinkShortenerWidget;
