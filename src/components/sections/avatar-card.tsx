import Image from "next/image";
import { profile } from "@/lib/profile";
import { cn } from "@/lib/utils";

/** Photo card. Shows a placeholder until `profile.photo` is set (Phase 9). */
export function AvatarCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[340/420] overflow-hidden rounded-[20px] border border-border bg-surface",
        className,
      )}
    >
      {profile.photo ? (
        <Image
          src={profile.photo}
          alt={`Photo of ${profile.name}`}
          fill
          priority
          sizes="(min-width: 1024px) 340px, 90vw"
          className="object-cover"
        />
      ) : (
        <>
          <span className="absolute top-[18px] left-5 font-mono text-[11px] text-muted">PHOTO</span>
          <span
            aria-hidden
            className="absolute top-[28.5%] left-1/2 size-[35%] -translate-x-1/2 rounded-full bg-border"
          />
          <span
            aria-hidden
            className="absolute top-[62%] left-1/2 h-[48%] w-[65%] -translate-x-1/2 rounded-t-[110px] bg-border"
          />
          <span className="sr-only">Photo of {profile.name} (not yet available)</span>
        </>
      )}
    </div>
  );
}
