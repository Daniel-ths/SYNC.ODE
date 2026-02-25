import { useEffect } from "react";

export default function WhatsappRedirect() {
  useEffect(() => {
    window.location.href =
      "https://wa.me/5591999246801?text=Oi!%20Quero%20um%20orçamento";
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      Redirecionando para o WhatsApp...
    </div>
  );
}