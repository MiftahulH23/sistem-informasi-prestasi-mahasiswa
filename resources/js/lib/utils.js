import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function camelToKebab(str) {
  return str
    ? str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    : "";
}
