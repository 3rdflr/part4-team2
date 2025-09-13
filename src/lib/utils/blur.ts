// lib/blur.ts
import { getPlaiceholder } from 'plaiceholder';

export async function getBlurDataURL(imageUrl: string, size = 10): Promise<string | undefined> {
  try {
    const res = await fetch(imageUrl, { cache: 'force-cache' }); // CDN이면 cache-friendly
    if (!res.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);
    const arrayBuf = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const { base64 } = await getPlaiceholder(buffer, { size });
    return base64; // 그대로 blurDataURL에 넣어도 OK
  } catch (e) {
    console.error('[blur] generation failed:', e);
    return undefined;
  }
}
