export default function Loading({ text, className = "" }) {
  return (
    <div className={`fixed left-0 top-0 flex h-full max-h-screen w-full max-w-[100vw] flex-col items-center justify-center space-y-2 ${className}`}>
      <div className="h-5.5 w-5.5 animate-spin-fast rounded-[50%] border-2 border-transparent border-b-black border-t-black" />
      {text && <p>{text}</p>}
    </div>
  );
}
