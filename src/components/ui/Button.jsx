
export function Button({ children, variant = 'primary', ...props }) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded font-medium transition'
  const variants = {
    primary:   'bg-black text-white hover:bg-gray-800',
    secondary: 'border border-black text-black hover:bg-gray-100',
  }

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  )
}