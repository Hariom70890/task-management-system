import * as React from "react"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all duration-200",
    destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm transition-all duration-200",
    outline: "border-2 border-gray-200 bg-white hover:border-blue-500 hover:text-blue-600 active:bg-gray-50 transition-all duration-200",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 shadow-sm transition-all duration-200",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 transition-all duration-200",
    link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 active:text-blue-800 transition-all duration-200"
  }

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs rounded-md",
    lg: "h-12 px-6 text-base rounded-md",
    icon: "h-10 w-10 rounded-full"
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export {Button}