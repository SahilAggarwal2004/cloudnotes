export default function Expandable({ children, expand }) {
  return (
    <div className={`grid grid-rows-[0fr] sm:inline-block transition-all duration-200 ${expand && "grid-rows-[1fr]"}`}>
      <div className="min-h-0">{children}</div>
    </div>
  );
}
