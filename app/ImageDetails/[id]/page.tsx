"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useUnsplashSearch from '@/hooks/useUnsplashSearch';
import { format, parseISO } from 'date-fns';
import { MinusIcon, PlusIcon, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';
import AddtoCollection from './AddtoCollection';

const ImageDetails = () => {
    //TODO /photos/id --> useUnsplash.ts
    //GET /collections/:id/related
    const [ToggleCollection, setToggleCollection] = useState(Array(3).fill(false));
    const [addedCollections, setAddedCollections] = useState(() => {
        // Initialize addedCollections from localStorage on component mount
        const storedCollections = Object.keys(localStorage)
            .filter(key => key.startsWith('collections'))
            .map(key => localStorage.getItem(key));
        return storedCollections ? storedCollections : [];
    });
    
    // const [searchText, setSearchText] = useState('');
    const { id } = useParams();
    const { theme } = useTheme();
    let keyy = `https://api.unsplash.com/photos/${id}?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID}`;
    
    
    // console.log(keyy)
    const { resultData, loading } = useUnsplashSearch(keyy as string);
    // console.log(resultData, 'res', loading);
    let Publisheddate;
    if (resultData) {
        // console.log(resultData.related_collections.results)
        Publisheddate = format(parseISO(resultData.created_at), 'MMMM dd, yyyy');
    }
    const handleToggleCollection = (index:number) => {
        setToggleCollection((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            const collectionId = resultData.related_collections.results[index].id;
            // console.log(collectionId, 'collectionId')
            

            if (newState[index]) {
                // Add collectionId to addedCollections if not already present
                if (!addedCollections.includes('collections' + collectionId)) {
                    const updatedCollections = [...addedCollections, 'collections' + collectionId];
                    setAddedCollections(updatedCollections);
                    localStorage.setItem('collections' + collectionId, JSON.stringify(resultData.related_collections.results[index]));
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
    // console.log(ToggleCollection, 'ToggleCollection')
    const handleDownload = async () => {
        try {
            const response = await fetch(resultData.urls.raw);
            const blob = await response.blob();
            // console.log(blob, 'blob')
            const blobUrl = window.URL.createObjectURL(blob);
            // console.log(blobUrl, 'blobUrl')

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `photo-${resultData.id}.jpg`;
            link.style.display = 'none';


            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };
    
 
    return (
        <div className='p-14 flex w-full md:flex-col justify-center items-center lg:flex-row gap-10 sm:flex-col max-sm:flex-col lg:items-start'>
            <div className='lg:w-1/2 flex flex-col gap-5'>
                {
                    loading ? (
                        <div className='flex flex-wrap gap-5 p-10 w-[500px] h-[600px]'>
                            <Skeleton className='w-full h-full' />
                        </div>
                    ) : (resultData &&
                        <Image src={resultData.urls.raw} alt={resultData.alt_description} width={600} height={600} priority={true} 
                        className='animate-pulse  bg-muted rounded-md mr-10 flex-0.8 w-full h-full aspect-square object-center object-cover mx-auto'
                                            onLoadingComplete={(image)=>image.classList.remove('animate-pulse')}
                        />

                    )
                }
            </div>
            <div className='lg:w-1/2 flex flex-col gap-5 md:w-full sm:w-full'>
                <div className='flex gap-2 items-center '>
                    <Avatar>
                        <AvatarImage src={resultData?.user?.profile_image.large} />
                        <AvatarFallback>{resultData?.user?.first_name[0]}{resultData?.user?.last_name[0]}</AvatarFallback>
                    </Avatar>

                    <h1 className='text-lg font-medium '>{resultData?.user?.name}</h1>
                </div>
                <p className='text-md font-light'>Published on {Publisheddate}</p>
                <div className='flex gap-5 '>
                    <Dialog>
                    <DialogTrigger className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2 ${theme==="dark"?"bg-secondary text-secondary-foreground ":"bg-secondary text-secondary-foreground"}` } ><PlusIcon size={20} className='mr-2' />Add to Collection</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className='text-lg font-medium mb-2'>Add to Collections</DialogTitle>
                                <DialogDescription>
                                    
                                        <AddtoCollection/>
                                        
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={handleDownload} variant={'secondary'}>
                        {/* <downloadIcon theme={theme}/> */}
                        <Image src={'/Images/down_arrow.svg'} alt="download" width={20} height={20} className='mr-2' />
                        Download
                    </Button>
                </div>

                <div className='mt-5 '>
                    <h1 className='text-2xl font-medium '>Collections</h1>
                    {resultData && resultData.related_collections.results.map((collections: any, index: number) => {
                        return <div className='flex gap-5 items-center hover:bg-[#f1f5f9] rounded-md' key={index}>
                            
                            <div className="w-[65px] h-[65px] m-4">
                                {/* <Link href={'/collections'}> */}
                                <Image src={collections.cover_photo.urls.raw} alt={collections.cover_photo.alt_description} width={60} height={60} className='!w-full !h-full  rounded-sm object-cover animate-pulse  bg-muted ' priority={true} onLoadingComplete={(image)=>image.classList.remove('animate-pulse')}></Image>
                                {/* </Link> */}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <h1 className='text-sm font-medium '>{collections.title}</h1>
                                <p className='text-xs font-extralight '>{collections.total_photos} photos</p>
                            </div>
                            <div className="flex flex-1 justify-end">
                                <Button variant={'ghost'} onClick={()=>handleToggleCollection(index)}>{ToggleCollection[index] ? <MinusIcon size={20} className='mr-2'/> : <PlusIcon size={20} className='mr-2'/>}
        {ToggleCollection[index] ? "Remove" : "Add"}</Button>
                            </div>
                            
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default ImageDetails;
