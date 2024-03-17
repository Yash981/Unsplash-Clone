import Image from "next/image";


import SearchField from "@/components/ui/Search";
import HeroImage from './../public/Images/hero-image.png';


export default function Home() {
  // const router = useRouter();
  
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2 gap-10 ">
      <div className="text-center">
        <h1 className="text-5xl font-semibold">Search</h1>
        <p>Search high-resolution images from Unsplash</p>
      </div>
      <Image src={HeroImage} alt="hero-image" fill={true} className="w-full h-full object-contain object-center relative -z-10" />
      <SearchField />
    </main>
  );
}
