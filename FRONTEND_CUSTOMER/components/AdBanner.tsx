import Image from "next/image";

interface AdBannerProps {
  imageUrl: string;
  alt: string;
}

export default function AdBanner({ imageUrl, alt }: AdBannerProps) {
  return (
    <div className="relative w-full aspect-[195/100] max-h-[420px] bg-gray-100">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
    </div>
  );
}