import { Bell } from "lucide-react";

const NavbarNotifications = () => {
  return (
    <button
      type="button"
      className="relative flex size-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
      aria-label="Notifications"
    >
      <Bell className="size-5" />
      <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
    </button>
  );
};

export default NavbarNotifications;
export { NavbarNotifications };
