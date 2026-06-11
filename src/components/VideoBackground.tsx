"use client";

import { useCallback, useEffect, useRef } from "react";

type VideoBackgroundProps = {
  src?: string;
  overlayClassName?: string;
};

export function VideoBackground({
  src = "/background.mp4",
  overlayClassName = "bg-black/35",
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const tryPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    try {
      await video.play();
    } catch {
      // Browser blocked autoplay; listeners below will retry.
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const resumeOnReady = () => {
      void tryPlay();
    };

    video.addEventListener("loadeddata", resumeOnReady);
    video.addEventListener("canplay", resumeOnReady);

    void tryPlay();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void tryPlay();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("pointerdown", resumeOnReady, { once: true });
    document.addEventListener("keydown", resumeOnReady, { once: true });

    return () => {
      video.removeEventListener("loadeddata", resumeOnReady);
      video.removeEventListener("canplay", resumeOnReady);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("pointerdown", resumeOnReady);
      document.removeEventListener("keydown", resumeOnReady);
    };
  }, [src, tryPlay]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback"
        className="video-background h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
