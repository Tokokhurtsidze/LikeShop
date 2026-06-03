import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI =
  'mongodb://khurtsidzetoko_db_user:Mongo12345@ac-wxadumd-shard-00-00.8y3qatg.mongodb.net:27017,ac-wxadumd-shard-00-01.8y3qatg.mongodb.net:27017,ac-wxadumd-shard-00-02.8y3qatg.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&appName=Base1'

const client = new MongoClient(MONGODB_URI)

const ownerId = new ObjectId('6660000000000000000000aa')

const listings = [
  {
    _id: new ObjectId(),
    title: {
      en: 'Luxury 2-Room Apartment for Sale in Mtatsminda',
      ka: 'ლუქს 2-ოთახიანი ბინა მთაწმინდაზე',
    },
    description: {
      en: 'Exceptional apartment with breathtaking views of Tbilisi from the iconic Mtatsminda district. Located on the 9th floor of a new-build residential complex. Features an open-plan kitchen-living room with panoramic windows, a modern bathroom with underfloor heating, and a spacious bedroom with built-in wardrobes. The building has 24/7 concierge service, underground parking, and a fitness center. Walking distance to Mtatsminda Park and the TV Tower.',
      ka: 'განსაკუთრებული ბინა თბილისის შესანიშნავი ხედებით მთაწმინდის კულტობრივი უბნიდან. განლაგებულია ახალი საცხოვრებელი კომპლექსის მე-9 სართულზე. პანორამული ფანჯრებით გახსნილი სამზარეულო-სასტუმრო ოთახი, თანამედროვე სველი წერტილი იატაკის გათბობით და просторული საძინებელი ჩაშენებული კარადებით. შენობაში: 24/7 კონსიერჟი, მიწისქვეშა პარკინგი და ფიტნეს-ცენტრი. მთაწმინდის პარკი და სატელევიზიო კოშკი ფეხით სიარულის მანძილზეა.',
    },
    transactionType: 'sale',
    propertyType: 'apartment',
    status: 'active',
    price: 195000,
    currency: 'USD',
    area: 72,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    floor: 9,
    totalFloors: 14,
    location: {
      region: 'თბილისი',
      district: 'მთაწმინდა',
      address: 'კოსტავას ქ. 68, მთაწმინდა, თბილისი',
      coordinates: { lat: 41.6941, lng: 44.7956 },
    },
    amenities: ['parking', 'elevator', 'security', 'gym', 'renovated', 'internet'],
    images: [
      {
        publicId: 'seed/apt2_main',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        alt: 'Apartment interior',
      },
      {
        publicId: 'seed/apt2_view',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        alt: 'City view from window',
      },
      {
        publicId: 'seed/apt2_kitchen',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        alt: 'Kitchen',
      },
      {
        publicId: 'seed/apt2_bath',
        url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
        alt: 'Bathroom',
      },
    ],
    owner: ownerId,
    views: 231,
    featured: true,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    _id: new ObjectId(),
    title: {
      en: 'Charming Stone Cottage in Sighnaghi',
      ka: 'ქვის კოტეჯი სიღნაღში',
    },
    description: {
      en: 'Beautifully restored traditional Georgian stone cottage in the romantic town of Sighnaghi, the City of Love in the Kakheti wine region. The property features original stone walls, wooden beam ceilings, and a wood-burning fireplace. Two bedrooms, a fully equipped kitchen, and a private terrace with stunning views of the Alazani Valley and the Caucasus Mountains. Ideal as a vacation rental or permanent residence. 5 minutes walk from the historic city walls.',
      ka: 'მშვენიერი, განახლებული ტრადიციული ქართული ქვის კოტეჯი სიღნაღში, სიყვარულის ქალაქში, კახეთის სავენახე რეგიონში. ქონება გამოირჩევა ორიგინალური ქვის კედლებით, ხის ძელური ჭერით და შეშის ბუხრით. ორი საძინებელი, სრულად აღჭურვილი სამზარეულო და კერძო აივანი ალაზნის ვაკის და კავკასიის მთების შესანიშნავი ხედებით. იდეალია სააგარაკო დასაქირავებლად ან მუდმივ საცხოვრებლად. ისტორიული ქალაქის კედლებამდე 5 წუთია.',
    },
    transactionType: 'sale',
    propertyType: 'cottage',
    status: 'active',
    price: 85000,
    currency: 'USD',
    area: 110,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    floor: 1,
    totalFloors: 2,
    location: {
      region: 'კახეთი',
      district: 'სიღნაღი',
      address: 'ჩავჭავაძის ქ. 14, სიღნაღი',
      coordinates: { lat: 41.6222, lng: 45.9235 },
    },
    amenities: ['garden', 'balcony', 'renovated', 'storage'],
    images: [
      {
        publicId: 'seed/cottage1_main',
        url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
        alt: 'Stone cottage exterior',
      },
      {
        publicId: 'seed/cottage1_interior',
        url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&q=80',
        alt: 'Cozy interior',
      },
      {
        publicId: 'seed/cottage1_view',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        alt: 'Mountain view',
      },
      {
        publicId: 'seed/cottage1_terrace',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        alt: 'Terrace with view',
      },
    ],
    owner: ownerId,
    views: 318,
    featured: false,
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    _id: new ObjectId(),
    title: {
      en: 'Commercial Space for Rent in Rustaveli Ave',
      ka: 'კომერციული ფართი ქირავდება რუსთაველის გამზ.',
    },
    description: {
      en: "Prime retail or office space on Tbilisi's most prestigious boulevard — Rustaveli Avenue. Ground floor unit in a historic early 20th century building with high ceilings (4.2m), large display windows, and direct street frontage. Currently fitted out as a cafe but easily converted to retail, gallery, or office use. Separate entrance, storage room, and staff restroom. Surrounded by banks, hotels, the National Parliament and the Rustaveli Theatre. High foot traffic location.",
      ka: 'პრემიუმ სავაჭრო ან საოფისე ფართი თბილისის ყველაზე პრესტიჟულ გამზირზე — რუსთაველის გამზირზე. პირველი სართული XX საუკუნის დასაწყისის ისტორიული შენობის, მაღალი ჭერით (4.2 მ), დიდი ვიტრინული ფანჯრებით და პირდაპირი ქუჩასთან წვდომით. ამჟამად კაფედ არის მოწყობილი, მარტივად გარდაიქმნება სავაჭრო, გალერეა ან საოფისე სივრცედ. ცალკე შესასვლელი, საწყობი და პერსონალის სველი წერტილი. მიმდებარეა ბანკები, სასტუმროები, პარლამენტი და რუსთაველის თეატრი.',
    },
    transactionType: 'rent_monthly',
    propertyType: 'commercial',
    status: 'active',
    price: 3500,
    currency: 'USD',
    area: 95,
    rooms: 2,
    bedrooms: 0,
    bathrooms: 1,
    floor: 1,
    totalFloors: 6,
    location: {
      region: 'თბილისი',
      district: 'მთაწმინდა',
      address: 'რუსთაველის გამზ. 22, თბილისი',
      coordinates: { lat: 41.6938, lng: 44.8015 },
    },
    amenities: ['security', 'internet', 'renovated', 'storage'],
    images: [
      {
        publicId: 'seed/commercial1_main',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        alt: 'Commercial space interior',
      },
      {
        publicId: 'seed/commercial1_front',
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
        alt: 'Street frontage',
      },
      {
        publicId: 'seed/commercial1_detail',
        url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
        alt: 'Interior details',
      },
    ],
    owner: ownerId,
    views: 95,
    featured: false,
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18'),
  },
]

async function seed() {
  await client.connect()
  console.log('Connected')
  const db = client.db('myDatabase')
  const result = await db.collection('listings').insertMany(listings)
  console.log(`Inserted ${result.insertedCount} listings`)
  await client.close()
  console.log('Done.')
}

seed().catch((e) => { console.error(e); process.exit(1) })
