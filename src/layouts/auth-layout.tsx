
interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;
