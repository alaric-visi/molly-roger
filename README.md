# The Ghost of Molly Roger

A branching psychic adventure in Victorian England, based on the SCP Foundation
tale [*The Ghost of Molly Roger*](https://scp-wiki.wikidot.com/the-ghost-of-molly-roger)
by psul. Licensed CC BY-SA 3.0 (see `LICENSE`).

## Running it

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # checks the story, then writes the site to dist/
npm run preview    # serve the built dist/ locally
```

`npm run build` runs the story lint and the engine tests first, and stops if either fails.

## Deploying to Netlify

Everything Netlify needs is already in `netlify.toml`: the build command
(`npm run build`), the publish folder (`dist`), Node 20, caching rules and security headers.

**From a Git repository (recommended)**

1. Put this folder in a Git repository and push it to GitHub, GitLab or Bitbucket.
2. In Netlify: *Add new site -> Import an existing project*, and pick the repository.
3. Netlify reads `netlify.toml`, so you can accept the defaults and press *Deploy*.
   Every push after that rebuilds the site; a failing story lint or test stops a broken deploy.

**Or by hand**

1. Run `npm install` then `npm run build`.
2. In Netlify: *Add new site -> Deploy manually*, and drag the `dist` folder onto the page.

**If it's going into an existing site** (e.g. at `/molly-roger/`): the build uses relative paths
(`base: "./"` in `vite.config.js`), so the contents of `dist` can be copied into any folder.
The headers in `netlify.toml` only apply when this folder is its own Netlify site; if you merge
it into another site, copy the `[[headers]]` blocks into that site's config.

**After the first deploy**

- Change the `og:image` URL in `index.html` to the full address
  (e.g. `https://your-site.netlify.app/og-image.png`) so link previews show the picture.
- To redraw the preview image: `python3 tools/make-og-image.py` (needs Pillow; uses macOS fonts).
- Fonts (Inter, Geist, DM Mono) are bundled with the site; only the icons come from cdnjs.
  The security policy allows nothing else. If you add
  analytics or other third-party scripts, add their domains to `Content-Security-Policy`
  in `netlify.toml`.

## Testing and balance

```bash
npm test                    # engine tests (node:test)
npm run lint:story          # story checks
npm run simulate            # random clicking: worst-case spread of endings
npm run simulate:explore    # a curious player: prefers new scenes, avoids rushing endings
```

## Accessibility

- Keyboard: 1-9 pick choices, Space/Enter skip text, Escape closes panels; focus moves to
  the new choices after each scene and stays inside open panels.
- Screen readers: each scene has a hidden heading (its location), the text is announced
  when it finishes typing, decorative art is hidden, controls are named.
- Colour: text and accent colours meet WCAG AA (4.5:1) in both themes.
- Motion: `prefers-reduced-motion` stills the typewriter, particles and transitions.
- Set pieces: every one can be skipped; Settings has a Gentle mode (more time) and an option
  to replace them with plain choices.

## Story tools

```bash
npm run lint:story       # broken links, unreachable scenes, unknown characters/locations
npm run simulate         # 20,000 random playthroughs: ending spread + gated-check stats
npm run simulate -- 100000
```

`npm run build` runs the story lint first and stops if it finds errors.

## Layout

```
index.html                 page shell + About / Story / Journey overlays
src/
  main.js                  entry: wires controls and keyboard, boots the game
  game.js                  game loop: scene changes, rendering, saving
  engine/
    rules.js               pure rules (no DOM) - shared with tools/
    dialogue.js            finds who is speaking in each paragraph
    save.js                versioned saves + storage fallback
  story/
    index.js               merges scenes, adds ids and "Play Again"
    characters.js          names, colours, relationship bars
    locations.js           every place a scene can happen
    acts.js                act title cards, sidebar objectives, the crew list
    scenes/act1.js …       the story itself
    scenes/endings.js
  stage/                   illustration panel: backgrounds + portraits
  ui/                      start screen, typewriter, HUD, journey, overlays, theme
  styles/                  CSS split by area
tools/
  story-lint.js
  simulate.js
```

## Game systems

| System | What it is | Where it's defined |
|---|---|---|
| Relationships | Molly, Worthington, Grace, Vane (0–100) | `story/characters.js` |
| Psychic level | Grows with practice; gates some risky moves | - |
| **Self** (0–100, starts 100) | How much of *you* is intact. Yielding to Molly lowers it; grounding (Grace's lessons, time alone, patience) raises it. Too little and the merger consumes you. | - |
| **Suspicion** (0–100) | Marks in Inspector Vane's ledger, shown as tally marks. Rule-breaking adds marks; at 40+ Vane turns up to the ritual, at 55+ she has read up on Molly's tricks. | - |
| Items | Carried in the Satchel; can unlock choices | `story/items.js` |
| Flags | Things that happened / you know; notes appear in the Satchel | `story/flags.js` |
| Player identity | Name, how Molly addresses you, pronouns | `story/player.js` |

## The story

| Act | File | What happens |
|---|---|---|
| Prologue - *The Cube* | `scenes/prologue.js` | The projection exam. Make a cube, a sail, or nothing at all. |
| I - *Awakening* | `scenes/act1.js` | Molly calls. The library, Grace, Worthington - and Vane's offer to an apprentice. |
| II - *The Heist* | `scenes/act2.js`, `scenes/act2_term.js` | The Michaelmas Term hub (three weeks, one activity each), the Alphabet Vault, and London without a W. |
| III - *The Inquiry* | `scenes/act3_inquiry.js` | Lady Harrowgate's Board. Vane's interview, Grace taken, Worthington's brass bird, the Quiet Ward. |
| IV - *The Ledger* | `scenes/act4_ledger.js` | The Grand Erasure. Muster a crew from the allies you've earned; rob the Ledger in two worlds at once. |
| V - *The Old Bank* | `scenes/act3.js` | The ritual (the original finale), shaped by everything before it. |

Sixteen endings live in `scenes/endings.js`. Epilogue lines (`story/epilogues.js`) are
added to the end of any ending whose conditions they match, so the fates of Pip,
Thomas Ashby, the Captain and others follow from what the player did.

Choices can use `hideWhen: "condition"` to disappear once they no longer make sense
(e.g. a term activity you've already done), and any effect block can bump a counter:
`counters: { allies: 1 }`, checked with `count:allies>=3`.

## Set pieces, Codex, New Game+ and sound

**Set pieces** (`src/ui/setpieces/`) are short interactive moments launched from a choice.
Each has a Begin button, a "Skip - decide for me" link, keyboard controls, and pauses while
the tab is hidden. With set pieces turned off in Settings, the same scene shows plain
choices instead.

| Set piece | Where | Outcomes |
|---|---|---|
| The Examination (`projection`) | Prologue | cube, sail, still |
| The Royal Alphabet Vault (`vault`) | Act II heist | win, lose (sea legs make Molly faster) |
| Inspector Vane's Questions (`interrogation`) | Act III interview | perfect, fair, poor (time depends on Self and Suspicion) |
| Hold On (`anchors`) | Act V ritual | held (replaces the Self check), lost (Grace's anchors and witness help) |

A set-piece choice looks like this; the plain alternatives carry `plainOnly: true`:

```js
{
    text: "Create a distraction with false memories",
    setPiece: "vault",
    skipOutcome: "win",
    outcomes: {
        win: { nextScene: "distraction_success" },
        lose: { nextScene: "molly_lead", relationshipChanges: { "Molly Roger": -5 } }
    }
}
```

**The Codex** (`story/codex.js`) holds people, Roger Molly's six letters and Board papers.
Each entry unlocks the first time its `when` condition holds (a list means "any of"), and
stays unlocked across playthroughs.

**New Game+.** Endings, codex and run count carry over (`rules.newRun`). After a first ending
the `ghost_memory` flag is set at the start of each run: Molly half-remembers you, and you can
say her name before she does (`named_her`). With eight endings found, carrying that to the
Ledger unlocks the hidden 17th ending, *The Ghost of Molly Roger*. Conditions can check
`endings>=N`.

**Sound** (`src/audio/audio.js`) is synthesised with the Web Audio API - no files. Off by
default; Settings turns it on and sets the volume. Each realm has a bed (institution: room tone
and a clock; dream: a shimmering chord; neutral: lamplight hiss), with rain, sea or embers
layered on by ambience, plus effects for choices, act curtains, items, endings and set pieces.

## The look: a Victorian paper theatre

- **Scenery** - `src/stage/art/locations.js` draws each set as layered SVG "flats"
  (`layer(depth, …)`); the stage nudges each layer by its depth as the pointer moves.
  Helpers (windows, gas lamps, bookcases, waves, rooftops, figures…) live in `art/kit.js`.
  Add a set by writing a builder, registering it in `sets`, and pointing a location at it.
- **Locations** - `story/locations.js` names the `set` (plus optional `variant`), the
  `realm` (picks the transition: ink for institution, a chromatic tear for dream, lamplight
  otherwise) and the `ambience` particles (`dust`, `moondust`, `dream`, `letters`, `embers`,
  `rain`, `stars`, `none`).
- **Cast** - characters are cut-paper profile silhouettes (`art/portraits.js`) lit in their
  own colour. A scene's `cast` places them:
  `cast: [{ who: "Grace", mood: "afraid", pos: "left", when: "suspicion>=40" }]`.
  Moods: neutral, pleased, angry, afraid, sad, stern, thoughtful (shown by posture and rim light).
  Without `cast`, the speaker stands alone on the right. Non-speakers step back into shadow.
- **Ending cards** - tarot-style cards in `art/endingCards.js`; each ending needs a `hint`
  for its face-down card in the Endings gallery.
- **Look and layout** - a full-width "studio" app in the style of mikehiggins.me.uk's tools
  (SEO News): Inter for reading, Geist for headings, DM Mono for labels, near-black surfaces
  and hairline borders. Tokens live in `styles/tokens.css`, layout in `styles/layout.css`.
  On desktop the page is exactly one screen tall: stage across the top, story text and choices
  side by side, progress in the right-hand sidebar; long scenes scroll inside the story card.
  Tablets and phones stack into one column. The stage art stays a night-time theatre in both
  light and dark mode.

## Writing scenes

```js
my_scene: {
    act: 2,
    theme: "dream",              // institution | dream | neutral
    location: "dreamspace",      // key from locations.js
    speaker: "Molly Roger",      // shows the portrait; null for narration
    text: "'Ahoy, {lass}!' [[if item:stolen_w]]The W hums in your pocket.[[/if]]",

    // Effects. On a scene: first visit only. On a choice: every time it's picked.
    relationshipChanges: { "Molly Roger": 10 },
    psychicChange: 1,
    selfChange: -5,
    suspicionChange: 10,
    setFlags: ["met_vane"],      clearFlags: [],
    addItems: ["roger_letters"], removeItems: [],

    choices: [
        { text: "...", nextScene: "other_scene", relationshipChanges: { "Grace": 5 } },
        {
            text: "Show Grace the photograph",
            nextScene: "roger_story",
            requires: "item:grace_photo & rel:grace>=20", // greyed out with a hint until met
            hideLocked: false                             // true = hide it entirely instead
        },
        {
            text: "Risky move",
            risky: true,
            nextScene: s => s.self >= 70 ? "win" : "lose", // s has psychicLevel, self, suspicion,
            targets: ["win", "lose"]                       //   relationships, flags, items, visited, player
        }
    ]
}
```

**Conditions** (for `requires` and `[[if ...]]`):
`flag:id`, `item:id`, `visited:scene_id`, `rel:molly>=40` (keys: molly, worthington, grace, vane),
`self<50`, `suspicion>=40`, `psychic>=8`. Prefix `!` to negate, join with `&`.
Text blocks: `[[if COND]]shown if true[[else]]shown if false[[/if]]` (can be nested).

**Tokens:** `{name}`, `{lass}` (lass / lad / matey), `{they}`, `{them}`, `{their}`, `{theirs}`,
`{themself}`, `{they_are}`, `{they_were}`, `{they_have}`. Capitalise the first letter for a
capitalised result: `{They_are} late.`

**Dialogue:** spoken paragraphs are found automatically and shown with the
speaker's colour and a name tag. The speaker is the first character named in
the narration around the quotes (`'Again,' Worthington says.`), "you say/ask…"
for the player, otherwise the previous speaker, the character named in the
paragraph before, or the scene's `speaker`. When it guesses wrong, start the
paragraph with a tag: `@grace: 'Line.'` (any character key), `@you:` for the
player, or `@none:` for a quotation that isn't speech. Tags are never shown.

**Objectives:** each act in `acts.js` lists `objectives` as `[condition, text]`
pairs; the sidebar shows the first whose condition holds, so end with `[null, "..."]`.

Endings use `ending: true` and `endingTitle`; the "Play Again" button is added
automatically. The linter catches typos in field names, unknown flags/items/tokens,
unbalanced `[[if]]` blocks, flags that are checked but never set, and scenes where
every choice is locked.

## Controls

- Click the text, or press Space/Enter, to reveal it instantly
- Keys 1–9 pick a choice
- Escape closes overlays
- Settings: text speed (including instant), light/dark, and whether to show what each choice changed
