import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type IconPosition = "start" | "end";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & {
  /** React 19 ref prop for the native button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Accessible label. Rendered visibly when children are not provided. */
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isDisabled?: boolean;
  isLoading?: boolean;
  isInterruptible?: boolean;
  /** Async action with built-in pending/loading handling and duplicate-click guard. */
  clickAction?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  isIconOnly?: boolean;
  endContent?: ReactNode;
  width?: number | string;
  /** Apply button styling/contents to a single child, e.g. React Router Link. */
  asChild?: boolean;
  disabled?: boolean;
};

const baseClasses =
  "relative inline-flex min-w-0 max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border font-medium no-underline transition-[background-color,border-color,color,opacity,transform] active:translate-y-px disabled:pointer-events-none disabled:cursor-default disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:opacity-55";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-primary bg-primary text-white hover:border-[#2b3139] hover:bg-[#2b3139]",
  secondary:
    "border-border-strong bg-surface text-primary hover:border-[#bfc2c7] hover:bg-[#f8f9f9]",
  outline:
    "border-border-strong bg-transparent text-primary hover:bg-accent-soft hover:text-accent-dark",
  ghost:
    "border-transparent bg-transparent text-primary hover:bg-accent-soft hover:text-accent-dark",
  danger: "border-alert bg-alert text-white hover:bg-alert/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[38px] px-[13px] py-0 text-[13px]",
  md: "min-h-11 px-4 py-2 text-sm",
  lg: "min-h-12 px-5 py-2.5 text-base",
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: "size-11 p-0",
  md: "size-11 p-0",
  lg: "size-12 p-0",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: "[&>svg]:size-4",
  md: "[&>svg]:size-4",
  lg: "[&>svg]:size-5",
};

const contentClasses = "min-w-0 overflow-hidden text-ellipsis";

const ButtonIcon = ({
  children,
  size,
}: {
  children: ReactNode;
  size: ButtonSize;
}) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center justify-center text-inherit",
      iconSizeClasses[size],
    )}
    aria-hidden="true"
  >
    {children}
  </span>
);

const renderContent = ({
  label,
  children,
  icon,
  iconPosition,
  endContent,
  isIconOnly,
  isLoading,
  size,
}: {
  label?: string;
  children?: ReactNode;
  icon?: ReactNode;
  iconPosition: IconPosition;
  endContent?: ReactNode;
  isIconOnly: boolean;
  isLoading: boolean;
  size: ButtonSize;
}) => {
  const visibleLabel = children ?? label;
  const iconNode = isLoading ? <span>…</span> : icon;

  if (isIconOnly) {
    return iconNode ? <ButtonIcon size={size}>{iconNode}</ButtonIcon> : null;
  }

  return (
    <>
      {iconNode && iconPosition === "start" ? (
        <ButtonIcon size={size}>{iconNode}</ButtonIcon>
      ) : null}
      <span className={contentClasses}>{visibleLabel}</span>
      {iconNode && iconPosition === "end" ? (
        <ButtonIcon size={size}>{iconNode}</ButtonIcon>
      ) : null}
      {endContent ? (
        <span className="inline-flex shrink-0 items-center text-inherit">
          {endContent}
        </span>
      ) : null}
    </>
  );
};

export const Button = ({
  className,
  label,
  variant = "secondary",
  size = "md",
  type = "button",
  isDisabled = false,
  disabled = false,
  isLoading = false,
  isInterruptible = false,
  clickAction,
  onClick,
  icon,
  iconPosition = "start",
  isIconOnly = false,
  endContent,
  width,
  asChild = false,
  children,
  style,
  ref,
  ...props
}: ButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const actionInFlightRef = useRef(false);
  const loading = isLoading || isPending;
  const inactive = isDisabled || disabled || (loading && !isInterruptible);
  const accessibleLabel =
    label ?? (typeof children === "string" ? children : undefined);
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    isIconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
    className,
  );
  const mergedStyle = width == null ? style : { ...style, width };

  const content = renderContent({
    label,
    children,
    icon,
    iconPosition,
    endContent,
    isIconOnly,
    isLoading: loading,
    size,
  });

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (inactive) {
      event.preventDefault();
      return;
    }

    onClick?.(event);

    if (!clickAction || event.defaultPrevented) return;
    if (actionInFlightRef.current && !isInterruptible) return;

    actionInFlightRef.current = true;
    setIsPending(true);

    try {
      await clickAction(event);
    } finally {
      actionInFlightRef.current = false;
      setIsPending(false);
    }
  };

  if (asChild) {
    const child = Children.only(children);

    if (!isValidElement(child)) {
      throw new Error("Button with asChild expects a single React element.");
    }

    const element = child as ReactElement<{
      className?: string;
      children?: ReactNode;
      style?: CSSProperties;
      "aria-busy"?: boolean;
      "aria-disabled"?: boolean;
      "aria-label"?: string;
    }>;
    const childContent = renderContent({
      label,
      children: element.props.children,
      icon,
      iconPosition,
      endContent,
      isIconOnly,
      isLoading: loading,
      size,
    });

    return cloneElement(element, {
      className: cn(classes, element.props.className),
      style: { ...mergedStyle, ...element.props.style },
      children: childContent,
      "aria-busy": loading || undefined,
      "aria-disabled": inactive || undefined,
      "aria-label": isIconOnly ? accessibleLabel : element.props["aria-label"],
    });
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      style={mergedStyle}
      disabled={inactive}
      aria-busy={loading || undefined}
      aria-label={isIconOnly ? accessibleLabel : undefined}
      onClick={(event) => void handleClick(event)}
      {...props}
    >
      {content}
    </button>
  );
};

Button.displayName = "Button";

export type { ButtonProps, ButtonSize, ButtonVariant, IconPosition };
