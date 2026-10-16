-- Apply Michael Kennedy's verified locations and revised public-facing titles.
-- Slugs remain stable so existing links, assets, and collection membership continue to work.
UPDATE photographs
SET title = CASE slug
  WHEN 'canyon-cascade' THEN 'Where the Canyon Roars'
  WHEN 'high-country-passage' THEN 'The Road Into Thin Air'
  WHEN 'night-lift' THEN 'Lanterns Against the Night'
  WHEN 'the-observer' THEN 'Sentinel at the Waterline'
  WHEN 'among-the-asters' THEN 'The Work of Summer'
  WHEN 'spring-portrait' THEN 'Blossoms at Her Cheek'
  WHEN 'first-bloom' THEN 'Spring, Unfolding'
  WHEN 'crowned-in-autumn' THEN 'A Crown for the Harvest'
  WHEN 'alpine-afterglow' THEN 'Above the Last Treeline'
  WHEN 'monarch-of-the-meadow' THEN 'King of the High Meadow'
  WHEN 'road-beneath-the-stars' THEN 'Headlights Through the Milky Way'
  WHEN 'cascade-above-timberline' THEN 'Snowmelt Over Stone'
  WHEN 'valley-before-rain' THEN 'Weather Coming Through Crystal'
  WHEN 'willow-portrait' THEN 'Beneath the Willow'
  WHEN 'framed-laughter' THEN 'Joy Between the Lines'
  WHEN 'autumn-by-water' THEN 'A Quiet Place in October'
  WHEN 'porchlight-portrait' THEN 'Easy Light, Easy Smile'
  WHEN 'the-vow' THEN 'The Moment Between Promises'
  WHEN 'autumn-story' THEN 'Bronze and Golden Light'
  WHEN 'winter-reeds' THEN 'When the Wetlands Turn Gold'
  WHEN 'under-the-open-sky' THEN 'Laughter Beneath the Arbor'
  WHEN 'the-unexpected-guest' THEN 'The Bride and the Black Horse'
  WHEN 'back-to-back' THEN 'Partners in Every Direction'
  ELSE title
END,
location = CASE slug
  WHEN 'canyon-cascade' THEN 'San Juan Mountains, Colorado'
  WHEN 'high-country-passage' THEN 'San Juan Mountains, Colorado'
  WHEN 'night-lift' THEN 'Huff ''n Puff Hot Air Balloon Rally, Topeka, Kansas'
  WHEN 'the-observer' THEN 'Antioch Park, Merriam, Kansas'
  WHEN 'among-the-asters' THEN 'Antioch Park, Merriam, Kansas'
  WHEN 'spring-portrait' THEN 'Lake Shawnee, Topeka, Kansas'
  WHEN 'first-bloom' THEN 'Loose Park, Kansas City, Missouri'
  WHEN 'crowned-in-autumn' THEN 'Kansas City Renaissance Festival, Bonner Springs, Kansas'
  WHEN 'alpine-afterglow' THEN 'Rocky Mountain National Park, Colorado'
  WHEN 'monarch-of-the-meadow' THEN 'Rocky Mountain National Park, Colorado'
  WHEN 'road-beneath-the-stars' THEN 'Clinton Lake, Lawrence, Kansas'
  WHEN 'cascade-above-timberline' THEN 'Near Breckenridge, Colorado'
  WHEN 'valley-before-rain' THEN 'Near Crystal, Colorado'
  WHEN 'willow-portrait' THEN 'Lake Shawnee, Topeka, Kansas'
  WHEN 'framed-laughter' THEN 'Lake Shawnee, Topeka, Kansas'
  WHEN 'autumn-by-water' THEN 'Lake Shawnee, Topeka, Kansas'
  WHEN 'porchlight-portrait' THEN 'Lake Shawnee, Topeka, Kansas'
  WHEN 'the-vow' THEN 'Lake Shawnee, Topeka, Kansas'
  WHEN 'autumn-story' THEN 'Overland Park Arboretum & Botanical Gardens, Overland Park, Kansas'
  WHEN 'winter-reeds' THEN 'Baker Wetlands, Lawrence, Kansas'
  WHEN 'under-the-open-sky' THEN 'Near Lawrence, Kansas'
  WHEN 'the-unexpected-guest' THEN 'Near Lawrence, Kansas'
  WHEN 'back-to-back' THEN 'Near Lawrence, Kansas'
  ELSE location
END,
updated_at = unixepoch('now') * 1000
WHERE slug IN (
  'canyon-cascade','high-country-passage','night-lift','the-observer','among-the-asters',
  'spring-portrait','first-bloom','crowned-in-autumn','alpine-afterglow','monarch-of-the-meadow',
  'road-beneath-the-stars','cascade-above-timberline','valley-before-rain','willow-portrait',
  'framed-laughter','autumn-by-water','porchlight-portrait','the-vow','autumn-story','winter-reeds',
  'under-the-open-sky','the-unexpected-guest','back-to-back'
);

UPDATE photographs
SET story = CASE slug
  WHEN 'canyon-cascade' THEN 'Cold mountain water drives through a narrow break in the San Juan rock, holding the permanence of stone against the relentless motion shaping it.'
  WHEN 'high-country-passage' THEN 'A single road threads across the immense green slopes of the San Juan Mountains, making the remote journey itself the subject.'
  WHEN 'night-lift' THEN 'At Topeka''s Huff ''n Puff Rally, balloon burners turn the field into a temporary city of color against the blue hour.'
  WHEN 'the-observer' THEN 'At Antioch Park, a mallard steps into warm light and watches the activity beyond the frame from the edge of the water.'
  WHEN 'among-the-asters' THEN 'Deep inside an Antioch Park aster, a honeybee reveals a miniature landscape of texture, color, labor, and summer life.'
  WHEN 'spring-portrait' THEN 'Soft blossoms, vivid hair, and an unguarded glance come together beside Lake Shawnee in a personal celebration of early spring.'
  WHEN 'first-bloom' THEN 'At Loose Park, shallow focus turns the season''s first blossoms into a study of fragile texture, pollen, and pale color.'
  WHEN 'crowned-in-autumn' THEN 'Regal costume, jeweled detail, and a welcoming smile meet in warm light at the Kansas City Renaissance Festival.'
  WHEN 'alpine-afterglow' THEN 'From the high reaches of Rocky Mountain National Park, warm horizon light falls over snowfields, stone, and distant alpine water.'
  WHEN 'monarch-of-the-meadow' THEN 'A bull elk pauses where sunlit grass meets dark evergreen forest in Rocky Mountain National Park.'
  WHEN 'road-beneath-the-stars' THEN 'Near Clinton Lake, passing headlights cross beneath the Milky Way, joining a journey measured in seconds with one measured in light-years.'
  WHEN 'cascade-above-timberline' THEN 'Above Breckenridge, snowmelt fans across broad stone ledges and gathers speed between the evergreens.'
  WHEN 'valley-before-rain' THEN 'Near Crystal, storm clouds compress the valley while a brief opening sends light across the meadow before the rain.'
  WHEN 'willow-portrait' THEN 'At Lake Shawnee, a broad willow trunk and trailing branches create a natural setting for a relaxed environmental portrait.'
  WHEN 'framed-laughter' THEN 'A burst of laughter breaks through the geometry of a lakeside structure, turning its repeating lines into a spontaneous frame.'
  WHEN 'autumn-by-water' THEN 'Beside the water at Lake Shawnee, an unhurried pose settles naturally into rock, foliage, and the movement of the stream.'
  WHEN 'porchlight-portrait' THEN 'A relaxed pose and candid smile stand out against bold Lake Shawnee architecture and soft garden color.'
  WHEN 'the-vow' THEN 'During a Lake Shawnee ceremony, the surrounding gathering falls away and the couple''s exchange becomes the entire frame.'
  WHEN 'autumn-story' THEN 'At the Overland Park Arboretum, warm backlight connects a bright expression with the bronze figure beside her.'
  WHEN 'winter-reeds' THEN 'At the Baker Wetlands, a low winter sun threads through cattails and turns the frozen water bronze.'
  WHEN 'under-the-open-sky' THEN 'Outside Lawrence, a shared laugh beneath a handmade arbor preserves the easy, open-country character of the wedding.'
  WHEN 'the-unexpected-guest' THEN 'A bride steps into a pasture outside Lawrence and a black horse quietly joins a portrait that belongs specifically to this day.'
  WHEN 'back-to-back' THEN 'Back-to-back beneath a broad Kansas sky, the newlyweds trade traditional posing for a portrait with humor and cinematic edge.'
  ELSE story
END,
updated_at = unixepoch('now') * 1000
WHERE slug IN (
  'canyon-cascade','high-country-passage','night-lift','the-observer','among-the-asters',
  'spring-portrait','first-bloom','crowned-in-autumn','alpine-afterglow','monarch-of-the-meadow',
  'road-beneath-the-stars','cascade-above-timberline','valley-before-rain','willow-portrait',
  'framed-laughter','autumn-by-water','porchlight-portrait','the-vow','autumn-story','winter-reeds',
  'under-the-open-sky','the-unexpected-guest','back-to-back'
);

UPDATE site_settings
SET value_json = '{"heroPhotographSlug":"canyon-cascade","heroTitle":"Photography for the moments you want to keep.","heroLocation":"San Juan Mountains, Colorado","heroStatement":"Portraits, weddings, milestones, and commissioned work—plus fine-art landscapes made for the walls you live with.","signatureStory":"Morning light settles across Monarch Lake as the surrounding peaks emerge in reflected color. Painted Silence captures the stillness of Colorado’s high country—the brief interval when light, water, and mountain become nearly indistinguishable.","featuredCollectionSlug":"mountain-stillness","showServices":true,"showJournal":true,"showNewsletter":true}',
    updated_at = unixepoch('now') * 1000
WHERE key = 'homepage';
