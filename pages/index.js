// import Link from "next/link";
import incidents from "../data/incidents";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000000, #1a1a1a)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      color: "white",
      fontFamily: "Inter, sans-serif"
    }}>
      <h1 style={{
        fontSize: "1.5rem",
        textAlign: "center"
      }}>News Not Found!!!</h1>
    </div>
  );
}