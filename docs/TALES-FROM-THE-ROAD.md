# Tales from the Road — content guide

The Colorado story is Version 1, an evolving entry, not a finished photo essay. Michael confirmed the current trip images/videos are on other devices and unavailable in this workspace. This release is intentionally text-led. No existing archive photo is represented as October 2026 trip media, and no fabricated image or empty player is published.

## Add or revise a story

1. Add a typed `RoadStory` data file under `lib/tales/`, following `colorado-autumn-2026.ts`.
2. Register it in `lib/tales/index.ts`. Set `published:false` until ready. Published stories automatically enter the archive and sitemap; the most recent publication appears on the homepage and Field Journal.
3. Insert or reorder blocks in the `blocks` array. Keep IDs stable for chapter links. Increment `version` and change `updatedAt` when publishing changes. Do not change `publishedAt` simply to move an old story to the top.
4. Run typecheck, lint, unit tests, build and rendered tests. Inspect the affected pages at 360, 390, 768, 1024 and 1440+ pixels before publishing through the established Worker workflow.

## Blocks

Text: `intro`, `text`, `wildlife`, `campsite`, `route` (paragraphs and optional list). Editorial pull quote: `quote` (not presented as a recorded quotation). Media: `image`, two/three-image `gallery`, `video`, and `behind-shot`. Commercial links: `cta` with print/licensing/partnership kind. Editorial planning: `future`; invisible by default and never shown as an empty image or broken player.

Use hidden `future` blocks as chronological insertion markers. Replace them or insert new blocks beside them when actual material is supplied. Current markers cover departure/vehicle, burger stop, first camp, roadside final image, wildlife, Telluride, Little Hawaii, Ewing Gulch and return journey.

## Images and originals

Preserve originals outside the web-public directory, including duplicate Nikon frames. Keep a private original-to-derivative manifest; do not publish original metadata or precise location unintentionally. Curate edited selections rather than treating every exposure as a separate photograph.

Generate orientation-correct WebP derivatives (for example 640, 1200 and 2048 pixels wide without upscaling). Provide `width`, `height`, useful `alt`, optional caption/credit and `sources` widths. Use local `/media/...` URLs backed by the existing R2 binding, or static asset URLs deployed through the existing asset workflow. Verify asset delivery before publishing references. No new bucket or service is needed.

`role:"documentary"` is the default editorial choice for trip phone images. Labels can be added selectively through `credit:"From the Road — Galaxy S22 Ultra"`. A `portfolio` image must have Michael's approval of the final edit; set `approvedFinal:true` only then. Do not infer camera, species, exact location or exposure settings from a filename. Add a hero only when the actual trip image is identified; homepage/archive/story share that field automatically.

## Edited Nikon photos, Behind the Shot and products

Use `behind-shot` with an approved final image, factual paragraphs, and optional matching catalog photograph slug. The component does not render an unapproved final image. Register real catalog entries/products separately using the existing admin/catalog process. Print links are gated by enabled real variants (sample variants are excluded); the story's bottom print link appears only for an approved story image with a real active product. The first eligible product is linked directly, so there is no empty filtered gallery. Licensing and partnership inquiries carry a server-validated story slug and optional catalog image context.

## Video

Use a web MP4 derivative, a lightweight poster, dimensions, a useful title, and a description/transcript. Add a WebVTT captions file for meaningful speech/audio. Keep vertical and landscape aspect ratios. The player is muted with controls, uses `preload="none"`, and attaches its source near the viewport. Optional `mutedPreview:true` plays only while visible, respects reduced-motion preference and handles blocked autoplay. Default is user-initiated playback. Never autoplay sound. There are no videos in this initial text-led release, so live video playback cannot yet be verified.

## Editorial boundaries

The chain at Little Hawaii is recounted as a decision and a lesson, not access guidance. The route is a recalled sequence, not navigation directions. Equipment and businesses are trip details, not endorsements or sponsorships. The site-wide Field Kit remains unpublished. Unverified older Colorado 2026 expedition drafts remain unpublished; the new story has its own explicitly evolving route and source.

## Release baseline / rollback

Before this feature: source `3d4c0c19a18ecbfff24dd71cf38af9a851dd758a`, Worker version `a7cc4077-67b3-4df5-8139-820a612345c9`, deployment `e2538cdf-ae30-4128-bd5e-2bfb1022e004`. No schema migration is required. A code rollback should not restore an old D1 backup and discard later inquiries. Preserve existing routes, assets and bindings via the established content deployment workflow.
