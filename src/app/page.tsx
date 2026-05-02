import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from './components/HeroSection'
import CategoriesSection from './components/CategoriesSection'
import HowItWorksSection from './components/HowItWorksSection'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'

const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'RapidFix',
  description: 'Home services marketplace connecting customers with verified electricians, plumbers, carpenters, painters, and more across Gujarat.',
  url: 'https://rapidfix.in',
  logo: 'https://rapidfix.in/logo.png',
  address: { '@type': 'PostalAddress', addressLocality: 'Rajkot', addressRegion: 'Gujarat', addressCountry: 'IN' },
  geo: { '@type': 'GeoCoordinates', latitude: 22.3039, longitude: 70.8022 },
  areaServed: ['Rajkot', 'Ahmedabad', 'Surat', 'Vadodara', 'Jamnagar', 'Gandhinagar'],
  priceRange: '₹₹',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '12000', bestRating: '5' },
  sameAs: ['https://twitter.com/rapidfix_in', 'https://instagram.com/rapidfix.in'],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How much does an electrician cost in Rajkot?', acceptedAnswer: { '@type': 'Answer', text: 'Electrician charges in Rajkot typically range from ₹200 to ₹800 depending on the job. Simple fixes like fan fitting cost around ₹200–300, while MCB panel work can go up to ₹800+. All prices on RapidFix are agreed upfront with no hidden charges.' } },
    { '@type': 'Question', name: 'How fast can I get a plumber?', acceptedAnswer: { '@type': 'Answer', text: 'Most plumbing jobs on RapidFix are accepted within 30 minutes. For emergency jobs marked as urgent, workers are notified immediately and average response time is under 15 minutes.' } },
    { '@type': 'Question', name: 'Are RapidFix workers verified?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Every worker on RapidFix submits a government-issued ID (Aadhaar) and a selfie before they can accept jobs. Our trust team reviews all documents within 24 hours.' } },
    { '@type': 'Question', name: 'What if I am not satisfied with the work?', acceptedAnswer: { '@type': 'Answer', text: 'You can raise a dispute within 48 hours of job completion using the "Report Issue" button in the app. Our team investigates and issues a refund or arranges a free redo if the work was unsatisfactory.' } },
    { '@type': 'Question', name: 'How do I pay on RapidFix?', acceptedAnswer: { '@type': 'Answer', text: 'You pay securely through Razorpay using UPI, credit/debit card, or net banking. Payment is held in escrow and released to the worker only after you confirm the job is done.' } },
  ],
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
