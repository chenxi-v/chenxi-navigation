import LinkItem from './LinkItem'

export default function CategoryCard({ category }) {
  return (
    <section
      id={category.id}
      className="bg-white/70 dark:bg-white/10 rounded-2xl p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl scroll-mt-28 border border-black/5 dark:border-white/20"
    >
      <h2 className="text-gray-700 dark:text-slate-200 mb-4 text-xl font-semibold flex items-center gap-2.5">
        <span>{category.icon}</span>
        <span>{category.name}</span>
      </h2>
      <div className="h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent mb-4 opacity-80 dark:opacity-60"></div>
      <div className="flex flex-col gap-2.5">
        {category.links.map((link, index) => (
          <LinkItem key={index} link={link} />
        ))}
      </div>
    </section>
  )
}
