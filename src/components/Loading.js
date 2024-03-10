export default function Loading({ text }) {
  return (
    <div className="fixed top-0 flex h-full w-full flex-col items-center justify-center space-y-2">
      <div className="h-[1.375rem] w-[1.375rem] animate-spin-fast rounded-[50%] border-2 border-transparent border-b-black border-t-black" />
      {text && <p>{text}</p>}
    </div>
  );
}
