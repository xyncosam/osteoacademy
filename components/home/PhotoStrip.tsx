import Image from 'next/image'

const PHOTOS = [
  { src: '/images/6f1a9503.jpg', alt: 'Instructor demonstrating a cervical technique on a client' },
  { src: '/images/6f1a9529.jpg', alt: 'Instructor demonstrating a hip-focused technique on a client' },
  { src: '/images/6f1a9506.jpg', alt: 'Hands-on practice during an Osteo Academy workshop' },
]

export function PhotoStrip() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {PHOTOS.map((photo) => (
        <div key={photo.src} className="relative h-64 overflow-hidden rounded-lg">
          <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
        </div>
      ))}
    </div>
  )
}
