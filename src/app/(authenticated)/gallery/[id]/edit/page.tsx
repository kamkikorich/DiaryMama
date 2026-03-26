import { getGalleryById } from '@/lib/supabase/queries'
import { ImageUpload } from '@/components/gallery/image-upload'
import { notFound } from 'next/navigation'

interface EditGalleryPageProps {
  params: Promise<{ id: string }>
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
  const { id } = await params
  const image = await getGalleryById(id)

  if (!image) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-lg font-semibold p-4 border-b">Edit Gambar</h1>
      <ImageUpload image={image} />
    </div>
  )
}