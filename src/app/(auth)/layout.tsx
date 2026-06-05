export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* optional decorative grid – comment if missing file */}
      {/* <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" /> */}
      {children}
    </div>
  );
}