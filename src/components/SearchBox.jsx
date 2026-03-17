import { useState, useEffect, useRef } from 'react'

const searchEngines = [
  { id: 'bing', name: '必应', url: 'https://www.bing.com/search?q=', icon: '/assets/icons/必应.svg' },
  { id: 'google', name: '谷歌', url: 'https://www.google.com/search?q=', icon: '/assets/icons/谷歌.svg' },
  { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=', icon: '/assets/icons/百度1.svg' }
]

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [selectedEngine, setSelectedEngine] = useState(searchEngines[0])
  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          formRef.current && !formRef.current.contains(event.target)) {
        setIsEngineDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      window.open(`${selectedEngine.url}${encodeURIComponent(query)}`, '_blank')
    }
  }

  return (
    <div className="flex justify-center mb-5 gap-3">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsEngineDropdownOpen(!isEngineDropdownOpen)}
          className="px-4 py-2 text-sm font-medium rounded-full bg-white dark:bg-white/30 dark:backdrop-blur-md text-gray-700 dark:text-slate-800 flex items-center gap-2 transition-all duration-200 shadow-md border border-gray-200 dark:border-white/40"
        >
          <img src={selectedEngine.icon} alt={selectedEngine.name} className="w-6 h-6" />
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isEngineDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-white/30 dark:backdrop-blur-md rounded-lg shadow-xl border border-gray-200 dark:border-white/40 overflow-hidden z-10">
            {searchEngines.map((engine) => (
              <button
                key={engine.id}
                type="button"
                onClick={() => {
                  setSelectedEngine(engine)
                  setIsEngineDropdownOpen(false)
                }}
                className={`w-full px-4 py-2 text-sm font-medium text-left flex items-center gap-2 transition-all duration-200 ${
                  selectedEngine.id === engine.id
                    ? 'bg-primary-400 text-white'
                    : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                <img src={engine.icon} alt={engine.name} className="w-6 h-6" />
              </button>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={handleSearch} className="flex-1 max-w-[600px] relative flex items-center" ref={formRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索..."
          className="w-full py-2.5 px-5 rounded-3xl text-base shadow-lg transition-all duration-300 bg-white dark:bg-white/30 dark:backdrop-blur-md text-gray-700 dark:text-slate-800 focus:outline-none focus:shadow-xl focus:-translate-y-0.5 placeholder:text-gray-400 dark:placeholder:text-white"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 border-none rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 hover:shadow-lg"
          aria-label="搜索"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </form>
    </div>
  )
}
