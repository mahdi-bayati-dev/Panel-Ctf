import Link from "next/link";

// app/page.tsx (مثال برای app-router)
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <button className="text-2xl font-bold hover:bg-colorThemeLite-accent/20 border border-colorThemeLite-accent p-4 rounded-2xl text-colorThemeLite-accent">
        <Link href='/login'>login</Link>
      </button>
    </main>
  );
}
