interface IconProps {
  name: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

/**
 * Icon component using Remix Icons
 * @param name - The icon name from Remix Icons (e.g., "home-line", "user-fill", "restaurant-line")
 * @param className - Additional CSS classes
 * @param size - Predefined size (xs, sm, md, lg, xl, 2xl, 3xl) or use className for custom size
 *
 * @example
 * <Icon name="home-line" size="lg" />
 * <Icon name="restaurant-fill" className="text-orange-500" />
 */
const Icon = ({ name, className = "", size = "md" }: IconProps) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  return <i className={`ri-${name} ${sizeClasses[size]} ${className}`} />;
};

export default Icon;
