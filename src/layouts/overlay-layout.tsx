import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

interface Props {
    children: React.ReactNode;
}

const OverlayLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen">
            <Header />
            <div className="p-3">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default OverlayLayout;
