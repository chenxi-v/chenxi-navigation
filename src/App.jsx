import { useState } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import SearchBox from './components/SearchBox'
import CategoryNav from './components/CategoryNav'
import CategoryCard from './components/CategoryCard'
import WeatherWidget from './components/WeatherWidget'
import BackToTop from './components/BackToTop'
import navData from '../nav-data.json'

function AppContent() {
  const { isDark } = useTheme()
  const [activeCategory, setActiveCategory] = useState('')

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed bg-white dark:bg-slate-900 transition-all duration-500"
      style={{ 
        backgroundImage: isDark 
          ? 'url(/assets/backgrounds/kumtanom-dark.png)' 
          : 'url(/assets/backgrounds/kumtanom.jpg)'
      }}
    >
      <div className="fixed inset-0 bg-black/0 dark:bg-black/20 transition-all duration-300 pointer-events-none" />
      
      <WeatherWidget />
      <ThemeToggle />
      
      <div className="relative z-10 max-w-[1200px] mx-auto pt-16">
        <header className="text-center text-white mb-5 p-5">
          <h1 className="text-3xl mb-2.5 drop-shadow-md">晨曦导航</h1>
        </header>

        <SearchBox />
        <CategoryNav 
          categories={navData.categories} 
          activeCategory={activeCategory}
          onCategoryClick={setActiveCategory}
        />

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 px-4">
          {navData.categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </main>

        <footer className="text-center text-black dark:text-slate-200 py-5 text-sm opacity-80">
          <p>© 2026 晨曦导航 - 极简灵动风格</p>
        </footer>
      </div>

      <BackToTop />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
