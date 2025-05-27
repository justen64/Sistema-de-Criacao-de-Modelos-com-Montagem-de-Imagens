import styles from "./styles.module.css";

export default function Botao({ onClick, texto, className, id }) {
  return (
    <button onClick={onClick} className={className} id={id}>
      {texto}
    </button>
  );
}
