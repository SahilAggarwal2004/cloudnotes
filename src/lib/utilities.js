import { toast } from "react-toastify";

export function copy(text) {
  navigator.clipboard.writeText(text);
  toast.success("Note copied to clipboard!");
}

export const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getPrefilledFeedbackFormUrl = (name, email) =>
  `https://docs.google.com/forms/d/e/1FAIpQLSctyzAd-wbl-HLBaPVihYO2n7192l6MJWi5vVgJQOmkpVKVWQ/viewform?usp=pp_url&entry.485428648=${encodeURIComponent(name)}&entry.879531967=${encodeURIComponent(email)}`;
