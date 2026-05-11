"use client";

import { useState } from "react";

export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5efe5] relative">
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
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => setEntered(true)}
            className="px-8 py-4 rounded-full bg-[#eadfcf]/95 border border-[#d8c8ae] backdrop-blur-md text-[#3a2f27] text-lg font-serif shadow-xl hover:scale-105 hover:bg-[#e4d6c2] transition"
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
        <div className="absolute inset-0">
          <img
            src="/welcome-bg.png"
            alt="Bloom & Binding Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#f5efe5]/45 backdrop-blur-md" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-md rounded-[36px] bg-[#efe4d1]/92 backdrop-blur-md shadow-2xl border border-[#dccdb8] px-10 pt-4 pb-8">

            {/* Welcome Header */}
            <div className="flex justify-center -mb-8">
              <img
                src="/welcome-header.png"
                alt="Welcome"
                className="w-[700px] max-w-none h-auto"
              />
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <button className="w-full rounded-2xl bg-black text-white py-5 text-lg font-medium shadow-lg hover:opacity-90 transition flex items-center justify-center gap-3">
                <span className="text-2xl"></span>
                Continue with Apple
              </button>

              <button className="w-full rounded-2xl bg-white border border-[#ddd2c3] py-5 text-lg font-medium text-[#2d241d] hover:bg-[#faf7f1] transition flex items-center justify-center gap-3 shadow-sm">
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-6 h-6"
                />
                Continue with Google
              </button>

              <button className="w-full rounded-2xl bg-[#b9bea7] py-5 text-lg font-medium text-[#2d241d] shadow-sm hover:opacity-90 transition flex items-center justify-center gap-3">
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

            <p className="text-center text-[#6d6258] mt-8 text-lg">
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