export default function Banner() {
  return (
    <section className="mt-4 border-2 rounded-lg container mx-auto relative overflow-hidden w-full h-[520px]">
      <img
        src="/banner.png"
        alt="Makeup raw materials"
        className="w-full h-full object-cover object-center"
      />
      {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/25" />
      <div className="absolute inset-0 flex flex-col justify-center px-16">
        <p className="text-xs tracking-[.2em] uppercase text-white/70 mb-4">
          Ladies Makeup Raw Materials
        </p>
        <h1 className="text-5xl font-bold text-white leading-tight max-w-lg mb-3">
          Pure Ingredients for Your Best Formula
        </h1>
        <p className="text-white/80 text-base mb-9 max-w-md leading-relaxed">
          Pigments, waxes, bases & more — wholesale quality delivered to your door.
        </p>
        <div className="flex gap-4 flex-wrap">
          <button className="bg-white text-black font-semibold text-sm px-8 py-4 hover:opacity-90 transition">
            Shop Now
          </button>
          <button className="border-2 border-white/60 hover:border-white text-white font-semibold text-sm px-8 py-[13px] transition">
            View Catalogue
          </button>
        </div>
      </div> */}
    </section>
  );
}