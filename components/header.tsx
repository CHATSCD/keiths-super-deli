"use client";

import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex flex-1 items-center justify-center">
          <Image
            src="/keiths-logo.png"
            alt="Keith's Superstores - The Fastest And Friendliest"
            width={300}
            height={60}
            priority
            className="h-12 w-auto"
          />
        </div>
      </div>
    </header>
  );
}
