import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import ServicesSection from '../components/home/ServicesSection';
import Portfolio from '../components/home/Portfolio';
import StepsSection from '../components/home/steps';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StepsSection />
      <StatsSection />
      <ServicesSection />
      <Portfolio />
    </>
  );
}
