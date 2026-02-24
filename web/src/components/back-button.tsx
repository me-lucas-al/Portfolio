import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function BackButton({ path ='/', className='p-8' }: { path?: string, className?: string }) {
  return (
    <div className={`${className}`}>
      <Link href={path}>
        <ArrowLeftIcon className="text-white"/>
      </Link>
    </div>
  );
}
