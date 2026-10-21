export const MAX_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_ATTACHMENTS = '.png,.jpg,.jpeg,.webp,.pdf,image/png,image/jpeg,image/webp,application/pdf';

export type FeedbackAttachment = {
  id: string;
  filename: string;
  contentType: AttachmentContentType;
  data: Uint8Array<ArrayBuffer>;
};

type AttachmentContentType = 'image/png' | 'image/jpeg' | 'image/webp' | 'application/pdf';

const signatures: Array<{ contentType: AttachmentContentType; bytes: Array<number | null> }> = [
  { contentType: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { contentType: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  {
    contentType: 'image/webp',
    bytes: [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50],
  },
  { contentType: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] },
];

export function detectContentType(bytes: Uint8Array): AttachmentContentType | undefined {
  return signatures.find(({ bytes: signature }) =>
    signature.every((byte, index) => byte === null || bytes[index] === byte)
  )?.contentType;
}

export function isImageAttachment(attachment: FeedbackAttachment): boolean {
  return attachment.contentType.startsWith('image/');
}

export async function readAttachments(
  files: File[],
  existingCount: number
): Promise<{ attachments: FeedbackAttachment[]; errors: string[] }> {
  const attachments: FeedbackAttachment[] = [];
  const errors: string[] = [];
  for (const file of files) {
    if (existingCount + attachments.length >= MAX_ATTACHMENTS) {
      errors.push(`Można dołączyć najwyżej ${MAX_ATTACHMENTS} pliki.`);
      break;
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      errors.push(`Plik „${file.name}” jest większy niż 5 MB.`);
      continue;
    }
    const data = new Uint8Array(await file.arrayBuffer());
    const contentType = detectContentType(data);
    if (!contentType) {
      errors.push(`Plik „${file.name}” nie jest obrazem PNG, JPEG, WebP ani plikiem PDF.`);
      continue;
    }
    attachments.push({ id: crypto.randomUUID(), filename: file.name || 'zrzut-ekranu', contentType, data });
  }
  return { attachments, errors };
}
