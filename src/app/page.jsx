import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-gray-600">Bienvenue sur l'application de gestion de cours</h1>
      <a 
        href="/dashboard" 
        className="px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Accéder au tableau de bord
      </a>
    </div>
  );
}
