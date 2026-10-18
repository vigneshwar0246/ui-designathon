"use client";

import { useRef } from "react";

export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="intro-video" aria-hidden="true">
      <video
        ref={videoRef}
        className="intro-video__media"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        poster="/images/car-poster.jpg"
        onCanPlay={() => {
          // A direct play request helps browsers that defer autoplay until the video can play.
          videoRef.current?.play().catch(() => undefined);
        }}
      >
        <source src="/videos/car-intro.mp4" type="video/mp4" />
      </video>
      <div className="intro-video__wash" />
      <div className="intro-video__grain" />
    </div>
  );
}
