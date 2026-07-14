import Image from 'next/image'

const PHOTOS = [
  { src: '/images/img-4913.jpg', alt: 'Instructor marking an acupressure meridian on a client’s forearm' },
  { src: '/images/img-2136.jpg', alt: 'Instructor teaching shoulder anatomy with a joint model' },
  { src: '/images/img-2828.jpg', alt: 'Instructor teaching functional anatomy with a foot skeleton model' },
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
