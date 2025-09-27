export async function loadComponent(id, path) {
  const container = document.getElementById(id);
  if (!container) return;
  try {
    const res = await fetch(path);
    const html = await res.text();
    container.innerHTML = html;
  } catch (err) {
    console.error('Failed to load ${path}:', err);
  }
}