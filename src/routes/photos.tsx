import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { photos } from '@/data/photos'
import type { Photo } from '@/data/photos'
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/photos')({
  component: PhotosPage,
})

function PhotosPage() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  function prev() {
    setLightbox((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
  }
  function next() {
    setLightbox((i) => (i === null ? null : (i + 1) % photos.length))
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Camera className="w-6 h-6 text-knights-blue" />
          <div>
            <h1 className="text-2xl font-bold text-knights-navy">Photo Gallery</h1>
            <p className="text-sm text-gray-500">2025–26 Season</p>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 py-24 flex flex-col items-center justify-center text-center px-4">
            <Camera className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-1">No photos yet</p>
            <p className="text-sm text-gray-400">
              Add images to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">public/photos/</code> and list them in{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">src/data/photos.ts</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 focus:outline-none"
              >
                <img
                  src={photo.src}
                  alt={photo.caption ?? `Photo ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                {photo.game && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate">{photo.game}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute left-4 text-white hover:text-gray-300 p-2"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            className="absolute right-4 text-white hover:text-gray-300 p-2"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="max-w-4xl max-h-[90vh] px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightbox].src}
              alt={photos[lightbox].caption ?? `Photo ${lightbox + 1}`}
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
            {(photos[lightbox].caption || photos[lightbox].game) && (
              <div className="text-center mt-3">
                {photos[lightbox].caption && (
                  <p className="text-white font-medium">{photos[lightbox].caption}</p>
                )}
                {photos[lightbox].game && (
                  <p className="text-gray-400 text-sm mt-0.5">{photos[lightbox].game}</p>
                )}
              </div>
            )}
            <p className="text-center text-gray-500 text-xs mt-2">{lightbox + 1} / {photos.length}</p>
          </div>
        </div>
      )}
    </div>
  )
}
