"use client";

import { useRef, useState } from "react";
import { Play, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { profile } from "@/lib/profile";
import { formatTime, statusLabels, statusPillTone, type Project } from "@/lib/project-types";
import { cn } from "@/lib/utils";

type DemoProject = Pick<
  Project,
  "slug" | "title" | "status" | "statusNote" | "demo" | "links" | "category"
>;

/**
 * "Watch demo" button + modal. The Radix dialog automatically returns focus
 * to the trigger button when closed (Esc / outside click / ✕ button).
 */
export function DemoDialog({
  project,
  children,
}: {
  project: DemoProject;
  /** Trigger element (rendered with asChild) */
  children: React.ReactElement;
}) {
  // (13) Modal "grows" from the trigger button's position
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setOrigin({
            x: rect.left + rect.width / 2 - window.innerWidth / 2,
            y: rect.top + rect.height / 2 - window.innerHeight / 2,
          });
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        style={
          {
            "--tw-enter-translate-x": `${origin.x}px`,
            "--tw-enter-translate-y": `${origin.y}px`,
            "--tw-enter-scale": "0.15",
            "--tw-exit-translate-x": `${origin.x}px`,
            "--tw-exit-translate-y": `${origin.y}px`,
            "--tw-exit-scale": "0.15",
          } as React.CSSProperties
        }
        className="max-h-[calc(100dvh-2rem)] gap-0 duration-300 ease-[cubic-bezier(.2,.8,.2,1)] data-closed:duration-200 overflow-y-auto rounded-[20px] bg-bg p-0 ring-0 sm:max-w-[920px] md:min-h-[640px] md:grid-cols-[400px_1fr] md:overflow-hidden"
      >
        <DemoBody project={project} />
        <DialogClose asChild>
          <button
            type="button"
            className="absolute top-5 right-5 z-10 grid size-8 place-items-center rounded-full bg-surface text-fg transition-colors hover:bg-border"
          >
            <X className="size-3.5" aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function DemoBody({ project }: { project: DemoProject }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chapters = project.demo?.chapters ?? [];
  const [videoFailed, setVideoFailed] = useState(!project.demo?.video);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selected, setSelected] = useState(0);

  // Active chapter follows the video position; without a video, the last selection.
  const active = videoFailed
    ? selected
    : Math.max(
        0,
        chapters.findLastIndex((c) => c.at <= time),
      );

  function jumpTo(index: number) {
    setSelected(index);
    const video = videoRef.current;
    if (!video || videoFailed) return;
    video.currentTime = chapters[index].at;
    void video.play().catch(() => {});
  }

  const lastAt = chapters.at(-1)?.at ?? 0;
  const progress = videoFailed
    ? chapters.length > 1
      ? ((chapters[selected]?.at ?? 0) / (lastAt + 10)) * 100
      : 0
    : duration
      ? (time / duration) * 100
      : 0;

  const storeName = project.category === "mobile" ? "Play Store" : "official release";

  return (
    <>
      {/* Video side */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden bg-surface px-10 py-10 md:py-0">
        <span
          aria-hidden
          className="absolute -top-[120px] -left-[100px] size-[600px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)]"
        />
        <div className="relative h-[420px] w-[202px] rounded-[40px] bg-[#18181b] p-[9px] md:h-[520px] md:w-[250px]">
          <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-[32px] bg-[#27272a]">
            {!videoFailed && (
              <video
                ref={videoRef}
                src={project.demo?.video}
                poster={project.demo?.poster}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                muted
                loop
                preload="none"
                autoPlay
                onError={() => setVideoFailed(true)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                aria-label={`Screen recording of ${project.title}`}
              />
            )}
            {videoFailed && (
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-white text-[#09090b]">
                  <Play className="ml-1 size-5" fill="currentColor" aria-hidden />
                </span>
                <span className="px-6 font-mono text-[11px] text-[#a1a1aa]">
                  Recording coming soon
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="relative mt-5 h-1 w-[202px] overflow-hidden rounded-sm bg-border md:w-[250px]">
          <div
            className="h-full rounded-sm bg-accent transition-[width] duration-300"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>

      {/* Info side */}
      <div className="flex flex-col gap-4 p-6 sm:p-10">
        <StatusPill className="self-start" {...statusPillTone(project.status)}>
          {statusLabels[project.status]} · {project.statusNote ?? `not on ${storeName} yet`}
        </StatusPill>
        <DialogTitle className="mt-4 text-[30px] leading-tight font-semibold tracking-[-0.02em] text-fg">
          {project.title} — demo
        </DialogTitle>
        <DialogDescription className="text-[15px] leading-normal text-muted">
          A real screen recording from the latest build. Click a chapter below to jump to a specific feature.
        </DialogDescription>

        {chapters.length > 0 && (
          <ol aria-label="Recording chapters">
            {chapters.map((chapter, i) => (
              <li key={chapter.at}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={cn(
                    "flex h-12 w-full items-center gap-3.5 rounded-[10px] px-3.5 text-left text-sm transition-colors",
                    i === active ? "bg-accent-soft font-medium" : "hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "w-[29px] font-mono text-xs",
                      i === active ? "text-accent" : "text-muted",
                    )}
                  >
                    {formatTime(chapter.at)}
                  </span>
                  <span className="text-fg">{chapter.label}</span>
                </button>
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-wrap gap-2.5">
          {project.links.apk && (
            <Button asChild variant="primary" size="md">
              <a href={project.links.apk} download>
                Download beta APK
              </a>
            </Button>
          )}
          {project.links.github && (
            <Button asChild variant="secondary" size="md">
              <a href={project.links.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden>↗</span>
              </a>
            </Button>
          )}
        </div>
        {project.links.apk && (
          <p className="text-xs text-muted">
            Optional APK, for Android 8+. For Play Store release updates: {profile.email}
          </p>
        )}
      </div>
    </>
  );
}
