export default function DailyHeroImage() {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
        <img 
          src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=2400&h=800&dpr=2"
          alt="Крымские горы и побережье"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
          <div className="w-full px-4 sm:px-6 md:px-8 pb-6 sm:pb-10 md:pb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg mb-2 sm:mb-3 leading-tight">
              Крым — жемчужина у моря
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 drop-shadow-md max-w-2xl leading-snug">
              Льготные ипотечные программы с господдержкой от 3%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}