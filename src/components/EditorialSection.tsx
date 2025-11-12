// components/EditorialSection.tsx
export default function EditorialSection() {
  const articles = [
    {
      title: 'Ultimate Guide to Exhaust Systems',
      excerpt: 'Everything you need to know about choosing the perfect exhaust for maximum performance and sound',
      readTime: '8 min read',
      category: 'Technical Guide',
    },
    {
      title: 'ECU Tuning 101',
      excerpt: 'Unlock hidden horsepower with proper engine management tuning and custom fuel maps',
      readTime: '12 min read',
      category: 'Performance',
    },
  ];

  return (
    <section className="bg-black py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-6">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-white/80 text-xs font-light tracking-[0.3em] uppercase">
              Knowledge Base
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Performance Insights
          </h2>
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
            Expert guides and technical articles from industry professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article, idx) => (
            <div
              key={idx}
              className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-700 cursor-pointer"
            >
              {/* Image Placeholder */}
              <div className="relative aspect-video bg-linear-to-br from-white/20 to-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute top-6 left-6">
                  <div className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full">
                    {article.category}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-4">
                <div className="flex items-center text-white/40 text-xs uppercase tracking-wider space-x-3">
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>Technical Guide</span>
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight group-hover:text-white/90 transition-colors">
                  {article.title}
                </h3>
                <p className="text-white/60 font-light leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-white group-hover:text-white/90 text-sm font-semibold pt-4 group-hover:translate-x-2 transition-all duration-700">
                  Read Full Guide
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center space-x-3 px-8 py-4 border border-white/20 rounded-xl text-white hover:bg-white/5 hover:border-white/40 transition-all duration-500 group">
            <span className="font-semibold">View All Articles</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
