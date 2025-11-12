"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Modal({ children }) {
  const router = useRouter();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center"
      style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(2px)" }}
      aria-modal="true"
      role="dialog"
      onClick={() => router.back()}
    >
      <div
        className="relative w-[min(92vw,900px)] max-h-[86vh] overflow-auto rounded-2xl bg-[#111] p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => router.back()}
          aria-label="Cerrar"
          className="absolute right-4 top-3 text-2xl leading-none"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

