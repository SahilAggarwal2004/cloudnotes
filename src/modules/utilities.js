import { toast } from "react-toastify";

export function copy(text) {
  navigator.clipboard.writeText(text);
  toast.success("Note copied to clipboard!");
}
