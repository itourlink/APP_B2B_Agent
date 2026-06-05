interface Props {
    children: React.ReactNode;
}

export const InfoLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* <header className="sticky top-0 z-50">
                <Header />
            </header> */}

            <div className="flex flex-1 max-w-360 mx-auto w-full group">

                {/* <aside className="shrink-0">
                    <Sidebar />
                </aside> */}

                <main>
                    {children}
                </main>
            </div>

            {/* <Footer /> */}
        </div>
    );
};