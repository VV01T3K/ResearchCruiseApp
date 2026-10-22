// Getters, because Base UI reads the padding when a popup opens, after the bars have rendered.
export const stickyBarsCollisionPadding = {
  get top() {
    return (document.getElementById('header')?.offsetHeight ?? 0) + 8;
  },
  right: 8,
  get bottom() {
    const actions = document.querySelector('[data-actions-section]');
    return (actions ? window.innerHeight - actions.getBoundingClientRect().top : 0) + 8;
  },
  left: 8,
};
