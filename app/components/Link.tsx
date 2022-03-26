import * as React from "react";

interface LinkProps extends React.AnchorHTMLAttributes<any> {}

export default function Link({ children, ...rest }: LinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
