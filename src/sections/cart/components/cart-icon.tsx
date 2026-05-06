import { ShoppingCart } from "lucide-react";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { pushWithCompany } from "@/utils/utilts";

const CartIcon = () => {
    const router = useRouter();

    return (
        <div
            onClick={() => pushWithCompany(router, paths.cart.list)}
            className="relative cursor-pointer group flex w-10 h-10 justify-center items-center gap-2.5 rounded-lg border border-[rgba(64,64,64,0.5)]"
        >
            <button className="cursor-pointer p-2.5 text-gray-600 group-hover:text-[#4a6fa5] rounded-full transition-all duration-300">
                <ShoppingCart size={20} strokeWidth={2} />
            </button>
            {/* You can add a badge here when cart state is implemented */}
        </div>
    );
};

export default CartIcon;
