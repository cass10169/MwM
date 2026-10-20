import { describe, it, expect } from "vitest";
import { getRoadStory, getStoryImage, publishedRoadStories, storyInquiry, storyImageInquiry } from "../../lib/tales";
import { inquirySchema } from "../../lib/validation";
import { inquiryMessage } from "../../lib/inquiry-details";
describe("living road stories",()=>{
  it("keeps chapter anchors unique and chronological slots private",()=>{
    for(const story of publishedRoadStories){
      expect(new Set(story.blocks.map(b=>b.id)).size).toBe(story.blocks.length);
      expect(story.blocks.filter(b=>b.type==="future").every(b=>b.type==="future" && !b.visible)).toBe(true);
    }
  });
  it("uses real derivative media and keeps print approval separate",()=>{
    const story=getRoadStory("colorado-autumn-2026")!;
    expect(story.hero?.filename).toBe("DSC_1922.jpg");
    expect(story.hero?.approvedFinal).toBeUndefined();
    expect(story.blocks.some(b=>["image","gallery","video","behind-shot"].includes(b.type))).toBe(true);
    expect(getRoadStory("unpublished-or-unknown")).toBeUndefined();
  });
  it("preserves canonical story and optional image inquiry context",()=>{
    const url=new URL(storyInquiry("colorado-autumn-2026","licensing","painted-silence"),"https://memorieswithmike.com");
    expect(url.searchParams.get("story")).toBe("colorado-autumn-2026");
    expect(url.searchParams.get("image")).toBe("painted-silence");
    const input=inquirySchema.parse({name:"QA Reader",email:"reader@example.com",serviceType:"Licensing",storySlug:"colorado-autumn-2026",intendedUse:"Editorial feature",message:"Interested in a future final edit.",consent:true,website:""});
    expect(inquiryMessage(input)).toContain("Story: Colorado: Chasing Autumn Through the High Country (https://memorieswithmike.com/tales-from-the-road/colorado-autumn-2026)");
  });
});

it("resolves licensing IDs only within published stories",()=>{
 const story=getRoadStory("colorado-autumn-2026")!;
 const id=story.hero!.id;
 expect(getStoryImage(story.slug,id)?.filename).toBe("DSC_1922.jpg");
 expect(getStoryImage("missing",id)).toBeUndefined();
 expect(getStoryImage(story.slug,"unknown")).toBeUndefined();
 expect(storyImageInquiry(story.slug,id)).toContain("storyImage="+id);
 const input=inquirySchema.parse({name:"QA Reader",email:"reader@example.com",serviceType:"Licensing",storySlug:story.slug,storyImageId:id,intendedUse:"Editorial",message:"Please quote this particular image.",consent:true,website:""});
 expect(inquiryMessage(input)).toContain("DSC_1922.jpg");
 expect(inquiryMessage(input)).toContain(id);
});
