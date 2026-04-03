import { cloneElement, isValidElement } from "react";

export const getIndex = (parentIndex, index) => `${parentIndex === "" ? "" : parentIndex + "-"}${index}`;

export function highlightText(node, searchRegex, index = "") {
  if (!searchRegex) return node;
  if (typeof node === "string") {
    const parts = node.split(searchRegex);
    return parts.map((part, i) => (i % 2 ? <mark key={getIndex(index, i)}>{part}</mark> : part));
  }
  if (Array.isArray(node)) return node.map((child, i) => highlightText(child, searchRegex, getIndex(index, i)));
  if (isValidElement(node)) {
    const { children } = node.props;
    const highlightedChildren = highlightText(children, searchRegex, getIndex(index, "c"));
    if (highlightedChildren === children) return node;
    return cloneElement(node, { children: highlightedChildren });
  }
  return node;
}
