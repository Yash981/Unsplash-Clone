"use client"
import { Button } from "@/components/ui/button";
import { ModeToggle } from './dark-mode-toggle';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoComponent from './LogoComponent';
const Navbar = () => {
  const { theme } = useTheme();
  // console.log(theme);
  const [mounted, setMounted] = useState(false);
  const [activeButton, setActiveButton] = useState('home');

  
  const handleButtonClick = (buttonName:string) => {
    setActiveButton(buttonName);
  };
  useEffect(() => setMounted(true), []);
  if(!mounted) return null
  return (
    <div
      className={`h-16 w-full flex justify-between items-center p-6 border-b-2 max-sm:p-1 max-sm:flex-col ${mounted && theme === "dark"
        ? "border-[rgba(229,231,235,0.1)]"
        : "border-[rgba(229,231,235,0.8)]"
        } max-sm:h-28 max-sm:justify-between max-sm:items-center`}
    >
      {/* sticky top-0 z-50 */}
      <Link href='/'>
        <LogoComponent theme={theme} />
      </Link>
      <div className=" ">
        <Link href={'/search/unsplash'}>
        <Button
          size={"default"}
          variant={"ghost"}
          className={`mr-2 ${activeButton ==='home' && theme === "dark" ?  'bg-[rgba(229,231,235,0.1)]' : ''}  ${activeButton ==='home' && theme === "light" ?  'bg-[rgba(229,231,235,0.8)]' : ''}  ${mounted && theme === "dark"
            ? "hover:bg-[rgba(229,231,235,0.1)] "
            : "hover:bg-[rgba(229,231,235,0.8)]"
            } `}
            onClick={() => handleButtonClick('home')} 
        >
          Home
        </Button>
        </Link>
        <Link href={"/collections"}>
          <Button
            size={"default"}
            variant={"ghost"}
            className={`hover:bg-[rgba(229,231,235,0.8)] mr-2 ${activeButton ==='collections' && theme === "dark" ?  'bg-[rgba(229,231,235,0.1)]' : ''} ${activeButton ==='collections' && theme === "light" ?  'bg-[rgba(229,231,235,0.8)]' : ''} ${mounted && theme === "dark"
              ? "hover:bg-[rgba(229,231,235,0.1)]"
              : "hover:bg-[rgba(229,231,235,0.8)]"
              } `}
              onClick={() => handleButtonClick('collections')}
          >
            Collections
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar