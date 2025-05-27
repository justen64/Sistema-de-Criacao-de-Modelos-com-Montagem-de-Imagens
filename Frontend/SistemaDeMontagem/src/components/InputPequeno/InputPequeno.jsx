import React from "react";
import styles from "./styles.module.css";

export default function InputPequeno({
  type,
  value,
  placeholder,
  onChange,
  erro,
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={styles.inputPequeno}
      erro={erro}
    />
  );
}
