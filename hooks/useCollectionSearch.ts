import { UnsplashResponse } from "@/components/ui/Search";
import axios from "axios";
import { useEffect, useState } from "react";

const useCollectionSearch = (Apikey: string) => {
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
            console.log(response.data)
            setResultData(response.data);
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
  
  export default useCollectionSearch;