# Video shot list: Loyal Point Construction (full site)

Drop finished files into `/quick-web`. I'll trim the loops, compress them for phones
and wire them in.

## First choice: real footage from the client's workshop

Real clips beat AI every time, and they're the biggest single thing that stops a site
looking AI-made. Ask the client to film on their phone:

- 10–20 seconds per clip, phone held still (lean on something), good light
- Both horizontal and vertical if possible
- Welding, cutting with a grinder, bending iron, spray-painting a finished piece
- Installing a door, gate or window at a customer's site
- A slow walk through the workshop

Send the original files (on WhatsApp choose "Document" so they aren't compressed).
Shaky footage is fine; I can stabilise it, colour-grade it to match the site and loop it.

## AI B-roll, if real footage isn't available

Rules for every clip: no text, no logos, no faces looking at camera, seamless loop.
Never generate the client's products (doors, gates, windows, containers). Those must be
their real photos, otherwise the site shows work they didn't do.

### Already done
- Desktop hero: welder at the beam (`gemini_generated_video_13aabbf5.mp4`)
- Phone hero: vertical welder (`mobile.mp4`)
- Grinder sparks (`assets/gen-video/Grindersparks.mp4`): 5s seamless loop, now in the
  copper contact band; will also be the "Cut" step
- Iron bending (`assets/gen-video/Ironbending.mp4`): only the first 3.2s are usable
  (after that the rod bends with no hand on it, straightens again and changes colour),
  so it's a 6.3s forward-and-back loop of the hand guiding the rod. Ready for the
  Services page header and "Bend" step. Optional re-do below if you want the bend itself.

### 1. Grinder sparks, 16:9 (used for: "Cut" step + contact band): DONE
```
Cinematic macro of an angle grinder cutting a steel bar, a dense fan of bright orange-white sparks streaking diagonally from left to right across a pure black background, sparks fill the right two-thirds of the frame, slow motion, shallow depth of field, warm copper glow, no face visible, 24fps, no text, no logos, seamless loop, 6 seconds.
```

### 2. Iron bending, 16:9 (used for: Services page header + "Bend" step): DONE

Optional re-do, written to avoid the glitches in the first version:
```
Cinematic close-up of a worker's gloved hands pulling a thick dark steel rod around the roller of a manual iron bending machine in a dark workshop, both hands stay on the rod the whole time, the rod bends smoothly into a right angle and stays bent, the rod keeps the same dark steel colour throughout, real physical weight and resistance, shallow depth of field, slow push-in, teal-black shadows with warm copper highlights, no face visible, 24fps, no text, no logos, 8 seconds.
```

First version:
```
Cinematic close-up of a thick steel rod being slowly bent on a manual iron bending machine in a dark workshop, gloved hands pulling the lever, metal surface catching warm side light, shallow depth of field, slow push-in, teal-black shadows with copper highlights, no face visible, 24fps, no text, no logos, seamless loop, 8 seconds.
```

### 3. Workshop atmosphere, 16:9 (used for: About page header)
```
Slow cinematic dolly through a dark metal fabrication workshop, shafts of light cutting through dust in the air, steel bars and tools on wall racks, a faint orange welding glow in the far background, no people facing camera, teal-black grade with warm orange highlights, 24fps, no text, no logos, seamless loop, 8 seconds.
```

### 4. Measuring and marking, 16:9 (used for: "Measure" step): DONE
(`assets/gen-video/Measuring-and-marking.mp4`: 3.5s–7.9s used as an 8.8s forward-and-back
loop; near 8.5s the AI jumps the bar to a new angle.)
```
Close-up of hands in worn work gloves measuring a steel bar with a tape measure and marking it with a soapstone pencil on a workbench, shallow depth of field, warm workshop light, dark background, slow camera slide, 24fps, no text, no logos, seamless loop, 6 seconds.
```

### 5. Spray finishing, 16:9 (used for: "Finish" step)
```
Close-up of a plain steel frame being spray-painted matte black in a dark workshop, fine paint mist glowing in backlight, slow motion, shallow depth of field, no face visible, teal-black shadows, 24fps, no text, no logos, seamless loop, 6 seconds.
```

### 6. Optional: molten weld macro, 16:9 (used for: background of the numbers strip)
```
Extreme macro of a glowing molten weld bead slowly cooling on dark steel, orange-to-deep-red heat gradient, tiny drifting embers, very dark surroundings, slow lateral camera slide, 24fps, no text, seamless loop, 8 seconds.
```

Priority if you only make some: 1, then 2, then 3. Export at 1080p if the tool allows.
