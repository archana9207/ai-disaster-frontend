// BUG FIX: replaced invalid `bg-linear-to-br` Tailwind class with an inline
// style gradient. bg-linear-to-br does not exist in Tailwind v3/v4 - the
// correct class is `bg-gradient-to-br`, but since this layout wraps pages that
// already render their own full-screen background we just use a neutral fallback
// so neither auth page is broken by a missing class.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#060c1a' }}
    >
      {children}
    </div>
  );
}