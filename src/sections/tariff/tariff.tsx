import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";

const Tariff = () => {
    const router = useRouter();
    const company = new URLSearchParams(window.location.search).get("company") || "";

    return (
        <button
            onClick={() => router.push(`${paths.tariff.list}?company=${company}`)}
            className="cursor-pointer rounded-lg border border-[rgba(64,64,64,0.5)] px-3 py-2 text-[14px] font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95"
        >
            Tariff
        </button>
    );
};

export default Tariff;
