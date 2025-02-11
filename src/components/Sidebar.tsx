"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaUser, FaSignOutAlt, FaBoxes,FaBoxOpen } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";


const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter(); // ✅ Router for redirection

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "GET" });
      if (response.ok) {
        router.push("/"); // ✅ Redirect after logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="md:flex h-full bg-black relative">
      <div className="flex flex-col h-screen w-16 fixed bg-black">
        <div className="flex items-center justify-center h-16">
          <span className="text-white text-md font-bold">Hermes</span>
        </div>

        <nav className="flex-grow mt-5">
          <ul className="flex flex-col items-center text-white gap-4">
            {/* Overview Link */}
            <li>
              <Link href="/Dashboard">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 ${
                    pathname === "/Dashboard" ? "bg-slate-600 text-white" : "hover:bg-slate-600/50"
                  }`}
                  title="Dashboard"
                >
                  <MdSpaceDashboard className="text-xl" />
                </div>
              </Link>
            </li>

            {/* Orders Link */}
            <li>
              <Link href="/Order">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 ${
                    pathname === "/Order" ? "bg-slate-600 text-white" : "hover:bg-slate-600/50"
                  }`}
                  title="Orders"
                >
                  <FaBoxes className="text-xl" />
                </div>
              </Link>
            </li>
             {/* Products Link */}
             <li>
              <Link href="/Product">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 ${
                    pathname === "/Product"
                      ? "bg-slate-600 text-white"
                      : "hover:bg-slate-600/50"
                  }`}
                  title="Products"
                >
                  <FaBoxOpen className="text-xl" />
                </div>
              </Link>
            </li>

            {/* Profile Link */}
            <li>
              <Link href="/Profile">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 ${
                    pathname === "/Profile" ? "bg-slate-600 text-white" : "hover:bg-slate-600/50"
                  }`}
                  title="Profile"
                >
                  <FaUser className="text-xl" />
                </div>
              </Link>
            </li>

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-600"
                title="Logout"
              >
                <FaSignOutAlt className="text-xl text-white" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
