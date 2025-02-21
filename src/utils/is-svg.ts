import { DOMParser } from "xmldom";

export function isSVG(content: string) {
  try {
    const doc = new DOMParser().parseFromString(content, "text/xml");
    return doc.documentElement.nodeName === "svg";
  } catch (_: unknown) {
    return false;
  }
}
