import { ImageUpload } from '@/components/gallery/image-upload'

export default function NewGalleryPage() {
  return (
    <div>
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Gambar Baru</h2>
      </div>
      <ImageUpload />
    </div>
  )
}