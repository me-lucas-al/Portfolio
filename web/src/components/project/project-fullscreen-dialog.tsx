"use client"

import { X } from "lucide-react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"

interface ProjectFullscreenDialogProps {
  title: string
  imagesUrl: string[]
  startIndex?: number
}

export function ProjectFullscreenDialog({ title, imagesUrl, startIndex = 0 }: ProjectFullscreenDialogProps) {
  return (
    <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] h-[95vh] border-none bg-transparent shadow-none flex flex-col items-center justify-center p-0 [&>button:last-child]:hidden">
      <DialogTitle className="sr-only">Modo tela cheia do projeto {title}</DialogTitle>
      
      <DialogClose className="absolute right-0 top-0 md:-right-8 md:-top-8 p-3 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/50 transition-colors rounded-full text-neutral-300 hover:text-white z-50 shadow-2xl backdrop-blur-sm">
        <X className="w-6 h-6" />
        <span className="sr-only">Fechar</span>
      </DialogClose>

      {imagesUrl.length === 1 ? (
        <div className="relative w-full h-[85vh] flex justify-center items-center">
          <Image 
            src={imagesUrl[0]} 
            alt={title} 
            width={1920}
            height={1080}
            className="w-full h-full object-contain rounded-xl shadow-2xl" 
            sizes="100vw"
          />
        </div>
      ) : (
        <Carousel className="w-full h-full flex flex-col items-center justify-center" opts={{ startIndex }}>
          <CarouselContent className="w-full max-h-[80vh] flex items-center ml-0">
            {imagesUrl.map((fullUrl, fIndex) => (
              <CarouselItem key={fIndex} className="basis-full flex justify-center items-center h-full pl-0 relative">
                <div className="relative flex justify-center items-center w-full h-[80vh]">
                  <Image 
                    src={fullUrl} 
                    alt={`${title} - Tela cheia ${fIndex + 1}`} 
                    width={1920}
                    height={1080}
                    className="w-full h-full object-contain rounded-xl shadow-2xl" 
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex items-center gap-6 mt-6">
            <CarouselPrevious className="static translate-y-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-xl" />
            <CarouselNext className="static translate-y-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-xl" />
          </div>
        </Carousel>
      )}
    </DialogContent>
  )
}
