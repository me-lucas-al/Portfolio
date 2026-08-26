"use client";

import { FolderGit2 } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProjectFullscreenDialog } from "./project-fullscreen-dialog";

interface ProjectGalleryProps {
  title: string;
  imagesUrl?: string[] | null;
}

export function ProjectGallery({ title, imagesUrl }: ProjectGalleryProps) {
  if (!imagesUrl || imagesUrl.length === 0) {
    return (
      <>
        <div className="w-full aspect-video bg-surface-2/50 rounded-xl overflow-hidden relative border border-line/50 mb-5 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center border border-line">
            <FolderGit2 className="w-6 h-6 text-fg-muted" />
          </div>
        </div>
        <h4 className="text-xl font-bold text-fg mb-4 group-hover:text-brand transition-colors">
          {title}
        </h4>
      </>
    );
  }

  if (imagesUrl.length === 1) {
    return (
      <>
        <div className="w-full aspect-video bg-surface-2/50 rounded-xl overflow-hidden relative border border-line/50 mb-5">
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-full h-full cursor-pointer block">
                <Image
                  src={imagesUrl[0]}
                  alt={title}
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover object-top"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </DialogTrigger>
            <ProjectFullscreenDialog title={title} imagesUrl={imagesUrl} />
          </Dialog>
        </div>
        <h4 className="text-xl font-bold text-fg mb-4 group-hover:text-brand transition-colors">
          {title}
        </h4>
      </>
    );
  }

  return (
    <Carousel className="w-full">
      <div className="w-full bg-surface-2/50 rounded-xl overflow-hidden border border-line/50 mb-5 relative">
        <CarouselContent className="ml-0">
          {imagesUrl.map((url, index) => (
            <CarouselItem
              key={index}
              className="pl-0"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full aspect-video cursor-pointer block">
                    <Image
                      src={url}
                      alt={`${title} - Imagem ${index + 1}`}
                      width={1280}
                      height={720}
                      className="w-full h-full object-cover object-top"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                </DialogTrigger>
                <ProjectFullscreenDialog
                  title={title}
                  imagesUrl={imagesUrl}
                  startIndex={index}
                />
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>

      <div className="flex items-start justify-between gap-4 mb-4">
        <h4 className="text-xl font-bold text-fg group-hover:text-brand transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-2 shrink-0">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 rounded-full bg-surface-2 border border-line text-fg-muted hover:bg-line-strong hover:text-fg hover:border-line-strong transition-all" />
          <CarouselNext className="static translate-y-0 h-8 w-8 rounded-full bg-surface-2 border border-line text-fg-muted hover:bg-line-strong hover:text-fg hover:border-line-strong transition-all" />
        </div>
      </div>
    </Carousel>
  );
}
