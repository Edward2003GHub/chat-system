import "./InputLabel.css";

export default function InputLabel({
  label,
  placeholderText,
  forr,
  type,
  err,
  errText,
  ...props
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label htmlFor={forr}>{label}</label>
      <input
        type={type}
        id={forr}
        placeholder={placeholderText}
        name={forr}
        {...props}
        className="input-style"
      />
      {err && (
        <p style={{ margin: 0, fontSize: "13px", color: "red" }}>{errText}</p>
      )}
    </div>
  );
}
