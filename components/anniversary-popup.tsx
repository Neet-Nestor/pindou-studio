'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Sparkles, Heart } from 'lucide-react';

const FIRST_MET_DATE = '2025-01-31';
const ANNIVERSARY_DATE = '2026-01-31'; // 1st Anniversary

export function AnniversaryPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after a brief delay for dramatic entrance
    const timer = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-2xl border-0 p-0 overflow-hidden bg-transparent shadow-none"
        aria-describedby="anniversary-description"
      >
        <div className="relative">
          {/* Animated background with liquid glass effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-pink-100 to-rose-50 dark:from-pink-950/40 dark:via-rose-950/40 dark:to-pink-900/40" />

          {/* Animated orbs for depth */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#DB2777]/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#CA8A04]/20 rounded-full blur-3xl animate-float-slower" />

          {/* Glass overlay */}
          <div className="absolute inset-0 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-pink-200/50 dark:border-pink-800/30 rounded-2xl shadow-2xl" />

          {/* Content */}
          <div className="relative z-10 p-12">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all duration-200 cursor-pointer group"
              aria-label="关闭"
            >
              <X className="w-5 h-5 text-[#831843] dark:text-pink-300 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Floating sparkles animation */}
            <div className="absolute top-8 left-12 animate-float">
              <Sparkles className="w-6 h-6 text-[#CA8A04] opacity-70" />
            </div>
            <div className="absolute top-16 right-16 animate-float-slower">
              <Sparkles className="w-5 h-5 text-[#F472B6] opacity-60" />
            </div>
            <div className="absolute bottom-16 left-20 animate-float-slow">
              <Heart className="w-5 h-5 text-[#DB2777] opacity-50" />
            </div>

            {/* Main content */}
            <div className="text-center space-y-6 py-8">
              {/* Icon header with pulse animation */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#DB2777] to-[#CA8A04] rounded-full blur-xl opacity-50 animate-pulse-slow" />
                <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#DB2777] to-[#F472B6] flex items-center justify-center shadow-lg">
                  <Heart className="w-10 h-10 text-white fill-white animate-heartbeat" />
                </div>
              </div>

              {/* Heading with gradient text */}
              <h2
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#DB2777] via-[#F472B6] to-[#CA8A04] bg-clip-text text-transparent"
                style={{ fontFamily: "'Noto Serif JP', serif" }}
              >
                一周年纪念
              </h2>

              {/* Subtitle */}
              <p
                id="anniversary-description"
                className="text-lg text-[#831843] dark:text-pink-200 max-w-md mx-auto leading-relaxed"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                今天是与
                <span className="inline-flex items-center gap-2 mx-2">
                  <span className="font-semibold text-[#DB2777] dark:text-pink-400 px-3 py-1 bg-pink-100/50 dark:bg-pink-900/30 rounded-full backdrop-blur-sm border border-pink-200/50 dark:border-pink-700/50">
                    ccliu
                  </span>
                </span>
                相识的
                <br />
                <span className="text-2xl font-semibold text-[#DB2777] dark:text-pink-400 mt-2 inline-block">
                  一周年纪念日
                </span>
              </p>

              {/* Date badge */}
              <div className="inline-flex flex-col items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-100/80 to-rose-100/80 dark:from-pink-900/40 dark:to-rose-900/40 rounded-2xl backdrop-blur-sm border border-pink-200/60 dark:border-pink-700/40 shadow-inner">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#CA8A04]" />
                  <time
                    className="text-sm font-medium text-[#831843] dark:text-pink-200"
                    dateTime={FIRST_MET_DATE}
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {FIRST_MET_DATE}
                  </time>
                  <span className="text-[#831843]/60 dark:text-pink-300/60">→</span>
                  <time
                    className="text-sm font-medium text-[#831843] dark:text-pink-200"
                    dateTime={ANNIVERSARY_DATE}
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {ANNIVERSARY_DATE}
                  </time>
                  <Sparkles className="w-4 h-4 text-[#CA8A04]" />
                </div>
                <span className="text-xs text-[#831843]/70 dark:text-pink-300/70 font-medium">
                  365天的美好时光
                </span>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#F472B6] to-transparent" />
                <Heart className="w-4 h-4 text-[#DB2777] fill-[#DB2777]" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#F472B6] to-transparent" />
              </div>

              {/* Message */}
              <div className="space-y-3 max-w-lg mx-auto">
                <p
                  className="text-base text-[#831843]/80 dark:text-pink-300/80 italic"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  感谢这一年来所有的陪伴与温暖
                  <br />
                  期待未来更多的美好瞬间
                </p>

                {/* Dedication message */}
                <div className="pt-4 px-6 py-4 bg-gradient-to-br from-pink-50/60 to-rose-50/60 dark:from-pink-950/30 dark:to-rose-950/30 rounded-xl border border-pink-200/40 dark:border-pink-800/30 backdrop-blur-sm">
                  <p
                    className="text-sm text-[#831843] dark:text-pink-200 leading-relaxed"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    这个网站是为你而建 💝
                    <br />
                    <span className="text-xs text-[#831843]/70 dark:text-pink-300/70 mt-1 inline-block">
                      看到你最近如此热爱这项手工艺，希望这个小站能让你的创作之旅更加便捷美好
                    </span>
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleClose}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#DB2777] to-[#CA8A04] text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#CA8A04] to-[#DB2777] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  继续探索
                  <Sparkles className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
