import CartView from "@/sections/cart/cart-view";
import { CONFIG } from "../../config-global"

const metadata =  {title: `Cart - ${CONFIG.appName}`}
const CartPage = () => {
    return (
      <>
         <div>
            <title>{metadata.title}</title>
         </div>
         <CartView />
      </>
    )
}

export default CartPage