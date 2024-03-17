"use client"
import SearchField from '@/components/ui/Search'
// import { decrement, increment } from '@/redux/reducers';
import axios from 'axios';
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useUnsplashSearch from '@/hooks/useUnsplashSearch';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';





const SearchResultPage = () => {

  const { slug } = useParams();
  const decodedSlug = decodeURIComponent(slug.toString());
  // console.log(decodedSlug, 'decodedSlug');

  const Apikey1 = `https://api.unsplash.com/search/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID}&query=${decodedSlug}&per_page=20`
  const { resultData, loading } = useUnsplashSearch(Apikey1 as string || '');
  // console.log(resultData, 'resultData');
  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <Image
        src="/Images/gradiend-bg@2x.png"
        alt="bg-image"
        width={1440}
        height={100}
        priority={true}
        className='w-full  object-cover object-center relative -z-10 max-sm:h-20 sm:h-20 '
      />

      <div className="w-full flex flex-col items-center justify-center -mt-8 ">
        <SearchField />
      </div>
      {loading ? (
        <div className='flex flex-wrap gap-5 p-10'>
          {[...Array(10)].map((_, index) => (
            <Skeleton className='w-[250px] h-[400px] rounded-lg' key={index} />
          ))}
        </div>
      ) : (
        <div className=' flex  flex-wrap gap-5 p-10  justify-center'>
          {resultData && resultData.map((image:any) => {
            return (
              <>
                <div className='relative overflow-hidden' key={image.id}>
                  <Link href={`/ImageDetails/${image.id}`} key={image.id}>
                    <Image
                      key={image.id}
                      src={image.urls.regular}
                      alt={image.alt_description}
                      width={250}
                      height={400}
                      className='object-cover object-center  animate-pulse bg-muted rounded-md aspect-[250/400] '
                      loading='lazy'
                      onLoadingComplete={(image)=>image.classList.remove('animate-pulse')}
                    />
                  </Link>
                </div>
              </>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResultPage;


