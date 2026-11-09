/** Photos of dishes Thu has cooked and baked. Optimised copies live in public/dishes (originals are in public/food). */
export const dishes = [
  { file: "comtam", name: "Cơm tấm" },
  { file: "banhkhot", name: "Bánh khọt" },
  { file: "banhhoi", name: "Bánh hỏi" },
  { file: "caphesuada", name: "Cà phê sữa đá" },
  { file: "japanesecurry", name: "Japanese curry" },
  { file: "steakpasta", name: "Steak pasta" },
  { file: "burger", name: "Burger" },
  { file: "koreangarliccreamchesebread", name: "Korean garlic cream cheese bread" },
  { file: "eggtart", name: "Egg tarts" },
  { file: "cheesecake", name: "Cheesecake" },
  { file: "matchatiramisu", name: "Matcha tiramisu" },
  { file: "matchamochi", name: "Matcha mochi" },
].map((d) => ({ ...d, src: `/dishes/${d.file}.jpg` }));
