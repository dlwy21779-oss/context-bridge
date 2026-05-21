"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

type UploadStatus = "idle" | "dragging" | "uploading" | "success" | "error";

interface UploadedFile {
  name: string;
  size: string;
  type: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function HomePage() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      name: f.name,
      size: formatBytes(f.size),
      type: f.type || "unknown",
    }));

    setStatus("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("success");
          setUploadedFiles((existing) => [...existing, ...newFiles]);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStatus("idle");
    if (e.dataTransfer.files.length > 0) simulateUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStatus("dragging");
  };

  const handleDragLeave = () => setStatus("idle");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files);
    }
  };

  const handleClear = () => {
    setUploadedFiles([]);
    setStatus("idle");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isDragging = status === "dragging";
  const isUploading = status === "uploading";

  return (
    <main style={styles.main}>
      {/* Background blobs */}
      <div style={{ ...styles.blob, ...styles.blob1 }} />
      <div style={{ ...styles.blob, ...styles.blob2 }} />

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logoRow}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#lg)" />
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="36" y2="36">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path d="M10 18c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <circle cx="18" cy="18" r="3" fill="#fff" />
              <path d="M18 10v-3M18 29v-3M10 18H7M29 18h-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={styles.logoText}>Context-Bridge</span>
          </div>
          <nav style={styles.nav}>
            <a href="#" style={styles.navLink}>Docs</a>
            <a href="#" style={styles.navLink}>Pricing</a>
            <button style={styles.navBtn}>Sign in</button>
          </nav>
        </header>

        {/* Hero */}
        <section style={styles.hero}>
          <div style={styles.badge}>✦ Your Second Brain for Digital Knowledge</div>
          <h1 style={styles.h1}>
            Capture, connect &amp;<br />understand everything
          </h1>
          <p style={styles.subtitle}>
            Drop your notes, PDFs, links, and ideas into Context-Bridge.<br />
            We organise, link, and surface the right knowledge — instantly.
          </p>
        </section>

        {/* Upload Card */}
        <section style={styles.cardWrapper}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Upload your knowledge</h2>
            <p style={styles.cardSub}>PDFs, Markdown, TXT, images — anything goes.</p>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              style={{
                ...styles.dropzone,
                ...(isDragging ? styles.dropzoneDragging : {}),
                ...(isUploading ? styles.dropzoneUploading : {}),
                cursor: isUploading ? "default" : "pointer",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {isUploading ? (
                <div style={styles.progressWrapper}>
                  <svg style={styles.spinIcon} width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="16" stroke="#e0e7ff" strokeWidth="4" />
                    <path d="M20 4a16 16 0 0 1 16 16" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  <p style={styles.uploadingText}>Uploading… {progress}%</p>
                  <div style={styles.progressTrack}>
                    <div style={{ ...styles.progressBar, width: `${progress}%` }} />
                  </div>
                </div>
              ) : (
                <>
                  <div style={isDragging ? styles.dropIconDragging : styles.dropIcon}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M20 28V16m0 0l-5 5m5-5l5 5" stroke={isDragging ? "#6366f1" : "#94a3b8"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 30h20" stroke={isDragging ? "#6366f1" : "#94a3b8"} strokeWidth="2.2" strokeLinecap="round" />
                      <rect x="4" y="4" width="32" height="32" rx="8" stroke={isDragging ? "#6366f1" : "#e2e8f0"} strokeWidth="1.5" strokeDasharray="4 3" />
                    </svg>
                  </div>
                  <p style={styles.dropText}>
                    {isDragging ? "Release to upload" : "Drag & drop files here"}
                  </p>
                  <p style={styles.dropHint}>or click to browse your device</p>
                  <div style={styles.fileTypePills}>
                    {["PDF", "MD", "TXT", "PNG", "JPG"].map((t) => (
                      <span key={t} style={styles.pill}>{t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <div style={styles.fileList}>
                <div style={styles.fileListHeader}>
                  <span style={styles.fileListTitle}>
                    ✓ {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} ready
                  </span>
                  <button onClick={handleClear} style={styles.clearBtn}>Clear all</button>
                </div>
                {uploadedFiles.map((file, i) => (
                  <div key={i} style={styles.fileRow}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6366f1" strokeWidth="1.8" />
                      <polyline points="14 2 14 8 20 8" stroke="#6366f1" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                    <span style={styles.fileName}>{file.name}</span>
                    <span style={styles.fileSize}>{file.size}</span>
                  </div>
                ))}
                <button style={styles.indexBtn}>
                  Index into Context-Bridge →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Feature strip */}
        <section style={styles.features}>
          {[
            { icon: "🧠", title: "Smart Linking", desc: "Automatically connects related concepts across all your files." },
            { icon: "⚡", title: "Instant Search", desc: "Find any idea, fact, or document in under a second." },
            { icon: "🔒", title: "Private by default", desc: "Your data stays yours. End-to-end encrypted at rest." },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </section>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} Context-Bridge · Built with Next.js &amp; deployed on Vercel
        </footer>
      </div>
    </main>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
    position: "relative",
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.25,
    pointerEvents: "none",
    zIndex: 0,
  },
  blob1: {
    width: 500,
    height: 500,
    background: "radial-gradient(circle, #6366f1, #8b5cf6)",
    top: -120,
    right: -100,
  },
  blob2: {
    width: 400,
    height: 400,
    background: "radial-gradient(circle, #3b82f6, #06b6d4)",
    bottom: -80,
    left: -80,
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 860,
    margin: "0 auto",
    padding: "0 24px 64px",
  },
  /* Header */
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "28px 0 16px",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoText: { fontSize: 20, fontWeight: 700, color: "#1e1b4b", letterSpacing: "-0.4px" },
  nav: { display: "flex", alignItems: "center", gap: 24 },
  navLink: { color: "#64748b", textDecoration: "none", fontSize: 15, fontWeight: 500 },
  navBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  /* Hero */
  hero: { textAlign: "center", padding: "56px 0 40px" },
  badge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #eef2ff, #ede9fe)",
    color: "#6366f1",
    borderRadius: 20,
    padding: "6px 16px",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 20,
    border: "1px solid #c7d2fe",
  },
  h1: {
    fontSize: "clamp(32px, 5vw, 52px)",
    fontWeight: 800,
    color: "#1e1b4b",
    lineHeight: 1.18,
    margin: "0 0 18px",
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: 17,
    color: "#64748b",
    lineHeight: 1.7,
    margin: 0,
  },
  /* Card */
  cardWrapper: { margin: "8px 0 40px" },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "36px 36px 32px",
    boxShadow: "0 4px 40px rgba(99,102,241,0.10), 0 1px 4px rgba(0,0,0,0.04)",
    border: "1px solid #e8eaf6",
  },
  cardTitle: { fontSize: 20, fontWeight: 700, color: "#1e1b4b", margin: "0 0 6px" },
  cardSub: { fontSize: 14, color: "#94a3b8", margin: "0 0 24px" },
  /* Dropzone */
  dropzone: {
    border: "2px dashed #c7d2fe",
    borderRadius: 14,
    padding: "40px 24px",
    textAlign: "center" as const,
    background: "#fafbff",
    transition: "all 0.2s ease",
    userSelect: "none",
  },
  dropzoneDragging: {
    border: "2px dashed #6366f1",
    background: "#eef2ff",
    transform: "scale(1.01)",
  },
  dropzoneUploading: {
    border: "2px dashed #a5b4fc",
    background: "#f5f3ff",
    cursor: "default",
  },
  dropIcon: { marginBottom: 12 },
  dropIconDragging: { marginBottom: 12, transform: "scale(1.1)", transition: "transform 0.2s" },
  dropText: { fontSize: 16, fontWeight: 600, color: "#334155", margin: "0 0 6px" },
  dropHint: { fontSize: 13, color: "#94a3b8", margin: "0 0 16px" },
  fileTypePills: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" as const },
  pill: {
    background: "#eef2ff",
    color: "#6366f1",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
    border: "1px solid #c7d2fe",
  },
  /* Progress */
  progressWrapper: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 12 },
  spinIcon: { animation: "spin 1s linear infinite" },
  uploadingText: { fontSize: 15, fontWeight: 600, color: "#6366f1", margin: 0 },
  progressTrack: {
    width: "100%",
    maxWidth: 320,
    height: 6,
    background: "#e0e7ff",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    borderRadius: 99,
    transition: "width 0.12s ease",
  },
  /* File list */
  fileList: { marginTop: 20, borderTop: "1px solid #f1f5f9", paddingTop: 20 },
  fileListHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  fileListTitle: { fontSize: 14, fontWeight: 700, color: "#22c55e" },
  clearBtn: {
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 12,
    color: "#94a3b8",
    cursor: "pointer",
  },
  fileRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    background: "#f8faff",
    borderRadius: 8,
    marginBottom: 6,
  },
  fileName: { flex: 1, fontSize: 13, color: "#334155", fontWeight: 500, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" },
  fileSize: { fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" as const },
  indexBtn: {
    marginTop: 14,
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "-0.2px",
  },
  /* Features */
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginBottom: 48,
  },
  featureCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 24px",
    boxShadow: "0 2px 16px rgba(99,102,241,0.07)",
    border: "1px solid #f1f5f9",
  },
  featureIcon: { fontSize: 28, display: "block", marginBottom: 12 },
  featureTitle: { fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: "0 0 8px" },
  featureDesc: { fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 },
  /* Footer */
  footer: { textAlign: "center", fontSize: 13, color: "#94a3b8", borderTop: "1px solid #f1f5f9", paddingTop: 24 },
};
