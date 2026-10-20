# Tales from the Road — content guide

Colorado Version 2 is the photographic edition, published October 20, 2026: eight chapters, 20 actual trip photographs and two 12-second silent video excerpts. Originals and existing Lightroom edits are preserved.

## Add or revise a story

1. Add a typed `RoadStory` data file under `lib/tales/`, following `colorado-autumn-2026.ts`.
2. Register it in `lib/tales/index.ts`. Set `published:false` until ready. Published stories automatically enter the archive and sitemap; the most recent publication appears on the homepage and Field Journal.
3. Insert or reorder blocks in the `blocks` array. Keep IDs stable for chapter links. Increment `version` and change `updatedAt` when publishing changes. Do not change `publishedAt` simply to move an old story to the top.
4. Run typecheck, lint, unit tests, build and rendered tests. Inspect the affected pages at 360, 390, 768, 1024 and 1440+ pixels before publishing through the established Worker workflow.

## Blocks

Text: `intro`, `text`, `wildlife`, `campsite`, `route` (paragraphs and optional list). Editorial pull quote: `quote` (not presented as a recorded quotation). Media: `image`, two/three-image `gallery`, `video`, `split` (image and prose), and `behind-shot`. Commercial links: `cta` with print/licensing/partnership kind. Editorial planning: `future`; invisible by default and never shown as an empty image or broken player.

Use hidden `future` blocks as chronological insertion markers. Replace them or insert new blocks beside them when actual material is supplied. The current photographic edition replaces the first entry’s media markers with actual selections.

## Images and originals

Preserve originals outside the web-public directory, including duplicate Nikon frames. Keep a private original-to-derivative manifest; do not publish original metadata or precise location unintentionally. Curate edited selections rather than treating every exposure as a separate photograph.

Generate orientation-correct WebP derivatives (for example 640, 1200 and 2048 pixels wide without upscaling). Provide `width`, `height`, useful `alt`, optional caption/credit and `sources` widths. Use local `/media/...` URLs backed by the existing R2 binding, or static asset URLs deployed through the existing asset workflow. Verify asset delivery before publishing references. No new bucket or service is needed.

`role:"documentary"` is the default editorial choice for trip phone images. Labels can be added selectively through `credit:"From the Road â€” Galaxy S22 Ultra"`. `portfolio` controls the visual treatment of supplied Nikon edits; it does not authorize print sales. Set `approvedFinal:true` only after Michael explicitly approves that image for the catalog. Do not infer camera, species, exact location or exposure settings from a filename. Add a hero only when the actual trip image is identified; homepage/archive/story share that field automatically.

## Edited Nikon photos, Behind the Shot and products

Use `behind-shot` with an approved final image, factual paragraphs, and optional matching catalog photograph slug. The component does not render an unapproved final image. Register real catalog entries/products separately using the existing admin/catalog process. Print links are gated by enabled real variants (sample variants are excluded); the story's bottom print link appears only for an approved story image with a real active product. The first eligible product is linked directly, so there is no empty filtered gallery. Licensing and partnership inquiries carry a server-validated story slug. Story-specific `storyImageId` is separately resolved against published, licensable images; the canonical filename, ID and caption are stored with the inquiry. Catalog image slugs remain separate.

## Video

Use a web MP4 derivative, a lightweight poster, dimensions, a useful title, and a description/transcript. Add a WebVTT captions file for meaningful speech/audio. Keep vertical and landscape aspect ratios. The player is muted with controls, uses `preload="none"`, and attaches its source near the viewport. Optional `mutedPreview:true` plays only while visible, respects reduced-motion preference and handles blocked autoplay. Default is user-initiated playback. Never autoplay sound. The current edition has two silent excerpts, with descriptive text and individual posters. MP4 responses support byte ranges for seeking.

## Editorial boundaries

The chain at Little Hawaii is recounted as a decision and a lesson, not access guidance. The route is a recalled sequence, not navigation directions. Equipment and businesses are trip details, not endorsements or sponsorships. The site-wide Field Kit remains unpublished. Unverified older Colorado 2026 expedition drafts remain unpublished; the new story has its own explicitly evolving route and source.

## Release baseline / rollback

Before Version 2: source `01d8a3adf4db596abfde0c82e87daa6ad14e77fa`, Worker version `297a45c5-58e7-4b49-8d22-5042ec91dbfc`, deployment `9c95a2af-a1e0-4455-9e61-074538b7edb3`. No schema migration is required. A code rollback should not restore an old D1 backup and discard later inquiries. Preserve existing routes, assets and bindings via the established content deployment workflow.

## October 2026 media provenance

The private local selection manifest inventories 261 file occurrences, deduplicated by SHA-256 into 152 unique assets: 39 Nikon JPGs, 98 phone JPGs and 15 MP4s. The brief mentioned 40 Nikon images; only 39 were found locally. Duplicate copies are recorded rather than published twice.

`colorado-media.ts` and `colorado-videos.ts` are the public display manifests. Content-addressed R2 keys contain only orientation-correct, sRGB web copies with metadata removed. No original filesystem paths or GPS coordinates enter the public bundle. Image widths are 640, 1200 and up to 2048 without upscaling; videos are H.264, silent, 24 fps, up to 640px wide, with fast-start metadata. Stored originals remain unchanged.

Selection decisions: DSC_1922 is the pasture hero; DSC_1984 gives the Telluride chapter a broader view than DSC_1983; DSC_2013 has more space around the waterfall than DSC_2014; DSC_2037-HDR balances the sweeping valley and foreground. DSC_2022-HDR and DSC_2043 are retained offline to avoid repeating the same vista. Fine-art sizes, products and prices have not been inferred from these 2560px exports. Exact creek/trail locations remain unassigned where unverified.

Each future story can specify `id`, `locations` and `revisions`, alongside dates, publication status, chapters and media. Keep `approvedFinal`, `photographSlug` and real available products as separate print gates. `licensable` means visitors can request a quote, not that a license has already been granted.
