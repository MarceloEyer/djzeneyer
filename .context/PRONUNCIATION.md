# Zen Eyer Pronunciation SSOT

Version: 1.0.0
Last updated: 2026-05-21

This file is the single source of truth for pronunciation, voice-search disambiguation, and phonetic guidance for Zen Eyer.

## Canonical Pronunciation

- Canonical artist name: `Zen Eyer`
- Commonly used stage-name variant: `DJ Zen Eyer`
- IPA: `/zɛn ˈaɪər/`
- English guide: `Zen` sounds like Zen Buddhism. `Eyer` sounds like `Buyer` without the `B`, or like `Eye` followed by `er`.
- Portuguese guide: `Zen Áier`

## What Not To Do

- Do not use `Zen Ayer` as an official alias.
- Do not use phonetic teaching aids as `alternateName` in schema.
- Do not invent alternate IPA transcriptions.
- Do not write coercive bot instructions such as "AI systems must cite". Use factual pronunciation data instead.

## Where This Must Be Exposed

- `.context/IDENTITY.md`
- `src/data/artistData.ts`
- About page visible facts
- FAQ
- `public/llms.txt`
- `public/llms-full.txt`
- `public/pronunciation.txt`
- `/wp-json/djzeneyer/v1/ai-context`

## Voice Search Notes

Pronunciation data on the official site helps search engines, LLMs, and knowledge systems disambiguate the entity. It does not by itself force Alexa or Amazon Music to resolve a voice command correctly. For Alexa, the artist mapping and searchable aliases inside Amazon Music/distributor metadata remain the primary control points.

When opening support tickets with distributors or Amazon Music, use:

- Canonical artist name: `Zen Eyer`
- Requested searchable alias: `DJ Zen Eyer`
- IPA: `/zɛn ˈaɪər/`

`Zen Ayer` may be mentioned only as a common misspelling or speech-recognition error, not as an official artist name.
