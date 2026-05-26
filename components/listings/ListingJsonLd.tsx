interface ListingJsonLdProps {
  listing: {
    _id: string
    title: { en: string; ka: string }
    description: { en: string; ka: string }
    price: number
    currency: string
    transactionType: string
    location: { address: string; region: string; district: string }
    images: { url: string }[]
    createdAt: string | Date
  }
  url: string
}

export function ListingJsonLd({ listing, url }: ListingJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title.en,
    description: listing.description.en,
    url,
    datePosted: new Date(listing.createdAt).toISOString(),
    image: listing.images.map((img) => img.url),
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: listing.currency,
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.location.district,
      addressRegion: listing.location.region,
      streetAddress: listing.location.address,
      addressCountry: 'GE',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
