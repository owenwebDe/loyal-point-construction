import { Hero } from "@/components/hero/Hero";
import { Build } from "@/components/sections/Build";
import { Cta } from "@/components/sections/Cta";
import { Facts } from "@/components/sections/Facts";
import { Featured } from "@/components/sections/Featured";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { Services } from "@/components/sections/Services";
import { clientPhotos } from "@/lib/work";

export default function Home() {
  // Same double-door design twice: "Weld" shows it welded but unpainted, "Finish" in gloss.
  const doors = clientPhotos("safety-doors");
  const weld = doors.find((d) => d.file.endsWith("welded-door.jpg"));
  const finish = doors.find((d) => d.file.endsWith("door2.jpg")) ?? doors[0];

  return (
    <>
      <Hero />
      <Services />
      <Build />
      <HowWeWork weld={weld} finish={finish} />
      <Featured />
      <Facts />
      <Cta />
    </>
  );
}
