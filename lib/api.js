// Penghubung ke back-end Laravel (REST API /api/v1). Hanya dipakai di komponen klien ("use client").
// Alamat API diatur lewat .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace(/\/+$/, "");

const KUNCI_TOKEN = "rental_token";
const KUNCI_AKUN = "rental_akun";

// ---------- penyimpanan sesi (localStorage, aman bila diblokir browser) ----------
const cadangan = {};
function simpan(k, v) {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    if (v === null) delete cadangan[k];
    else cadangan[k] = v;
  }
}
function ambil(k) {
  try {
    return localStorage.getItem(k);
  } catch {
    return cadangan[k] ?? null;
  }
}

export const sesi = {
  token: () => ambil(KUNCI_TOKEN),
  akun() {
    try {
      return JSON.parse(ambil(KUNCI_AKUN) || "null");
    } catch {
      return null;
    }
  },
  /** data = isi jawaban POST /auth/login */
  set(data) {
    simpan(KUNCI_TOKEN, data.token);
    simpan(
      KUNCI_AKUN,
      JSON.stringify({
        id: data.user.id,
        nama: data.user.nama,
        role: data.user.role,
        wajib_ganti_password: !!data.wajib_ganti_password,
      }),
    );
    beritahu();
  },
  ubahAkun(ubah) {
    const a = sesi.akun();
    if (!a) return;
    simpan(KUNCI_AKUN, JSON.stringify({ ...a, ...ubah }));
    beritahu();
  },
  hapus() {
    simpan(KUNCI_TOKEN, null);
    simpan(KUNCI_AKUN, null);
    beritahu();
  },
};

// Komponen SesiProvider mendengarkan perubahan ini (dan 401/403 dari API).
function beritahu(jenis = "berubah", detail) {
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent("rental-sesi", { detail: { jenis, ...detail } }));
}

// ---------- galat ----------
export class ApiError extends Error {
  constructor(status, body = {}) {
    super(body.message || pesanBawaan(status));
    this.name = "ApiError";
    this.status = status;
    this.code = body.code || null;
    this.errors = body.errors || null; // galat per kolom (422)
    this.data = body; // isi lengkap jawaban galat (mis. pesanan_terdampak)
  }
}

function pesanBawaan(status) {
  if (status === 0) return "Tidak bisa terhubung ke server. Pastikan back-end sedang berjalan, lalu coba lagi.";
  if (status === 401) return "Sesi login sudah berakhir. Silakan login lagi.";
  if (status === 403) return "Anda tidak punya akses untuk tindakan ini.";
  if (status === 404) return "Data tidak ditemukan.";
  if (status === 422) return "Periksa lagi isian Anda.";
  if (status === 429) return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  return "Terjadi kesalahan di server. Coba lagi nanti.";
}

// ---------- permintaan ----------
/**
 * opsi: { json, form (FormData), query (objek), auth (bawaan: pakai token bila ada), alihkan401 (bawaan true) }
 * Mengembalikan isi JSON lengkap ({ data, meta, ... }). Melempar ApiError bila gagal.
 */
export async function request(method, path, opsi = {}) {
  let url = API_URL + path;
  if (opsi.query) {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(opsi.query)) if (v !== undefined && v !== null && v !== "") q.append(k, v);
    const s = q.toString();
    if (s) url += (url.includes("?") ? "&" : "?") + s;
  }
  const headers = { Accept: "application/json" };
  let body;
  if (opsi.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opsi.json);
  } else if (opsi.form) {
    body = opsi.form;
  }
  const token = opsi.auth !== false ? sesi.token() : null;
  if (token) headers.Authorization = "Bearer " + token;

  let res;
  try {
    res = await fetch(url, { method, headers, body });
  } catch {
    throw new ApiError(0);
  }
  if (res.status === 204) return {};
  const tipe = res.headers.get("Content-Type") || "";
  const data = tipe.includes("json") ? await res.json().catch(() => ({})) : {};
  if (res.ok) return data;
  const err = new ApiError(res.status, data);
  if (token && opsi.alihkan401 !== false) tanganiSesi(err);
  throw err;
}

// 401 = token habis. 403 GANTI_PASSWORD_DULU = admin wajib ganti kata sandi.
function tanganiSesi(err) {
  if (err.status === 401) {
    const role = sesi.akun()?.role;
    sesi.hapus();
    beritahu("habis", { role });
  } else if (err.status === 403 && err.code === "GANTI_PASSWORD_DULU") {
    sesi.ubahAkun({ wajib_ganti_password: true });
  }
}

export const api = {
  get: (p, o) => request("GET", p, o),
  post: (p, o) => request("POST", p, o),
  put: (p, o) => request("PUT", p, o),
  patch: (p, o) => request("PATCH", p, o),
  del: (p, o) => request("DELETE", p, o),
};

/** Unduh berkas yang butuh token (mis. PDF nota), lalu simpan dengan nama berkas. */
export async function unduh(path, namaBerkas = "dokumen.pdf", query) {
  let url = API_URL + path;
  if (query) {
    const q = new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== ""));
    if (q.toString()) url += "?" + q;
  }
  const headers = { Accept: "application/pdf" };
  if (sesi.token()) headers.Authorization = "Bearer " + sesi.token();
  let res;
  try {
    res = await fetch(url, { headers });
  } catch {
    throw new ApiError(0);
  }
  if (!res.ok) {
    const err = new ApiError(res.status, await res.json().catch(() => ({})));
    tanganiSesi(err);
    throw err;
  }
  const blob = await res.blob();
  const tautan = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = tautan;
  a.download = namaBerkas;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(tautan), 10000);
}

/** Alamat tujuan setelah login berhasil. */
export function tujuanSetelahLogin(data) {
  if (data.user.role === "admin") return data.wajib_ganti_password ? "/admin/ganti-sandi" : "/admin/dashboard";
  return "/user/riwayat";
}

/** Alamat ?next= hanya dipakai bila masih di situs ini dan sesuai peran akun. */
export function nextAman(next, role) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  const keAdmin = next.startsWith("/admin");
  return (role === "admin") === keAdmin ? next : null;
}
