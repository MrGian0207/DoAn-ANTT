import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...rest }: ButtonProps) {
  return (
    <div id={styles.button} {...rest}>
      {children}
    </div>
  );
}

