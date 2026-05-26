"use client";

import { create } from "zustand";

export interface Toast {
  id: number;
  text: string;
}

interface ToastState {
  toasts: Toast[];
  notify: (text: string) => void;
  dismiss: (id: number) => void;
}

let seq = 0;

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  notify: (text) => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, text }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Вызов из любого места без хука. */
export const notify = (text: string) => useToasts.getState().notify(text);
