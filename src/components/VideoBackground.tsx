"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_POSTER = "/background-poster.jpg";

type VideoBackgroundProps = {
  src?: string;
  posterSrc?: string;
  overlayClassName?: string;
};

export function VideoBackground({
  src = "/background.mp4",
  posterSrc = DEFAULT_POSTER,
  overlayClassName = "bg-black/35",
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useStaticBackground, setUseStaticBackground] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const enableStaticBackground = useCallback(() => {
    setUseStaticBackground(true);
  }, []);

  const tryPlay = useCallback(async () => {
    if (useStaticBackground) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    try {
      await video.play();
      if (video.paused) {
        enableStaticBackground();
      }
    } catch {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        enableStaticBackground();
      }
    }
  }, [useStaticBackground, enableStaticBackground]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setUseStaticBackground(motionQuery.matches);

    const onMotionChange = (event: MediaQueryListEvent) => {
      setUseStaticBackground(event.matches);
    };

    motionQuery.addEventListener("change", onMotionChange);
    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  useEffect(() => {
    if (useStaticBackground) return;

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

    const fallbackTimer = window.setTimeout(() => {
      if (video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        enableStaticBackground();
      }
    }, 2000);

    return () => {
      window.clearTimeout(fallbackTimer);
      video.removeEventListener("loadeddata", resumeOnReady);
      video.removeEventListener("canplay", resumeOnReady);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("pointerdown", resumeOnReady);
      document.removeEventListener("keydown", resumeOnReady);
    };
  }, [src, tryPlay, useStaticBackground, enableStaticBackground]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {useStaticBackground ? (
        <img
          src={posterSrc}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterSrc}
          disablePictureInPicture
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          className="video-background h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
