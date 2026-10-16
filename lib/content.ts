export type Photograph = {
  id?: string;
  slug: string;
  title: string;
  location: string;
  category: string;
  orientation: "landscape" | "portrait" | "square" | "panoramic";
  color: string;
  featured: boolean;
  available: boolean;
  story: string;
  filename: string;
  variant: "mountain" | "lake" | "wildlife" | "prairie" | "detail";
  displayUrl?: string;
  altText?: string;
  focalPointX?: number;
  focalPointY?: number;
  status?: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  portfolioVisible?: boolean;
  seoVisible?: boolean;
  shortDescription?: string;
  capturedAt?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  shutterSpeed?: string;
  aperture?: string;
  iso?: number;
  aspectRatio?: string;
  showTechnicalMetadata?: boolean;
};

export type ProductVariantOption = {
  id: string;
  sku: string;
  material: string;
  size: string;
  finish?: string;
  frame?: string;
  border?: string;
  mat?: string;
  priceCents: number;
  salePriceCents?: number;
  inventory?: number;
  leadTimeMinDays?: number;
  leadTimeMaxDays?: number;
  available: boolean;
};

export type StoreProduct = {
  slug: string;
  photographSlug: string;
  title: string;
  enabled: boolean;
  featured: boolean;
  startingPrice: number;
  materials: string[];
  sizes: string[];
  editionType?: "OPEN" | "LIMITED";
  editionSize?: number;
  description?: string;
  variants: ProductVariantOption[];
};

export const siteContent = {
  signatureStory:
    "Morning light settles across Monarch Lake as the surrounding peaks emerge in reflected color. Painted Silence captures the stillness of Colorado’s high country—the brief interval when light, water, and mountain become nearly indistinguishable.",
};

export const photographs: Photograph[] = [
  {
    slug: "painted-silence",
    title: "Painted Silence",
    location: "Monarch Lake, Colorado",
    category: "Landscapes",
    orientation: "landscape",
    color: "blue",
    featured: true,
    available: false,
    story: siteContent.signatureStory,
    filename: "painted-silence-2048.webp",
    variant: "lake",
    displayUrl: "/photographs/painted-silence-2048.webp",
    altText:
      "Pink and orange sunset clouds reflected across the still water of Monarch Lake between dark mountain ridges.",
  },
  {
    slug: "light-beyond-the-ridge",
    title: "Light Beyond the Ridge",
    location: "Monarch Lake, Colorado",
    category: "Landscapes",
    orientation: "landscape",
    color: "blue",
    featured: true,
    available: false,
    story:
      "The last color of evening gathers behind a snow-lined ridge while the lake holds a softer reflection below.",
    filename: "light-beyond-the-ridge-2048.webp",
    variant: "lake",
    displayUrl: "/photographs/light-beyond-the-ridge-2048.webp",
    altText: "Snow-lined mountains beneath pink sunset clouds reflected in a dark alpine lake.",
  },
  {
    slug: "canyon-cascade",
    title: "Where the Canyon Roars",
    location: "San Juan Mountains, Colorado",
    category: "Landscapes",
    orientation: "landscape",
    color: "green",
    featured: true,
    available: false,
    story:
      "Cold mountain water drives through a narrow break in the San Juan rock, then opens into a white rush below. The long exposure holds both forces at once: the permanence of stone and the relentless motion shaping it.",
    filename: "canyon-cascade-2048.webp",
    variant: "mountain",
    displayUrl: "/photographs/canyon-cascade-2048.webp",
    altText: "A silky waterfall pouring through a dark, moss-covered rock canyon into a fast foreground stream.",
  },
  {
    slug: "high-country-passage",
    title: "The Road Into Thin Air",
    location: "San Juan Mountains, Colorado",
    category: "Landscapes",
    orientation: "panoramic",
    color: "green",
    featured: true,
    available: false,
    story:
      "A single road threads across the immense green slopes of the San Juan Mountains, offering scale to a landscape that otherwise feels without measure. The journey becomes the subject: remote, exposed, and pulling toward whatever waits beyond the next rise.",
    filename: "high-country-passage-2048.webp",
    variant: "mountain",
    displayUrl: "/photographs/high-country-passage-2048.webp",
    altText: "Panoramic view of a winding gravel road crossing a broad green mountain basin beneath scattered clouds.",
  },
  {
    slug: "night-lift",
    title: "Lanterns Against the Night",
    location: "Huff 'n Puff Hot Air Balloon Rally, Topeka, Kansas",
    category: "Events",
    orientation: "landscape",
    color: "blue",
    featured: true,
    available: false,
    story:
      "At Topeka's Huff 'n Puff Hot Air Balloon Rally, burners ignite one after another and turn the field into a temporary city of light. Saturated color rises against the blue hour while crews and spectators disappear into silhouette below.",
    filename: "night-lift-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/night-lift-2048.webp",
    altText: "Colorful hot-air balloons glowing at a nighttime balloon gathering beneath a deep blue sky.",
  },
  {
    slug: "the-observer",
    title: "Sentinel at the Waterline",
    location: "Antioch Park, Merriam, Kansas",
    category: "Wildlife",
    orientation: "landscape",
    color: "green",
    featured: true,
    available: false,
    story:
      "At the edge of the water in Antioch Park, a mallard steps into a narrow band of warm light and watches the activity beyond the frame. The low perspective turns an everyday encounter into an attentive wildlife portrait.",
    filename: "the-observer-2048.webp",
    variant: "wildlife",
    displayUrl: "/photographs/the-observer-2048.webp",
    altText:
      "Close portrait of a mallard standing on stone in warm backlight with another duck softly blurred behind it.",
  },
  {
    slug: "among-the-asters",
    title: "The Work of Summer",
    location: "Antioch Park, Merriam, Kansas",
    category: "Nature & Macro",
    orientation: "square",
    color: "green",
    featured: true,
    available: false,
    story:
      "Deep inside an aster at Antioch Park, a honeybee works through a bright ring of pollen. The close view reveals a complete landscape at miniature scale—texture, color, labor, and the quiet exchange that keeps summer flowering.",
    filename: "among-the-asters-2048.webp",
    variant: "wildlife",
    displayUrl: "/photographs/among-the-asters-2048.webp",
    altText: "Macro photograph of a honeybee collecting pollen from the yellow center of a pale violet aster.",
  },
  {
    slug: "spring-portrait",
    title: "Blossoms at Her Cheek",
    location: "Lake Shawnee, Topeka, Kansas",
    category: "Portraits",
    orientation: "landscape",
    color: "green",
    featured: true,
    available: false,
    story:
      "Soft blossoms, vivid hair, and an unguarded glance come together beside Lake Shawnee. The close composition keeps the session personal and lets the color of early spring support the subject rather than compete with her.",
    filename: "spring-portrait-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/spring-portrait-2048.webp",
    altText: "Close outdoor portrait of a woman with dark purple hair holding pale blossoms beside her face.",
  },
  {
    slug: "crowned-in-autumn",
    title: "A Crown for the Harvest",
    location: "Kansas City Renaissance Festival, Bonner Springs, Kansas",
    category: "Portraits",
    orientation: "portrait",
    color: "earth",
    featured: false,
    available: false,
    story:
      "Regal costuming meets an unmistakably human smile at the Kansas City Renaissance Festival. Jewels, velvet, and warm autumn light build the spectacle, while the expression makes the portrait immediate and welcoming.",
    filename: "crowned-in-autumn-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/crowned-in-autumn-2048.webp",
    altText: "Smiling bearded festival performer wearing a jeweled gold crown and deep red historical costume.",
  },
  {
    slug: "first-bloom",
    title: "Spring, Unfolding",
    location: "Loose Park, Kansas City, Missouri",
    category: "Nature & Macro",
    orientation: "landscape",
    color: "earth",
    featured: false,
    available: false,
    story:
      "At Loose Park, the first blossoms open before the season fully settles in. Shallow focus separates one fragile cluster from the garden and turns a familiar sign of spring into a study of texture, pollen, and pale color.",
    filename: "first-bloom-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/first-bloom-2048.webp",
    altText: "Close view of pale pink spring blossoms with orange pollen and softly blurred flowers behind them.",
  },
  {
    slug: "still-waters",
    title: "Still Waters",
    location: "Colorado",
    category: "Landscapes",
    orientation: "landscape",
    color: "blue",
    featured: false,
    available: false,
    story: "Late light travels across the mountains while the lake carries a quieter version of the scene below.",
    filename: "still-waters-2048.webp",
    variant: "lake",
    displayUrl: "/photographs/still-waters-2048.webp",
    altText: "Mountain lake reflecting golden evening light, forested slopes, and a broad blue sky.",
  },
  {
    slug: "alpine-afterglow",
    title: "Above the Last Treeline",
    location: "Rocky Mountain National Park, Colorado",
    category: "Landscapes",
    orientation: "portrait",
    color: "earth",
    featured: false,
    available: false,
    story:
      "From the high reaches of Rocky Mountain National Park, the world falls away into snowfields, stone, and distant water. The last warm light catches the horizon while the alpine basin below has already entered evening.",
    filename: "alpine-afterglow-2048.webp",
    variant: "mountain",
    displayUrl: "/photographs/alpine-afterglow-2048.webp",
    altText:
      "Vertical view into a rugged mountain cirque with lingering snowfields and small alpine lakes beneath a golden sky.",
  },
  {
    slug: "road-beneath-the-stars",
    title: "Headlights Through the Milky Way",
    location: "Clinton Lake, Lawrence, Kansas",
    category: "Landscapes",
    orientation: "portrait",
    color: "blue",
    featured: false,
    available: false,
    story:
      "Near Clinton Lake, the Milky Way climbs over a dark Kansas horizon as passing vehicles draw red and gold through the foreground. The frame joins two kinds of travel: one measured in seconds, the other in light-years.",
    filename: "road-beneath-the-stars-2048.webp",
    variant: "mountain",
    displayUrl: "/photographs/road-beneath-the-stars-2048.webp",
    altText:
      "The Milky Way filling a dark teal night sky above silhouetted trees and red and gold vehicle light trails.",
  },
  {
    slug: "cascade-above-timberline",
    title: "Snowmelt Over Stone",
    location: "Near Breckenridge, Colorado",
    category: "Landscapes",
    orientation: "portrait",
    color: "green",
    featured: false,
    available: false,
    story:
      "Above Breckenridge, snowmelt fans across broad ledges and gathers speed between evergreens. A long exposure follows the water's path over stone while retaining the clarity and altitude of the surrounding high country.",
    filename: "cascade-above-timberline-2048.webp",
    variant: "mountain",
    displayUrl: "/photographs/cascade-above-timberline-2048.webp",
    altText:
      "Vertical long-exposure cascade flowing over wide rock ledges between evergreen trees under a clear blue sky.",
  },
  {
    slug: "crystal-mill",
    title: "Crystal Mill",
    location: "Crystal, Colorado",
    category: "Landscapes",
    orientation: "portrait",
    color: "green",
    featured: false,
    available: false,
    story:
      "The weathered mill stands above the river, held between timber, stone, and the continuous movement of water.",
    filename: "crystal-mill-2048.webp",
    variant: "mountain",
    displayUrl: "/photographs/crystal-mill-2048.webp",
    altText: "Historic wooden Crystal Mill perched above a rocky river and waterfall among green trees in Colorado.",
  },
  {
    slug: "valley-before-rain",
    title: "Weather Coming Through Crystal",
    location: "Near Crystal, Colorado",
    category: "Landscapes",
    orientation: "landscape",
    color: "green",
    featured: false,
    available: false,
    story:
      "Near Crystal, storm clouds compress the valley and deepen every green along the water. A brief opening sends light across the meadow, capturing the charged pause when the weather has arrived but the rain has not.",
    filename: "valley-before-rain-2048.webp",
    variant: "mountain",
    displayUrl: "/photographs/valley-before-rain-2048.webp",
    altText: "A mountain pond and meadow beneath dramatic storm clouds, framed by steep forested cliffs.",
  },
  {
    slug: "willow-portrait",
    title: "Beneath the Willow",
    location: "Lake Shawnee, Topeka, Kansas",
    category: "Portraits",
    orientation: "portrait",
    color: "green",
    featured: false,
    available: false,
    story:
      "A broad willow trunk and trailing branches create a natural portrait studio beside Lake Shawnee. The setting gives the subject room to relax while the tree's texture and shape add depth without pulling attention away from the person.",
    filename: "willow-portrait-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/willow-portrait-2048.webp",
    altText:
      "Young person standing beside a large willow tree, framed by its textured trunk and hanging green branches.",
  },
  {
    slug: "framed-laughter",
    title: "Joy Between the Lines",
    location: "Lake Shawnee, Topeka, Kansas",
    category: "Portraits",
    orientation: "square",
    color: "monochrome",
    featured: false,
    available: false,
    story:
      "A burst of laughter breaks through the geometry of a lakeside structure at Lake Shawnee. Repeating lines provide the composition, but the expression gives the photograph its energy and makes the frame feel spontaneous rather than staged.",
    filename: "framed-laughter-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/framed-laughter-2048.webp",
    altText: "Laughing young person in a patterned jacket framed through a repeating octagonal railing opening.",
  },
  {
    slug: "autumn-by-water",
    title: "A Quiet Place in October",
    location: "Lake Shawnee, Topeka, Kansas",
    category: "Portraits",
    orientation: "portrait",
    color: "earth",
    featured: false,
    available: false,
    story:
      "Beside the water at Lake Shawnee, an unhurried pose settles naturally into rock, foliage, and the movement of the stream. The portrait carries autumn through atmosphere and color instead of relying on a formal seasonal setup.",
    filename: "autumn-by-water-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/autumn-by-water-2048.webp",
    altText: "Young person seated beside a small garden waterfall surrounded by rocks, trees, and autumn foliage.",
  },
  {
    slug: "autumn-story",
    title: "Bronze and Golden Light",
    location: "Overland Park Arboretum & Botanical Gardens, Overland Park, Kansas",
    category: "Portraits",
    orientation: "landscape",
    color: "earth",
    featured: false,
    available: false,
    story:
      "At the Overland Park Arboretum, warm backlight links a bright expression with the bronze figure beside her. The portrait feels playful and distinctly tied to place, preserving both the personality of the subject and the character of the garden.",
    filename: "autumn-story-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/autumn-story-2048.webp",
    altText: "Smiling young girl beside a bronze artist sculpture in warm autumn sunlight.",
  },
  {
    slug: "companions-at-the-waterline",
    title: "Companions at the Waterline",
    location: "Location withheld",
    category: "Wildlife",
    orientation: "landscape",
    color: "green",
    featured: false,
    available: false,
    story:
      "One mallard holds the foreground in crisp detail while a second bird recedes into the soft green shelter of the waterline.",
    filename: "companions-at-the-waterline-2048.webp",
    variant: "wildlife",
    displayUrl: "/photographs/companions-at-the-waterline-2048.webp",
    altText: "Mallard standing on stone with a second duck softly blurred among green foliage behind it.",
  },
  {
    slug: "the-beauty-of-autumn",
    title: "The Beauty of Autumn",
    location: "Location withheld",
    category: "Portraits",
    orientation: "landscape",
    color: "earth",
    featured: false,
    available: false,
    story:
      "A finished seasonal collage gathers outdoor portraits, bright leaves, and playful expressions into one autumn keepsake.",
    filename: "the-beauty-of-autumn-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/the-beauty-of-autumn-2048.webp",
    altText:
      "Autumn-themed collage of outdoor childhood portraits arranged over a background of red and yellow leaves.",
  },
  {
    slug: "porchlight-portrait",
    title: "Easy Light, Easy Smile",
    location: "Lake Shawnee, Topeka, Kansas",
    category: "Portraits",
    orientation: "portrait",
    color: "earth",
    featured: false,
    available: false,
    story:
      "A relaxed seated pose and candid smile take shape against the bold architecture at Lake Shawnee. Soft garden color keeps the background lively while the clean composition holds attention on the person.",
    filename: "porchlight-portrait-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/porchlight-portrait-2048.webp",
    altText: "Smiling young adult in a plaid shirt seated outdoors beside a red architectural column.",
  },
  {
    slug: "the-vow",
    title: "The Moment Between Promises",
    location: "Lake Shawnee, Topeka, Kansas",
    category: "Weddings",
    orientation: "landscape",
    color: "monochrome",
    featured: false,
    available: false,
    story:
      "During an outdoor ceremony at Lake Shawnee, the surrounding gathering falls away and the couple's exchange becomes the entire frame. Selective color concentrates the eye on the promises, expressions, and gestures at the center of the day.",
    filename: "the-vow-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/the-vow-2048.webp",
    altText:
      "Bride and groom facing one another during an outdoor ceremony, shown in color against a monochrome background.",
  },
  {
    slug: "monarch-of-the-meadow",
    title: "King of the High Meadow",
    location: "Rocky Mountain National Park, Colorado",
    category: "Wildlife",
    orientation: "square",
    color: "earth",
    featured: false,
    available: false,
    story:
      "High in Rocky Mountain National Park, a bull elk pauses where sunlit grass meets the dark evergreen forest. His antlers clear the background cleanly, giving the portrait both the power of the animal and the scale of its alpine habitat.",
    filename: "monarch-of-the-meadow-2048.webp",
    variant: "wildlife",
    displayUrl: "/photographs/monarch-of-the-meadow-2048.webp",
    altText: "Bull elk with large antlers standing in a golden meadow before evergreen trees.",
  },
  {
    slug: "winter-reeds",
    title: "When the Wetlands Turn Gold",
    location: "Baker Wetlands, Lawrence, Kansas",
    category: "Landscapes",
    orientation: "landscape",
    color: "earth",
    featured: false,
    available: false,
    story:
      "At the Baker Wetlands, a low winter sun threads through cattails and turns the frozen water bronze. The layered reeds hold the warmth of the last light against the unmistakable stillness of the season.",
    filename: "winter-reeds-2048.webp",
    variant: "lake",
    displayUrl: "/photographs/winter-reeds-2048.webp",
    altText: "Golden sunset over a frozen lake viewed through tall silhouetted cattails and reeds.",
  },
  {
    slug: "graduation-day-companion",
    title: "Graduation Day Companion",
    location: "Location withheld",
    category: "Graduations",
    orientation: "landscape",
    color: "green",
    featured: false,
    available: false,
    story:
      "A graduation portrait becomes more personal with a beloved companion sharing the frame and the celebration.",
    filename: "graduation-day-companion-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/graduation-day-companion-2048.webp",
    altText: "Smiling graduate in a red cap and gown posing outdoors with a large white dog.",
  },
  {
    slug: "under-the-open-sky",
    title: "Laughter Beneath the Arbor",
    location: "Near Lawrence, Kansas",
    category: "Weddings",
    orientation: "portrait",
    color: "green",
    featured: false,
    available: false,
    story:
      "Just outside Lawrence, a shared laugh beneath a handmade arbor cuts through the formality of the ceremony. The photograph preserves the couple's ease with one another and the open-country character of the celebration.",
    filename: "under-the-open-sky-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/under-the-open-sky-2048.webp",
    altText: "Newlywed couple laughing beneath a rustic flowered arbor in an open green field.",
  },
  {
    slug: "the-unexpected-guest",
    title: "The Bride and the Black Horse",
    location: "Near Lawrence, Kansas",
    category: "Weddings",
    orientation: "portrait",
    color: "green",
    featured: false,
    available: false,
    story:
      "A bride steps into the pasture with bouquet in hand and a black horse quietly joins the portrait. Made outside Lawrence, the image feels personal because it belongs specifically to this couple, this place, and this day.",
    filename: "the-unexpected-guest-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/the-unexpected-guest-2048.webp",
    altText: "Laughing bride in a white dress standing beside a dark horse in a green field.",
  },
  {
    slug: "back-to-back",
    title: "Partners in Every Direction",
    location: "Near Lawrence, Kansas",
    category: "Weddings",
    orientation: "portrait",
    color: "blue",
    featured: false,
    available: false,
    story:
      "Back-to-back beneath a broad Kansas sky, the newlyweds trade traditional posing for a portrait with humor and edge. The open field and low horizon give the unconventional moment room to feel cinematic.",
    filename: "back-to-back-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/back-to-back-2048.webp",
    altText: "Bride and groom posing back-to-back with sporting rifles in an open field beneath a broad blue sky.",
  },
  {
    slug: "studio-gaze",
    title: "Studio Gaze",
    location: "Location withheld",
    category: "Portraits",
    orientation: "landscape",
    color: "monochrome",
    featured: false,
    available: false,
    story:
      "A direct expression and close composition create a spare portrait with room for the subject's presence to settle.",
    filename: "studio-gaze-2048.webp",
    variant: "detail",
    displayUrl: "/photographs/studio-gaze-2048.webp",
    altText: "Close head-and-shoulders portrait of a bearded man against a neutral gray background.",
  },
];

export const collections = [
  {
    slug: "mountain-stillness",
    title: "Mountain Stillness",
    subtitle: "Light, reflection, and the high country",
    description: "A study of the calm that exists between weather, water, and stone.",
    photographSlugs: [
      "painted-silence",
      "light-beyond-the-ridge",
      "canyon-cascade",
      "high-country-passage",
      "still-waters",
      "alpine-afterglow",
      "cascade-above-timberline",
      "crystal-mill",
      "valley-before-rain",
    ],
  },
  {
    slug: "wild-encounters",
    title: "Wild Encounters",
    subtitle: "Brief meetings in untamed places",
    description: "Wildlife portraits centered on presence rather than spectacle.",
    photographSlugs: ["the-observer", "companions-at-the-waterline", "monarch-of-the-meadow"],
  },
  {
    slug: "heartland-light",
    title: "Earth & Sky",
    subtitle: "Water, weather, night, and living color",
    description: "Photographs shaped by the changing relationship between land, atmosphere, and light.",
    photographSlugs: [
      "night-lift",
      "first-bloom",
      "among-the-asters",
      "road-beneath-the-stars",
      "winter-reeds",
    ],
  },
  {
    slug: "human-stories",
    title: "Human Stories",
    subtitle: "Portraits, milestones, and lives in motion",
    description: "Environmental portraits and celebrations shaped around expression, place, and the people involved.",
    photographSlugs: [
      "spring-portrait",
      "willow-portrait",
      "framed-laughter",
      "autumn-by-water",
      "autumn-story",
      "the-beauty-of-autumn",
      "porchlight-portrait",
      "studio-gaze",
      "the-vow",
      "graduation-day-companion",
      "under-the-open-sky",
      "the-unexpected-guest",
      "back-to-back",
    ],
  },
];

const materialAdjustments: Record<string, number> = { "Archival paper": 0, Metal: 12000, Acrylic: 19000, Canvas: 9000 };
const sizeAdjustments: Record<string, number> = {
  "12 × 18": 0,
  "16 × 24": 9500,
  "20 × 30": 19000,
  "24 × 36": 32000,
  "24 × 12": 0,
  "36 × 18": 19000,
  "48 × 24": 38000,
};

export const products: StoreProduct[] = photographs.map((photo, index) => {
  const materials = ["Archival paper", "Metal", "Acrylic", "Canvas"];
  const sizes =
    photo.orientation === "panoramic"
      ? ["24 × 12", "36 × 18", "48 × 24"]
      : ["12 × 18", "16 × 24", "20 × 30", "24 × 36"];
  const variants = materials.flatMap((material) =>
    sizes.map((size) => ({
      id: `sample-${photo.slug}-${material}-${size}`,
      sku: `SAMPLE-${photo.slug.toUpperCase().replaceAll("-", "_")}-${material.slice(0, 3).toUpperCase()}-${size.replaceAll(" ", "").replace("×", "X")}`,
      material,
      size,
      priceCents: 18500 + (materialAdjustments[material] ?? 0) + (sizeAdjustments[size] ?? 0),
      available: photo.available,
    })),
  );
  return {
    slug: photo.slug,
    photographSlug: photo.slug,
    title: photo.title,
    enabled: photo.available,
    featured: index < 4,
    startingPrice: Math.min(...variants.map((variant) => variant.priceCents)),
    materials,
    sizes,
    editionType: "OPEN",
    description: photo.story,
    variants,
  };
});

export const journalPosts = [
  {
    slug: "waiting-for-the-lake-to-go-still",
    title: "Waiting for the lake to go still",
    category: "Behind the image",
    readingTime: "5 min",
    excerpt: "What the final frame cannot show: the early start, changing wind, and patience behind Painted Silence.",
    body: `A landscape photograph can look instantaneous, but the final frame is often the result of waiting. At Monarch Lake, the composition depended on the relationship between the mountain ridges, the reflection, and the color moving through the sky. The scene only became complete when the water carried that color back toward the viewer.

## Building the frame

The shoreline creates a quiet foreground while the dark ridges guide the eye toward the light. Keeping enough space around the reflection allows the photograph to feel open rather than crowded. The goal was not to make the scene louder, but to preserve the stillness already present.

## Finishing with restraint

The edit protects detail in the shadowed slopes while allowing the color in the clouds and water to remain natural. That balance is especially important in a large print, where small changes in contrast and saturation become much more visible.

Painted Silence is ultimately about the brief alignment of light, water, and distance—and the patience required to recognize it.`,
    published: true,
  },
  {
    slug: "photographing-wildlife-with-presence",
    title: "Photographing wildlife with presence",
    category: "Field notes",
    readingTime: "4 min",
    excerpt: "A quieter approach to making wildlife photographs that feel like encounters rather than trophies.",
    body: `Strong wildlife photographs begin before the shutter is pressed. The most useful approach is to slow down, watch behavior, and give the animal enough room to remain comfortable. That patience produces photographs that feel like encounters rather than interruptions.

## Work from behavior, not reaction

Repeated movements reveal when an animal is likely to pause, turn, feed, or enter better light. Anticipating those moments is more reliable than chasing them. A stable position and a clean background also make it easier to concentrate on expression, posture, and the small details that give the subject presence.

## Protect the sense of place

A close portrait can be powerful, but the surrounding habitat is part of the story. Water, stone, grass, and changing light explain where the encounter happened without overwhelming the subject.

The finished photograph should preserve both the character of the animal and the quiet of the moment in which it was seen.`,
    published: true,
  },
  {
    slug: "choosing-a-fine-art-print",
    title: "Choosing a fine-art print for your space",
    category: "Print guide",
    readingTime: "6 min",
    excerpt: "A practical guide to material, scale, viewing distance, and the feeling you want a room to carry.",
    body: `The right print is a combination of image, material, scale, and the room where it will live. Begin with the feeling you want the space to carry, then choose a presentation that supports the photograph rather than competing with it.

## Choose the material

Archival paper offers a traditional surface with nuanced tone and fine detail. Metal gives color and contrast a clean, contemporary presence. Acrylic emphasizes depth and clarity, while canvas offers a softer, more textural presentation.

## Choose the scale

Measure the available wall area and consider the normal viewing distance. A photograph hung above furniture usually benefits from a width that relates clearly to the piece below it. Large landscapes need enough scale for distant details to remain part of the experience, but they also need breathing room around the frame.

## Use the room as part of the decision

Natural light, wall color, nearby artwork, and reflections all affect the final result. A photograph that feels balanced in the room will hold attention without making the space feel crowded.`,
    published: true,
  },
];

export const services = [
  {
    slug: "weddings",
    title: "Weddings",
    description: "Honest coverage of the people, movement, and small moments that make the day yours.",
  },
  {
    slug: "graduations",
    title: "Graduations",
    description: "Portraits that mark the work behind the milestone and the person stepping into what comes next.",
  },
  {
    slug: "families",
    title: "Families",
    description: "Relaxed sessions built around connection instead of rigid posing.",
  },
  {
    slug: "events",
    title: "Events",
    description: "Professional documentary coverage for gatherings, organizations, and meaningful occasions.",
  },
  {
    slug: "commissioned",
    title: "Commissioned work",
    description:
      "Custom landscape, commercial, and location-based photography shaped around a specific space or story.",
  },
];

export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(cents / 100);
}
