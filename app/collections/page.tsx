"use client"
import { Button } from '@/components/ui/button';
import useCollectionSearch from '@/hooks/useCollectionSearch';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Collections = () => {
  const [TotalCollection, setTotalCollections] = useState([]);

  useEffect(() => {
    const storedCollections = Object.keys(localStorage)
      .filter(key => key.startsWith('collections'))
      .map(key => {
        const item = localStorage.getItem(key);
        try {
          const parsedItem = JSON.parse(item || 'null');
          return parsedItem;
        } catch (error) {
          console.error(`Error parsing JSON from localStorage key "${key}":`, error);
          console.log(`Value of localStorage key "${key}":`, item);
          return null;
        }
      })
      .filter(collection => collection !== null);

    const info = storedCollections.map(collection => ({
      id: collection.id,
      title: collection.title,
      total_photos: collection.total_photos
    }));
    //@ts-ignore
    setTotalCollections(info);
  }, []);
  const handleRemoveCollection = (id:any) => {
    localStorage.removeItem(`collections${id}`);
    setTotalCollections((prevCollections) =>
      prevCollections.filter((collection:any) => collection.id !== id)
    );
  };

  return (
    <main className='w-full h-full'>
      <div className='flex flex-col justify-center items-center mt-12 gap-2'>
        <h1 className='text-4xl font-semibold bg-gradient-to-right bg-clip-text text-transparent'>Collections</h1>
        <div className="text-center">
          <h2 className='font-thin text-md'>Explore the world through collections of beautiful</h2>
          <h2 className='font-thin text-md'> photos free to use under the <span className='border-b-2 border-white font-medium'><Link href='https://unsplash.com/license' target='_blank'>Unsplash License.</Link></span></h2>
        </div>
      </div>
      <div className='flex flex-wrap gap-5 p-5 pt-10 justify-center'>
        {TotalCollection ? (
          TotalCollection.map((collection:any) => (
            <CollectionItem key={collection.id} collection={collection} handleRemoveCollection={handleRemoveCollection}/>
          ))
        ) : (
          <h1>No Collections</h1>
        )}
        <h1>{TotalCollection.length === 0 ? 'No Collections' : ''}</h1>
      </div>
    </main>
  );
};

//@ts-ignore
const CollectionItem = ({ collection,handleRemoveCollection }) => {
  const key = `https://api.unsplash.com/collections/${collection.id}/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID}&per_page=3`;
  const { resultData, loading } = useCollectionSearch(key);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!resultData) {
    return <div>Error fetching images</div>;
  }

  const imgUrls = resultData.map((data:any) => data.urls.small);
  const firstImageUrl = imgUrls[0];
  const otherImagesUrl = imgUrls.slice(1);

  return (
    <div>
      <Link href={`/collections/${collection.id}=${collection.title}=${collection.total_photos}`}>
        <div className='flex w-96 h-60 m-4 relative rounded-xl overflow-hidden'>
          <div className='w-1/2 object-fill object-center overflow-hidden'>
            <Image src={firstImageUrl} alt="image" width={120} height={120} priority={true} className='!w-full !h-full   object-cover' />
          </div>
          {otherImagesUrl.length > 0 && (
            <div className='h-full w-1/2 object-cover '>
              {otherImagesUrl.map((url:any, idx:number) => (
                <div key={idx} className='h-1/2 object-fill object-center px-1 mb-1 overflow-hidden'>
                  <Image src={url} alt="image" width={80} height={80} priority={true} className='!w-full !h-full' />
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
      <div className="w-full px-4 flex justify-between items-center">
        <div>
          <p className='text-start text-lg font-medium'>{collection.title}</p>
          <p className='text-start text-sm font-thin'>{collection.total_photos} photos</p>
        </div>
        <div>
          <Button variant='destructive' onClick={() => handleRemoveCollection(collection.id)}>Remove</Button>
        </div>
      </div>
    </div>
  );
};

export default Collections;
