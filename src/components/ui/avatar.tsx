import Image from "next/image";
import { cn, initials } from "@/lib/utils";

export function Avatar({
  name,
  image,
  className,
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-border/80 bg-secondary/10 text-sm font-semibold text-secondary",
        className,
      )}
    >
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
