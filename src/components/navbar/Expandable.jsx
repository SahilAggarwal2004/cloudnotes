export default function Expandable({ children, expand, className = "" }) {
  return (
    <div className={`grid grid-rows-[0fr] overflow-hidden transition-all duration-200 ${expand && "grid-rows-[1fr]"} ${className}`}>
      <div className="min-h-0">{children}</div>
    </div>
  );
}
