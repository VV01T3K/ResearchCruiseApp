export function SectionIdFromTitle(title: string) {
  return "section_" + title.replace(/[^A-Za-z]/g, "")
}
