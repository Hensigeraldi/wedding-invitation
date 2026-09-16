"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RSVPEntry = {
  id: string;
  name: string;
  attendance: "yes" | "no";
  guests: number;
  message: string;
  createdAt: string;
};

type RSVPSummary = {
  total: number;
  attending: number;
  notAttending: number;
  totalGuests: number;
  entries: RSVPEntry[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function exportCSV(entries: RSVPEntry[]) {
  const header = ["ID", "Nama", "Kehadiran", "Jumlah Tamu", "Pesan", "Waktu Submit"];
  const rows = entries.map((e) => [
    e.id,
    `"${e.name.replace(/"/g, '""')}"`,
    e.attendance === "yes" ? "Hadir" : "Tidak Hadir",
    e.guests,
    `"${(e.message ?? "").replace(/"/g, '""')}"`,
    new Date(e.createdAt).toLocaleString("id-ID"),
  ]);

  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rsvp-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminRSVPPage() {
  const [secret, setSecret] = useState("");
  const [data, setData] = useState<RSVPSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");

  // Restore token dari sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_secret");
    if (saved) setSecret(saved);
  }, []);

  const fetchData = useCallback(
    async (token: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/rsvp", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          setError("Token salah atau tidak valid. Periksa kembali ADMIN_SECRET Anda.");
          setData(null);
          return;
        }
        if (!res.ok) {
          setError("Gagal mengambil data. Coba lagi.");
          return;
        }
        const json = await res.json();
        setData(json);
        sessionStorage.setItem("admin_secret", token);
      } catch {
        setError("Tidak dapat terhubung ke server.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) fetchData(secret.trim());
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    
    try {
      const res = await fetch(`/api/rsvp/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.ok) {
        fetchData(secret); // Refresh data
      } else {
        alert("Gagal menghapus data.");
      }
    } catch {
      alert("Terjadi kesalahan.");
    }
  };

  const filteredEntries =
    data?.entries.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.message.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || e.attendance === filter;
      return matchesSearch && matchesFilter;
    }) ?? [];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f1117; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .page { min-height: 100vh; padding: 2rem 1rem; }
        .container { max-width: 1100px; margin: 0 auto; }

        /* Header */
        .header { margin-bottom: 2rem; }
        .header h1 { font-size: 1.75rem; font-weight: 700; color: #f8fafc; }
        .header p { color: #94a3b8; margin-top: 0.25rem; font-size: 0.875rem; }
        .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #1e3a5f; color: #60a5fa; margin-left: 0.5rem; }

        /* Login Card */
        .login-card { background: #1e2130; border: 1px solid #2d3748; border-radius: 12px; padding: 2rem; max-width: 420px; margin: 6rem auto; }
        .login-card h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
        .login-card p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1.5rem; }
        .input-group { display: flex; gap: 0.5rem; }
        .input-group input { flex: 1; padding: 0.65rem 1rem; background: #0f1117; border: 1px solid #374151; border-radius: 8px; color: #e2e8f0; font-size: 0.875rem; outline: none; }
        .input-group input:focus { border-color: #3b82f6; }
        .btn { padding: 0.65rem 1.25rem; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
        .btn:hover { opacity: 0.85; }
        .btn-primary { background: #3b82f6; color: #fff; }
        .btn-success { background: #10b981; color: #fff; }
        .btn-danger { background: #ef4444; color: #fff; }
        .btn-sm { padding: 0.4rem 0.75rem; font-size: 0.75rem; border-radius: 6px; }
        .btn-outline { background: transparent; color: #94a3b8; border: 1px solid #374151; }
        .btn-outline:hover { color: #e2e8f0; border-color: #6b7280; }
        .error-msg { color: #f87171; font-size: 0.8rem; margin-top: 0.75rem; padding: 0.6rem 0.85rem; background: #2d1111; border-radius: 6px; border: 1px solid #7f1d1d; }

        /* Stats */
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #1e2130; border: 1px solid #2d3748; border-radius: 10px; padding: 1.25rem 1.5rem; }
        .stat-card .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; font-weight: 600; margin-bottom: 0.5rem; }
        .stat-card .value { font-size: 2rem; font-weight: 700; line-height: 1; }
        .stat-card.green .value { color: #34d399; }
        .stat-card.red .value { color: #f87171; }
        .stat-card.blue .value { color: #60a5fa; }
        .stat-card.amber .value { color: #fbbf24; }

        /* Toolbar */
        .toolbar { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.25rem; }
        .toolbar input { flex: 1; min-width: 200px; padding: 0.6rem 1rem; background: #1e2130; border: 1px solid #2d3748; border-radius: 8px; color: #e2e8f0; font-size: 0.875rem; outline: none; }
        .toolbar input:focus { border-color: #3b82f6; }
        .filter-btns { display: flex; gap: 0.4rem; }
        .filter-btn { padding: 0.5rem 0.9rem; font-size: 0.78rem; font-weight: 600; border-radius: 6px; border: 1px solid #2d3748; background: #1e2130; color: #94a3b8; cursor: pointer; transition: all 0.15s; }
        .filter-btn.active { background: #1e3a5f; border-color: #3b82f6; color: #60a5fa; }
        .filter-btn:hover:not(.active) { border-color: #4b5563; color: #e2e8f0; }

        /* Table */
        .table-wrap { background: #1e2130; border: 1px solid #2d3748; border-radius: 10px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #161a27; padding: 0.75rem 1rem; text-align: left; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; white-space: nowrap; }
        td { padding: 0.85rem 1rem; border-top: 1px solid #1a2035; font-size: 0.875rem; vertical-align: top; }
        tr:hover td { background: #1a2035; }
        .attendance-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
        .attendance-badge.yes { background: #064e3b; color: #34d399; }
        .attendance-badge.no { background: #450a0a; color: #f87171; }
        .message-text { color: #94a3b8; font-size: 0.8rem; max-width: 250px; word-break: break-word; }
        .no-message { color: #374151; font-style: italic; font-size: 0.8rem; }
        .date-text { color: #64748b; font-size: 0.78rem; white-space: nowrap; }

        /* Empty state */
        .empty { text-align: center; padding: 4rem 1rem; color: #4b5563; }
        .empty p { margin-top: 0.5rem; font-size: 0.875rem; }

        /* Top bar */
        .topbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem; }
        .topbar-actions { display: flex; gap: 0.5rem; }

        /* Loading */
        .loading { text-align: center; padding: 4rem; color: #64748b; }
        .spinner { display: inline-block; width: 24px; height: 24px; border: 3px solid #2d3748; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.7s linear infinite; margin-bottom: 0.75rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="page">
        <div className="container">
          {/* ── Login screen ── */}
          {!data && (
            <div className="login-card">
              <h2>🔐 Admin RSVP</h2>
              <p>Masukkan ADMIN_SECRET untuk mengakses daftar tamu.</p>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    id="admin-secret-input"
                    type="password"
                    placeholder="ADMIN_SECRET..."
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    id="admin-login-btn"
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "..." : "Masuk"}
                  </button>
                </div>
                {error && <p className="error-msg">{error}</p>}
              </form>
            </div>
          )}

          {/* ── Dashboard ── */}
          {data && (
            <>
              {/* Header */}
              <div className="topbar">
                <div className="header">
                  <h1>
                    Daftar Tamu RSVP
                    <span className="badge">Admin</span>
                  </h1>
                  <p>Christian &amp; Rodela — 10 Oktober 2026</p>
                </div>
                <div className="topbar-actions">
                  <button
                    id="export-csv-btn"
                    className="btn btn-success"
                    onClick={() => exportCSV(data.entries)}
                  >
                    ⬇ Export CSV
                  </button>
                  <button
                    id="refresh-btn"
                    className="btn btn-outline"
                    onClick={() => fetchData(secret)}
                    disabled={loading}
                  >
                    {loading ? "..." : "↻ Refresh"}
                  </button>
                  <button
                    id="logout-btn"
                    className="btn btn-danger"
                    onClick={() => {
                      sessionStorage.removeItem("admin_secret");
                      setData(null);
                      setSecret("");
                    }}
                  >
                    Keluar
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="stats">
                <div className="stat-card blue">
                  <div className="label">Total Konfirmasi</div>
                  <div className="value">{data.total}</div>
                </div>
                <div className="stat-card green">
                  <div className="label">✓ Hadir</div>
                  <div className="value">{data.attending}</div>
                </div>
                <div className="stat-card red">
                  <div className="label">✗ Tidak Hadir</div>
                  <div className="value">{data.notAttending}</div>
                </div>
                <div className="stat-card amber">
                  <div className="label">Total Tamu (Hadir)</div>
                  <div className="value">{data.totalGuests}</div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="toolbar">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Cari nama atau pesan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="filter-btns">
                  {(["all", "yes", "no"] as const).map((f) => (
                    <button
                      key={f}
                      id={`filter-${f}`}
                      className={`filter-btn ${filter === f ? "active" : ""}`}
                      onClick={() => setFilter(f)}
                    >
                      {f === "all" ? "Semua" : f === "yes" ? "Hadir" : "Tidak Hadir"}
                    </button>
                  ))}
                </div>
                <span style={{ color: "#64748b", fontSize: "0.8rem", marginLeft: "auto" }}>
                  {filteredEntries.length} dari {data.total} entri
                </span>
              </div>

              {/* Table */}
              <div className="table-wrap">
                {loading ? (
                  <div className="loading">
                    <div className="spinner" />
                    <p>Memuat data...</p>
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="empty">
                    <div style={{ fontSize: "2rem" }}>📭</div>
                    <p>Belum ada data RSVP yang sesuai.</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Status</th>
                        <th>Tamu</th>
                        <th>Pesan</th>
                        <th>Waktu Submit</th>
                        <th style={{ textAlign: "right" }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEntries.map((entry, idx) => (
                        <tr key={entry.id}>
                          <td style={{ color: "#4b5563", width: "2rem" }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600 }}>{entry.name}</td>
                          <td>
                            <span className={`attendance-badge ${entry.attendance}`}>
                              {entry.attendance === "yes" ? "✓ Hadir" : "✗ Tidak"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", color: "#94a3b8" }}>
                            {entry.attendance === "yes" ? entry.guests : "—"}
                          </td>
                          <td>
                            {entry.message ? (
                              <span className="message-text">{entry.message}</span>
                            ) : (
                              <span className="no-message">—</span>
                            )}
                          </td>
                          <td>
                            <span className="date-text">{formatDate(entry.createdAt)}</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteEntry(entry.id)}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
