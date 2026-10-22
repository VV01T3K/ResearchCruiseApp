export function navbarCollisionPadding() {
  const navbarHeight = document.getElementById('header')?.offsetHeight ?? 0;
  return { top: navbarHeight + 8, right: 8, bottom: 8, left: 8 };
}
