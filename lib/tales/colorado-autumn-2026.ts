import { coloradoMedia as media } from "./colorado-media";
import { coloradoVideos } from "./colorado-videos";
import type { RoadStory, StoryBlock } from "./types";

// Narrative supplied by Michael; actual trip media selected from the October source folder.
const firstEntry: RoadStory = {
  slug: "colorado-autumn-2026",
  title: "Colorado: Chasing Autumn Through the High Country",
  subtitle: "Road miles, fall color, wildlife, mountain weather, unexpected hikes, and nights in a hammock.",
  excerpt: "Two days late, a missed Hardee’s, a burger tradition, five pounds of bacon—and a road that kept pulling me farther south.",
  description: "Michael Kennedy’s evolving Colorado autumn road-trip journal: Granby, Telluride, wildlife, roadside photography and hammock nights in the high country.",
  published: true,
  version: 1,
  publishedAt: "2026-10-16",
  updatedAt: "2026-10-16",
  tripLabel: "Colorado · October 2026",
  growingNote: "This story is still growing. More photographs, field notes, video, and Nikon images from the trip will be added as I finish working through the files.",
  mediaNote: "The first entry begins with the words. Photographs and clips from the road will join the story as I gather and edit them.",
  blocks: [
    { id: "the-late-start", type: "intro", title: "Two days late. One missed breakfast.", paragraphs: [
      "Some trips begin with a carefully followed itinerary. This one started about two days late, at 3:30 in the morning, with a craving for Hardee’s.",
      "By Thursday, October 8, I was finally heading west toward Colorado. I knew there was a Hardee’s somewhere along the route, so I decided to hold out for breakfast. I passed it in the dark.",
      "With breakfast hours running out, I gave up and stopped for a McDonald’s bacon, egg and cheese biscuit. About two exits later: another Hardee’s. An excellent start to the planning portion of the trip."
    ] },
    { id: "departure-media", type: "future", editorialNote: "Insert verified departure, packed-vehicle or highway documentary media after the opening." },
    { id: "burger-tradition", type: "text", title: "The unofficial Colorado tradition", paragraphs: [
      "Granby was the first major objective, but Denver came first. For several years now, a stop at Grandpa’s Burger Haven has been my unofficial Colorado tradition.",
      "This time: a cheeseburger with everything, add bacon, and onion rings. No complicated itinerary required for that stop."
    ] },
    { id: "burger-media", type: "future", editorialNote: "Grandpa’s Burger Haven exterior, if supplied and identified. A personal stop, not sponsorship." },
    { id: "granby", type: "text", title: "Granby, and a five-pound limit", paragraphs: [
      "I wanted to head back toward Monarch Lake. I also had another very specific reason for going to Granby: Fitch Ranch.",
      "Earlier in the year, I had discovered their bacon—especially the apple cinnamon bacon—and brought about five pounds home. This time I deliberately limited myself to another five pounds. That counts as restraint.",
      "Before leaving the area, I stopped at City Market for a case of water, food essentials, Johnsonville jalapeño cheddar sausage, and ice. Once everything was loaded into my Ozark Trail high-performance rolling cooler, I went down the street to Fitch Ranch for the bacon.",
      "They carry much more than bacon. My priorities on this particular stop were simply very clear."
    ] },
    { id: "first-night", type: "campsite", title: "The first night outside", paragraphs: [
      "The first night was a chance to find out how my hammock setup handled colder weather. Temperatures were expected in the low 40s, with a possibility of rain. This was the coldest real-world test I had given this setup so far.",
      "I had a Sunyear hammock with a mosquito net, a Wise Owl underquilt, a rain fly, a Rogue Expedition 0-degree mummy sleeping bag, and a neck pillow. A king-size Bedsure faux-fur comforter was there as backup.",
      "I stayed comfortable without having to lean heavily on the extra comforter. That is how the setup worked for me that night, in those conditions."
    ] },
    { id: "first-camp-media", type: "future", editorialNote: "Insert hammock/setup documentary pair or captioned video. Retain trip-specific gear context only." },
    { id: "quiet-road", type: "route", title: "A few hours without notifications", paragraphs: [
      "Around 11 a.m., I left Granby. A long stretch out of cell service gave me several hours of driving in silence. No constant notifications—just the road and mountain scenery.",
      "The route I noted ran through US 40, CO 131, I-70, CO 133 and CO 92, then on toward Telluride. These are the stretches I remember from the journey, rather than turn-by-turn directions. I reached Telluride around 6 p.m."
    ], items: ["Granby", "US 40 → CO 131 → I-70 → CO 133 → CO 92", "Toward Telluride"] },
    { id: "windshield", type: "quote", text: "Some photographs aren’t planned. Sometimes you see something through the windshield and know you’ll regret it if you don’t pull over." },
    { id: "roadside-discovery", type: "text", title: "The scene that made me stop", paragraphs: [
      "A mountain peak, some fading fall leaves, a bright green field, and cattle. That combination was enough to make this a must-stop photographic moment.",
      "It was one of those discoveries that became part of the trip because I was there to see it."
    ] },
    { id: "roadside-final", type: "future", editorialNote: "Insert identified roadside documentary image; later add approved Nikon edit and Behind the Shot. Do not infer exposure settings or location." },
    { id: "elk", type: "wildlife", title: "An arrival worth slowing down for", paragraphs: [
      "Just outside Telluride, I encountered an elk herd. I stopped for a while to watch and admire them before continuing into town."
    ] },
    { id: "wildlife-media", type: "future", editorialNote: "Curate confirmed encounter images/clips; identify species only when supported. No older elk portfolio substitutions." },
    { id: "telluride", type: "text", title: "Telluride, then one hour in the hot tub", paragraphs: [
      "That evening I walked around Telluride, rode the gondola up to Mountain Village, and ate at Steamies Burger Bar.",
      "After dinner I booked a room through Airbnb at Mountain Lodge Telluride. There was a hot tub—and, after the drive, roughly one hour left before it closed.",
      "I got to the room, changed quickly, and spent that remaining hour relaxing in the water. Sometimes the best plan of the day is the simplest one."
    ] },
    { id: "telluride-media", type: "future", editorialNote: "Insert town, gondola or selected human moments in a two/three-image layout, after Michael identifies them." },
    { id: "library", type: "text", title: "A charging stop and a change of plan", paragraphs: [
      "The next morning I checked out by about 10 a.m. and headed back toward Telluride. I had been told Little Hawaii would be inaccessible, so I started researching how to reach Mystic Falls.",
      "My devices needed charging. I walked to the public library and kept researching while they charged. Then I realized the Little Hawaii trailhead was only a few blocks away."
    ] },
    { id: "little-hawaii", type: "text", title: "“Just looking” became a much bigger hike", paragraphs: [
      "I was not prepared for a serious hike. I had no food and no water. The idea was only to take a look at the trail.",
      "At the trailhead, a chain blocked the entrance. I saw other people using the trail and chose to continue. That was my decision, not evidence that the route was open or safe. Looking back, the barrier and my lack of preparation were reasons to stop—not reasons to keep following other people.",
      "The walk became repeated elevation changes and creek crossings, with water reaching approximately knee depth at times. It required much more effort than I had planned for. Eventually I found the small waterfall and watering-hole area I had been looking for.",
      "By then I was lightheaded and ill. At altitude, with the exertion, no food or water, and dehydration, I was struggling. I experienced symptoms that felt related to the altitude, but this is my account of how I felt, not a medical diagnosis.",
      "The return was difficult. I pushed my way back down, and the priority changed from finding another photograph to finding somewhere quiet to recover. The lesson I brought away was about preparation and knowing when to turn back."
    ] },
    { id: "little-hawaii-media", type: "future", editorialNote: "Add identified creek/waterfall documentary media without presenting this account as access advice. Add edited Black Creek Trail images only after sequencing is confirmed." },
    { id: "ewing-gulch", type: "campsite", title: "Back to Ewing Gulch", paragraphs: [
      "I headed south toward Rico and returned to Ewing Gulch, a small dispersed camping area I had visited years earlier. The place came with a memory.",
      "On that earlier visit, someone had routed water through stacked rocks to form a small sitting pool. I had been making photographs with a lens ball when it cracked, and I left the damaged ball in the bottom of the pool. That was something I should have packed out.",
      "This time I was curious whether it would still be there. But the old sitting pool was gone, the routed-water arrangement was gone, and there was no water there to inspect.",
      "I still used the area to camp. I hung the hammock and rested for the night. It was approximately 38°F, with intermittent rain overnight."
    ] },
    { id: "ewing-media", type: "future", editorialNote: "Add confirmed campsite, hammock and weather media. Preserve originals; publish web derivatives only." },
    { id: "toward-home", type: "text", title: "Pointing back toward Kansas", paragraphs: [
      "By morning I felt significantly better, although not completely recovered. I decided to begin the trip back toward Kansas.",
      "That is where this entry pauses for now. There are more files to work through, more photographs to edit, and more of the road to put into words."
    ] },
    { id: "next-chapter", type: "future", editorialNote: "Append the return journey and corrected chronology here when Michael supplies it. Edited Nikon selections can also be inserted into the relevant earlier chapters." }
  ]
};

const prose = (...ids: string[]) => ids.flatMap(id=>{
  const block=firstEntry.blocks.find(b=>b.id===id);
  return block && "paragraphs" in block ? block.paragraphs : [];
});
const photo = (id: string, filename: string): StoryBlock => ({id,type:"image",fullWidth:true,image:media[filename]});
export const coloradoAutumn2026: RoadStory = {
  ...firstEntry,
  id:"colorado-autumn-2026",
  version:2,
  updatedAt:"2026-10-20",
  subtitle:"Five pounds of bacon, mountain roads, wildlife, changing weather, and the adventures that never quite go according to plan.",
  growingNote:"This story is still growing. These photographs and field notes are the beginning; more memories, edits, and details from the road will find their way here.",
  mediaNote:undefined,
  locations:["Colorado","Denver","Granby","Telluride","Mountain Village","Ewing Gulch"],
  revisions:[{date:"2026-10-16",note:"First written field journal."},{date:"2026-10-20",note:"Photographic edition with eight chapters, selected Nikon and phone images, and video excerpts."}],
  hero:media["DSC_1922.jpg"],
  blocks:[
    {id:"the-late-start",type:"intro",title:"01 / A Late Start and a Missed Breakfast",paragraphs:prose("the-late-start")},
    {id:"departure-media",type:"split",title:"West, eventually.",image:media["20261008_085702.jpg"],paragraphs:["Two days late, but finally on the road. The breakfast plan had already gone sideways; the Colorado part was still ahead of me."]},
    {id:"burger-tradition",type:"text",title:"02 / Some Traditions Are Worth the Detour",paragraphs:prose("burger-tradition")},
    {id:"burger-media",type:"split",reverse:true,title:"Five pounds counts as restraint.",image:media["4b687509-a2ba-436d-a158-b241a9282489.jpg"],paragraphs:prose("granby")},
    {id:"first-night",type:"campsite",title:"03 / First Night in the Wild",paragraphs:prose("first-night")},
    {id:"first-evening",type:"gallery",images:[media["20261008_183826.jpg"],media["20261009_101929.jpg"]]},
    {id:"quiet-road",type:"route",title:"04 / Miles Without a Signal",paragraphs:prose("quiet-road"),items:["Granby","US 40 → CO 131 → I-70 → CO 133 → CO 92","Toward Telluride"]},
    {id:"windshield",type:"quote",text:"Some photographs aren’t planned. Sometimes you see something through the windshield and know you’ll regret it if you don’t pull over."},
    {id:"roadside-discovery",type:"split",title:"The scene that made me stop",image:media["20261009_171118.jpg"],paragraphs:[...prose("roadside-discovery"),"The pasture photograph at the start of this story is the Nikon frame from that stop. This phone portrait is the other side of it: me, the roadside, and the landscape that interrupted the drive."]},
    {id:"telluride",type:"text",title:"05 / Telluride at Last",paragraphs:prose("elk")},
    photo("wildlife-media","20261009_175613.jpg"),
    {id:"telluride-evening",type:"text",paragraphs:prose("telluride")},
    photo("telluride-overlook","DSC_1984.jpg"),
    {id:"telluride-details",type:"gallery",images:[media["20261009_184420.jpg"],media["DSC_1973-HDR.jpg"]]},
    photo("autumn-waterway","DSC_1925.jpg"),
    {id:"little-hawaii",type:"text",title:"06 / The Hike That Wasn’t Supposed to Happen",paragraphs:prose("library")},
    {id:"forest-details",type:"gallery",images:[media["DSC_1992-HDR.jpg"],media["DSC_1999.jpg"]]},
    {id:"just-looking",type:"text",paragraphs:prose("little-hawaii").slice(0,3)},
    {id:"woodland-water",type:"gallery",images:[media["DSC_2003.jpg"],media["DSC_2006.jpg"]]},
    {id:"waterfall-frame",type:"split",title:"The water, and the way back",image:media["DSC_2013.jpg"],paragraphs:prose("little-hawaii").slice(3)},
    coloradoVideos.waterfall,
    {id:"ewing-gulch",type:"campsite",title:"07 / An Old Place, a Different Memory",paragraphs:prose("ewing-gulch").map(p=>p.replace("I headed south toward Rico and returned to Ewing Gulch", "I returned to Ewing Gulch, south of Rico"))},
    {id:"camp-morning",type:"gallery",images:[media["20261011_080145.jpg"],media["20261011_082913.jpg"]]},
    coloradoVideos.river,
    {id:"quiet-detail",type:"split",reverse:true,title:"A quieter morning",image:media["DSC_2005.jpg"],paragraphs:["By morning I felt significantly better, although not completely recovered. I decided to begin the trip back toward Kansas."]},
    {id:"toward-home",type:"text",title:"08 / The Road Continues",paragraphs:["I came for the landscapes and fall color. What stays with me is a little less orderly: the burger stop, the elk, the pasture I hadn’t planned to photograph, and a hike that taught me to take my own limits more seriously.","That is where this entry pauses. I still have photographs to work through and details to put into words. The next trip can wait long enough for me to learn something from this one."]},
    photo("valley-finale","DSC_2037-HDR.jpg")
  ]
};
