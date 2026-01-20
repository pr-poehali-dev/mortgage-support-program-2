export default function DailyHeroImage() {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
        <img 
          src="https://i.imgur.com/LxyQAtM.jpeg"
          alt="Ипотека в Крыму"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}