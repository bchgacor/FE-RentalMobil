// Pop-up memakai CSS :target (alamat berakhiran #id). Menutupnya = mengosongkan hash, lalu "#" dibersihkan dari alamat.
export function tutupModal() {
  if (window.location.hash) window.location.hash = "";
  window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
}
