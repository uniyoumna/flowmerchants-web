import { NavbarNotifications } from "./NavbarNotifications";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarUserProfile } from "./NavbarUserProfile";

const Navbar = () => {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-white px-6 shrink-0 z-20">
      {/* ─── Search Bar ─── */}
      <NavbarSearch />

      {/* ─── Right Controls ─── */}
      <div className="flex items-center gap-4">
        <NavbarNotifications />
        <div className="h-7 w-px bg-slate-200" />
        <NavbarUserProfile />
      </div>
    </header>
  );
};

export default Navbar;
export { Navbar };
