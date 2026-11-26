import asyncio, json, urllib.request, datetime
from playwright.async_api import async_playwright
# Uji end-to-end (Playwright, Python) terhadap back-end tiruan e2e/mock-server.mjs.
# Cara pakai ada di README bagian "Uji end-to-end".
import os
W=os.environ.get('FE_URL','http://localhost:3100'); A=os.environ.get('API_URL','http://localhost:8000/api/v1')
CHROME=os.environ.get('CHROME')  # kosongkan untuk memakai Chromium bawaan Playwright
PELUNCUR={'executable_path':CHROME,'args':['--no-sandbox']} if CHROME else {}
FOTO=os.environ.get('FOTO', os.path.join(os.path.dirname(os.path.abspath(__file__)),'hasil')); os.makedirs(FOTO, exist_ok=True)
def tgl(n): return (datetime.date.today()+datetime.timedelta(days=n)).isoformat()
def mail(): return json.load(urllib.request.urlopen(A+'/_mock/mail'))
def api(path, body):
    r=urllib.request.Request(A+path, data=json.dumps(body).encode(), headers={'Content-Type':'application/json'}); return json.load(urllib.request.urlopen(r))
ok=[]; bad=[]
def cek(n,c,i=''): (ok if c else bad).append(n); print(('PASS ' if c else 'FAIL ')+n, '' if c else i)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(**PELUNCUR)
    pg=await (await b.new_context(viewport={'width':1280,'height':900})).new_page(); errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'Failed to load resource' not in m.text else None)
    # penjaga: halaman pelanggan tanpa login -> masuk?next
    await pg.goto(W+'/user/riwayat'); await pg.wait_for_url('**/masuk?next=*'); cek('penjaga riwayat -> masuk', '%2Fuser%2Friwayat' in pg.url, pg.url)
    # katalog
    await pg.goto(W+'/katalog'); await pg.fill('#tgl',tgl(3)); await pg.fill('#dur','2'); await pg.click('form.pencarian button')
    await pg.wait_for_selector('.daftar-ds .kotak.mobil'); n=await pg.locator('.daftar-ds .kotak.mobil').count(); cek('katalog dari API', n>=1, n)
    await pg.select_option('#kursi','5'); await pg.click('form.pencarian button'); await pg.wait_for_timeout(800)
    names=await pg.locator('.daftar-ds .nama').all_text_contents(); cek('filter kursi 5', names==['Brio'], names)
    await pg.goto(f'{W}/katalog-hasil?tgl_mulai={tgl(0)}&durasi=1'); await pg.wait_for_selector('.alert.galat'); cek('tanggal hari ini -> galat 422', True)
    # form pesan tamu
    await pg.goto(f'{W}/katalog-hasil?tgl_mulai={tgl(3)}&durasi=2'); await pg.wait_for_selector('.daftar-ds .kotak.mobil')
    await pg.click('.daftar-ds .kotak.mobil:has-text("Brio") a.btn'); await pg.wait_for_selector('form[aria-label="Form pesan"]')
    tot=(await pg.text_content('.ringkasan .total')).replace('\xa0',' '); cek('total ds 2 hari', 'Rp 1.300.000' in tot, tot)
    await pg.click('text=Ganti ke lepas kunci'); await pg.select_option('#trans','matic'); await pg.wait_for_timeout(200)
    tot=(await pg.text_content('.ringkasan .total')).replace('\xa0',' '); cek('total ts matic', 'Rp 700.000' in tot, tot)
    cek('alamat tersembunyi saat ambil', await pg.locator('#lokasi').count()==0); await pg.check('#diantar'); cek('alamat muncul saat diantar', await pg.locator('#lokasi').is_visible())
    await pg.fill('#jam','09:00'); await pg.fill('#lokasi','Jl. Ijen 1'); await pg.check('#setuju-jaminan'); await pg.check('#setuju-sk')
    await pg.click('form[aria-label="Form pesan"] button[type=submit]'); await pg.wait_for_url('**/masuk?next=*'); cek('tamu pesan -> masuk dengan next', '%2Fpesan%2F' in pg.url, pg.url)
    nexturl=pg.url
    # daftar
    await pg.goto(W+'/daftar'); await pg.fill('#nama','Rina Wulandari'); await pg.fill('#email','rina@contoh.id'); await pg.fill('#wa','081234567891')
    await pg.select_option('#provinsi','Jawa Timur'); await pg.fill('#kota','Kota Malang'); await pg.fill('#sandi','rahasia123'); await pg.fill('#sandi2','rahasia124')
    await pg.click('form button[type=submit]'); await pg.wait_for_selector('.galat-kolom'); cek('konfirmasi sandi beda ditolak', True)
    await pg.fill('#sandi2','rahasia123'); await pg.click('form button[type=submit]'); await pg.wait_for_url('**/cek-email?*')
    cek('daftar -> cek email + email tampil', 'rina@contoh.id' in await pg.text_content('main'))
    await pg.goto(nexturl); await pg.fill('#email','rina@contoh.id'); await pg.fill('#sandi','rahasia123'); await pg.click('form button[type=submit]')
    await pg.wait_for_selector('text=Kirim ulang tautan verifikasi'); cek('belum verifikasi -> tawar kirim ulang', True)
    url=mail()[-1]['url']; cek('tautan email ke FE Next', url.startswith(W+'/verifikasi-email?token='), url)
    await pg.goto(url); await pg.wait_for_url('**/masuk?verif=1'); cek('verifikasi -> login', 'berhasil diverifikasi' in await pg.text_content('form'))
    await pg.goto(W+'/verifikasi-email?token=salah'); await pg.wait_for_selector('text=tidak valid'); cek('token salah -> gagal + kirim ulang', await pg.locator('#email-ulang').count()==1)
    # login lalu kembali ke form pesan
    await pg.goto(nexturl); await pg.fill('#email','rina@contoh.id'); await pg.fill('#sandi','rahasia123'); await pg.click('form button[type=submit]')
    await pg.wait_for_url('**/pesan/**'); cek('login -> kembali ke form pesan', 'jenis=lepas_kunci' in pg.url, pg.url)
    cek('navbar nama pelanggan', 'Rina Wulandari' in await pg.text_content('nav'))
    await pg.wait_for_selector('text=domisili profil Anda'); cek('syarat jaminan sesuai domisili', 'Kota Malang' in await pg.text_content('.syarat'))
    await pg.check('#diantar'); await pg.fill('#jam','09:00'); await pg.fill('#lokasi','Jl. Ijen 1'); await pg.check('#setuju-jaminan'); await pg.check('#setuju-sk')
    await pg.click('form[aria-label="Form pesan"] button[type=submit]'); await pg.wait_for_url('**/user/pesanan/*/bayar'); cek('buat pesanan -> bayar', True)
    await pg.wait_for_selector('text=Bayar sekarang'); cek('hitung mundur tampil', await pg.locator('.countdown').count()==1)
    pid=pg.url.split('/pesanan/')[1].split('/')[0]
    await pg.screenshot(path=''+FOTO+'/next_bayar.png', full_page=True)
    # riwayat
    await pg.goto(W+'/user/riwayat'); await pg.wait_for_selector('.panel.p-1 .kartu'); cek('riwayat berlangsung', 'Menunggu pembayaran' in await pg.text_content('.panel.p-1'))
    # pesanan kedua ditolak (409)
    await pg.goto(f'{W}/pesan/1?jenis=dengan_sopir&tgl_mulai={tgl(5)}&durasi=1'); await pg.wait_for_selector('#tujuan')
    await pg.fill('#jam','08:00'); await pg.fill('#tujuan','Batu'); await pg.fill('#lokasi','Jl. A'); await pg.check('#setuju-sk')
    await pg.click('form[aria-label="Form pesan"] button[type=submit]'); await pg.wait_for_selector('.alert.galat'); cek('409 pesanan menunggu ada', 'menunggu pembayaran' in await pg.text_content('.alert.galat'))
    # detail + batalkan
    await pg.goto(f'{W}/user/pesanan/{pid}'); await pg.wait_for_selector('text=Batalkan pesanan'); await pg.click('text=Batalkan pesanan')
    await pg.wait_for_selector('#batal-langsung:target'); await pg.click('text=Ya, batalkan'); await pg.wait_for_selector('text=Pesanan dibatalkan.')
    cek('batalkan -> status dibatalkan', 'Dibatalkan' in await pg.text_content('.kepala-detail')); cek('modal tertutup', not await pg.locator('#batal-langsung').is_visible())
    # pesanan dikonfirmasi -> ajukan pembatalan
    await pg.goto(f'{W}/pesan/1?jenis=dengan_sopir&tgl_mulai={tgl(5)}&durasi=1'); await pg.wait_for_selector('#tujuan')
    await pg.fill('#jam','08:00'); await pg.fill('#tujuan','Batu'); await pg.fill('#lokasi','Jl. A'); await pg.check('#setuju-sk')
    await pg.click('form[aria-label="Form pesan"] button[type=submit]'); await pg.wait_for_url('**/bayar'); pid2=pg.url.split('/pesanan/')[1].split('/')[0]
    api('/_mock/set',{'id':int(pid2),'ubah':{'status':'dikonfirmasi','status_bayar':'lunas','metode':'bank_transfer'}})
    await pg.goto(f'{W}/user/pesanan/{pid2}'); await pg.wait_for_selector('text=Ajukan pembatalan'); await pg.click('.aksi-detail >> text=Ajukan pembatalan')
    cek('rekening wajib untuk VA', await pg.locator('#no-rek').is_visible())
    await pg.fill('#alasan','Batal acara'); await pg.fill('#bank','BCA'); await pg.fill('#no-rek','123'); await pg.fill('#nama-rek','Rina'); await pg.click('#ajukan-batal button[type=submit]')
    await pg.wait_for_selector('text=Pengajuan pembatalan terkirim.'); cek('ajukan -> pengajuan', 'Pengajuan pembatalan' in await pg.text_content('.kepala-detail'))
    # nota
    await pg.goto(f'{W}/user/pesanan/{pid2}/nota'); await pg.wait_for_selector('.nota')
    cek('nota total dibayar', 'Total dibayar (Virtual account)' in await pg.text_content('.nota'))
    async with pg.expect_download() as dl: await pg.click('text=Unduh PDF')
    cek('unduh PDF nota', (await dl.value).suggested_filename.endswith('.pdf'))
    # review via riwayat (selesai)
    api('/_mock/set',{'id':int(pid2),'ubah':{'status':'selesai'}})
    await pg.goto(W+'/user/riwayat'); await pg.click('label[for=tab-2]'); await pg.wait_for_selector('.panel.p-2 form.nilai-inline')
    await pg.click(f'label[for="b4-{pid2}"]'); await pg.fill('.panel.p-2 textarea','Mantap'); await pg.click('.panel.p-2 form.nilai-inline button')
    await pg.wait_for_selector('text=penilaian Anda sudah dikirim'); cek('review inline terkirim', True)
    # profil
    await pg.goto(W+'/user/profil'); await pg.wait_for_selector('#nama'); await pg.fill('#nama','Rina W'); await pg.fill('#kota','Kota Surabaya')
    cek('ket domisili luar', 'luar Malang Raya' in await pg.text_content('main'))
    await pg.click('text=Simpan Perubahan'); await pg.wait_for_selector('#konfirmasi-simpan:target'); await pg.click('text=Ya, simpan')
    await pg.wait_for_selector('text=Profil berhasil disimpan.'); cek('navbar nama ikut berubah', 'Rina W' in await pg.text_content('nav'))
    await pg.fill('#lama','salah123'); await pg.fill('#baru','baru12345'); await pg.fill('#baru2','baru12345'); await pg.click('text=Simpan Kata Sandi')
    await pg.wait_for_selector('.galat-kolom, .alert.galat'); cek('sandi lama salah ditolak', True)
    # keluar
    await pg.click('nav >> text=Keluar'); await pg.wait_for_url('**/masuk'); cek('keluar -> masuk', True)
    await pg.goto(W+'/user/profil'); await pg.wait_for_url('**/masuk?next=*'); cek('setelah keluar dijaga', True)
    # mobile overflow
    m=await (await b.new_context(viewport={'width':390,'height':844})).new_page()
    for u in ['/','/katalog-hasil?tgl_mulai='+tgl(3)+'&durasi=2','/pesan/1?jenis=lepas_kunci&tgl_mulai='+tgl(3)+'&durasi=2','/daftar']:
        await m.goto(W+u); await m.wait_for_timeout(800); w=await m.evaluate('document.documentElement.scrollWidth'); cek('mobile '+u.split('?')[0], w<=390, w)
    cek('tanpa error konsol', not errs, errs[:5])
    print(f'\n{len(ok)} lulus, {len(bad)} gagal', bad); await b.close()
asyncio.run(main())
