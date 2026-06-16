export default function Banner() {
  return (
    <section className="container mx-auto relative mt-4 h-[520px] w-full overflow-hidden rounded-lg border-2 border-border bg-card">
      <img
        src="/banner.png"
        alt="Makeup raw materials"
        className="h-full w-full object-cover object-center"
      />
    </section>
  );
}
