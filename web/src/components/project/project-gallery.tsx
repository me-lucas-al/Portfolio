"use client"

import { FolderGit2 } from "lucide-react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ProjectFullscreenDialog } from "./project-fullscreen-dialog"

interface ProjectGalleryProps {
  title: string
  imagesUrl?: string[] | null
}

export function ProjectGallery({ title, imagesUrl }: ProjectGalleryProps) {
  if (!imagesUrl || imagesUrl.length === 0) {
    return (
      <>
        <div className="w-full aspect-video bg-neutral-900/50 rounded-xl overflow-hidden relative border border-neutral-800/50 mb-5 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-950/40 flex items-center justify-center border border-blue-900/50">
            <FolderGit2 className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
      </>
    )
  }

  if (imagesUrl.length === 1) {
    return (
      <>
        <div className="w-full aspect-video bg-neutral-900/50 rounded-xl overflow-hidden relative border border-neutral-800/50 mb-5">
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-full h-full cursor-pointer relative block">
                <Image 
                  src={imagesUrl[0]} 
                  alt={title} 
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </DialogTrigger>
            <ProjectFullscreenDialog title={title} imagesUrl={imagesUrl} />
          </Dialog>
        </div>
        <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
      </>
    )
  }

  return (
    <Carousel className="w-full">
      <div className="w-full aspect-video bg-neutral-900/50 rounded-xl overflow-hidden relative border border-neutral-800/50 mb-5">
        <CarouselContent className="h-full ml-0">
          {imagesUrl.map((url, index) => (
            <CarouselItem key={index} className="h-full pl-0 overflow-hidden relative">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full h-full cursor-pointer relative block">
                    <Image 
                      src={url} 
                      alt={`${title} - Imagem ${index + 1}`} 
                      fill
                      className="object-cover object-top" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                </DialogTrigger>
                <ProjectFullscreenDialog title={title} imagesUrl={imagesUrl} startIndex={index} />
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
      
      <div className="flex items-start justify-between gap-4 mb-4">
        <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-2 shrink-0">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-blue-900/60 hover:border-blue-800 transition-all" />
          <CarouselNext className="static translate-y-0 h-8 w-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-blue-900/60 hover:border-blue-800 transition-all" />
        </div>
      </div>
    </Carousel>
  )
}

