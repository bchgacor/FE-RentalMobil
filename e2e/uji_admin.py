import asyncio, json, urllib.request, datetime
from playwright.async_api import async_playwright
# Uji end-to-end (Playwright, Python) terhadap back-end tiruan e2e/mock-server.mjs.
# Cara pakai ada di README bagian "Uji end-to-end".
import os
W=os.environ.get('FE_URL','http://localhost:3100'); A=os.environ.get('API_URL','http://localhost:8000/api/v1')
CHROME=os.environ.get('CHROME')  # kosongkan untuk memakai Chromium bawaan Playwright
PELUNCUR={'executable_path':CHROME,'args':['--no-sandbox']} if CHROME else {}
FOTO=os.environ.get('FOTO', os.path.join(os.path.dirname(os.path.abspath(__file__)),'hasil')); os.makedirs(FOTO, exist_ok=True)
PNG=os.path.join(os.path.dirname(os.path.abspath(__file__)),'kecil.png')
def tgl(n): return (datetime.date.today()+datetime.timedelta(days=n)).isoformat()
def api(path, body=None, token=None, method=None):
    h={'Content-Type':'application/json','Accept':'application/json'}
    if token: h['Authorization']='Bearer '+token
    r=urllib.request.Request(A+path, data=json.dumps(body).encode() if body is not None else None, headers=h, method=method)
    return json.load(urllib.request.urlopen(r))
ok=[]; bad=[]
def cek(n,c,i=''): (ok if c else bad).append(n); print(('PASS ' if c else 'FAIL ')+n, '' if c else i)

def siapkan():
    # pelanggan + dua pesanan (dengan sopir dan lepas kunci) lewat API, lalu dikonfirmasi lewat helper mock
    api('/auth/register', {'nama':'Budi Santoso','email':'budi@contoh.id','no_hp':'081234567890','provinsi':'Jawa Timur','kota':'Kota Malang','password':'rahasia123','password_confirmation':'rahasia123'})
    url=json.load(urllib.request.urlopen(A+'/_mock/mail'))[-1]['url']; api('/auth/verifikasi-email', {'token':url.split('token=')[1]})
    t=api('/auth/login', {'email':'budi@contoh.id','password':'rahasia123'})['data']['token']
    a=api('/pemesanan', {'id_tipe':2,'jenis_sewa':'dengan_sopir','tgl_mulai':tgl(2),'durasi':2,'jam_serah':'08:00','tujuan':'Batu','lokasi_jemput':'Jl. Ijen 1','setuju_syarat':True}, t)['data']
    api('/_mock/set', {'id':a['id'],'ubah':{'status':'dikonfirmasi','status_bayar':'lunas','metode':'qris'}})
    b=api('/pemesanan', {'id_tipe':2,'jenis_sewa':'lepas_kunci','transmisi':'matic','tgl_mulai':tgl(4),'durasi':1,'jam_serah':'09:00','metode_ambil':'ambil','setuju_syarat':True,'setuju_syarat_jaminan':True}, t)['data']
    api('/_mock/set', {'id':b['id'],'ubah':{'status':'dikonfirmasi','status_bayar':'lunas','metode':'qris','domisili':'malang_raya'}})
    return a['id'], b['id']

async def main():
    ida, idb = siapkan()
    async with async_playwright() as p:
        br=await p.chromium.launch(**PELUNCUR)
        pg=await (await br.new_context(viewport={'width':1280,'height':900})).new_page(); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'Failed to load resource' not in m.text else None)
        # penjaga admin
        await pg.goto(W+'/admin/dashboard'); await pg.wait_for_url('**/admin/masuk*'); cek('penjaga admin -> admin/masuk', True)
        # login pelanggan di form admin ditolak
        await pg.fill('#email','budi@contoh.id'); await pg.fill('#sandi','rahasia123'); await pg.click('form button[type=submit]')
        await pg.wait_for_selector('.alert.galat'); cek('akun pelanggan ditolak di login admin', 'admin' in (await pg.text_content('.alert.galat')).lower())
        await pg.fill('#email','admin@rental.test'); await pg.fill('#sandi','Admin12345'); await pg.click('form button[type=submit]')
        await pg.wait_for_url('**/admin/ganti-sandi'); cek('admin wajib ganti sandi', True)
        await pg.goto(W+'/admin/pesanan'); await pg.wait_for_url('**/admin/ganti-sandi'); cek('belum ganti sandi -> tetap ke ganti-sandi', True)
        await pg.fill('#lama','Admin12345'); await pg.fill('#baru','AdminBaru123'); await pg.fill('#baru2','AdminBaru123'); await pg.click('form button[type=submit]')
        await pg.wait_for_url('**/admin/dashboard'); cek('ganti sandi -> dashboard', True)
        # dashboard
        await pg.wait_for_selector('text=Perlu tindakan'); await pg.wait_for_selector('.kartu.stat .angka')
        txt=await pg.text_content('main'); cek('dashboard hitungan dikonfirmasi 2', 'Dikonfirmasi2' in txt.replace(' ',''), txt[:300])
        cek('dashboard tugas serahkan unit', 'Serahkan unit' in txt)
        # daftar pesanan + saring
        await pg.goto(W+'/admin/pesanan'); await pg.wait_for_selector('table.tabel tbody tr'); n=await pg.locator('table.tabel tbody tr').count(); cek('daftar pesanan admin', n>=2, n)
        await pg.click('.saring a:has-text("Berjalan")'); await pg.wait_for_url('**status=berjalan'); await pg.wait_for_timeout(500)
        cek('saring berjalan kosong', 'Tidak ada pesanan' in await pg.text_content('main') or await pg.locator('table.tabel tbody tr td.memuat').count()==1)
        # serah terima dengan sopir
        await pg.goto(f'{W}/admin/pesanan/{ida}'); await pg.wait_for_selector('text=Serahkan unit'); await pg.click('a.btn:has-text("Serahkan unit")')
        await pg.wait_for_url('**/serah-terima'); await pg.wait_for_selector('#plat option[value="11"]', state='attached')
        cek('dengan sopir: tanpa bagian jaminan', await pg.locator('text=Jaminan Diterima').count()==0)
        await pg.click('button:has-text("Serahkan unit")'); cek('unit wajib dipilih (validasi browser)', '/serah-terima' in pg.url)
        await pg.select_option('#plat','11'); await pg.click('button:has-text("Serahkan unit")')
        await pg.wait_for_url(f'**/admin/pesanan/{ida}?ok=serah'); await pg.wait_for_selector('.alert.sukses'); cek('serah terima -> detail berjalan', 'Berjalan' in await pg.text_content('main'))
        # serah terima lepas kunci dengan jaminan, galat 422 per kolom dulu
        await pg.goto(f'{W}/admin/pesanan/{idb}/serah-terima'); await pg.wait_for_selector('text=Jaminan Diterima')
        cek('malang raya: isian motor & STNK', await pg.locator('#f-motor').count()==1)
        await pg.select_option('#dom','luar_malang_raya'); cek('luar malang: booking transport+hotel', await pg.locator('#f-trans').count()==1 and await pg.locator('#f-motor').count()==0)
        await pg.select_option('#dom','malang_raya')
        await pg.select_option('#plat','12'); await pg.fill('#identitas','3573010101010001'); await pg.fill('#odo','15000')
        for s in ['#f-ktp','#f-sim','#f-dok','#f-motor']: await pg.set_input_files(s, PNG)
        await pg.click('button:has-text("Serahkan unit")'); await pg.wait_for_url(f'**/admin/pesanan/{idb}?ok=serah'); cek('serah terima lepas kunci + foto jaminan', True)
        # pengembalian lepas kunci: pratinjau back-end, kerusakan butuh foto
        await pg.goto(f'{W}/admin/pesanan/{idb}'); await pg.click('a.btn:has-text("Selesaikan pesanan")'); await pg.wait_for_url('**/pengembalian')
        await pg.wait_for_selector('#odoz'); await pg.fill('#odoz','15200'); await pg.wait_for_timeout(800)
        cek('pratinjau ringkasan dari back-end', 'Rp' in await pg.text_content('.ringkasan'))
        await pg.select_option('select[name="kondisi[depan]"]','lecet'); cek('kondisi lecet -> isian biaya & foto', await pg.locator('input[name="biaya[depan]"]').count()==1 and await pg.locator('input[name="foto[depan]"]').count()==1)
        await pg.fill('input[name="biaya[depan]"]','150000'); await pg.wait_for_timeout(900)
        tg=(await pg.text_content('.ringkasan .baris.total')).replace('\xa0',' '); cek('tagihan tambahan ikut biaya kerusakan', '150.000' in tg, tg)
        await pg.set_input_files('input[name="foto[depan]"]', PNG)
        await pg.check('#servis'); await pg.fill('#perlu','Ketok bumper depan'); await pg.check('#setuju')
        await pg.click('button:has-text("Selesaikan pesanan")'); await pg.wait_for_url(f'**/admin/pesanan/{idb}?ok=selesai'); await pg.wait_for_selector('.alert.sukses')
        cek('pengembalian -> selesai', 'Selesai' in await pg.text_content('main'))
        api('/_mock/set', {'id':idb,'ubah':{'review':{'id':idb,'rating':5,'komentar':'Mobil bersih','tgl_review':tgl(0),'tampil_di_katalog':True}}})
        await pg.goto(f'{W}/admin/pesanan/{idb}'); await pg.click('button:has-text("Sembunyikan dari katalog")'); await pg.wait_for_selector('text=Ulasan disembunyikan dari katalog')
        cek('ulasan bisa disembunyikan dari katalog', await pg.locator('button:has-text("Tampilkan di katalog")').count()==1)
        # pengembalian dengan sopir (tanpa odometer)
        await pg.goto(f'{W}/admin/pesanan/{ida}/pengembalian'); await pg.wait_for_selector('#tglk'); cek('dengan sopir: tanpa odometer', await pg.locator('#odoz').count()==0)
        await pg.check('#setuju'); await pg.click('button:has-text("Selesaikan pesanan")'); await pg.wait_for_url(f'**/admin/pesanan/{ida}?ok=selesai'); cek('pengembalian dengan sopir', True)
        await pg.goto(f'{W}/admin/pesanan/{ida}/serah-terima'); await pg.wait_for_url(f'**/admin/pesanan/{ida}'); cek('serah terima pesanan selesai dialihkan', True)
        # kelola mobil: tambah tipe (galat tarif kosong dulu)
        await pg.goto(W+'/admin/kelola-mobil'); await pg.wait_for_selector('td:has-text("Avanza")'); cek('daftar tipe dari API', await pg.locator('section.kartu').first.locator('tbody tr').count()>=3)
        await pg.click('text=Tambah tipe'); await pg.wait_for_url('**/tipe/baru')
        await pg.fill('#nama','Xpander Cross'); await pg.fill('#merk','Mitsubishi'); await pg.fill('#kursi','7')
        await pg.click('button:has-text("Simpan")'); await pg.click('#konfirmasi button[type=submit]'); await pg.wait_for_selector('.galat-kolom'); cek('tarif kosong ditolak', 'minimal satu tarif' in await pg.text_content('form'))
        await pg.fill('#t2','400000'); await pg.set_input_files('#f1', PNG); await pg.click('button:has-text("Simpan")'); await pg.click('#konfirmasi button[type=submit]')
        await pg.wait_for_url('**/admin/kelola-mobil?ok=tipe'); await pg.wait_for_selector('text=Xpander Cross'); cek('tipe baru tampil', True)
        # tambah unit untuk tipe baru
        await pg.click('text=Tambah unit'); await pg.wait_for_url('**/unit/baru*'); await pg.wait_for_selector('#tipe option:has-text("Xpander Cross")', state='attached')
        await pg.select_option('#tipe', label='Xpander Cross (Mitsubishi)'); await pg.fill('#plat','n 7777 xc'); await pg.fill('#thn','2024'); await pg.fill('#warna','Abu-abu')
        await pg.fill('#rangka','RKX1'); await pg.fill('#mesin','MSX1'); await pg.click('button:has-text("Simpan")'); await pg.click('#konfirmasi button[type=submit]')
        await pg.wait_for_url('**/admin/kelola-mobil?ok=unit'); await pg.wait_for_selector('text=N 7777 XC'); cek('unit baru (plat dirapikan back-end)', True)
        # hapus tipe yang masih punya unit -> 409
        row=pg.locator('tr:has-text("Xpander Cross")').first; await row.locator('button:has-text("Hapus")').click(); await pg.click('#konfirmasi button:has-text("Ya, hapus")')
        await pg.wait_for_selector('.alert.galat'); cek('hapus tipe ber-unit ditolak', 'unit' in (await pg.text_content('.alert.galat')).lower())
        # nonaktifkan lalu aktifkan unit
        r=pg.locator('tr:has-text("N 7777 XC")'); await r.locator('button:has-text("Tandai tidak tersedia")').click(); await pg.click('#konfirmasi button:has-text("Ya, tandai")')
        await pg.wait_for_selector('tr:has-text("N 7777 XC") .badge:has-text("Tidak tersedia")'); cek('unit ditandai tidak tersedia', True)
        await r.locator('button:has-text("Tandai tersedia")').click(); await pg.click('#konfirmasi button:has-text("Ya, tandai")')
        await pg.wait_for_selector('tr:has-text("N 7777 XC") .badge:has-text("Tersedia")'); cek('unit ditandai tersedia lagi', True)
        # hapus unit, lalu tambah plat sama -> tawar pulihkan
        await r.locator('button:has-text("Hapus")').click(); await pg.click('#konfirmasi button:has-text("Ya, hapus")'); await pg.wait_for_selector('text=Unit N 7777 XC dihapus')
        cek('unit dihapus', await pg.locator('tr:has-text("N 7777 XC")').count()==0)
        await pg.goto(W+'/admin/kelola-mobil/unit/baru'); await pg.wait_for_selector('#tipe option:has-text("Xpander")', state='attached')
        await pg.select_option('#tipe', label='Xpander Cross (Mitsubishi)'); await pg.fill('#plat','N 7777 XC'); await pg.fill('#thn','2024'); await pg.fill('#warna','Abu'); await pg.fill('#rangka','RKX2'); await pg.fill('#mesin','MSX2')
        await pg.click('button:has-text("Simpan")'); await pg.click('#konfirmasi button[type=submit]'); await pg.wait_for_selector('text=Pulihkan unit lama'); cek('plat di tempat sampah -> tawar pulihkan', True)
        await pg.click('text=Pulihkan unit lama'); await pg.wait_for_url('**/unit/*?pulih=1'); await pg.wait_for_selector('#plat'); cek('pulihkan -> form unit lama', await pg.input_value('#plat')=='N 7777 XC')
        # ubah tipe: hapus foto
        await pg.goto(W+'/admin/kelola-mobil'); await pg.locator('tr:has-text("Xpander Cross") a:has-text("Ubah")').first.click(); await pg.wait_for_selector('.foto-lama')
        cek('form ubah tipe terisi', await pg.input_value('#nama')=='Xpander Cross' and await pg.locator('#f1').count()==1 and await pg.locator('#f3').count()==0)
        await pg.click('.foto-lama button'); await pg.wait_for_selector('text=Belum ada foto'); cek('hapus foto tipe', await pg.locator('#f3').count()==1)
        # servis: dari pengembalian ada 1 sedang servis
        await pg.goto(W+'/admin/servis'); await pg.wait_for_selector('text=Pengingat servis'); await pg.wait_for_timeout(300)
        await pg.click('header a:has-text("Catat servis")'); await pg.wait_for_selector('#catat-servis:target')
        await pg.select_option('#unit', index=1); await pg.fill('#jenis','Servis berkala'); await pg.fill('#bengkel','Bengkel Maju Jaya'); await pg.fill('#odo','1')
        cek('odometer mundur ditolak (min dari odometer terakhir)', not await pg.evaluate("document.getElementById('odo').checkValidity()"))
        await pg.fill('#odo',''); await pg.click('#catat-servis button[type=submit]'); await pg.wait_for_selector('text=Servis dicatat'); cek('catat servis', await pg.locator('#catat-servis:target').count()==0)
        n=await pg.locator('section:has-text("Sedang servis") tbody tr:has(a:has-text("Selesai servis"))').count(); cek('sedang servis tampil', n>=1, n)
        await pg.locator('a:has-text("Selesai servis")').first.click(); await pg.wait_for_selector('#selesai-servis:target')
        await pg.fill('#bk','250000'); await pg.click('#selesai-servis button[type=submit]'); await pg.wait_for_selector('#selesai-servis .galat-kolom'); cek('komponen wajib dipilih', True)
        await pg.check('#c1'); await pg.check('#c8'); await pg.fill('#c8-teks','Wiper'); await pg.click('#selesai-servis button[type=submit]'); await pg.wait_for_selector('text=Servis selesai dicatat')
        cek('riwayat servis memuat komponen', 'Oli mesin, Wiper' in await pg.text_content('section:has-text("Riwayat servis")'))
        await pg.click('header a:has-text("Catat servis")'); await pg.select_option('#unit', index=2); await pg.fill('#jenis','Ganti ban'); await pg.fill('#bengkel','Bengkel B')
        await pg.click('#catat-servis button[type=submit]'); await pg.wait_for_selector('td a.tautan:has-text("Batal")')
        await pg.locator('td a.tautan:has-text("Batal")').first.click(); await pg.click('#batal-servis button:has-text("Ya, batalkan")'); await pg.wait_for_selector('text=Servis dibatalkan')
        cek('batal servis', await pg.locator('td a.tautan:has-text("Batal")').count()==0 and 'Dibatalkan' in await pg.text_content('section:has-text("Riwayat servis")'))
        await pg.fill('#interval','6000'); await pg.click('button:has-text("Simpan interval")'); await pg.wait_for_selector('text=Interval servis disimpan'); cek('simpan interval', True)
        # laporan
        await pg.goto(W+'/admin/laporan'); await pg.wait_for_selector('text=Pesanan pada periode ini'); await pg.wait_for_selector('table.tabel tbody tr')
        cek('laporan dari API', await pg.locator('table.tabel tbody tr').count()==2)
        await pg.click('.saring a:has-text("Selesai")'); await pg.wait_for_url('**status=selesai'); await pg.wait_for_timeout(500)
        cek('saring status laporan', 'status selesai' in await pg.text_content('main'))
        async with pg.expect_download() as dl: await pg.click('button:has-text("Unduh PDF")')
        cek('unduh PDF laporan', (await dl.value).suggested_filename.endswith('.pdf'))
        await pg.goto(W+'/admin/laporan?periode=7&status=dibatalkan'); await pg.wait_for_selector('text=Tidak ada pesanan'); cek('laporan kosong -> PDF nonaktif', await pg.locator('button:has-text("Unduh PDF")').is_disabled())
        # seluler
        await pg.set_viewport_size({'width':390,'height':844})
        for path in ['/admin/dashboard','/admin/kelola-mobil','/admin/servis','/admin/laporan',f'/admin/pesanan/{idb}']:
            await pg.goto(W+path); await pg.wait_for_timeout(900)
            lebar=await pg.evaluate('document.documentElement.scrollWidth'); cek('tanpa geser samping '+path, lebar<=392, lebar)
        await pg.screenshot(path=''+FOTO+'/admin_hp.png', full_page=True)
        await pg.set_viewport_size({'width':1280,'height':900})
        for path in ['/admin/dashboard','/admin/servis','/admin/kelola-mobil','/admin/laporan']:
            await pg.goto(W+path); await pg.wait_for_timeout(900); await pg.screenshot(path=''+FOTO+'/admin'+path.replace('/','_')+'.png', full_page=True)
        # keluar
        await pg.click('text=Keluar'); await pg.wait_for_url('**/admin/masuk*'); cek('keluar admin', True)
        cek('tanpa galat konsol', not errs, errs[:5])
        await br.close()
    print(f'\n{len(ok)} lulus, {len(bad)} gagal'); [print(' -',x) for x in bad]
asyncio.run(main())
