import { cloneElement, isValidElement } from "react";

export function highlightText(node, searchRegex) {
  if (!searchRegex) return node;
  if (typeof node === "string") {
    const parts = node.split(searchRegex);
    return parts.map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
  }
  if (Array.isArray(node)) return node.map((child) => highlightText(child, searchRegex));
  if (isValidElement(node)) {
    const { children } = node.props;
    const highlightedChildren = highlightText(children, searchRegex);
    if (highlightedChildren === children) return node;
    return cloneElement(node, { children: highlightedChildren });
  }
  return node;
}
