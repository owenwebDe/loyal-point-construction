"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, useGSAP);

/** The brand curve, cubic-bezier(0.22, 1, 0.36, 1). */
export const EASE = CustomEase.create("brand", "0.22,1,0.36,1");

export const motionEnabled = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("motion");

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };
