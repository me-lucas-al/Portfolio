"use client"

import { ProjectType } from "@portfolio/packages"
import { ExternalLink, Github, FolderGit2, X } from "lucide-react"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog"

export function ProjectCard({ title, description, technologies, deployUrl, githubUrl, imagesUrl }: ProjectType) {
  return (
    <div className="group relative flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-blue-900/50 transition-all duration-300 hover:shadow-[0_0_40px_-15px_rgba(23,37,84,0.6)] hover:-translate-y-1">
      <div>
        {imagesUrl && imagesUrl.length > 0 ? (
          imagesUrl.length > 1 ? (
            <Carousel className="w-full">
              <div className="w-full h-48 md:h-52 rounded-xl overflow-hidden relative border border-neutral-800/50 mb-5">
                <CarouselContent className="h-full ml-0">
                  {imagesUrl.map((url, index) => (
                    <CarouselItem key={index} className="h-full pl-0 overflow-hidden relative">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="w-full h-full cursor-pointer relative block">
                            <img 
                              src={url} 
                              alt={`${title} - Imagem ${index + 1}`} 
                              className="w-full h-full object-cover" 
                              loading={index === 0 ? "eager" : "lazy"}
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] h-[95vh] border-none bg-transparent shadow-none flex flex-col items-center justify-center p-0 [&>button:last-child]:hidden">
                          <DialogTitle className="sr-only">Modo tela cheia do projeto {title}</DialogTitle>
                          
                          <DialogClose className="absolute right-0 top-0 md:-right-8 md:-top-8 p-3 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/50 transition-colors rounded-full text-neutral-300 hover:text-white z-50 shadow-2xl backdrop-blur-sm">
                            <X className="w-6 h-6" />
                            <span className="sr-only">Fechar</span>
                          </DialogClose>

                          <Carousel className="w-full h-full flex flex-col items-center justify-center" opts={{ startIndex: index }}>
                            <CarouselContent className="w-full max-h-[80vh] flex items-center ml-0">
                              {imagesUrl.map((fullUrl, fIndex) => (
                                <CarouselItem key={fIndex} className="basis-full flex justify-center items-center h-full pl-0">
                                  <img 
                                    src={fullUrl} 
                                    alt={`${title} - Tela cheia ${fIndex + 1}`} 
                                    className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" 
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            
                            <div className="flex items-center gap-6 mt-6">
                              <CarouselPrevious className="static translate-y-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-xl" />
                              <CarouselNext className="static translate-y-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-xl" />
                            </div>
                          </Carousel>
                        </DialogContent>
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
          ) : (
            <>
              <div className="w-full h-48 md:h-52 rounded-xl overflow-hidden relative border border-neutral-800/50 mb-5">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="w-full h-full cursor-pointer relative block">
                      <img 
                        src={imagesUrl[0]} 
                        alt={title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] h-[95vh] border-none bg-transparent shadow-none flex flex-col items-center justify-center p-0 [&>button:last-child]:hidden">
                    <DialogTitle className="sr-only">Modo tela cheia do projeto {title}</DialogTitle>
                    
                    <DialogClose className="absolute right-0 top-0 md:-right-8 md:-top-8 p-3 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/50 transition-colors rounded-full text-neutral-300 hover:text-white z-50 shadow-2xl backdrop-blur-sm">
                      <X className="w-6 h-6" />
                      <span className="sr-only">Fechar</span>
                    </DialogClose>

                    <img 
                      src={imagesUrl[0]} 
                      alt={title} 
                      className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {title}
              </h4>
            </>
          )
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-blue-950/40 flex items-center justify-center mb-6 border border-blue-900/50">
              <FolderGit2 className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
              {title}
            </h4>
          </>
        )}
        
        <p className="text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-4">
          {description}
        </p>

        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {technologies.map(tech => (
              <span key={tech} className="px-3 py-1 text-xs font-mono text-blue-400 bg-blue-950/30 border border-blue-900/30 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 mt-auto pt-6 border-t border-neutral-900/50">
        {githubUrl && (
          <Link href={githubUrl} target="_blank" className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-white transition-colors">
            <Github className="w-4 h-4" />
            Código
          </Link>
        )}
        {deployUrl && (
          <Link href={deployUrl} target="_blank" className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-blue-400 transition-colors">
            <ExternalLink className="w-4 h-4" />
            Site (Deploy)
          </Link>
        )}
      </div>
    </div>
  )
}