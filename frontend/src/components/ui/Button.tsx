type ButtonProps = {
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  children: React.ReactNode
}

export function Button({ variant = 'primary', disabled, onClick, type = 'button', children }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium transition'
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
      : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 disabled:opacity-50'

  return (
    <button type={type} className={`${base} ${styles}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

