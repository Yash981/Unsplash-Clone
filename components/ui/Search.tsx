"use client"
import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts"


export interface Resultt {
  id: string;
  urls: {
    regular: string;
    full: string;
  };
  alt_description: string;
}
export interface UnsplashResponse {
  results: Resultt[]
}

const SearchField = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputValueRef = useRef<HTMLInputElement>(null);
  // const debouncedQuery = useDebounceValue(query, 1000);

  // useEffect(() => {

  //   if (debouncedQuery[0].trim()) {
  //     router.push(`/search/${encodeURIComponent(debouncedQuery[0])}`);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [debouncedQuery[0], router]);
  const handleSearch = ()=>{
    if (inputValueRef.current!.value.trim()) {
      router.push(`/search/${encodeURIComponent(inputValueRef.current!.value)}`);
    }
  }

  useEffect(() => {
    setMounted(true);
    const storedQuery = localStorage.getItem('searchQuery');
    if (storedQuery) {
      setQuery(storedQuery);
    }

  }, []);
  useEffect(() => {
    // Set the input value to the current query
    // console.log(inputValueRef.current);
    if (inputValueRef.current) {
      inputValueRef.current.value = query;
    }
  }, [query]);

  return (
    <div
      className="relative md:w-[80%] mt-2  sm:w-[90%] lg:w-2/5 w-[90%]"
    // onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Enter your keywords..."
        className={`border-2 border-input rounded-lg py-2 px-4 w-full h-14 pl-8 focus:outline-none focus:border-[#E5E7EBCC] shadow-md ${mounted && theme === "dark" ? "bg-[#1E293B]" : ""
          }`} value={query} onChange={(e) => { setQuery(e.target.value); localStorage.setItem('searchQuery', inputValueRef.current!.value); }} ref={inputValueRef} />
      {/* <button type="submit"> */}
      <Search className="h-6 w-6 absolute right-3 top-4 text-[#797b80cc] cursor-pointer" type="button" onClick={handleSearch}/>
      {/* </button> */}
    </div>
  );
};
export default SearchField;




