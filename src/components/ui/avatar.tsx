import Image from "next/image";
import { initials } from "@/lib/utils";

export function Avatar({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  return (
    <div className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-secondary/10 text-sm font-semibold text-secondary">
      {image ? (
        <Image
          src={image}
          alt={name}
          width={40}
          height={40}
          className="size-full rounded-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </div>
  );
}
