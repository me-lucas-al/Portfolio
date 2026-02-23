import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function BackButton({ path ='/' }: { path?: string }) {
  return (
    <div className="p-8">
      <Link href={path}>
        <ArrowLeftIcon className="text-white"/>
      </Link>
    </div>
  );
}
