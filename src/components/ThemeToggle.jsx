import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-[9998] hidden md:flex w-10 h-10 rounded-full bg-gradient-to-br from-white/90 to-gray-100/95 dark:from-slate-800/90 dark:to-slate-900/95 border-2 border-primary-400/30 dark:border-primary-400/40 cursor-pointer items-center justify-center transition-all duration-300 shadow-md hover:scale-110 hover:rotate-12 hover:shadow-lg text-gray-700 dark:text-slate-200"
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
