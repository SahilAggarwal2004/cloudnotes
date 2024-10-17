export default function Hamburger({ open }) {
  const genericHamburgerLine = `h-1 w-6 rounded-full bg-white transition transform duration-[250]`;

  return (
    <div className="flex flex-col rounded justify-center items-center space-y-1 scale-75">
      <div className={`${genericHamburgerLine} ${open ? "rotate-45 translate-y-2" : ""}`} />
      <div className={`${genericHamburgerLine} ${open ? "opacity-0" : ""}`} />
      <div className={`${genericHamburgerLine} ${open ? "-rotate-45 -translate-y-2" : ""}`} />
    </div>
  );
};