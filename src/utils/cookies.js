const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function leerCookie(nombre) {
  const prefijo = `${encodeURIComponent(nombre)}=`;
  const cookie = document.cookie
    .split("; ")
    .find((entrada) => entrada.startsWith(prefijo));

  return cookie ? decodeURIComponent(cookie.slice(prefijo.length)) : null;
}

export function guardarCookie(nombre, valor, maxAge = COOKIE_MAX_AGE) {
  const seguro = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(nombre)}=${encodeURIComponent(valor)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${seguro}`;
}

export function borrarCookie(nombre) {
  guardarCookie(nombre, "", 0);
}
