export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f0e6] flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-6xl font-serif text-stone-800 mb-6">
          Bloom & Binding
        </h1>

        <p className="text-xl italic text-stone-600 mb-8">
          Where your reading life blooms.
        </p>

        <div className="bg-white/70 border border-stone-200 rounded-3xl shadow-xl p-8">
          <p className="text-lg text-stone-700 mb-4">
            🌸 Bloom & Binding is officially under construction.
          </p>

          <p className="text-stone-500">
            Dashboard, conservatory magic, and literary adventures coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}