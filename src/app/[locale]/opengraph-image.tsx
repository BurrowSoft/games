import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#0d0d14",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 96, lineHeight: 1 }}>🎮</div>
      <div
        style={{
          marginTop: 24,
          fontSize: 72,
          fontWeight: 900,
          background: "linear-gradient(90deg, #34d399, #6ee7b7)",
          backgroundClip: "text",
          color: "transparent",
          letterSpacing: "-2px",
        }}
      >
        GamesMole
      </div>
      <div style={{ marginTop: 16, fontSize: 28, color: "#9ca3af", textAlign: "center", maxWidth: 700 }}>
        Live game rankings updated every 5 minutes from Twitch
      </div>
      <div
        style={{
          marginTop: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 999,
          padding: "8px 20px",
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
        <span style={{ fontSize: 18, color: "#34d399", fontWeight: 600 }}>Live Now</span>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
