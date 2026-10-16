# Image preparation

## Rule zero

Keep original RAW, TIFF, PSD, and full-resolution master files in an offline or private archive. Upload only purpose-made display derivatives. The public media route can return only objects stored under thumbnail, display, social, or product paths and never has access to a master-file path.

## Recommended derivatives

| Intended use               |       Recommended pixels | Aspect ratio         | Suggested filename                     | Visibility                        |
| -------------------------- | -----------------------: | -------------------- | -------------------------------------- | --------------------------------- |
| Homepage hero              |      2400 × 1600 minimum | 3:2                  | painted-silence-hero-2400x1600.avif    | Public display derivative         |
| Standard landscape display |              2400 × 1600 | 3:2                  | painted-silence-display-2400x1600.webp | Public display derivative         |
| Portrait display           |              1800 × 2250 | 4:5                  | photograph-slug-display-1800x2250.webp | Public display derivative         |
| Square display             |              2000 × 2000 | 1:1                  | photograph-slug-display-2000x2000.webp | Public display derivative         |
| Panoramic display          |              2800 × 1400 | 2:1                  | photograph-slug-display-2800x1400.webp | Public display derivative         |
| Thumbnail                  | 1000 × 1000 bounding box | Preserve composition | photograph-slug-thumbnail-1000.webp    | Public thumbnail derivative       |
| Product detail             |        2800 px long edge | Match print crop     | photograph-slug-product-2800.webp      | Public product-display derivative |
| Social sharing             |               1200 × 630 | 1.91:1               | photograph-slug-social-1200x630.jpg    | Public social derivative          |

Every local CSS placeholder displays its intended filename and ratio in the interface. Replace the placeholder through the administrator editor; do not overwrite source files with a real photograph.

## Export settings

- Convert to sRGB.
- Remove GPS and other private EXIF fields unless intentionally publishing them.
- Preserve enough detail for a large display without approaching the master resolution.
- Use AVIF or WebP for display when the editing workflow supports reliable color; JPEG is accepted as a source derivative.
- Keep each upload below 20 MB.
- Use a conservative screen-sharpening pass.
- Inspect skies, gradients, shadow detail, and wildlife fur or feathers for compression artifacts.
- Do not add a watermark that interferes with viewing unless it is a deliberate brand choice.

The media route creates responsive 480, 768, 1200, 1600, and 2048 pixel outputs in AVIF, WebP, and JPEG where the platform image transformer is available.

## Alternative text

Alternative text should communicate what is important in the actual photograph, not repeat a filename or marketing phrase. Include the subject, relevant setting, meaningful action, and composition only when it helps.

Good structure:

```text
Morning light reflected across Monarch Lake beneath layered mountain peaks.
```

Do not retain the seeded REPLACE WITH ACCURATE ALT TEXT warning after a photograph is published.

## Focal point

Set horizontal and vertical focal points from 0 to 100 in the photograph editor. The public layout uses those values as the object-position for responsive crops. Check each image at mobile, tablet, standard desktop, and ultrawide sizes.

## Upload validation

The protected upload endpoint validates:

- administrator authorization and same-origin mutation context
- accepted MIME type
- JPEG, PNG, WebP, or AVIF file signature
- nonzero dimensions supplied from browser image decoding
- maximum 20 MB size
- randomized object key
- SHA-256 checksum
- object-path allowlist

The service never trusts the client filename to choose an extension.

## Product print files

The browser-facing product derivative is not the print-production file. Store print-production masters in the lab’s approved secure transfer workflow. Confirm crop, color profile, resolution, bleed, border, mat, and sharpening independently for every material and size.

## Launch review

1. View every real derivative on calibrated and ordinary displays.
2. Confirm accurate alt text, title, location, story, and focal point.
3. Verify portrait, landscape, square, and panoramic layouts.
4. Open the keyboard lightbox and test zoom and previous/next navigation.
5. Confirm no network response exposes a master filename or master dimensions.
6. Run Lighthouse with the final hero and at least twelve real gallery images.
