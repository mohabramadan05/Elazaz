"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Props = {
  name?: string | null;
  mainImage: string;
  thumbnails: string[];
};

export default function ProductGallery({ name, mainImage, thumbnails }: Props) {
  const galleryImages = useMemo(() => {
    const list = [mainImage, ...thumbnails].filter(Boolean);
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item)) return false;
      seen.add(item);
      return true;
    });
  }, [mainImage, thumbnails]);

  const [activeImage, setActiveImage] = useState(
    galleryImages[0] ?? mainImage,
  );

  const active = activeImage || mainImage;

  return (
    <div className="flex gap-4">
      <div className="hidden sm:flex flex-col gap-3 w-20">
        {galleryImages.map((image) => {
          const isActive = image === active;
          return (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative bg-white border rounded-sm transition ${
                isActive ? "border-[#B47720]" : "border-[#EEEEEE]"
              }`}
            >
              <Image
                src={image}
                alt={name ?? "Thumbnail"}
                width={80}
                height={80}
                className="aspect-square w-full object-cover rounded-sm"
              />
              <span
                className={`pointer-events-none absolute inset-0 rounded-sm bg-[#F2F2F2] transition ${
                  isActive ? "opacity-0" : "opacity-50"
                }`}
              />
            </button>
          );
        })}
      </div>
      <div className="flex-1">
        <Image
          src={active}
          alt={name ?? "Product image"}
          width={520}
          height={520}
          className="aspect-square w-full object-contain"
        />
      </div>
    </div>
  );
}
