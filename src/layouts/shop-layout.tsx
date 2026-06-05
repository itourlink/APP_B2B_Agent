import Footer from "@/components/footer/footer";
import ShopHeader from "@/sections/shop/components/shop-header";

interface Props {
    children: React.ReactNode;
}

const ShopLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen">
            <ShopHeader />
            <div className="">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default ShopLayout;
