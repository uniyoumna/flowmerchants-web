import { Search } from "lucide-react";

const NavbarSearch = () => {
  return (
    <div className="flex w-72 items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2 transition-all focus-within:border-[#7C3AED]/40 focus-within:ring-2 focus-within:ring-[#7C3AED]/10">
      <Search className="size-4 text-slate-400 shrink-0" />
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-hidden"
      />
    </div>
  );
};

export default NavbarSearch;
export { NavbarSearch };
