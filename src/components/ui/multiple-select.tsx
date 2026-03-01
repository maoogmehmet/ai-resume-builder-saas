'use client';

import {
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import * as React from 'react';

export type TTag = {
  key: string;
  name: string;
};

type MultipleSelectProps = {
  tags: TTag[];
  customTag?: (item: TTag) => ReactNode | string;
  onChange?: (value: TTag[]) => void;
  defaultValue?: TTag[];
};

export const MultipleSelect = ({
  tags,
  customTag,
  onChange,
  defaultValue,
}: MultipleSelectProps) => {
  const [selected, setSelected] = useState<TTag[]>(defaultValue ?? []);
  const containerRef = useRef<HTMLDivElement>(null);

  const onValueChange = useCallback((value: TTag[]) => {
    onChange?.(value);
  }, [onChange]);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollBy({
        left: containerRef.current?.scrollWidth,
        behavior: 'smooth',
      });
    }
    onValueChange(selected);
  }, [selected, onValueChange]);

  const onSelect = (item: TTag) => {
    setSelected((prev) => [...prev, item]);
  };

  const onDeselect = (item: TTag) => {
    setSelected((prev) => prev.filter((i) => i !== item));
  };

  return (
    <AnimatePresence mode={'popLayout'}>
      <div className={'flex w-full flex-col gap-2'}>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Selected</span>
        <motion.div
          layout
          ref={containerRef}
          className='selected no-scrollbar flex min-h-[40px] w-full items-center overflow-x-scroll scroll-smooth rounded-lg border border-white/[0.06] bg-white/[0.02] p-2'
        >
          <motion.div layout className='flex items-center gap-1.5 flex-wrap'>
            {selected?.map((item) => (
              <Tag
                name={item?.key}
                key={item?.key}
                className={'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}
              >
                <div className='flex items-center gap-1.5'>
                  <motion.span layout className={'text-nowrap text-[12px]'}>
                    {item?.name}
                  </motion.span>
                  <button className={'hover:text-red-400 transition-colors'} onClick={() => onDeselect(item)}>
                    <X size={12} />
                  </button>
                </div>
              </Tag>
            ))}
          </motion.div>
        </motion.div>
        {tags?.length > selected?.length && (
          <div className='flex w-full flex-wrap gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2'>
            {tags
              ?.filter((item) => !selected?.some((i) => i.key === item.key))
              .map((item) => (
                <Tag
                  name={item?.key}
                  onClick={() => onSelect(item)}
                  key={item?.key}
                >
                  {customTag ? (
                    customTag(item)
                  ) : (
                    <motion.span layout className={'text-nowrap text-[12px]'}>
                      {item?.name}
                    </motion.span>
                  )}
                </Tag>
              ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

type TagProps = PropsWithChildren &
  Pick<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
    name?: string;
    className?: string;
  };

export const Tag = ({ children, className, name, onClick }: TagProps) => {
  return (
    <motion.div
      layout
      layoutId={name}
      onClick={onClick}
      className={
        `cursor-pointer rounded-md bg-white/[0.06] border border-white/[0.08] px-2 py-1 text-[12px] text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors ${className || ''}`
      }
    >
      {children}
    </motion.div>
  );
};
