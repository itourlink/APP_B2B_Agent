import { useRouter } from "@/routes/hooks/use-router"
import { paths } from "@/routes/paths"
import { ShoppingCart } from "lucide-react"

const Cart = () => {
    const router = useRouter()
    return (
        <div>
            <button onClick={() => router.push(paths.overlay.cart)} className="cursor-pointer p-2.5 text-gray-600 hover:bg-gray-100 hover:text-[#4a6fa5] rounded-full transition-all">
                <ShoppingCart size={20} strokeWidth={2} />
            </button>
        </div>
    )
}

export default Cart