import { describe, it, expect } from "vitest";
import { getRoadStory, publishedRoadStories, storyInquiry } from "../../lib/tales";
import { inquirySchema } from "../../lib/validation";
import { inquiryMessage } from "../../lib/inquiry-details";
describe("living road stories",()=>{
  it("keeps chapter anchors unique and chronological slots private",()=>{
    for(const story of publishedRoadStories){
      expect(new Set(story.blocks.map(b=>b.id)).size).toBe(story.blocks.length);
      expect(story.blocks.filter(b=>b.type==="future").every(b=>b.type==="future" && !b.visible)).toBe(true);
    }
  });
  it("does not pass unavailable trip files off as existing imagery",()=>{
    const story=getRoadStory("colorado-autumn-2026")!;
    expect(story.hero).toBeUndefined();
    expect(story.blocks.some(b=>["image","gallery","video","behind-shot"].includes(b.type))).toBe(false);
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
