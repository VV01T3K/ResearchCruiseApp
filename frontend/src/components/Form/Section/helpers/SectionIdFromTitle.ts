export function SectionIdFromTitle(title: String) {
    return 'section_' + title.replace(/[^A-Za-z]/g, '');
}