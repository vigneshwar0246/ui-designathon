"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { introContent, introScrollDistance } from "@/config/introContent";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import IntroVideo from "./IntroVideo";
import IntroScene from "./IntroScene";
import ScrollIndicator from "./ScrollIndicator";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CinematicIntro() {
  const rootRef = useRef<HTMLElement>(null);
  useSmoothScroll();

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;

    const scenes = gsap.utils.toArray<HTMLElement>("[data-intro-scene]", root);
    const progress = root.querySelector<HTMLElement>("[data-progress]");
    const scrollIndicator = root.querySelector<HTMLElement>(".scroll-indicator");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    // The video is deliberately absent from this timeline. Only interface layers scrub.
    if (media.matches) {
      scenes.forEach((scene, index) => {
        scene.setAttribute("aria-hidden", index === 0 ? "false" : "true");
      });
      return;
    }

    gsap.set(scenes.slice(1), { autoAlpha: 0, y: 38 });
    gsap.set(scenes[0], { autoAlpha: 1, y: 0 });
    if (progress) gsap.set(progress, { scaleY: 0, transformOrigin: "top" });

    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: `+=${introScrollDistance}%`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.7,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Inactive scenes are removed from the keyboard and accessibility tree.
          const active = Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length));
          scenes.forEach((scene, index) => scene.setAttribute("aria-hidden", index === active ? "false" : "true"));
        },
      },
    });

    scenes.forEach((scene, index) => {
      if (index === 0) return;
      const transition = index * 1.1 - 0.28;
      timeline.to(scenes[index - 1], { autoAlpha: 0, y: -32, duration: 0.32 }, transition);
      timeline.to(scene, { autoAlpha: 1, y: 0, duration: 0.38 }, transition + 0.3);
    });

    if (scrollIndicator) timeline.to(scrollIndicator, { autoAlpha: 0, y: 12, duration: 0.3 }, 0.28);
    if (progress) timeline.to(progress, { scaleY: 1, duration: 5.3, ease: "none" }, 0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    document.fonts?.ready.then(refresh).catch(() => undefined);
    return () => window.removeEventListener("load", refresh);
  }, { scope: rootRef });

  return (
    <main ref={rootRef} className="cinematic-intro">
      <IntroVideo />
      <div className="intro-frame">
        <header className="intro-nav">
          <Link className="intro-nav__brand" href="/" aria-label="Traffic One, introduction">
            <span className="intro-nav__mark" aria-hidden="true">T<span>/</span></span>
            <span className="intro-nav__identity">
              <strong>{introContent.brand}</strong>
              <small>{introContent.brandDescription}</small>
            </span>
          </Link>
          <Link className="intro-nav__entry" href={introContent.navigation.href}>
            {introContent.navigation.label}<ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
          </Link>
        </header>

        {introContent.scenes.map((scene, index) => (
          <IntroScene key={scene.id} scene={scene} position={index} />
        ))}

        <div className="intro-bottom">
          <ScrollIndicator />
          <div className="intro-bottom__right">
            <span className="intro-bottom__descriptor">TRAFFIC&nbsp; / &nbsp;INCIDENTS&nbsp; / &nbsp;CONNECTED ROADS</span>
            <span className="intro-bottom__progress" aria-hidden="true"><i data-progress /></span>
          </div>
        </div>
      </div>
      <Link className="reduced-motion-entry" href={introContent.finalAction.href}>
        {introContent.finalAction.label} <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </main>
  );
}
