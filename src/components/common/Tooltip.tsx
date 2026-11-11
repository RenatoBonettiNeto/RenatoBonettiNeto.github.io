import {
  cloneElement,
  useEffect,
  useId,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from 'react';

export function Tooltip({
  text,
  disabled = false,
  children,
}: {
  text: string;
  disabled?: boolean;
  children: ReactElement<HTMLAttributes<HTMLElement>>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || disabled) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [open, disabled]);

  if (disabled) return children;
  return (
    <span
      className="tooltip-trigger"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {cloneElement(children, {
        'aria-describedby': [children.props['aria-describedby'], id]
          .filter(Boolean)
          .join(' '),
      })}
      <span id={id} role="tooltip" className="tooltip-content" hidden={!open}>
        {text}
      </span>
    </span>
  );
}
