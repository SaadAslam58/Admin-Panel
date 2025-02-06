"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaServicestack, FaBoxes } from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname(); // Get the current route

  return (
    <div className="flex h-full bg-black relative">
      <div className="flex flex-col h-screen w-16 fixed bg-black">
        {/* Optional: Add a Logo or Branding */}
        <div className="flex items-center justify-center h-16 ">
          <span className="text-white text-md font-bold">Hermes</span>
        </div>

        <nav className="flex-grow mt-5">
          <ul className="flex flex-col items-center text-white gap-4">
              {/* Overview Link */}
            <li>
              <Link href="/Overview">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 ${
                    pathname === "/Overview"
                      ? "bg-slate-600 text-white"
                      : "hover:bg-slate-600/50"
                  }`}
                  title="Overview"
                >
                  <FaServicestack className="text-xl" />
                </div>
              </Link>
            </li>
            {/* Orders Link */}
            <li>
              <Link href="/Order">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 ${
                    pathname === "/Order"
                      ? "bg-slate-600 text-white"
                      : "hover:bg-slate-600/50"
                  }`}
                  title="Orders"
                >
                  <FaBoxes className="text-xl" />
                </div>
              </Link>
            </li>

          

            {/* Profile Link */}
            <li>
              <Link href="/Profile">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 ${
                    pathname === "/Profile"
                      ? "bg-slate-600 text-white"
                      : "hover:bg-slate-600/50"
                  }`}
                  title="Profile"
                >
                  <FaUser className="text-xl" />
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;