"use client";

import { useState } from "react";

export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#f5efe5]">
      {/* SCREEN 1 */}
      <div
        className={`absolute inset-0 z-20 transition-all duration-1000 ${
          entered
            ? "opacity-0 pointer-events-none scale-105"
            : "opacity-100 scale-100"
        }`}
      >
        <img
          src="/welcome-bg.png"
          alt="Bloom & Binding Welcome"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-x-0 bottom-44 sm:bottom-8 flex justify-center px-6 z-30">
          <button
            onClick={() => setEntered(true)}
            className="px-8 py-4 rounded-full bg-[#eadfcf]/95 border border-[#d8c8ae] backdrop-blur-md text-[#3a2f27] text-lg font-serif shadow-xl active:scale-95 transition"
          >
            Step Inside
          </button>
        </div>
      </div>

      {/* SCREEN 2 */}
      <div
        className={`absolute inset-0 z-10 transition-all duration-1000 ${
          entered
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* blurred bg */}
        <div className="absolute inset-0">
          <img
            src="/welcome-bg.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#f5efe5]/45 backdrop-blur-md" />
        </div>

        {/* login */}
        <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
          <div className="w-full max-w-md rounded-[32px] bg-[#efe4d1]/92 backdrop-blur-md shadow-2xl border border-[#dccdb8] px-8 pt-4 pb-8">

            <div className="flex justify-center -mb-6">
              <img
                src="/welcome-header.png"
                alt="Welcome"
                className="w-[700px] max-w-none h-auto"
              />
            </div>

            <div className="space-y-4">
              <button className="w-full rounded-2xl bg-black text-white py-4 text-lg font-medium shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-3">
                <span className="text-2xl"></span>
                Continue with Apple
              </button>

              <button className="w-full rounded-2xl bg-white border border-[#ddd2c3] py-4 text-lg font-medium text-[#2d241d] active:scale-[0.98] transition flex items-center justify-center gap-3 shadow-sm">
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-6 h-6"
                />
                Continue with Google
              </button>

              <button className="w-full rounded-2xl bg-[#b9bea7] py-4 text-lg font-medium text-[#2d241d] shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
                Continue with Email
              </button>
            </div>

            <p className="text-center text-[#6d6258] mt-6 text-base">
              Already have an account?{" "}
              <span className="underline cursor-pointer hover:text-[#2d241d]">
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}