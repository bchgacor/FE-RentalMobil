// Membungkus setiap file CSS prototipe dengan kelas pembungkus (.h-umum, .h-admin, ...)
// supaya aturan dari satu halaman tidak bertabrakan dengan halaman lain di Next.js.
import fs from 'node:fs';
import postcss from 'postcss';
import prefixer from 'postcss-prefix-selector';
const SUMBER = process.argv[2];
const PETA = { index: 'h-umum', admin: 'h-admin', riwayat: 'h-riwayat', about: 'h-about', katalog: 'h-katalog', pesan: 'h-pesan' };
for (const [nama, kelas] of Object.entries(PETA)) {
  let css = fs.readFileSync(`${SUMBER}/${nama}.css`, 'utf8').replaceAll('url("../img/', 'url("/img/').replaceAll("url('../img/", "url('/img/").replaceAll('url(../img/', 'url(/img/')
    // "margin: 10" tanpa satuan tidak berlaku di browser, tapi pengolah CSS Next.js mengubahnya jadi 10px.
    .replace(/margin:\s*10;/g, 'margin: 0;');
  const hasil = postcss([prefixer({
    prefix: `.${kelas}`,
    transform(prefix, selector, prefixed) {
      if (selector === 'html' || selector === 'body' || selector === ':root') return prefix;
      if (selector.startsWith('html ') || selector.startsWith('body ')) return `${prefix} ${selector.replace(/^(html|body)\s+/, '')}`;
      if (selector === '*' ) return `${prefix}, ${prefix} *`;
      return prefixed;
    },
  })]).process(css, { from: undefined }).css;
  fs.writeFileSync(`styles/${nama}.css`, `/* Dibuat otomatis dari prototipe/css/${nama}.css oleh scripts/scope-css.mjs. Jangan diedit langsung. */\n` + hasil);
  console.log(nama, '->', kelas);
}
