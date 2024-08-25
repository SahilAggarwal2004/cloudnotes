export const charLimit = { minPassword: 8, minName: 3, maxName: 20, otp: 6, maxTitle: 20, maxDescription: 5000, maxTag: 12 };

export const colors = ["#e5e7eb", "#ffffff", "#ff8080", "#ffaa80", "#ffd480", "#ffff80", "#d5ff80", "#aaff80", "#80ff80", "#80ffaa", "#80ffd4", "#80ffff", "#80d4ff", "#80aaff", "#8080ff", "#aa80ff", "#d580ff", "#ff80d5", "#ff80aa", "#ff80ff"];

export const defaultColor = colors[0];

export const hideNavbar = ["/", "/_error"];

export const infinity = Number.MAX_SAFE_INTEGER;

export const onlyGuest = ["/account/signup", "/account/login", "/account/forgot", "/note/[noteId]"];

export const queryKey = ["notes"];

export const unitDurations = { minute: 60 * 1000, hour: 60 * 60 * 1000, day: 24 * 60 * 60 * 1000 };
