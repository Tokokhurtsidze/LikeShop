import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI =
  'mongodb://khurtsidzetoko_db_user:Mongo12345@ac-wxadumd-shard-00-00.8y3qatg.mongodb.net:27017,ac-wxadumd-shard-00-01.8y3qatg.mongodb.net:27017,ac-wxadumd-shard-00-02.8y3qatg.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&appName=Base1'

const client = new MongoClient(MONGODB_URI)

async function seed() {
  await client.connect()
  console.log('Connected to MongoDB')

  const db = client.db('ss_clone')

  // Upsert a demo owner user
  const ownerId = new ObjectId('6660000000000000000000aa')
  await db.collection('users').updateOne(
    { _id: ownerId },
    {
      $setOnInsert: {
        _id: ownerId,
        name: 'LikeShop Demo',
        email: 'demo@likeshop.ge',
        phone: '+995 555 000 001',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  )

  const listings = [
    {
      _id: new ObjectId(),
      title: {
        en: 'Modern 4-Room House in Vake',
        ka: 'თანამედროვე 4-ოთახიანი სახლი ვაკეში',
      },
      description: {
        en: 'Stunning modern house in the prestigious Vake district of Tbilisi. Fully renovated in 2023 with premium finishes throughout. Open-plan living and dining area with floor-to-ceiling windows overlooking a private garden. Chef\'s kitchen with granite countertops, stainless steel appliances. Three spacious bedrooms, master en-suite. Private parking for 2 cars. Close to Vake Park, international schools and restaurants.',
        ka: 'შესანიშნავი თანამედროვე სახლი თბილისის პრესტიჟულ ვაკის უბანში. სრულად განახლებული 2023 წელს პრემიუმ მასალებით. ღია სივრცის სასტუმრო და სასადილო ოთახი ჭერამდე მიმავალი ფანჯრებით, კერძო ბაღის ხედით. სამზარეულო გრანიტის სამუშაო ზედაპირებითა და ბრენდული ტექნიკით. სამი просторული საძინებელი, მასტერ საძინებლის ვანით. კერძო პარკინგი 2 ავტომობილისთვის. ახლოს ვაკის პარკთან, საერთაშორისო სკოლებთან და რესტორნებთან.',
      },
      transactionType: 'sale',
      propertyType: 'house',
      status: 'active',
      price: 485000,
      currency: 'USD',
      area: 220,
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      floor: 1,
      totalFloors: 2,
      location: {
        region: 'თბილისი',
        district: 'ვაკე',
        address: 'ბარნოვის ქ. 45, ვაკე, თბილისი',
        coordinates: { lat: 41.7151, lng: 44.7731 },
      },
      amenities: ['parking', 'garden', 'security', 'balcony', 'storage', 'renovated'],
      images: [
        {
          publicId: 'seed/house1_main',
          url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
          alt: 'Modern house exterior',
        },
        {
          publicId: 'seed/house1_living',
          url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=800&q=80',
          alt: 'Living room',
        },
        {
          publicId: 'seed/house1_kitchen',
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
          alt: 'Kitchen',
        },
        {
          publicId: 'seed/house1_bedroom',
          url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
          alt: 'Master bedroom',
        },
        {
          publicId: 'seed/house1_garden',
          url: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80',
          alt: 'Garden',
        },
      ],
      owner: ownerId,
      views: 142,
      featured: true,
      createdAt: new Date('2024-11-10'),
      updatedAt: new Date('2024-11-10'),
    },
    {
      _id: new ObjectId(),
      title: {
        en: 'Cozy 3-Room Apartment in Saburtalo',
        ka: 'კომფორტული 3-ოთახიანი ბინა საბურთალოზე',
      },
      description: {
        en: 'Bright and well-maintained 3-room apartment on the 7th floor in the heart of Saburtalo. The apartment features a large balcony with panoramic city views, newly renovated bathroom with Italian tiles, and updated kitchen. Hardwood floors throughout. Just 5 minutes walk to Delisi metro station, supermarkets and cafes. Ideal for a young family or professionals.',
        ka: 'ნათელი და კარგ მდგომარეობაში მყოფი 3-ოთახიანი ბინა მე-7 სართულზე, საბურთალოს ცენტრში. ბინაში გაქვთ დიდი აივანი ქალაქის პანორამული ხედით, ახლად გარემონტებული სველი წერტილი იტალიური კერამიკით და განახლებული სამზარეულო. პარკეტი მთელ ბინაში. სულ 5 წუთი სიარულით დელისის მეტრომდე, სუპერმარკეტებამდე და კაფეებამდე. იდეალური ახალგაზრდა ოჯახისთვის ან პროფესიონალებისთვის.',
      },
      transactionType: 'rent_monthly',
      propertyType: 'apartment',
      status: 'active',
      price: 1200,
      currency: 'USD',
      area: 85,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      floor: 7,
      totalFloors: 12,
      location: {
        region: 'თბილისი',
        district: 'საბურთალო',
        address: 'მოსაშვილის ქ. 12, საბურთალო, თბილისი',
        coordinates: { lat: 41.7389, lng: 44.7632 },
      },
      amenities: ['balcony', 'elevator', 'renovated', 'internet', 'furnished'],
      images: [
        {
          publicId: 'seed/apt1_main',
          url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
          alt: 'Apartment living room',
        },
        {
          publicId: 'seed/apt1_bedroom',
          url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
          alt: 'Bedroom',
        },
        {
          publicId: 'seed/apt1_kitchen',
          url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
          alt: 'Kitchen',
        },
        {
          publicId: 'seed/apt1_balcony',
          url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
          alt: 'Balcony view',
        },
      ],
      owner: ownerId,
      views: 87,
      featured: true,
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-11-15'),
    },
  ]

  const result = await db.collection('listings').insertMany(listings)
  console.log(`Inserted ${result.insertedCount} listings`)
  console.log('IDs:', Object.values(result.insertedIds).map(id => id.toString()))

  await client.close()
  console.log('Done.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
