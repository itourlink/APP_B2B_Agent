import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <div className="py-25">
        {children}
      </div>
      <Footer />
    </>
  );
};
