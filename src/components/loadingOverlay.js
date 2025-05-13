export default function LoadingOverlay() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(255,255,255,0.8)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "24px", fontWeight: "bold"
    }}>
      Carregando...
    </div>
  );
}