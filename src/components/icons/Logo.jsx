/* eslint-disable @next/next/no-img-element */
export default function Logo({ type, width, height }) {
  return (
    <div className="flex select-none justify-center">
      <img
        src="/images/logo.webp"
        alt="CloudNotes"
        width={width || 60}
        height={height || 60}
        className={type === "black" ? "normal:hidden" : type === "white" ? "hidden normal:block" : ""}
        style={type === "white" ? { filter: "invert(90%)" } : {}}
      />
    </div>
  );
}
