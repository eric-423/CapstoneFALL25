import { HeroSection } from '@/components/home/HeroSection';
import { WhyChooseSection } from '@/components/home/WhyChooseSection';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { FranchiseSection } from '@/components/home/FranchiseSection';
import { LocationNewsletterSection } from '@/components/home/LocationNewsletterSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhyChooseSection />
      <BestSellersSection />
      <FranchiseSection />
      <LocationNewsletterSection />
    </>
  );
}
