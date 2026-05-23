import Image from "next/image";

export default function AuthImage() {
  return (
    <div className="relative hidden overflow-hidden bg-slate-100 lg:block">
      <Image
        src="/splitImg.png"
        alt="Shopping experience"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-slate-950/20" />
    </div>
  );
}
