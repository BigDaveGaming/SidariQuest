# Chapter 1 artwork review and production list

The approved [title reference](../art/reference/style_reference_title_screen.png) and [locals sheet](../art/reference/locals_approved_designs_sheet.png) govern character identity and style. Follow the [art brief](ART_BRIEF_CHAPTER1.txt) for compositions and the [asset status](ASSET_STATUS.md) for current local mood names.

## Full-body playtest

Dialogue scenes use six intact full-body assets as the source for closer framing. The dialogue panel hides the lower bodies, and the mini-market counter sits in front of the shopkeeper. Dave uses his existing approved standing design. Sharon has a hands-free standing pose. Spyros Rent-a-Van, Kyria Eleni, Kyrios Spyros and Fat Spyros use the faces and visible clothing from their approved references, extended to full length. Wide location shots establish the setting before the characters move into the foreground for dialogue. Dialogue reactions use movement and text with the standing art.

Original PNGs remain in place. New masters are under `art/raw/approved/`; run the importer to refresh the WebPs, remove nearly transparent edge noise, and add uniform padding. Sharon uses her phone to film the view in the plane. The title, baggage reclaim and arrivals panels show her with empty hands.

## Artwork from the first playtest

- Preserved the title background, logo, tagline, full-body character art, and the existing Dave and Sharon WebPs other than the repaired shocked portrait. The approved title master and reference files remain in the repository.
- Generated and integrated the four location backgrounds from the brief. The office and apartment exterior use warm plaster, terracotta and faded green shutters, with blank signboards. The kitchen and market use a wider palette of tiled floors, olive greens and warm plaster. The in-game title supplies the Greek sign at the hire office.
- Produced a transparent, left-facing Spyros Rent-a-Van normal portrait from the approved portrait reference. It retains his dark curls, moustache, plain navy polo, glasses at the collar and clipboard. It remains available as source material for a future portrait layout.
- Integrated three painted airport panels. Greek airport-sign labels and translations are rendered outside the artwork.
- Redrew the shocked Sharon portrait from the approved crop with opaque figure alpha, a clear edge and no neighbouring image sliver. Preserved the original raw PNG. Full expression-set framing still needs a shared guide.
- Added a transparent fig reward and the illustrated van app icon. The icon master exports to the 180, 192 and 512 px runtime PNG sizes.
- Sharon’s original seven bust files are 640 × 640 with zero fully opaque pixels. Their existing WebPs restore opacity and are visibly usable, but that cleanup left crop and fringe issues. Dave’s 600 × 600 busts have alpha, though the source crop dimensions fall short of the 1024 px masters and contain defects. All twelve old local crops are fully opaque at roughly 430–446 × 245–275, with baked-in captions. Those crops remain as source references rather than game portraits.

## Optional portrait work for a future layout

The files below belong to the earlier bust layout. The current full-body cast is complete.

| Target | Direction and acceptance checks |
| --- | --- |
| `characters/dave_{normal,proud,confused,cringe,fuming,shocked,talking}.png` | Square 1024 px individual masters. Preserve every approved expression and use a shared framing guide. Remove the white hole in confused and the edge slivers in fuming/shocked. Keep fuming’s illustrated steam. |
| `characters/sharon_{normal,proud,confused,cringe,fuming,talking}.png` | Square 1024 px individual masters. Rebuild opaque body alpha while preserving anti-aliased hair, remove the bright edge halo and proud’s patch near her hand, and remove the adjacent crop from fuming. Align her eyes and shoulders between moods. |
| `characters/sharon_full.png` | Technical cleanup only. Inspect the stray speck near the bag. Preserve pose, phone, footwear and framing. |
| `locals/spyros_van_{proud,confused}.png` | Match the approved normal portrait scale, angle, and face shape. Proud is relieved and welcoming. Confused is worried about what the tourists are trying to say. |
| `locals/eleni_{normal,pleased,exasperated}.png`, `locals/kyrios_spyros_{normal,stern,explaining}.png`, `locals/fat_spyros_{normal,laughing,fed_up}.png` | Preserve respective faces, hair, clothes and props from the approved sheet. Individual 1024 × 1024 masters, left-facing, transparent, with no captions or slivers. Eleni is the landlady, Kyrios Spyros is the landlord, and Fat Spyros works at the mini-market. |

## Import and review

Put replacement character and local PNG masters in `art/raw/approved/characters/` and `art/raw/approved/locals/`, and leave the existing raw files intact. Place backgrounds, comic panels and extras in `art/raw/backgrounds/`, `art/raw/intro/` and `art/raw/extras/`. Use the exact filenames from the table and brief. Run:

```sh
python scripts/import-chapter1-art.py
```

The importer needs Pillow, checks master dimensions and basic alpha, emits WebPs and generates the runtime art list used by both the game and offline cache. Preview cut-outs against light and dark backgrounds at phone size. Check for opaque figure interiors, clean edges, matching face and shoulder positions, correct facing and no baked-in captions. Include the generated outputs with the PNG masters in the review.
