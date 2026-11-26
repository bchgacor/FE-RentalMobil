// Mock API untuk uji tampilan, meniru perilaku controller Laravel (P0). Bukan bagian proyek.
import http from 'node:http';
import crypto from 'node:crypto';

const FE = process.env.FRONTEND_URL || 'http://localhost:3000';
const PORT = 8000;
const akun = [
  { id: 1, nama: 'Admin', email: 'admin@rental.test', password: 'Admin12345', role: 'admin', aktif: true, verif: true, wajib: true },
];
const tokens = new Map();   // token -> id akun
const verif = new Map();    // token verifikasi -> id
const reset = new Map();    // token reset -> {id, exp}
const mail = [];
const hit = {};             // throttle sederhana
const tipe = [
  { id: 1, nama: 'Avanza', merk: 'Toyota', kursi: 7, bahan_bakar: 'bensin', tarif: { dengan_sopir: 750000, lepas_kunci_manual: 350000, lepas_kunci_matic: 400000 }, unit: ['manual', 'matic'] },
  { id: 2, nama: 'Brio', merk: 'Honda', kursi: 5, bahan_bakar: 'bensin', tarif: { dengan_sopir: 650000, lepas_kunci_manual: 300000, lepas_kunci_matic: 350000 }, unit: ['matic', 'manual'] },
  { id: 3, nama: 'Xenia', merk: 'Daihatsu', kursi: 7, bahan_bakar: 'bensin', tarif: { dengan_sopir: 700000, lepas_kunci_manual: 330000, lepas_kunci_matic: 380000 }, unit: ['manual'] },
];
const PENUH = process.env.TGL_PENUH || '';
let nPlat = 1000;
const UNIT = tipe.flatMap((t) => t.unit.map((tr) => ({ id: ++nPlat - 1000, id_tipe: t.id, plat_nomor: `N ${nPlat} A${String.fromCharCode(64 + t.id)}`, tahun: 2022, warna: 'Putih', transmisi: tr, km_terakhir: 10000, status: 'tersedia', detail: { status_kepemilikan: 'milik_perusahaan', no_rangka: 'RK' + nPlat, no_mesin: 'MS' + nPlat } })));
const unitTipe = (t) => UNIT.filter((u) => u.id_tipe === t.id && u.status === 'tersedia'); // tanggal semua unit habis (untuk uji)

const tgl = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const send = (res, s, body) => {
  res.writeHead(s, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(s === 204 ? '' : JSON.stringify(body));
};
const v422 = (res, errors) => send(res, 422, { message: Object.values(errors)[0][0], code: 'VALIDASI_GAGAL', errors });
const pw = (p) => typeof p === 'string' && p.length >= 8 && /\d/.test(p);

async function bodyOf(req) {
  const chunks = []; for await (const c of req) chunks.push(c);
  const buf = Buffer.concat(chunks);
  const ct = req.headers['content-type'] || '';
  if (ct.includes('application/json')) { try { return JSON.parse(buf.toString() || '{}'); } catch { return {}; } }
  if (ct.includes('multipart/form-data') || ct.includes('urlencoded')) {
    const fd = await new Request('http://x', { method: 'POST', headers: { 'content-type': ct }, body: buf }).formData();
    const o = {}; for (const [k, v] of fd.entries()) { if (k.endsWith('[]')) (o[k.slice(0, -2)] ??= []).push(v); else o[k] = v; } return o;
  }
  return {};
}
function auth(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
  const id = m && tokens.get(m[1]);
  return id ? { a: akun.find((x) => x.id === id), t: m[1] } : null;
}

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE', 'Access-Control-Allow-Headers': 'Authorization,Content-Type,Accept' });
    return res.end();
  }
  const url = new URL(req.url, 'http://x');
  const p = url.pathname.replace(/^\/api\/v1/, '');
  const b = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await bodyOf(req) : {};
  const key = `${req.method} ${p}`;
  console.log(key, JSON.stringify(b).slice(0, 200));

  if (key === 'GET /_mock/mail') return send(res, 200, mail);
  if (key === 'POST /_mock/set') { const o = (globalThis.PESANAN || []).find((x) => x.id === +b.id); Object.assign(o, b.ubah); return send(res, 200, { ok: true }); }

  if (key === 'POST /auth/register') {
    const e = {};
    if (!b.nama) e.nama = ['Nama wajib diisi.'];
    if (!/^\S+@\S+\.\S+$/.test(b.email || '')) e.email = ['Format email tidak valid.'];
    else if (akun.some((x) => x.email === b.email && x.verif)) e.email = ['Email sudah dipakai.'];
    if (!/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(b.no_hp || '')) e.no_hp = ['Format nomor HP tidak valid.'];
    if (!b.provinsi) e.provinsi = ['Provinsi wajib diisi.'];
    if (!b.kota) e.kota = ['Kota wajib diisi.'];
    if (!pw(b.password)) e.password = ['Kata sandi minimal 8 karakter dan mengandung angka.'];
    else if (b.password !== b.password_confirmation) e.password = ['Konfirmasi kata sandi tidak cocok.'];
    if (Object.keys(e).length) return v422(res, e);
    const a = { id: akun.length + 1, nama: b.nama, email: b.email, password: b.password, role: 'user', aktif: true, verif: false, wajib: false, no_hp: b.no_hp, provinsi: b.provinsi, kota: b.kota };
    akun.push(a);
    const t = crypto.randomBytes(16).toString('hex'); verif.set(t, a.id);
    mail.push({ to: a.email, url: `${FE}/verifikasi-email?token=${t}` });
    return send(res, 201, { data: { id: a.id, nama: a.nama, email: a.email }, message: 'Cek email Anda untuk verifikasi' });
  }
  if (key === 'POST /auth/verifikasi-email') {
    const id = verif.get(b.token);
    if (!id) return send(res, 422, { message: 'Tautan verifikasi tidak valid atau sudah kedaluwarsa', code: 'TOKEN_TIDAK_VALID' });
    verif.delete(b.token); akun.find((x) => x.id === id).verif = true;
    return send(res, 200, { message: 'Email berhasil diverifikasi' });
  }
  if (key === 'POST /auth/kirim-ulang-verifikasi') {
    const a = akun.find((x) => x.email === b.email);
    if (!a) return send(res, 404, { message: 'Email tidak terdaftar', code: 'EMAIL_TIDAK_TERDAFTAR' });
    const t = crypto.randomBytes(16).toString('hex'); verif.set(t, a.id);
    mail.push({ to: a.email, url: `${FE}/verifikasi-email?token=${t}` });
    return send(res, 200, { message: 'Tautan verifikasi dikirim' });
  }
  if (key === 'POST /auth/login') {
    hit[key] = (hit[key] || 0) + 1;
    if (!b.email || !b.password) return v422(res, { email: ['Email wajib diisi.'] });
    const a = akun.find((x) => x.email === b.email && x.password === b.password);
    if (!a) return send(res, 401, { message: 'Email atau kata sandi salah', code: 'KREDENSIAL_SALAH' });
    if (a.role !== 'admin' && !a.verif) return send(res, 403, { message: 'Email belum diverifikasi', code: 'EMAIL_BELUM_TERVERIFIKASI' });
    const t = crypto.randomBytes(20).toString('hex'); tokens.set(t, a.id);
    return send(res, 200, { data: { token: t, user: { id: a.id, nama: a.nama, role: a.role }, wajib_ganti_password: a.wajib } });
  }
  if (key === 'POST /auth/lupa-password') {
    if (!/^\S+@\S+\.\S+$/.test(b.email || '')) return v422(res, { email: ['Format email tidak valid.'] });
    const a = akun.find((x) => x.email === b.email);
    if (a) { const t = crypto.randomBytes(32).toString('hex'); reset.set(t, { id: a.id }); mail.push({ to: a.email, url: `${FE}/reset-password?token=${t}&email=${encodeURIComponent(a.email)}` }); }
    return send(res, 200, { message: 'Jika email terdaftar, instruksi reset kata sandi telah dikirim' });
  }
  if (key === 'POST /auth/reset-password') {
    const r = reset.get(b.token); const a = r && akun.find((x) => x.id === r.id);
    if (!a || a.email !== b.email) return send(res, 422, { message: 'Tautan reset tidak valid', code: 'TOKEN_RESET_TIDAK_VALID' });
    if (!pw(b.password)) return v422(res, { password: ['Kata sandi minimal 8 karakter dan mengandung angka.'] });
    if (b.password !== b.konfirmasi) return v422(res, { password: ['Konfirmasi kata sandi tidak cocok.'] });
    a.password = b.password; a.wajib = false; a.verif = true; reset.delete(b.token);
    for (const [t, id] of tokens) if (id === a.id) tokens.delete(t);
    return send(res, 200, { message: 'Kata sandi berhasil direset, silakan login' });
  }

  if (p === '/katalog/tipe' && req.method === 'GET') {
    const q = Object.fromEntries(url.searchParams);
    const e = {};
    if (!q.tgl_mulai) e.tgl_mulai = ['Tanggal mulai wajib diisi.'];
    else if (q.tgl_mulai < tgl(1) || q.tgl_mulai > tgl(30)) e.tgl_mulai = ['Tanggal mulai paling cepat besok dan paling jauh 30 hari lagi.'];
    if (!(+q.durasi >= 1 && +q.durasi <= 30)) e.durasi = ['Durasi 1 sampai 30 hari.'];
    if (Object.keys(e).length) return v422(res, e);
    const akhir = new Date(q.tgl_mulai); akhir.setDate(akhir.getDate() + (+q.durasi - 1));
    const kena = PENUH && q.tgl_mulai <= PENUH && akhir.toISOString().slice(0, 10) >= PENUH;
    const data = tipe.filter((t) => !kena)
      .filter((t) => !q.kursi || t.kursi === +q.kursi)
      .filter((t) => unitTipe(t).length)
      .filter((t) => !q.transmisi || unitTipe(t).some((u) => u.transmisi === q.transmisi))
      .map(({ unit, fotoAdmin, ...t }) => ({ ...t, foto: (fotoAdmin || []).map((f) => f.url), rating_rata: t.id === 2 ? 4.8 : null, sisa_unit: unitTipe(t).length }));
    return send(res, 200, { data });
  }
  let m = /^\/katalog\/tipe\/(\d+)$/.exec(p);
  if (m && req.method === 'GET') {
    const t = tipe.find((x) => x.id === +m[1]);
    if (!t) return send(res, 404, { message: 'Data tidak ditemukan', code: 'TIDAK_DITEMUKAN' });
    const { unit, fotoAdmin, ...r } = t;
    return send(res, 200, { data: { ...r, foto: (fotoAdmin || []).map((f) => f.url), rating_rata: t.id === 2 ? 4.8 : null, sisa_unit: url.searchParams.get('tgl_mulai') ? unit.length : null, review: t.id === 2 ? [{ rating: 5, komentar: 'Mobil bersih dan irit.', nama: 'Siti', tgl_review: '2026-10-02' }] : [] } });
  }
  if (key === 'GET /info') return send(res, 200, { data: { jam_operasional: '07.00-21.00', alamat: 'Jl. Contoh No. 1, Malang', telepon: '081234567890', email: 'info@rental.test', batas_antar_gratis: 'Tlogomas' } });

  // ---- perlu login ----
  const s = auth(req);
  if (!s) return send(res, 401, { message: 'Belum login', code: 'BELUM_LOGIN' });
  if (key === 'POST /auth/logout') { tokens.delete(s.t); return send(res, 204); }
  if (key === 'PUT /profil/password') {
    if (b.password_lama !== s.a.password) return v422(res, { password_lama: ['Kata sandi lama salah'] });
    if (!pw(b.password_baru)) return v422(res, { password_baru: ['Kata sandi minimal 8 karakter dan mengandung angka.'] });
    if (b.password_baru !== b.konfirmasi) return v422(res, { password_baru: ['Konfirmasi kata sandi tidak cocok.'] });
    s.a.password = b.password_baru; s.a.wajib = false;
    return send(res, 200, { message: 'Kata sandi berhasil diganti' });
  }
  if (s.a.wajib) return send(res, 403, { message: 'Ganti kata sandi dulu', code: 'GANTI_PASSWORD_DULU' });

  // ---------------- P1a: pesanan pelanggan ----------------
  const TAB = { berlangsung: ['menunggu_pembayaran', 'dikonfirmasi', 'berjalan', 'pengajuan_pembatalan'], riwayat: ['selesai', 'dibatalkan'] };
  const aksi = (o) => ({
    bisa_bayar: o.status === 'menunggu_pembayaran' && !o.lewat,
    bisa_batalkan: o.status === 'menunggu_pembayaran',
    bisa_ajukan_pembatalan: o.status === 'dikonfirmasi' && o.tgl_mulai > tgl(0),
    bisa_review: o.status === 'selesai' && !o.review,
    bisa_unduh_nota: ['dikonfirmasi', 'berjalan', 'selesai', 'pengajuan_pembatalan'].includes(o.status),
    bisa_perpanjang: o.status === 'berjalan',
    bisa_pesan_lagi: ['selesai', 'dibatalkan'].includes(o.status),
  });
  const utama = (a) => a.bisa_bayar ? 'bayar' : a.bisa_ajukan_pembatalan ? 'ajukan_pembatalan' : a.bisa_review ? 'beri_review' : a.bisa_pesan_lagi ? 'pesan_lagi' : null;
  const ringkas = (o) => ({ id: o.id, nomor: o.nomor, status: o.status, tipe: { id: o.tipe.id, nama: o.tipe.nama }, tgl_mulai: o.tgl_mulai, durasi: o.durasi, total_biaya: o.total, aksi_utama: utama(aksi(o)) });
  const lengkap = (o) => ({ ...ringkas(o), jenis_sewa: o.jenis_sewa, transmisi: o.transmisi, tgl_kembali: o.tgl_kembali, jam_serah: o.jam_serah,
    metode_ambil: o.metode_ambil, lokasi_jemput: o.lokasi_jemput, tujuan: o.tujuan,
    plat_nomor: ['berjalan', 'selesai'].includes(o.status) ? o.plat : null,
    pembayaran: { metode: o.metode, status: o.status_bayar, order_id: `PSN-${String(o.id).padStart(4, '0')}-${o.percobaan}` },
    tagihan_tambahan: o.tagihan || null, jaminan: null, hasil_pemeriksaan: null, aksi: aksi(o) });
  globalThis.PESANAN ??= [];
  const P = globalThis.PESANAN;
  if (key === 'POST /pemesanan') {
    if (s.a.role !== 'user') return send(res, 403, { message: 'Akses ditolak', code: 'AKSES_DITOLAK' });
    const t = tipe.find((x) => x.id === +b.id_tipe);
    const e = {};
    if (!t) e.id_tipe = ['Tipe tidak ditemukan.'];
    if (!['dengan_sopir', 'lepas_kunci'].includes(b.jenis_sewa)) e.jenis_sewa = ['Jenis sewa tidak valid.'];
    if (!b.jam_serah) e.jam_serah = ['Jam wajib diisi.'];
    if (b.setuju_syarat !== true) e.setuju_syarat = ['Wajib menyetujui syarat.'];
    if (b.jenis_sewa === 'dengan_sopir' && !b.tujuan) e.tujuan = ['Tujuan wajib diisi.'];
    if (b.jenis_sewa === 'lepas_kunci' && b.setuju_syarat_jaminan !== true) e.setuju_syarat_jaminan = ['Wajib menyetujui syarat jaminan.'];
    if (Object.keys(e).length) return v422(res, e);
    if (P.some((o) => o.akun === s.a.id && o.status === 'menunggu_pembayaran')) return send(res, 409, { message: 'Selesaikan atau batalkan pesanan yang menunggu pembayaran lebih dulu', code: 'PESANAN_MENUNGGU_ADA' });
    const tarif = b.jenis_sewa === 'dengan_sopir' ? t.tarif.dengan_sopir : t.tarif['lepas_kunci_' + b.transmisi];
    const k = new Date(b.tgl_mulai); k.setDate(k.getDate() + b.durasi - 1);
    const o = { id: P.length + 1, akun: s.a.id, nomor: `RM-${b.tgl_mulai.replaceAll('-', '')}-${String(P.length + 1).padStart(4, '0')}`, status: 'menunggu_pembayaran', tipe: t,
      jenis_sewa: b.jenis_sewa, transmisi: b.transmisi || null, tgl_mulai: b.tgl_mulai, durasi: b.durasi, tgl_kembali: k.toISOString().slice(0, 10), jam_serah: b.jam_serah,
      metode_ambil: b.metode_ambil || null, lokasi_jemput: b.lokasi_jemput || null, tujuan: b.tujuan || null, total: tarif * b.durasi, metode: null, status_bayar: 'menunggu', percobaan: 1, plat: 'N 1234 AB' };
    P.push(o);
    const batas = new Date(Date.now() + 3600e3).toISOString();
    return send(res, 201, { data: { id: o.id, nomor: o.nomor, status: o.status, tgl_mulai: o.tgl_mulai, durasi: o.durasi, tgl_kembali: o.tgl_kembali, total_biaya: o.total, batas_pembayaran: batas,
      midtrans: { snap_token: (process.env.SNAP_ASLI ? 'tok-' : 'snap-palsu-') + o.nomor, order_id: `PSN-${String(o.id).padStart(4, '0')}-1` } } });
  }
  if (key === 'GET /pemesanan') {
    const tab = url.searchParams.get('tab'); const page = +(url.searchParams.get('page') || 1); const per = +(url.searchParams.get('per_page') || 10);
    const mine = P.filter((o) => o.akun === s.a.id && (!tab || TAB[tab].includes(o.status))).sort((x, y) => y.id - x.id);
    return send(res, 200, { data: mine.slice((page - 1) * per, page * per).map(ringkas), meta: { page, per_page: per, total: mine.length } });
  }
  let mo = /^\/pemesanan\/(\d+)(\/[a-z-]+)?$/.exec(p);
  if (mo) {
    const o = P.find((x) => x.id === +mo[1] && x.akun === s.a.id);
    if (!o) return send(res, 404, { message: 'Data tidak ditemukan', code: 'TIDAK_DITEMUKAN' });
    const sub = mo[2] || '';
    if (req.method === 'GET' && !sub) return send(res, 200, { data: lengkap(o) });
    if (req.method === 'POST' && sub === '/pembayaran') {
      if (o.status !== 'menunggu_pembayaran') return send(res, 409, { message: 'Status pesanan tidak valid untuk pembayaran', code: 'STATUS_TIDAK_VALID' });
      if (o.lewat) return send(res, 409, { message: 'Batas pembayaran 1 jam sudah lewat', code: 'PEMBAYARAN_KEDALUWARSA' });
      o.percobaan++;
      return send(res, 200, { data: { snap_token: (process.env.SNAP_ASLI ? 'tok-' : 'snap-palsu-') + o.nomor + '-' + o.percobaan, batas_pembayaran: new Date(Date.now() + 1800e3).toISOString() } });
    }
    if (req.method === 'POST' && sub === '/batalkan') {
      if (o.status !== 'menunggu_pembayaran') return send(res, 409, { message: 'Hanya pesanan yang menunggu pembayaran yang bisa dibatalkan', code: 'STATUS_TIDAK_VALID' });
      o.status = 'dibatalkan'; o.status_bayar = 'gagal'; return send(res, 200, { data: { status: 'dibatalkan' } });
    }
    if (req.method === 'POST' && sub === '/ajukan-pembatalan') {
      if (o.status !== 'dikonfirmasi') return send(res, 409, { message: 'Status pesanan tidak valid untuk pengajuan pembatalan', code: 'STATUS_TIDAK_VALID' });
      if (!b.alasan) return v422(res, { alasan: ['Alasan wajib diisi.'] });
      if (['bank_transfer', 'echannel', 'cstore'].includes(o.metode) && (!b.bank || !b.no_rekening || !b.nama_rekening)) return v422(res, { no_rekening: ['Rekening tujuan refund wajib diisi.'] });
      o.status = 'pengajuan_pembatalan'; return send(res, 200, { data: { status: 'pengajuan_pembatalan' } });
    }
    if (req.method === 'POST' && sub === '/review') {
      if (o.status !== 'selesai') return send(res, 409, { message: 'Review hanya untuk pesanan yang sudah selesai', code: 'STATUS_TIDAK_VALID' });
      if (o.review) return send(res, 409, { message: 'Pesanan ini sudah pernah diberi review', code: 'SUDAH_ADA_REVIEW' });
      if (!(b.rating >= 1 && b.rating <= 5)) return v422(res, { rating: ['Nilai 1 sampai 5.'] });
      o.review = { ...b, tgl_review: new Date().toISOString().slice(0, 10), tampil_di_katalog: true }; return send(res, 201, { data: { id_review: o.id } });
    }
    if (req.method === 'GET' && sub === '/nota') {
      if (!aksi(o).bisa_unduh_nota) return send(res, 409, { message: 'Pesanan belum dibayar', code: 'STATUS_TIDAK_VALID' });
      res.writeHead(200, { 'Content-Type': 'application/pdf', 'Access-Control-Allow-Origin': '*' }); return res.end('%PDF-1.4\n% nota ' + o.nomor + '\n%%EOF');
    }
  }

  // ---------------- P1b: pesanan admin ----------------
  if (p.startsWith('/admin/pemesanan')) {
    if (s.a.role !== 'admin') return send(res, 403, { message: 'Akses ditolak', code: 'AKSES_DITOLAK' });
    const PP = globalThis.PESANAN ??= [];
    const nama = (o) => (akun.find((x) => x.id === o.akun) || {}).nama || 'Pelanggan';
    const pel = (o) => { const a = akun.find((x) => x.id === o.akun) || {}; return { nama: a.nama, no_hp: a.no_hp, email: a.email, provinsi: a.provinsi, kota: a.kota, no_identitas: o.no_identitas || null }; };
    const aksiA = (o) => ({ bisa_serahkan: o.status === 'dikonfirmasi', bisa_selesaikan: o.status === 'berjalan', bisa_setujui: o.status === 'pengajuan_pembatalan', bisa_tolak: o.status === 'pengajuan_pembatalan',
      bisa_refund_selesai: !!o.refund_menunggu, bisa_tandai_lunas: o.status === 'selesai' && o.tagihan && o.tagihan.status === 'menunggu',
      bisa_kembalikan_jaminan: o.status === 'selesai' && o.jenis_sewa === 'lepas_kunci' && o.jaminan_ditahan && !(o.tagihan && o.tagihan.status === 'menunggu') });
    if (key === 'GET /admin/pemesanan') {
      const st = url.searchParams.get('status'), qq = (url.searchParams.get('q') || '').toLowerCase();
      const page = +(url.searchParams.get('page') || 1), per = +(url.searchParams.get('per_page') || 10);
      const L = PP.filter((o) => (!st || o.status === st) && (!qq || nama(o).toLowerCase().includes(qq) || String(o.id) === qq.replace(/\D/g, '').replace(/^0+/, ''))).sort((x, y) => y.id - x.id);
      return send(res, 200, { data: L.slice((page - 1) * per, page * per).map((o) => ({ id: o.id, nomor: o.nomor, tgl_pesan: tgl(0), pelanggan: { nama: nama(o) }, tipe: { id: o.tipe.id, nama: o.tipe.nama }, plat_nomor: o.plat_set || null, tgl_mulai: o.tgl_mulai, status: o.status })), meta: { page, per_page: per, total: L.length } });
    }
    const m2 = /^\/admin\/pemesanan\/(\d+)(\/.*)?$/.exec(p); const o = m2 && PP.find((x) => x.id === +m2[1]);
    if (!o) return send(res, 404, { message: 'Pesanan tidak ditemukan', code: 'TIDAK_DITEMUKAN' });
    const sub = m2[2] || '';
    const ringkas = () => {
      const tarif = Math.floor(o.total / o.durasi);
      const telat = Math.max(0, Math.round((new Date(b.tgl_kembali) - new Date(o.tgl_kembali)) / 864e5));
      const rusak = Object.keys(b).filter((k) => /^kondisi\[/.test(k) && b[k] !== 'baik').reduce((t, k) => t + (+b[k.replace('kondisi', 'biaya')] || 0), 0);
      const lain = Object.keys(b).filter((k) => /^biaya_tambahan\[/.test(k)).reduce((t, k) => t + (+b[k] || 0), 0);
      const bbm = o.jenis_sewa === 'dengan_sopir' ? 0 : (+b.biaya_kekurangan_bbm || 0);
      const tag = telat * tarif + bbm + rusak + lain;
      return { biaya_sewa: o.total, hari_terlambat: telat, denda_keterlambatan: telat * tarif, kekurangan_bbm: bbm, biaya_kerusakan: rusak, biaya_lain: lain, tagihan_tambahan: tag, total_akhir: o.total + tag };
    };
    if (req.method === 'GET' && !sub) {
      return send(res, 200, { data: { id: o.id, nomor: o.nomor, status: o.status, tipe: { id: o.tipe.id, nama: o.tipe.nama }, jenis_sewa: o.jenis_sewa, transmisi: o.transmisi, tgl_mulai: o.tgl_mulai, durasi: o.durasi,
        tgl_kembali: o.tgl_kembali, jam_serah: o.jam_serah, metode_ambil: o.metode_ambil, lokasi_jemput: o.lokasi_jemput, tujuan: o.tujuan, total_biaya: o.total,
        pembayaran: { metode: o.metode, status: o.status_bayar, order_id: 'PSN-' + o.id }, tagihan_tambahan: o.tagihan || null,
        tgl_pesan: tgl(0), domisili: o.domisili || 'luar_malang_raya', catatan: null, plat_nomor: o.plat_set || null, pelanggan: pel(o),
        riwayat_pembayaran: [{ jenis: 'sewa', metode: o.metode, jumlah: o.total, status: o.status_bayar, order_id: 'PSN-' + o.id }].concat(o.tagihan ? [{ jenis: 'tambahan', metode: o.tagihan.metode || null, jumlah: o.tagihan.jumlah, status: o.tagihan.status }] : []),
        refund: o.refund_menunggu ? { id_pembayaran: 77, cara: 'transfer_admin', selesai: false, jumlah: o.total, bank: 'BCA', no_rekening: '1234567890', nama_rekening: nama(o) } : null,
        refund_menunggu: o.refund_menunggu ? [{ id_pembayaran: 77, jumlah: o.total, order_id: 'PSN-' + o.id }] : [],
        serah_terima: o.serah || null, jaminan: o.jaminan_daftar ? { status: o.jaminan_ditahan ? 'ditahan' : 'dikembalikan', daftar: o.jaminan_daftar } : null,
        pengembalian: o.kembali || null, review: o.review ? { id: o.review.id ?? o.id, rating: o.review.rating, komentar: o.review.komentar, tgl_review: tgl(0), tampil_di_katalog: o.review.tampil_di_katalog !== false } : null,
        catatan_admin: o.catatan_admin || null, alasan_pengajuan: o.status === 'pengajuan_pembatalan' ? 'Jadwal berubah' : null, alasan_pembatalan: null, status_sebelumnya: null,
        log_aktivitas: o.log || [{ waktu: new Date().toISOString(), aksi: 'Pesanan dibuat', oleh: 'Pelanggan' }], aksi: aksiA(o) } });
    }
    const log = (t) => { (o.log ??= [{ waktu: new Date().toISOString(), aksi: 'Pesanan dibuat', oleh: 'Pelanggan' }]).push({ waktu: new Date().toISOString(), aksi: t, oleh: s.a.nama }); };
    if (key.endsWith('/catatan') && req.method === 'PUT') { o.catatan_admin = b.catatan_admin; return send(res, 200, { data: { catatan_admin: o.catatan_admin } }); }
    if (sub === '/unit-tersedia') return send(res, 200, { data: { unit: [{ id: 11, plat_nomor: 'N 2001 CA', warna: 'Putih', km_terakhir: 12300 }, { id: 12, plat_nomor: 'N 2002 CB', warna: 'Hitam', km_terakhir: 8900 }], jumlah: 2 } });
    if (sub === '/serah-terima') {
      if (o.status !== 'dikonfirmasi') return send(res, 409, { message: 'Status tidak valid', code: 'STATUS_TIDAK_VALID' });
      const e = {}; const lk = o.jenis_sewa === 'lepas_kunci';
      if (!b.id_kendaraan) e.id_kendaraan = ['Unit wajib dipilih.'];
      if (lk) {
        if (!b.no_identitas) e.no_identitas = ['No. identitas wajib diisi.'];
        if (!b.odometer_awal) e.odometer_awal = ['Odometer awal wajib diisi.'];
        for (const f of ['ktp_asli', 'sim_c_asli', 'dokumen_tambahan']) if (!(b[`foto_jaminan[${f}]`] instanceof Blob)) e[`foto_jaminan.${f}`] = ['Foto wajib diunggah.'];
        const dom = b.domisili_disesuaikan || o.domisili || 'luar_malang_raya';
        const perlu = dom === 'malang_raya' ? ['motor_stnk'] : ['booking_transportasi', 'booking_hotel'];
        for (const f of perlu) if (!(b[`foto_jaminan[${f}]`] instanceof Blob)) e[`foto_jaminan.${f}`] = ['Foto wajib diunggah.'];
        if (b.domisili_disesuaikan) o.domisili = b.domisili_disesuaikan;
      }
      if (Object.keys(e).length) return v422(res, e);
      o.status = 'berjalan'; o.plat_set = b.id_kendaraan === '12' ? 'N 2002 CB' : 'N 2001 CA'; o.plat = o.plat_set; o.no_identitas = b.no_identitas || null;
      o.serah = { tgl_serah: new Date().toISOString(), plat_nomor: o.plat_set, odometer_awal: lk ? +b.odometer_awal : null, bbm_awal: b.bbm_awal || null, catatan_kondisi: b.catatan_kondisi || null, jumlah_foto: 0, admin: s.a.nama };
      if (lk) { o.jaminan_ditahan = true; o.jaminan_daftar = ['ktp_asli', 'sim_c_asli', b['jaminan[dokumen_tambahan]'], ...(o.domisili === 'malang_raya' ? ['motor_stnk'] : ['booking_transportasi', 'booking_hotel'])].map((j) => ({ jenis: j, diterima: true, dikembalikan: false })); }
      log('Unit diserahkan'); return send(res, 200, { data: { status: 'berjalan', plat_nomor: o.plat_set, jaminan_status: lk ? 'ditahan' : null } });
    }
    if (sub === '/pengembalian/preview' || sub === '/pengembalian') {
      if (!(req.headers['content-type'] || '').startsWith('multipart/form-data')) return send(res, 415, { message: 'Endpoint ini hanya menerima multipart/form-data', code: 'FORMAT_TIDAK_DIDUKUNG' });
      if (o.status !== 'berjalan') return send(res, 409, { message: 'Status tidak valid', code: 'STATUS_TIDAK_VALID' });
      const e = {}; const lk = o.jenis_sewa === 'lepas_kunci';
      if (!b.tgl_kembali) e.tgl_kembali = ['Tanggal kembali wajib diisi.'];
      if (!b.jam_kembali) e.jam_kembali = ['Jam kembali wajib diisi.'];
      for (const bg of ['depan', 'belakang', 'sisi_kiri', 'sisi_kanan', 'atap', 'kaca_lampu', 'ban_velg', 'interior']) {
        if (!b[`kondisi[${bg}]`]) e[`kondisi.${bg}`] = ['Kondisi wajib diisi.'];
        else if (b[`kondisi[${bg}]`] !== 'baik') {
          if (b[`biaya[${bg}]`] === undefined) e[`biaya.${bg}`] = ['Biaya wajib diisi.'];
          if (sub === '/pengembalian' && !(b[`foto[${bg}]`] instanceof Blob)) e[`foto.${bg}`] = ['Foto wajib diunggah bila ada kerusakan.'];
        }
      }
      if (lk && b.odometer_akhir === undefined) e.odometer_akhir = ['Odometer akhir wajib diisi.'];
      if (sub === '/pengembalian' && b.disetujui_penyewa !== '1') e.disetujui_penyewa = ['Penyewa harus menyetujui hasil pemeriksaan.'];
      if (b.unit_perlu_servis === '1' && !b['servis[keperluan]']) e['servis.keperluan'] = ['Keperluan servis wajib diisi.'];
      if (Object.keys(e).length) return v422(res, e);
      const r = ringkas();
      if (sub === '/pengembalian/preview') return send(res, 200, { data: { ringkasan: r } });
      o.status = 'selesai';
      if (r.tagihan_tambahan) o.tagihan = { jumlah: r.tagihan_tambahan, status: b.status_pembayaran_tagihan && b.status_pembayaran_tagihan !== 'belum_dibayar' ? 'lunas' : 'menunggu', metode: null };
      o.kembali = { tgl_kembali: b.tgl_kembali, jam_kembali: b.jam_kembali, hari_terlambat: r.hari_terlambat, tarif_denda_per_hari: Math.floor(o.total / o.durasi), denda_keterlambatan: r.denda_keterlambatan,
        odometer_akhir: lk ? +b.odometer_akhir : null, bbm_akhir: b.bbm_akhir || null, biaya_kekurangan_bbm: r.kekurangan_bbm, kebersihan: b.kebersihan || null,
        kondisi: ['depan', 'belakang', 'sisi_kiri', 'sisi_kanan', 'atap', 'kaca_lampu', 'ban_velg', 'interior'].map((bg) => ({ bagian: bg, kondisi: b[`kondisi[${bg}]`], biaya: +b[`biaya[${bg}]`] || 0, keterangan: b[`keterangan[${bg}]`] || null, ada_foto: !!b[`foto[${bg}]`] })),
        biaya_tambahan: Object.keys(b).filter((k) => /^biaya_tambahan\[/.test(k) && +b[k]).map((k) => ({ jenis: k.slice(15, -1), keterangan: b[k.replace('biaya_tambahan', 'keterangan_tambahan')] || null, nominal: +b[k] })),
        jumlah_foto: 0, catatan_admin: b.catatan_admin || null };
      log('Pengembalian dicatat, pesanan selesai'); return send(res, 200, { data: { status: 'selesai', ringkasan: r } });
    }
    if (sub === '/setujui-pembatalan') { if (o.status !== 'pengajuan_pembatalan') return send(res, 409, { message: 'Status tidak valid', code: 'STATUS_TIDAK_VALID' }); o.status = 'dibatalkan'; o.status_bayar = 'lunas'; o.refund_menunggu = ['bank_transfer', 'echannel', 'cstore'].includes(o.metode); if (!o.refund_menunggu) o.status_bayar = 'dikembalikan'; log('Pembatalan disetujui'); return send(res, 200, { data: { status: 'dibatalkan' } }); }
    if (sub === '/tolak-pembatalan') { if (o.status !== 'pengajuan_pembatalan') return send(res, 409, { message: 'Status tidak valid', code: 'STATUS_TIDAK_VALID' }); o.status = 'dikonfirmasi'; log('Pengajuan pembatalan ditolak'); return send(res, 200, { data: { status: 'dikonfirmasi' } }); }
    if (sub === '/refund-selesai') { if (!o.refund_menunggu) return send(res, 409, { message: 'Tidak ada refund', code: 'STATUS_TIDAK_VALID' }); o.refund_menunggu = false; o.status_bayar = 'dikembalikan'; log('Refund ditransfer'); return send(res, 200, { data: { selesai: true } }); }
    if (sub === '/tagihan/lunas') { o.tagihan.status = 'lunas'; o.tagihan.metode = b.metode; log('Tagihan tambahan lunas'); return send(res, 200, { data: { status: 'lunas' } }); }
    if (sub === '/jaminan/kembalikan') { if (o.tagihan && o.tagihan.status === 'menunggu') return send(res, 409, { message: 'Tagihan belum lunas', code: 'TAGIHAN_BELUM_LUNAS' }); o.jaminan_ditahan = false; o.jaminan_daftar.forEach((j) => (j.dikembalikan = true)); log('Jaminan dikembalikan'); return send(res, 200, { data: { status: 'dikembalikan' } }); }
  }

  // ---------------- P1c: kelola mobil ----------------
  if (p.startsWith('/admin/tipe') || p.startsWith('/admin/unit')) {
    if (s.a.role !== 'admin') return send(res, 403, { message: 'Akses ditolak', code: 'AKSES_DITOLAK' });
    const U = UNIT, SAMPAH = globalThis.SAMPAH ??= { tipe: [], unit: [] };
    const bentukT = (t) => ({ id: t.id, nama: t.nama, merk: t.merk, kursi: t.kursi, bahan_bakar: t.bahan_bakar, harga_sopir_per_hari: t.tarif.dengan_sopir,
      harga_lepas_kunci_manual: t.tarif.lepas_kunci_manual, harga_lepas_kunci_matic: t.tarif.lepas_kunci_matic, foto: t.fotoAdmin || [], jumlah_foto: (t.fotoAdmin || []).length, jumlah_unit: U.filter((u) => u.id_tipe === t.id).length });
    const disewa = (u) => (globalThis.PESANAN || []).some((o) => o.status === 'berjalan' && o.plat_set === u.plat_nomor);
    const bentukU = (u) => ({ id: u.id, id_tipe: u.id_tipe, tipe: { id: u.id_tipe, nama: (tipe.find((t) => t.id === u.id_tipe) || {}).nama }, plat_nomor: u.plat_nomor, tahun: u.tahun, warna: u.warna,
      transmisi: u.transmisi, km_terakhir: u.km_terakhir, status: u.status, sedang_disewa: disewa(u), status_tampil: u.status === 'tersedia' && disewa(u) ? 'disewa' : u.status, detail: u.detail });
    const judul = (x) => String(x || '').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    const validT = () => {
      const e = {};
      if (!b.nama) e.nama = ['Nama wajib diisi.']; if (!b.merk) e.merk = ['Merk wajib diisi.'];
      if (!(+b.kursi >= 1)) e.kursi = ['Kursi wajib diisi.']; if (!['bensin', 'diesel', 'listrik'].includes(b.bahan_bakar)) e.bahan_bakar = ['Bahan bakar tidak valid.'];
      if (!b.harga_sopir_per_hari && !b.harga_lepas_kunci_manual && !b.harga_lepas_kunci_matic) e.harga_sopir_per_hari = ['Isi minimal satu tarif'];
      return e;
    };
    const isiT = (t) => { t.nama = judul(b.nama); t.merk = judul(b.merk); t.kursi = +b.kursi; t.bahan_bakar = b.bahan_bakar;
      t.tarif = { dengan_sopir: +b.harga_sopir_per_hari || null, lepas_kunci_manual: +b.harga_lepas_kunci_manual || null, lepas_kunci_matic: +b.harga_lepas_kunci_matic || null };
      const f = [].concat(b.foto || [])[0]; if (f instanceof Blob) { (t.fotoAdmin ??= []).push({ id: Date.now() % 100000, url: FE + '/img/mobil/ts-brio.png' }); } };
    if (key === 'GET /admin/tipe') return send(res, 200, { data: tipe.slice().sort((a, c) => a.nama.localeCompare(c.nama)).map(bentukT) });
    if (key === 'POST /admin/tipe') {
      const e = validT(); if (Object.keys(e).length) return v422(res, e);
      const sm = SAMPAH.tipe.find((t) => t.nama.toLowerCase() === b.nama.trim().toLowerCase() && t.merk.toLowerCase() === b.merk.trim().toLowerCase());
      if (sm) { const ps = `Tipe ${sm.nama} dengan merk ${sm.merk} ada di tempat sampah. Pulihkan tipe itu, atau hapus permanen dulu lalu buat ulang.`; return send(res, 422, { message: ps, code: 'TIPE_ADA_DI_SAMPAH', errors: { nama: [ps] }, detail: { jenis: 'tipe', id: sm.id, nama: sm.nama, merk: sm.merk } }); }
      if (tipe.some((t) => t.nama.toLowerCase() === b.nama.trim().toLowerCase() && t.merk.toLowerCase() === b.merk.trim().toLowerCase())) return v422(res, { nama: ['Tipe dengan nama dan merk ini sudah ada.'] });
      const t = { id: Math.max(0, ...tipe.map((x) => x.id), ...SAMPAH.tipe.map((x) => x.id)) + 1, unit: [] }; isiT(t); tipe.push(t); return send(res, 201, { data: bentukT(t) });
    }
    let mt = /^\/admin\/tipe\/(\d+)(\/foto\/(\d+)|\/pulihkan)?$/.exec(p);
    if (mt) {
      if (mt[2] === '/pulihkan') { const i = SAMPAH.tipe.findIndex((t) => t.id === +mt[1]); if (i < 0) return send(res, 404, { message: 'Tidak ditemukan', code: 'TIDAK_DITEMUKAN' }); tipe.push(SAMPAH.tipe.splice(i, 1)[0]); return send(res, 200, { data: { id: +mt[1] } }); }
      const t = tipe.find((x) => x.id === +mt[1]); if (!t) return send(res, 404, { message: 'Tipe tidak ditemukan', code: 'TIDAK_DITEMUKAN' });
      if (mt[3] && req.method === 'DELETE') { t.fotoAdmin = (t.fotoAdmin || []).filter((f) => f.id !== +mt[3]); return send(res, 200, { data: bentukT(t) }); }
      if (req.method === 'GET') return send(res, 200, { data: bentukT(t) });
      if (req.method === 'POST') { const e = validT(); if (Object.keys(e).length) return v422(res, e); isiT(t); return send(res, 200, { data: bentukT(t) }); }
      if (req.method === 'DELETE') { if (U.some((u) => u.id_tipe === t.id)) return send(res, 409, { message: 'Hapus unit tipe ini lebih dulu', code: 'TIPE_MASIH_DIPAKAI' }); tipe.splice(tipe.indexOf(t), 1); SAMPAH.tipe.push(t); return send(res, 204); }
    }
    if (key === 'GET /admin/unit') { const it = url.searchParams.get('id_tipe'); return send(res, 200, { data: U.filter((u) => !it || u.id_tipe === +it).sort((a, c) => a.plat_nomor.localeCompare(c.plat_nomor)).map(bentukU) }); }
    const validU = (idU) => {
      const e = {}; const plat = String(b.plat_nomor || '').toUpperCase().replace(/\s+/g, ' ').trim().replace(/^([A-Z]{1,2})\s?(\d{1,4})\s?([A-Z]{0,3})$/, (m, a1, a2, a3) => [a1, a2, a3].filter(Boolean).join(' '));
      b.plat_nomor = plat;
      if (!tipe.some((t) => t.id === +b.id_tipe)) e.id_tipe = ['Tipe tidak valid.'];
      if (!/^[A-Z]{1,2} \d{1,4}( [A-Z]{1,3})?$/.test(plat)) e.plat_nomor = ['Format plat nomor tidak dikenali. Gunakan 1-2 huruf, 1-4 angka, lalu 0-3 huruf, mis. N 1234 AB.'];
      else if (U.some((u) => u.plat_nomor === plat && u.id !== idU)) e.plat_nomor = ['Plat nomor sudah dipakai unit lain.'];
      if (!b.detail || !b.detail.no_rangka) e['detail.no_rangka'] = ['No rangka wajib diisi.'];
      if (!b.detail || !b.detail.no_mesin) e['detail.no_mesin'] = ['No mesin wajib diisi.'];
      if (Object.keys(e).length) return e;
      const sm = SAMPAH.unit.find((u) => u.plat_nomor === plat);
      if (sm) return { __sampah: sm };
      return e;
    };
    if (key === 'POST /admin/unit') {
      const e = validU(null);
      if (e.__sampah) { const ps = `Plat nomor sama dengan unit ${e.__sampah.plat_nomor} yang ada di tempat sampah. Pulihkan unit itu, atau hapus permanen dulu lalu buat ulang.`; return send(res, 422, { message: ps, code: 'UNIT_ADA_DI_SAMPAH', errors: { plat_nomor: [ps] }, detail: { jenis: 'unit', id: e.__sampah.id, plat_nomor: e.__sampah.plat_nomor } }); }
      if (Object.keys(e).length) return v422(res, e);
      const u = { id: Math.max(0, ...U.map((x) => x.id), ...SAMPAH.unit.map((x) => x.id)) + 1, id_tipe: +b.id_tipe, plat_nomor: b.plat_nomor, tahun: +b.tahun, warna: b.warna, transmisi: b.transmisi, km_terakhir: b.km_terakhir ?? null, status: 'tersedia', detail: b.detail };
      U.push(u); return send(res, 201, { data: bentukU(u) });
    }
    let mu = /^\/admin\/unit\/(\d+)(\/status|\/pulihkan)?$/.exec(p);
    if (mu) {
      if (mu[2] === '/pulihkan') { const i = SAMPAH.unit.findIndex((u) => u.id === +mu[1]); U.push(SAMPAH.unit.splice(i, 1)[0]); return send(res, 200, { data: { id: +mu[1] } }); }
      const u = U.find((x) => x.id === +mu[1]); if (!u) return send(res, 404, { message: 'Unit tidak ditemukan', code: 'TIDAK_DITEMUKAN' });
      const terdampak = () => (globalThis.PESANAN || []).filter((o) => o.status === 'dikonfirmasi' && o.tipe.id === u.id_tipe && U.filter((x) => x.id_tipe === u.id_tipe && x.status === 'tersedia').length <= 1)
        .map((o) => ({ id: o.id, nomor: o.nomor, nama: (akun.find((a) => a.id === o.akun) || {}).nama, tgl_mulai: o.tgl_mulai, tgl_kembali: o.tgl_kembali }));
      const konf = url.searchParams.get('konfirmasi') === '1' || b.konfirmasi === true;
      if (req.method === 'GET' && !mu[2]) return send(res, 200, { data: bentukU(u) });
      if (req.method === 'PUT') { const e = validU(u.id); if (Object.keys(e).length) return v422(res, e); Object.assign(u, { id_tipe: +b.id_tipe, plat_nomor: b.plat_nomor, tahun: +b.tahun, warna: b.warna, transmisi: b.transmisi, km_terakhir: b.km_terakhir ?? null, detail: b.detail }); return send(res, 200, { data: bentukU(u) }); }
      if (req.method === 'PATCH' && mu[2] === '/status') {
        if (disewa(u)) return send(res, 409, { message: 'Unit sedang disewa, status tidak bisa diubah', code: 'UNIT_SEDANG_DISEWA' });
        if (b.status === 'tidak_tersedia' && !konf && terdampak().length) return send(res, 409, { message: 'Ada pesanan dikonfirmasi yang akan kekurangan unit', code: 'PESANAN_TERDAMPAK', pesanan_terdampak: terdampak() });
        u.status = b.status; return send(res, 200, { data: { id: u.id, status: u.status } });
      }
      if (req.method === 'DELETE') {
        if (disewa(u)) return send(res, 409, { message: 'Unit sedang disewa, tidak bisa dihapus', code: 'UNIT_SEDANG_DISEWA' });
        if (!konf && terdampak().length) return send(res, 409, { message: 'Ada pesanan dikonfirmasi yang akan kekurangan unit', code: 'PESANAN_TERDAMPAK', pesanan_terdampak: terdampak() });
        U.splice(U.indexOf(u), 1); SAMPAH.unit.push(u); return send(res, 204);
      }
    }
  }


  // ---------------- P3: dashboard, servis, laporan ----------------
  const mRev = p.match(/^\/admin\/review\/(\d+)$/);
  if (mRev && req.method === 'PATCH') {
    const o = (globalThis.PESANAN || []).find((x) => x.review && x.review.id === +mRev[1]);
    if (!o) return send(res, 404, { message: 'Review tidak ditemukan', code: 'TIDAK_DITEMUKAN' });
    o.review.tampil_di_katalog = !!b.tampil_di_katalog; return send(res, 200, { data: { tampil_di_katalog: o.review.tampil_di_katalog } });
  }
  if (p.startsWith('/admin/dashboard') || p.startsWith('/admin/servis') || p.startsWith('/admin/laporan')) {
    if (!s || s.a.role !== 'admin') return send(res, 403, { message: 'Akses ditolak', code: 'AKSES_DITOLAK' });
    const PP = globalThis.PESANAN ??= [];
    const SV = globalThis.SERVIS ??= [];
    globalThis.INTERVAL ??= 5000;
    const tipeDari = (u) => tipe.find((t) => t.id === u.id_tipe);
    const namaU = (u) => `${tipeDari(u).nama} ${u.tahun}`;
    const statusUnit = () => UNIT.map((u) => {
      const last = SV.filter((x) => x.id_kendaraan === u.id && x.status === 'selesai').pop();
      const kmB = (last ? last.km_saat_ini : 0) + globalThis.INTERVAL;
      const sisa = kmB - u.km_terakhir;
      return { id_kendaraan: u.id, plat_nomor: u.plat_nomor, unit: namaU(u), status_unit: u.status, km_terakhir: u.km_terakhir, servis_terakhir: last ? last.tgl_perawatan : null, km_berikutnya: kmB, tgl_berikutnya: tgl(90), status: sisa <= 0 ? 'perlu_servis' : sisa <= 500 ? 'segera' : 'aman', sisa_km: sisa, sisa_hari: 90 };
    });
    if (key === 'GET /admin/dashboard') {
      const h = (st) => PP.filter((o) => o.status === st).length;
      const tugas = PP.filter((o) => o.status === 'pengajuan_pembatalan').map((o) => ({ id: o.id, nomor: o.nomor, jenis: 'pengajuan_pembatalan', keterangan: `${o.nomor} mengajukan pembatalan` }))
        .concat(PP.filter((o) => o.status === 'dikonfirmasi').map((o) => ({ id: o.id, nomor: o.nomor, jenis: 'serahkan_unit', keterangan: `${o.nomor} siap diserahkan ${o.tgl_mulai}` })));
      return send(res, 200, { data: { hitungan: { menunggu_pembayaran: h('menunggu_pembayaran'), dikonfirmasi: h('dikonfirmasi'), berjalan: h('berjalan'), pengajuan_pembatalan: h('pengajuan_pembatalan'), unit_tersedia: UNIT.filter((u) => u.status === 'tersedia').length, unit_dalam_servis: UNIT.filter((u) => u.status === 'dalam_servis').length }, tugas_admin: tugas, pengingat_servis: statusUnit().filter((x) => x.status !== 'aman').map((x) => ({ id_kendaraan: x.id_kendaraan, plat_nomor: x.plat_nomor, status: x.status })) } });
    }
    if (key === 'GET /admin/servis/status-unit') return send(res, 200, { data: statusUnit() });
    if (key === 'GET /admin/servis') {
      const bentuk = (x) => { const u = UNIT.find((y) => y.id === x.id_kendaraan); return { ...x, plat_nomor: u.plat_nomor, unit: namaU(u) }; };
      const sel = SV.filter((x) => x.status === 'selesai');
      const jum = (k) => sel.reduce((a, x) => a + (x[k] || 0), 0);
      return send(res, 200, { data: { ringkasan: { unit_dalam_servis: UNIT.filter((u) => u.status === 'dalam_servis').length, unit_tersedia: UNIT.filter((u) => u.status === 'tersedia').length, total_biaya_bengkel: jum('biaya_bengkel'), total_ditagih: jum('biaya_ditagih_ke_penyewa'), total_ditanggung_perusahaan: jum('biaya_bengkel') - jum('biaya_ditagih_ke_penyewa') },
        sedang_servis: SV.filter((x) => x.status === 'dalam_servis').map(bentuk), riwayat: SV.filter((x) => x.status !== 'dalam_servis').map(bentuk).reverse() } });
    }
    if (key === 'PUT /admin/servis/interval') {
      if (!(+b.interval_km >= 1)) return v422(res, { interval_km: ['Interval minimal 1 km.'] });
      globalThis.INTERVAL = +b.interval_km; return send(res, 200, { data: { interval_km: globalThis.INTERVAL } });
    }
    if (key === 'POST /admin/servis') {
      const e = {};
      const u = UNIT.find((y) => y.id === +b.id_kendaraan);
      if (!u) e.id_kendaraan = ['Unit tidak ditemukan.'];
      if (!b.jenis_servis) e.jenis_servis = ['Jenis servis wajib diisi.'];
      if (!b.bengkel) e.bengkel = ['Bengkel wajib diisi.'];
      if (u && b.km_saat_ini != null && b.km_saat_ini !== '' && +b.km_saat_ini < u.km_terakhir) e.km_saat_ini = [`Odometer tidak boleh lebih kecil dari ${u.km_terakhir} km.`];
      if (Object.keys(e).length) return v422(res, e);
      if (u.status === 'disewa') return send(res, 409, { message: 'Unit sedang disewa', code: 'UNIT_SEDANG_DISEWA' });
      if (u.status === 'dalam_servis') return send(res, 409, { message: 'Unit sudah dalam servis', code: 'UNIT_SUDAH_DALAM_SERVIS' });
      const kena = PP.filter((o) => o.status === 'dikonfirmasi' && o.tipe.id === u.id_tipe).map((o) => ({ id: o.id, nomor: o.nomor, nama: 'Dewi Lestari', tgl_mulai: o.tgl_mulai, tgl_kembali: o.tgl_kembali }));
      if (kena.length && !b.konfirmasi) return send(res, 409, { message: 'Ada pesanan dikonfirmasi yang akan kekurangan unit', code: 'PESANAN_TERDAMPAK', pesanan_terdampak: kena });
      const x = { id: SV.length + 1, id_kendaraan: u.id, tgl_perawatan: b.tgl_perawatan, jenis_servis: b.jenis_servis, tingkat_servis: b.tingkat_servis, bengkel: b.bengkel, catatan: b.catatan || null, km_saat_ini: b.km_saat_ini ? +b.km_saat_ini : u.km_terakhir, status: 'dalam_servis', asal_pesanan: null, komponen: [], biaya_bengkel: null, biaya_ditagih_ke_penyewa: 0 };
      SV.push(x); u.status = 'dalam_servis'; if (b.km_saat_ini) u.km_terakhir = +b.km_saat_ini;
      return send(res, 201, { data: x });
    }
    let m;
    if ((m = /^\/admin\/servis\/(\d+)\/(selesai|batal)$/.exec(p)) && req.method === 'POST') {
      const x = SV.find((y) => y.id === +m[1]);
      if (!x) return send(res, 404, { message: 'Servis tidak ditemukan', code: 'TIDAK_DITEMUKAN' });
      if (x.status !== 'dalam_servis') return send(res, 409, { message: 'Status servis tidak valid', code: 'STATUS_TIDAK_VALID' });
      const u = UNIT.find((y) => y.id === x.id_kendaraan);
      if (m[2] === 'batal') { x.status = 'dibatalkan'; u.status = 'tersedia'; return send(res, 200, { data: x }); }
      if (!(req.headers['content-type'] || '').startsWith('multipart/form-data')) return send(res, 415, { message: 'Endpoint ini hanya menerima multipart/form-data', code: 'FORMAT_TIDAK_DIDUKUNG' });
      const e = {};
      if (!Array.isArray(b.komponen) || !b.komponen.length) e.komponen = ['Pilih minimal satu komponen.'];
      if (!(+b.biaya_bengkel >= 0) || b.biaya_bengkel === '') e.biaya_bengkel = ['Biaya bengkel wajib diisi.'];
      if (!(+b.km_saat_ini >= u.km_terakhir)) e.km_saat_ini = [`Odometer tidak boleh lebih kecil dari ${u.km_terakhir} km.`];
      if (Object.keys(e).length) return v422(res, e);
      Object.assign(x, { status: 'selesai', komponen: b.komponen, biaya_bengkel: +b.biaya_bengkel, km_saat_ini: +b.km_saat_ini, biaya_ditagih_ke_penyewa: x.asal_pesanan ? +b.biaya_bengkel : 0 });
      u.status = 'tersedia'; u.km_terakhir = +b.km_saat_ini;
      return send(res, 200, { data: x });
    }
    if (key === 'GET /admin/servis/' + (p.split('/')[3] || '') && /^\d+$/.test(p.split('/')[3] || '')) {
      const x = SV.find((y) => y.id === +p.split('/')[3]); if (!x) return send(res, 404, { message: 'Servis tidak ditemukan', code: 'TIDAK_DITEMUKAN' });
      const u = UNIT.find((y) => y.id === x.id_kendaraan); return send(res, 200, { data: { ...x, plat_nomor: u.plat_nomor, unit: namaU(u), km_terakhir: u.km_terakhir } });
    }
    if (key === 'GET /admin/laporan' || key === 'GET /admin/laporan/pdf') {
      const st = url.searchParams.get('status') || '';
      const L = PP.filter((o) => !st || o.status === st);
      const ok = ['dikonfirmasi', 'berjalan', 'selesai'];
      if (key.endsWith('/pdf')) {
        if (!L.length) return send(res, 409, { message: 'Tidak ada data pada periode ini', code: 'DATA_KOSONG' });
        res.writeHead(200, { 'Content-Type': 'application/pdf', 'Access-Control-Allow-Origin': '*' }); return res.end('%PDF-1.4 mock');
      }
      const per = {}; L.forEach((o) => { per[o.status] = (per[o.status] || 0) + 1; });
      return send(res, 200, { data: { periode: { dari: tgl(-7), sampai: tgl(0) }, ringkasan: { total_pendapatan: L.filter((o) => ok.includes(o.status)).reduce((a, o) => a + o.total + (o.tagihan || 0), 0), jumlah_transaksi: L.length, jumlah_dibatalkan: L.filter((o) => o.status === 'dibatalkan').length, per_status: per },
        data: L.map((o) => ({ id: o.id, tgl_mulai: o.tgl_mulai, nomor: o.nomor, pelanggan: 'Budi', unit: o.plat_set || o.tipe.nama, status: o.status, sewa: o.total, tagihan_tambahan: o.tagihan || 0 })) } });
    }
  }
  // ---------------- P2: profil ----------------
  const bentukP = (a) => ({ id: a.id, nama: a.nama, email: a.email, role: a.role, no_hp: a.no_hp || null, provinsi: a.provinsi || null, kota: a.kota || null, foto: a.foto || null, email_terverifikasi: !!a.verif });
  if (key === 'GET /profil') return send(res, 200, { data: bentukP(s.a) });
  if (key === 'POST /profil') {
    if (!(req.headers['content-type'] || '').startsWith('multipart/form-data')) return send(res, 415, { message: 'Endpoint ini hanya menerima multipart/form-data', code: 'FORMAT_TIDAK_DIDUKUNG' });
    const e = {};
    if ('nama' in b && !b.nama) e.nama = ['Nama wajib diisi.'];
    if ('no_hp' in b && !/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(b.no_hp)) e.no_hp = ['Format nomor HP tidak valid.'];
    if ('kota' in b && !b.kota) e.kota = ['Kota wajib diisi.'];
    if (b.foto instanceof Blob && b.foto.size > 2048 * 1024) e.foto = ['Foto maksimal 2 MB.'];
    if (Object.keys(e).length) return v422(res, e);
    for (const k of ['nama', 'no_hp', 'provinsi', 'kota']) if (k in b) s.a[k] = b[k];
    if (b.foto instanceof Blob) s.a.foto = FE + '/img/authorization.jpg';
    if (b.hapus_foto === '1') s.a.foto = null;
    return send(res, 200, { data: bentukP(s.a) });
  }
  if (key === 'GET /me') return send(res, 200, { data: { id: s.a.id, nama: s.a.nama, email: s.a.email, role: s.a.role, no_hp: s.a.no_hp || null, provinsi: s.a.provinsi || null, kota: s.a.kota || null } });
  return send(res, 404, { message: 'Tidak ditemukan (mock)', code: 'TIDAK_DITEMUKAN' });
}).listen(PORT, () => console.log('mock on', PORT));
