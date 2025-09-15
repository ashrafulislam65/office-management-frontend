// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <>
//       <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
//         <Link href="/signin">Signin</Link>
//         <Link href="/signup">Signup</Link>
//       </nav>
//       <main>
//         <h1>Home Page</h1>
//       </main>
//     </>
//   );
// }


'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1 text-xl font-bold">🏡 HomeOffice</div>
        <div className="flex gap-4">
          <Link href="/signup" className="btn btn-ghost">Signup</Link>
          <Link href="/signin" className="btn btn-ghost">Login</Link>
          <Link href="/admin/dashboard" className="btn btn-ghost">Admin Dashboard</Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 bg-base-200 px-8 py-20">
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <Image
              src="/547708248_24826788166961069_8005857787847002807_n.png"
              alt="Home Office"
              width={400}
              height={400}
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold">
                <span className="text-gray-500">home</span>{' '}
                <span className="text-gray-800">OFFICE</span>
              </h1>
              <p className="py-6 max-w-md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
              <Link href="/signup" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer items-center p-4 bg-base-300 text-base-content">
        <div className="items-center grid-flow-col">
          © {new Date().getFullYear()} HomeOffice — All rights reserved
        </div>
      </footer>
    </div>
  )
}
