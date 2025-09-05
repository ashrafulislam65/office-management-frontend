import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link href="/signin">Signin</Link>
        <Link href="/signup">Signup</Link>
      </nav>
      <main>
        <h1>Home Page</h1>
      </main>
    </>
  );
}
