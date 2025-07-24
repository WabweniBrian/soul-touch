import Logo from "@/components/common/logo";
import Link from "next/link";
import React, { Suspense } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-brand-indigo-500 relative min-h-screen overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute -bottom-10 -right-10 h-[300px] w-[300px] rounded-full bg-white/10" />
      <div className="absolute bottom-10 right-10 h-[100px] w-[100px] rounded-full bg-white/10" />

      {/* Header */}
      <header className="w-full border-b bg-white px-4 py-6">
        <div className="mx-autp flex max-w-7xl justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold">Soul Touch Academy</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="mx-auto w-full max-w-5xl">
          {/*  Auth Form */}
          <div className="mx-auto w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-background">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
