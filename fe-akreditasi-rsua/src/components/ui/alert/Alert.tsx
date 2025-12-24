import { Link } from "react-router";
import { ReactNode } from "react";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  title: string | ReactNode;
  message: string | ReactNode;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
  className = "",
}) => {
  const variantClasses = {
    success: {
      container:
        "border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15",
      icon: "text-success-500",
    },
    error: {
      container:
        "border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15",
      icon: "text-error-500",
    },
    warning: {
      container:
        "border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15",
      icon: "text-warning-500",
    },
    info: {
      container:
        "border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15",
      icon: "text-blue-light-500",
    },
  };

  const icons: Record<AlertProps["variant"], ReactNode> = {
    success: (
      <svg className="fill-current" width="28" height="28" viewBox="0 0 24 24">
        <path d="M3.7 12A8.3 8.3 0 1 1 12 20.3 8.3 8.3 0 0 1 3.7 12Zm8.3-6.1a6.1 6.1 0 1 0 0 12.2 6.1 6.1 0 0 0 0-12.2Zm3.62 4.84a.9.9 0 0 1 0 1.27l-4 4a.9.9 0 0 1-1.28 0L8.38 13.1a.9.9 0 1 1 1.28-1.27l1.53 1.53 3.36-3.37a.9.9 0 0 1 1.27 0Z" />
      </svg>
    ),
    error: (
      <svg className="fill-current" width="28" height="28" viewBox="0 0 24 24">
        <path d="M12 1.85A10.15 10.15 0 1 0 22.15 12 10.16 10.16 0 0 0 12 1.85Zm1 14.62a1 1 0 0 1-2 0v-.01a1 1 0 0 1 2 0Zm0-4.42a1 1 0 0 1-2 0V7.38a1 1 0 0 1 2 0Z" />
      </svg>
    ),
    warning: (
      <svg className="fill-current" width="28" height="28" viewBox="0 0 24 24">
        <path d="M12 1.85A10.15 10.15 0 1 0 22.15 12 10.16 10.16 0 0 0 12 1.85Zm1 14.77a1 1 0 1 1-2 0v-.01a1 1 0 0 1 2 0ZM11 7.38a1 1 0 1 1 2 0v4.62a1 1 0 0 1-2 0Z" />
      </svg>
    ),
    info: (
      <svg className="fill-current" width="28" height="28" viewBox="0 0 24 24">
        <path d="M12 1.85A10.15 10.15 0 1 0 22.15 12 10.16 10.16 0 0 0 12 1.85Zm1 14.77a1 1 0 1 1-2 0v-.01a1 1 0 0 1 2 0ZM11 7.5a1 1 0 1 1 2 0v.01a1 1 0 0 1-2 0Z" />
      </svg>
    ),
  };

  return (
    <div
      className={`rounded-xl border p-4 ${variantClasses[variant].container} ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className={variantClasses[variant].icon}>{icons[variant]}</div>

        <div>
          <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>

          <p className="text-base text-gray-600 dark:text-gray-400">
            {message}
          </p>

          {showLink && (
            <Link
              to={linkHref}
              className="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
            >
              {linkText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
