export default function LinkItem({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start p-3 rounded-xl no-underline transition-all duration-300 h-20 bg-white/60 dark:bg-white/20 text-gray-700 dark:text-slate-100 gap-3 hover:bg-primary-400/10 dark:hover:bg-white/30 hover:translate-x-1.5 hover:shadow-md"
      style={{ isolation: 'isolate' }}
    >
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        <img
          src={link.icon}
          alt={link.name}
          className="w-8 h-8"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold mb-1 truncate dark:text-slate-50">
          {link.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {link.desc}
        </div>
      </div>
    </a>
  )
}
