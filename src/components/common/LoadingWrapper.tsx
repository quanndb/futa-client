// components/common/LoadingWrapper.client.tsx
"use client";
import { useLoading } from "@/store/LoadingStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Ensures that this component is only rendered on the client-side

const LoadingIndicator = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white opacity-50 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-8 border-solid rounded-full relative">
        <div className="absolute inset-0 w-full h-full border-t-8 border-orange-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default function LoadingWrapper() {
  const { isLoading, setIsLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    // Khi pathname thay đổi, bật loading
    setIsLoading(true);

    // Simulate a small delay to hide loading after transition
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500); // hoặc 300ms tuỳ độ mượt

    return () => clearTimeout(timeout);
  }, [pathname, setIsLoading]);

  return isLoading ? <LoadingIndicator /> : null;
}
