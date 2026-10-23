"use client";

import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/styles.css";
import type { WorkItem } from "@/lib/work";

const WIDTHS = [640, 1080, 1600];

type Props = {
  open: boolean;
  slides: WorkItem[];
  index: number;
  onClose: () => void;
  onExiting: () => void;
  onView: (index: number) => void;
};

export default function LightboxView({ open, slides, index, onClose, onExiting, onView }: Props) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      plugins={[Zoom, Counter]}
      animation={{ fade: 220, swipe: 420 }}
      carousel={{ finite: slides.length <= 1, padding: 16 }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      zoom={{ maxZoomPixelRatio: 2.5, scrollToZoom: true }}
      on={{ view: ({ index: i }) => onView(i), exiting: onExiting }}
      render={{
        buttonPrev: slides.length <= 1 ? () => null : undefined,
        buttonNext: slides.length <= 1 ? () => null : undefined,
      }}
      slides={slides.map((item) => ({
        src: item.src,
        alt: item.alt,
        width: item.width,
        height: item.height,
        srcSet: WIDTHS.filter((w) => w < item.width)
          .map((w) => ({
            src: `/_next/image?url=${encodeURIComponent(item.src)}&w=${w}&q=75`,
            width: w,
            height: Math.round((item.height * w) / item.width),
          }))
          .concat({ src: item.src, width: item.width, height: item.height }),
      }))}
    />
  );
}
