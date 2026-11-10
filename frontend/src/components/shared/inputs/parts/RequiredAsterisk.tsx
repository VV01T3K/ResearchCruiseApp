export function RequiredAsterisk() {
  return (
    <span className="ml-1 font-bold text-danger" title="Pole jest obowiązkowe do wypełnienia">
      <span aria-hidden="true">*</span>
      <span className="sr-only">wymagane</span>
    </span>
  );
}
