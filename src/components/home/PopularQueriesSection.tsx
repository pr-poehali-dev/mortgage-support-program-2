import TagCloud from '@/components/TagCloud';

export default function PopularQueriesSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Популярные запросы
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Быстрый доступ к самым востребованным услугам и информации по недвижимости, ипотеке и банковским сервисам в Севастополе
          </p>
        </div>
        
        <TagCloud />
      </div>
    </section>
  );
}
