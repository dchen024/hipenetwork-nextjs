import { Metadata } from "next";
import Hero from "@/components/Hero";
import FeaturesTab from "@/components/FeaturesTab";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Testimonial from "@/components/Testimonial";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ToasterContext from "./context/ToastContext";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "",
  description: "",
  // other metadata
};

export default function Home() {
  return (
    <main>
      <Lines />
      <Header />
      <ToasterContext />
      <Hero />
      <FeaturesTab />
      <Testimonial />
      <CTA />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
