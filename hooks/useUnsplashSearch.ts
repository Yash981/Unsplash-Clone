// import { Resultt, UnsplashResponse } from "@/app/search/[slug]/page";
import axios from "axios";
import { useState, useEffect } from "react";
import { Resultt, UnsplashResponse } from "../components/ui/Search";
const useUnsplashSearch = (Apikey: string) => {
  // console.log(Apikey);

  const [resultData, setResultData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  // console.log(query)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<UnsplashResponse>(`${Apikey}`);
        // console.log(response.data)
        // if(!response.data){
        //   setResultData('ok')
        //   return
        // }
        if (Apikey.startsWith("https://api.unsplash.com/photos/")) {
          // console.log(response.data);
          setResultData(response.data as any);
        } else {
          setResultData(response.data.results);
        }
        // console.log(response.data.results)
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    if (Apikey) {
      // console.log(query)
      fetchData();
    }
  }, [Apikey]);
  console.log(resultData);
  return { resultData, loading };
};

export default useUnsplashSearch;

