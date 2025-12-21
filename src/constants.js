export const charLimit = {
  name: { min: 3, max: 20 },
  note: { title: { max: 20 }, description: { max: 5000, maxAI: 4000 }, tag: { max: 12 } },
  otp: 6,
  password: { min: 8 },
};

export const colors = [
  "#e5e7eb",
  "#ffffff",
  "#ff8080",
  "#ffaa80",
  "#ffd480",
  "#ffff80",
  "#d5ff80",
  "#aaff80",
  "#80ff80",
  "#80ffaa",
  "#80ffd4",
  "#80ffff",
  "#80d4ff",
  "#80aaff",
  "#8080ff",
  "#aa80ff",
  "#d580ff",
  "#ff80d5",
  "#ff80aa",
  "#ff80ff",
];

export const defaults = { title: "", description: "", tag: "General", color: colors[0] };

export const hideNavbar = ["/", "/_error"];

export const infinity = Number.MAX_SAFE_INTEGER;

export const maxNotes = 25;

export const newNotesKey = "newNotes";

export const newNotePrefix = "new-";

export const onlyGuest = ["/account/signup", "/account/login", "/account/forgot"];

export const queryKey = ["notes"];

export const tagColorsKey = "tagColors";

export const unitDurations = { second: 1000, minute: 60 * 1000, hour: 60 * 60 * 1000, day: 24 * 60 * 60 * 1000 };

export const timeouts = { get: 5 * unitDurations.second, mutation: 8 * unitDurations.second };
