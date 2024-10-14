"use client";
import { useLoading } from "@/app/contexts/Loading";

export default function Loading() {
  const { isLoading } = useLoading();
  return (
    isLoading && (
      <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
        <span className="loading loading-spinner loading-lg text-blue-light"></span>
      </div>
    )
  );
}
