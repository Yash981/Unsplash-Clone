"use client"
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useCollectionSearch from '@/hooks/useCollectionSearch'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ViewCollectionPhotos = () => {
    const { id } = useParams()
    // console.log(decodeURIComponent(id))
    //@ts-ignore
    const idTitlePhotos = decodeURIComponent(id).split('=')
    console.log(idTitlePhotos)

    const key = `https://api.unsplash.com/collections/${idTitlePhotos[0]}/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID}&per_page=30`
    const { resultData, loading } = useCollectionSearch(key as string)
    // console.log(resultData.length)
    return (
        <div className='mt-10 '>
            <h1 className='text-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-right'>{ decodeURI(idTitlePhotos[1]) }</h1>
            <p className='text-center'>{idTitlePhotos[2]} photos</p>
            {/*  */}
            <div className='flex flex-wrap gap-5 p-10 justify-center'>

                {
                    loading ? (<div>loading...</div>) : (
                        resultData && resultData.map((data: any, index: number) => {
                            return (
                                <div className=' flex items-center justify-center ' key={data.id}>
                                    <div className='rounded-lg relative'>
                                        
                                        <Image
                                            src={data.urls.raw}
                                            alt={data.title}
                                            width={250}
                                            height={400}
                                            className='animate-pulse rounded-md bg-muted aspect-[250/400]  object-cover object-center'
                                            onLoadingComplete={(image)=>image.classList.remove('animate-pulse')} 
                                        />


                                    </div>

                                </div>
                            )
                        })
                    )
                }
            </div>
            {Number(idTitlePhotos[2]) <= 30 ? null : (
                <div className='flex justify-center mt-10 mb-10'>
                    <Link href={`https://unsplash.com/collections/${idTitlePhotos[0]}/${ decodeURI(idTitlePhotos[1]) }`} target='_blank'>
                    <Button variant={"outline"} className="text-lg">View More</Button>
                    </Link>
                </div>
            )}
        </div>
        
    )

}

export default ViewCollectionPhotos