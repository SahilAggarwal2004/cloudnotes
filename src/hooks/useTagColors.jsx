import { useState } from "react";
import { getStorage, setStorage } from "../modules/storage";
import { defaultColor } from "../constants";

export default function useTagColors() {
  const [tagColors, setTagColors] = useState(getStorage("tag-colors", {}));
  const getTagColor = (tag) => tagColors[tag] || defaultColor;
  const setTagColor = (tag, color) =>
    setTagColors((tagColors) => {
      tagColors[tag] = color;
      setStorage("tag-colors", tagColors);
      return tagColors;
    });

  return { getTagColor, setTagColor };
}
