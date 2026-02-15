"use client";

import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { SuggestionForm } from "./SuggestionForm";

type Segment = { id: string; name: string; slug: string };

export function SuggestionFormModal({ segments }: { segments: Segment[] }) {
  const [open, setOpen] = useState(false);

  const handleSuccess = useCallback(() => {
    setTimeout(() => setOpen(false), 2000);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-[var(--slovenia-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--slovenia-blue)] focus:ring-offset-2"
      >
        Dodaj predlog
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
                Dodaj predlog
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--slovenia-blue)]"
                aria-label="Zapri"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <SuggestionForm segments={segments} onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
