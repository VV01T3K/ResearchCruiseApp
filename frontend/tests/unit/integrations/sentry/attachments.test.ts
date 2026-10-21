import { expect, it } from 'vite-plus/test';
import { MAX_ATTACHMENT_SIZE, readAttachments } from '@/integrations/sentry/attachments';

const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const webp = [0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50];

function file(name: string, bytes: number[], size = bytes.length) {
  const data = new Uint8Array(size);
  data.set(bytes);
  return new File([data], name, { type: 'image/png' });
}

it.each([
  ['shot.png', png, 0, 'image/png', undefined],
  ['photo.jpg', [0xff, 0xd8, 0xff, 0xe0], 0, 'image/jpeg', undefined],
  ['shot.webp', webp, 0, 'image/webp', undefined],
  ['doc.pdf', [0x25, 0x50, 0x44, 0x46, 0x2d], 0, 'application/pdf', undefined],
  ['fake.png', [0x3c, 0x73, 0x76, 0x67], 0, undefined, 'nie jest obrazem'],
  ['riff.webp', [0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x41, 0x56, 0x49, 0x20], 0, undefined, 'nie jest obrazem'],
  ['big.png', png, 0, undefined, 'większy niż 5 MB', MAX_ATTACHMENT_SIZE + 1],
  ['fourth.png', png, 3, undefined, 'najwyżej 3'],
] as const)('reads %s', async (name, bytes, existing, contentType, error, size?: number) => {
  const { attachments, errors } = await readAttachments([file(name, [...bytes], size)], existing);
  expect(attachments.map((attachment) => attachment.contentType)).toEqual(contentType ? [contentType] : []);
  expect(errors.join()).toContain(error ?? '');
});

it('keeps readable files when another file fails to load', async () => {
  const broken = file('gone.png', png);
  broken.arrayBuffer = () => Promise.reject(new DOMException('', 'NotReadableError'));
  const { attachments, errors } = await readAttachments([file('shot.png', png), broken], 0);
  expect(attachments.map((attachment) => attachment.filename)).toEqual(['shot.png']);
  expect(errors).toEqual(['Nie udało się odczytać pliku „gone.png”.']);
});
