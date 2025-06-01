export default function LoginCard({ title, children }) {
  return (
    <div className="bg-zinc-900 dark:bg-white px-12 py-10 rounded-3xl w-full max-w-[480px] shadow-[0_0_30px_rgba(0,0,0,0.5)] dark:shadow-[0_0_30px_rgba(0,0,0,0.1)] flex flex-col items-center overflow-hidden transition-all">
      <h4 className="text-white dark:text-zinc-800 text-3xl mb-8 font-semibold transition-colors">{title}</h4>
      {children}
    </div>
  );
}
