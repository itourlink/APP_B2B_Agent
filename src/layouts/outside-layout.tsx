import Footer from "@/components/footer/footer";
import HeaderOutside from "@/components/header-outside/header";

interface Props {
    children: React.ReactNode;
}

const OutsideLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen">
            <HeaderOutside />
            <div className="p-3 mt-30">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default OutsideLayout;
