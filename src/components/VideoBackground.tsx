type VideoBackgroundProps = {
  src?: string;
  overlayClassName?: string;
};

export function VideoBackground({
  src = "/background.mp4",
  overlayClassName = "bg-black/35",
}: VideoBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
