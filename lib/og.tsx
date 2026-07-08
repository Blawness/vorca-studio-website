import { ImageResponse } from "next/og";
import { LOGO_DATA_URI } from "./og-logo";

// Shared renderer for the `opengraph-image` / `twitter-image` file conventions.
// Kept in one place so every generated card stays on-brand: black canvas,
// blue→cyan accent, wordmark up top, domain on the baseline.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OgImageOptions {
    /** Small label above the title, e.g. "Layanan". */
    eyebrow?: string;
    title: string;
}

export function renderOgImage({ eyebrow, title }: OgImageOptions) {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
                    padding: "72px 80px",
                    backgroundColor: "#000000",
                    // Satori has no radial-gradient support on `background`, so the
                    // glow is a linear wash instead.
                    backgroundImage:
                        "linear-gradient(135deg, #000000 0%, #04121f 55%, #06263a 100%)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- satori only renders <img> */}
                    <img src={LOGO_DATA_URI} width={64} height={64} alt="" />
                    <div
                        style={{
                            fontSize: 26,
                            fontWeight: 700,
                            letterSpacing: 6,
                            color: "#ffffff",
                        }}
                    >
                        VORCA STUDIO
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {eyebrow ? (
                        <div
                            style={{
                                fontSize: 26,
                                letterSpacing: 3,
                                textTransform: "uppercase",
                                color: "#22d3ee",
                                marginBottom: 20,
                            }}
                        >
                            {eyebrow}
                        </div>
                    ) : null}
                    <div
                        style={{
                            fontSize: title.length > 60 ? 60 : 72,
                            fontWeight: 700,
                            lineHeight: 1.15,
                            color: "#ffffff",
                            // Satori needs an explicit clamp; long article titles
                            // would otherwise overflow the canvas.
                            display: "block",
                            lineClamp: 3,
                        }}
                    >
                        {title}
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div
                        style={{
                            display: "flex",
                            width: 120,
                            height: 5,
                            borderRadius: 999,
                            backgroundImage: "linear-gradient(90deg, #2563eb 0%, #22d3ee 100%)",
                        }}
                    />
                    <div style={{ fontSize: 26, color: "#94a3b8" }}>www.vorcastudio.com</div>
                </div>
            </div>
        ),
        size,
    );
}
