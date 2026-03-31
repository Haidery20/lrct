import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBrxpcU_1Lxp6cwZ9-tZe6wVbtmX11tf2Y',
  authDomain: 'landroverclub-cms.firebaseapp.com',
  projectId: 'landroverclub-cms',
  storageBucket: 'landroverclub-cms.firebasestorage.app',
  messagingSenderId: '228797425802',
  appId: '1:228797425802:web:228b77cbbd2bc5e0b02573',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

const now = new Date().toISOString()

const events = [
  {
    title: 'Rock Shungu',
    description: 'Join us for our extreme 4X4 challenge, expedition and share experiences.',
    event_date: '2025-03-29',
    time: '6:00 AM',
    location: 'Mkuranga-Pwani',
    attendees: 45,
    event_type: 'Offroad',
    registration_deadline: '2025-03-25',
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    title: 'Ruaha National Park',
    description: 'Epic 3-day expedition to the base camp of Ruaha National Park.',
    event_date: '2025-04-18',
    time: '10:00 AM',
    location: 'Songea',
    attendees: 12,
    event_type: 'Adventure',
    registration_deadline: '2025-04-10',
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    title: 'Wami Mbiki',
    description: 'Wildlife photography expedition through the Tanzania best game reserve.',
    event_date: '2025-06-21',
    time: '7:00 AM',
    location: 'Wami-Pwani',
    attendees: 18,
    event_type: 'Adventure',
    registration_deadline: '2025-06-15',
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    title: 'Magoroto Drive',
    description: 'Enjoy the best sceneries of coastal regions and its beautiful climatic condition.',
    event_date: '2025-08-08',
    time: '9:00 AM',
    location: 'Tanga',
    attendees: 25,
    event_type: 'Offroad Drive',
    registration_deadline: '2025-08-01',
    is_published: true,
    created_at: now,
    updated_at: now,
  },
]

const gallery = [
  {
    title: 'Mpalano Festival',
    image_url: '/images/mpalano.jpg',
    category: 'Festivals',
    location: 'Matema Beach',
    date: 'July 2025',
    participants: 12,
    caption: 'An incredible festival experience at Matema Beach.',
    created_at: now,
  },
  {
    title: 'Rock Shungu',
    image_url: '/images/rockshungu.jpg',
    category: 'Offroads',
    location: 'Shungumbweni',
    date: 'June 2025',
    participants: 18,
    caption: 'Extreme offroad challenge at Shungumbweni.',
    created_at: now,
  },
  {
    title: 'Landrover Festival',
    image_url: '/images/landroverfestival.jpg',
    category: 'Festivals',
    location: 'Arusha',
    date: 'October 2024',
    participants: 15,
    caption: 'Annual Land Rover Festival in Arusha.',
    created_at: now,
  },
  {
    title: 'Saadani National Park',
    image_url: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    category: 'expeditions',
    location: 'Saadani - Bagamoyo',
    date: 'June 2024',
    participants: 20,
    caption: 'Expedition to the beautiful Saadani National Park.',
    created_at: now,
  },
  {
    title: 'Udzungwa National Park',
    image_url: '/images/udzungwa.jpg',
    category: 'expeditions',
    location: 'Udzungwa - Morogoro',
    date: 'June 2024',
    participants: 20,
    caption: 'Exploring the lush Udzungwa National Park.',
    created_at: now,
  },
  {
    title: 'Magoroto Forest',
    image_url: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    category: 'expeditions',
    location: 'Tanga',
    date: 'October 2023',
    participants: 25,
    caption: 'A stunning drive through Magoroto Forest in Tanga.',
    created_at: now,
  },
]

const partners = [
  { name: 'G4L', logo_url: '/images/partners/g4l.jpg', sort_order: 1, is_active: true, created_at: now, updated_at: now },
  { name: 'Samcare', logo_url: '/images/partners/samcare.avif', sort_order: 2, is_active: true, created_at: now, updated_at: now },
  { name: 'Afriroots', logo_url: '/images/partners/afriroots.avif', sort_order: 3, is_active: true, created_at: now, updated_at: now },
  { name: 'Weibull', logo_url: '/images/partners/weibull.avif', sort_order: 4, is_active: true, created_at: now, updated_at: now },
  { name: 'Wanda', logo_url: '/images/partners/wanda.jpg', sort_order: 5, is_active: true, created_at: now, updated_at: now },
]

const contactDetails = [
  { label: 'Email Us', value: 'info@landroverclub.or.tz', type: 'email', sub_info: 'We respond within 24 hours', sort_order: 1, updated_at: now },
  { label: 'Call Us', value: '+255 713 652 642', type: 'phone', sub_info: 'Mon-Fri 9AM-6PM EAT', sort_order: 2, updated_at: now },
  { label: 'Visit Us', value: 'Dar es Salaam, Tanzania', type: 'address', sub_info: 'Monthly meetings at various locations', sort_order: 3, updated_at: now },
  { label: 'WhatsApp', value: '+255 713 652 642', type: 'whatsapp', sub_info: 'Quick questions and updates', sort_order: 4, updated_at: now },
]

async function clearCollection(name: string) {
  const snap = await getDocs(collection(db, name))
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
  console.log(`Cleared ${name}`)
}

async function seedCollection(name: string, data: object[]) {
  for (const item of data) {
    await addDoc(collection(db, name), item)
  }
  console.log(`Seeded ${data.length} items into ${name}`)
}

async function main() {
  console.log('Starting seed...')

  await clearCollection('events')
  await seedCollection('events', events)

  await clearCollection('gallery')
  await seedCollection('gallery', gallery)

  await clearCollection('partners')
  await seedCollection('partners', partners)

  await clearCollection('contact_details')
  await seedCollection('contact_details', contactDetails)

  console.log('Seed complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
