// components/ReviewsSection.tsx
export default function ReviewsSection() {
  const reviews = [
    {
      name: 'Marcus Chen',
      bike: '2023 Ducati Panigale V4',
      rating: 5,
      text: 'The Akrapovic exhaust system completely transformed my bike. The quality is exceptional, the sound is pure perfection, and the power gains are immediately noticeable.',
      verified: true,
      date: '2 weeks ago',
    },
    {
      name: 'Sarah Mitchell',
      bike: '2024 BMW S1000RR',
      rating: 5,
      text: 'Outstanding customer service and technical support. They helped me choose the perfect suspension setup for my riding style. Track times improved significantly.',
      verified: true,
      date: '1 month ago',
    },
    {
      name: 'Alex Rodriguez',
      bike: '2022 Kawasaki ZX-10R',
      rating: 5,
      text: 'Track-proven performance parts that actually deliver. The brake upgrade kit is incredible - shorter stopping distances and better feel. Worth every penny.',
      verified: true,
      date: '3 weeks ago',
    },
  ];

  return (
    <section className="bg-white/[0.02] py-32 px-6 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 mb-6">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white/80 text-xs font-light tracking-[0.3em] uppercase">
              Trusted Worldwide
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Rider Reviews
          </h2>
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
            Join thousands of satisfied riders who trust us with their performance upgrades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-700 group"
            >
              {/* Stars */}
              <div className="flex mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-white/80 font-light leading-relaxed mb-6 group-hover:text-white transition-colors">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Reviewer Info */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold">{review.name}</p>
                  {review.verified && (
                    <div className="flex items-center space-x-1.5 text-green-400 text-xs">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-white/50 text-sm font-light">{review.bike}</p>
                <p className="text-white/30 text-xs mt-1 font-light">{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-white/10">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-black text-white mb-2">4.9</p>
            <p className="text-white/60 text-sm font-light">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-black text-white mb-2">12K+</p>
            <p className="text-white/60 text-sm font-light">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-black text-white mb-2">98%</p>
            <p className="text-white/60 text-sm font-light">Satisfaction</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-black text-white mb-2">50K+</p>
            <p className="text-white/60 text-sm font-light">Happy Riders</p>
          </div>
        </div>
      </div>
    </section>
  );
}
