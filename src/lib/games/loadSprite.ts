import { withBasePath } from '@/lib/basePath'

export function loadSprite(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = withBasePath(src)
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}
