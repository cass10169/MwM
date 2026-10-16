"use client";
import { useEffect, useRef } from "react";
import { useCart } from "./cart-provider";
export function ClearCart() {
  const { clear } = useCart();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    queueMicrotask(clear);
  }, [clear]);
  return null;
}
