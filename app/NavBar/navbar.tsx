import Link from "next/link";

export default function NavBar() {
  return (
    <nav>
      <div class="navbar bg-base-100 shadow-sm">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl bg-[#B9E8EA]">Office Management</a>
        </div>
        <div class="flex gap-2">
          <Link href="/about">About Page</Link>
          <Link href="./Login">Login</Link>
          <Link href="./Register">Register</Link>
          <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <a class="justify-between">
                  Profile
                  <span class="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}