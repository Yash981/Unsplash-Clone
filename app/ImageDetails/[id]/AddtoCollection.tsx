import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useUnsplashSearch from '@/hooks/useUnsplashSearch';
import axios from 'axios';
import { MinusIcon, PlusIcon, Search } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'


const AddtoCollection = () => {
    const [inputValue, setInputValue] = useState("");
    const [resultData, setResultData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addedCollections, setAddedCollections] = useState(() => {
        // Initialize addedCollections from localStorage on component mount
        const storedCollections = Object.keys(localStorage)
            .filter(key => key.startsWith('collections'))
            .map(key => localStorage.getItem(key || ''));
        return storedCollections ? storedCollections : [];
    });
    const [ToggleCollection, setToggleCollection] = useState(Array(3).fill(false));
    const [timeoutExecuted, setTimeoutExecuted] = useState(false);

    // console.log(ToggleCollection, 'ToggleCollection')
    const handleSearchCollection = () => {
        setLoading(true);

        // console.log(newToggleCollection,'newToggleCollection')
    };
    useEffect(() => {
        if (resultData.length > 0 && !timeoutExecuted) { // Check if resultData has been fetched and setTimeout has not been executed yet
            // console.log(resultData, 'resultData')
            const timeoutId = setTimeout(() => {
                const newToggleCollection = [...ToggleCollection];
                resultData.forEach((collection, index) => {
                    //@ts-ignore
                    const collectionId = collection.id;
                    if (addedCollections.includes('collections_' + collectionId)) {
                        newToggleCollection[index] = true;
                    }
                });
                setToggleCollection(newToggleCollection);
                setTimeoutExecuted(true); // Set the flag to true to prevent continuous execution
            }, 1000);

            return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout on component unmount or re-render
        }
    }, [resultData, addedCollections, ToggleCollection, timeoutExecuted]);
    const handleToggleCollection = (index: number) => {
        setToggleCollection((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            //@ts-ignore
            const collectionId = resultData[index].id;

            if (newState[index]) {
                // Add collectionId to addedCollections if not already present
                if (!addedCollections.includes('collections' + collectionId)) {
                    const updatedCollections = [...addedCollections, 'collections' + collectionId];
                    setAddedCollections(updatedCollections);
                    localStorage.setItem('collections' + collectionId, JSON.stringify(resultData[index]));
                }
            } else {
                // Remove collectionId from addedCollections
                //@ts-ignore
                const updatedCollections = addedCollections.filter(id => id !== 'collections' + collectionId);
                setAddedCollections(updatedCollections);
                localStorage.removeItem('collections' + collectionId);
            }

            return newState;
        });
    }
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get(`https://api.unsplash.com/search/collections?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID}&query=${inputValue}&per_page=3`);
                setResultData(response.data.results); // Store the fetched data in state

            } catch (error) {
                console.error('Error fetching collections:', error);
            } finally {
                setLoading(false); // Set loading state to false regardless of success or failure
                
                
            }
        };

        if (inputValue && loading) {
            fetchCollections(); // Call the fetchCollections function when inputValue is not empty and loading is true

            // console.log(ToggleCollection, 'newToggleCollection',newToggleCollection)
        }
    }, [inputValue, loading,]);


    // if (resultData) console.log(resultData as any, 'resultData')
    // 
    return (
        <>
            <div className='flex p-2 border border-spacing-1 rounded-md py-4'>
                <input type="search" name="search" id="search" placeholder='Search' className='flex-1 bg-transparent outline-none px-2' autoComplete='off' onChange={(e) => setInputValue(e.target.value)} value={inputValue} />
                <Search className='cursor-pointer' onClick={handleSearchCollection} />
            </div>
            {/* @ts-ignore */}
            {resultData && <p className='my-2 px-2'>{resultData.length} Matches Found</p>}
            {loading ? (
                <div className='flex flex-wrap gap-5 p-5 flex-col'>
                    {[...Array(3)].map((_, index) => (
                        <Skeleton className='w-[400px] h-[60px] rounded-lg' key={index} />
                    ))}
                </div>
            ) : (
                <div className='flex flex-wrap  flex-col'>

                    {/* @ts-ignore */}
                    {resultData && resultData.map((collection: any, index) => (
                        <div className='flex gap-5 items-center ' key={collection.id}>
                            
                            <div className="w-[65px] h-[65px] m-4">
                                {/* <Link href={'/collections'}> */}
                                <Image src={collection.cover_photo.urls.raw} alt={collection.cover_photo.alt_description} width={60} height={60} className='!w-full !h-full  rounded-sm object-cover' priority={true}></Image>
                                {/* </Link> */}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <h1 className='text-sm font-medium '>{collection.title}</h1>
                                <p className='text-xs font-extralight '>{collection.total_photos} photos</p>
                            </div>
                            <div className="flex flex-1 justify-end">
                                <Button variant={'ghost'} onClick={() => handleToggleCollection(index)}>{ToggleCollection[index] ? <MinusIcon size={20} className='mr-2' /> : <PlusIcon size={20} className='mr-2' />}
                                    {ToggleCollection[index] ? "Remove" : "Add"}</Button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default AddtoCollection
