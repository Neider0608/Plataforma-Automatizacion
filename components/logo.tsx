export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary blur-lg opacity-50"></div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
        >
          <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="url(#gradient)" strokeWidth="2" fill="none" />
          <circle cx="16" cy="16" r="4" fill="url(#gradient)" />
          <defs>
            <linearGradient id="gradient" x1="4" y1="4" x2="28" y2="28">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        AutoFlow AI
      </span>
    </div>
  )
}
