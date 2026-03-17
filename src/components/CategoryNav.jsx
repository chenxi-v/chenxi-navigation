export default function CategoryNav({ categories, activeCategory, onCategoryClick }) {
  return (
    <nav className="flex justify-center flex-wrap gap-3 mb-6 py-2.5">
      {categories.map((category) => (
        <a
          key={category.id}
          href={`#${category.id}`}
          onClick={(e) => {
            e.preventDefault()
            onCategoryClick(category.id)
            document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-md flex items-center gap-1.5 ${
            activeCategory === category.id
              ? 'bg-gradient-to-br from-primary-400 to-primary-500 text-white -translate-y-0.5 shadow-lg'
              : 'bg-white/95 dark:bg-white/20 dark:backdrop-blur-sm border border-black/10 dark:border-white/10 text-gray-700 dark:text-slate-100 hover:bg-primary-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </a>
      ))}
    </nav>
  )
}
