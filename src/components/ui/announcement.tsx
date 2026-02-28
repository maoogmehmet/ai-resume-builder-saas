import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AnnouncementProps {
  title: string
  description: string
  href?: string
  onClose?: () => void
}

export function Announcement({
  title,
  description,
  href,
  onClose,
}: AnnouncementProps) {
  const contentNode = (
    <section className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-black p-3 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-2xl shadow-black/50">
      <span className="flex items-center justify-between text-zinc-500">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-100">{title}</h5>
        {onClose && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onClose}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-xs hover:bg-white/5 focus-visible:outline-none"
                >
                  <span className="text-lg text-zinc-500 hover:text-white">×</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-900 border-white/10 text-white">
                <p>Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </span>
      <p className="text-sm text-zinc-400 font-medium leading-snug">{description}</p>
    </section>
  )

  return (
    <div className="collapsed:hidden relative w-full">
      <div className="absolute inset-x-0 -top-8 z-10 h-8 w-full from-background to-transparent bg-gradient-to-t" />
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="relative z-20 block h-fit w-full p-2 pt-0"
        >
          {contentNode}
        </a>
      ) : (
        <div className="relative z-20 block h-fit w-full p-2 pt-0">
          {contentNode}
        </div>
      )}
    </div>
  )
}
