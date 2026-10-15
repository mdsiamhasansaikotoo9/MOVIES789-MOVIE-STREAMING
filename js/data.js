/* Movies 789 — demo catalog
   Everything here is placeholder/fictional content for a UI demo. */

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Horror",
  "Sci-Fi", "Romance", "Thriller", "Animation", "Documentary"
];

const MOVIES = [
  { id: 1,  title: "Neon Requiem",        year: 2025, runtime: "2h 08m", rating: 8.6, genres: ["Action", "Sci-Fi", "Thriller"], seed: "neon-requiem",
    blurb: "A rogue courier races through a rain-drenched megacity to deliver the one file that can topple a syndicate." },
  { id: 2,  title: "The Long Harbor",     year: 2024, runtime: "1h 54m", rating: 7.9, genres: ["Drama"], seed: "long-harbor",
    blurb: "A dockworker returns to her hometown to settle her father's estate and confronts a secret that split the family." },
  { id: 3,  title: "Paper Constellations", year: 2023, runtime: "1h 47m", rating: 8.2, genres: ["Romance", "Drama"], seed: "paper-constellations",
    blurb: "Two architecture students trade blueprints and secrets over a single competition-winning summer." },
  { id: 4,  title: "Undergrowth",         year: 2025, runtime: "1h 39m", rating: 8.0, genres: ["Horror", "Thriller"], seed: "undergrowth",
    blurb: "A botanist studying an invasive vine realizes it's been mapping the town's houses for a reason." },
  { id: 5,  title: "Copperline",          year: 2022, runtime: "2h 15m", rating: 8.8, genres: ["Drama", "Documentary"], seed: "copperline",
    blurb: "The rise and fall of a mining town told through three generations of the same family." },
  { id: 6,  title: "Low Tide Radio",      year: 2024, runtime: "1h 42m", rating: 7.8, genres: ["Comedy", "Drama"], seed: "low-tide-radio",
    blurb: "A failing pirate radio station gets one last shot at relevance during a coastal storm." },
  { id: 7,  title: "Ashfall",             year: 2025, runtime: "2h 02m", rating: 7.2, genres: ["Action", "Adventure"], seed: "ashfall",
    blurb: "A volcanologist and a smuggler are forced to cross a closed exclusion zone together." },
  { id: 8,  title: "Kindling",            year: 2023, runtime: "1h 36m", rating: 8.0, genres: ["Animation", "Adventure"], seed: "kindling",
    blurb: "A small clockwork fox sets out to relight the lanterns of a village that forgot how to dream." },
  { id: 9,  title: "The Understudy",      year: 2024, runtime: "1h 58m", rating: 8.4, genres: ["Drama", "Thriller"], seed: "understudy",
    blurb: "A theater understudy starts living her lead actress's life a little too convincingly." },
  { id: 10, title: "Glass Orchard",       year: 2022, runtime: "1h 45m", rating: 7.6, genres: ["Romance"], seed: "glass-orchard",
    blurb: "A greenhouse keeper and a traveling glassblower rebuild an abandoned orchard, and each other." },
  { id: 11, title: "Static Horizon",      year: 2025, runtime: "2h 11m", rating: 8.9, genres: ["Sci-Fi", "Drama"], seed: "static-horizon",
    blurb: "The last radio operator on a dying space station keeps broadcasting to a planet that stopped answering." },
  { id: 12, title: "Hollow Points",       year: 2023, runtime: "1h 51m", rating: 7.4, genres: ["Thriller", "Action"], seed: "hollow-points",
    blurb: "A retired negotiator is pulled back in for a hostage situation with no clear demands." },
  { id: 13, title: "Marrow Road",         year: 2024, runtime: "1h 49m", rating: 7.1, genres: ["Horror"], seed: "marrow-road",
    blurb: "A highway crew keeps finding the same stretch of road repaving itself overnight." },
  { id: 14, title: "Sundial Kids",        year: 2022, runtime: "1h 32m", rating: 7.9, genres: ["Animation", "Comedy"], seed: "sundial-kids",
    blurb: "Three siblings build a time-telling machine out of junkyard scraps to save their grandfather's farm." },
  { id: 15, title: "The Quiet Ledger",    year: 2025, runtime: "2h 04m", rating: 8.3, genres: ["Drama", "Thriller"], seed: "quiet-ledger",
    blurb: "A forensic accountant finds her own name buried in the fraud case she's been hired to solve." },
  { id: 16, title: "Salt & Static",       year: 2023, runtime: "1h 40m", rating: 7.5, genres: ["Comedy", "Romance"], seed: "salt-static",
    blurb: "Two competing weather-app developers are stranded together at the same remote research station." },
  { id: 17, title: "Doorframe",           year: 2024, runtime: "1h 33m", rating: 7.3, genres: ["Horror", "Drama"], seed: "doorframe",
    blurb: "A carpenter restoring an old house keeps finding doors that weren't in the original blueprints." },
  { id: 18, title: "The Cartographer's Debt", year: 2022, runtime: "2h 20m", rating: 8.7, genres: ["Adventure", "Drama"], seed: "cartographers-debt",
    blurb: "A mapmaker sells years of her life to a mysterious guild for one accurate map of the border coast." },
  { id: 19, title: "Vantage",             year: 2025, runtime: "1h 56m", rating: 8.1, genres: ["Sci-Fi", "Action"], seed: "vantage",
    blurb: "A drone pilot discovers her targeting AI has started making decisions she never programmed." },
  { id: 20, title: "Every Other Sunday",  year: 2023, runtime: "1h 44m", rating: 7.8, genres: ["Drama", "Comedy"], seed: "every-other-sunday",
    blurb: "A divorced father and his teenage daughter narrate their shared custody weekends to rival podcasts." },
  { id: 21, title: "The Long Fuse",       year: 2024, runtime: "2h 06m", rating: 8.0, genres: ["Thriller"], seed: "long-fuse",
    blurb: "A bomb-disposal veteran trains her replacement while a copycat threat closes in on both of them." },
  { id: 22, title: "Wallflowers",         year: 2022, runtime: "1h 38m", rating: 7.6, genres: ["Romance", "Comedy"], seed: "wallflowers",
    blurb: "Two wedding-season plus-ones keep getting seated together and start plotting their exits in advance." },
  { id: 23, title: "Iron Tide",           year: 2025, runtime: "2h 12m", rating: 8.5, genres: ["Action", "Drama"], seed: "iron-tide",
    blurb: "A decommissioned tanker crew is called back for one illegal, necessary rescue at sea." },
  { id: 24, title: "The Signal Keepers",  year: 2023, runtime: "1h 59m", rating: 8.2, genres: ["Documentary"], seed: "signal-keepers",
    blurb: "The last operators of analog lighthouses talk through what gets lost when a coastline goes automatic." },
  { id: 25, title: "Nightshade Avenue",   year: 2024, runtime: "1h 47m", rating: 7.0, genres: ["Horror", "Thriller"], seed: "nightshade-avenue",
    blurb: "A new streetlight schedule in a quiet suburb starts changing what the neighbors remember." },
  { id: 26, title: "Firstlight",          year: 2022, runtime: "1h 41m", rating: 7.7, genres: ["Drama"], seed: "firstlight",
    blurb: "A retiring air-traffic controller trains a replacement during the airport's final analog week." },
  { id: 27, title: "The Understory",      year: 2025, runtime: "1h 50m", rating: 8.4, genres: ["Adventure", "Documentary"], seed: "understory",
    blurb: "A canopy researcher spends a year living in the treeline of an old-growth forest slated for sale." },
  { id: 28, title: "Counterweight",       year: 2023, runtime: "2h 01m", rating: 7.9, genres: ["Thriller", "Drama"], seed: "counterweight",
    blurb: "A crane operator becomes the only witness to a construction accident that wasn't one." },
  { id: 29, title: "Pocket Universe",     year: 2024, runtime: "1h 35m", rating: 8.1, genres: ["Animation", "Sci-Fi"], seed: "pocket-universe",
    blurb: "A kid who finds a marble containing a tiny, aging civilization has to decide whether to tell anyone." },
  { id: 30, title: "Rearview",            year: 2025, runtime: "1h 52m", rating: 7.3, genres: ["Comedy", "Drama"], seed: "rearview",
    blurb: "A rideshare driver's last night on the job turns into a slow-motion tour of everyone she almost became." }
];

function posterUrl(seed, w = 400, h = 600) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function genreCounts() {
  const counts = {};
  GENRES.forEach(g => counts[g] = 0);
  MOVIES.forEach(m => m.genres.forEach(g => { counts[g] = (counts[g] || 0) + 1; }));
  return counts;
}
