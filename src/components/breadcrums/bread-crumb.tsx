import { ArrowLeft } from "lucide-react";
import { useRouter } from "@/routes/hooks/use-router";

interface Props {
  title: string;
}

const BreadCrumb = ({ title }: Props) => {
  const router = useRouter();
  return (
    <div className="flex items-center space-x-2 mb-5">
      {
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full shadow"
        >
          <ArrowLeft size={20} />
        </button>
      }
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
  );
};

export default BreadCrumb;
