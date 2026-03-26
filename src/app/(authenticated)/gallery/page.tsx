import { getGallery } from '@/lib/supabase/queries'
import { ImageGrid } from '@/components/gallery/image-grid'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function GalleryPage() {
  const images = await getGallery(100)

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Galeri</h2>
        <Link href="/gallery/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Baru
          </Button>
        </Link>
      </div>

      <ImageGrid images={images} />
    </div>
  )
}