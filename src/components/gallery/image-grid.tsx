'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { deleteGallery } from '@/lib/supabase/queries'
import { Button } from '@/components/ui/button'
import type { Gallery } from '@/types'
import { Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ImageGridProps {
  images: Gallery[]
}

export function ImageGrid({ images }: ImageGridProps) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Padam gambar ini?')) return

    try {
      await deleteGallery(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Ralat memadam gambar')
    }
  }

  if (images.length === 0) {
    return <p className="text-gray-500 text-center py-8">Tiada gambar lagi.</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group"
          >
            {image.pautan_gambar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.pautan_gambar}
                alt={image.keterangan || 'Gallery image'}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImage(image)}
              />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
              <div className="text-white text-xs">
                <p>{image.users?.nama}</p>
                <p>{formatDate(image.created_at)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-red-400"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          {selectedImage.pautan_gambar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedImage.pautan_gambar}
              alt={selectedImage.keterangan || 'Gallery image'}
              className="max-w-full max-h-full object-contain"
            />
          )}
          {selectedImage.keterangan && (
            <p className="absolute bottom-8 text-white text-center max-w-md">
              {selectedImage.keterangan}
            </p>
          )}
        </div>
      )}
    </>
  )
}