// Tema claro/oscuro — clase 'dark' en <html>, persistida en localStorage.

export function getTheme(): 'light' | 'dark' {
  return localStorage.getItem('des_theme') === 'dark' ? 'dark' : 'light';
}

export function applyTheme(t: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.documentElement.dataset.theme = t;
  localStorage.setItem('des_theme', t);
  window.dispatchEvent(new CustomEvent('des-theme'));
}

export function toggleTheme() {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

// Llamar antes de render para evitar flash de tema incorrecto.
export function initTheme() {
  const t = getTheme();
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.documentElement.dataset.theme = t;
}
