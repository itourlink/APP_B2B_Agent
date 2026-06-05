interface Props {
    children: React.ReactNode;
}

export const InfoLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex flex-1 max-w-360 mx-auto w-full group">
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
};