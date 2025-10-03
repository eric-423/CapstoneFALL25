interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='min-h-screen flex flex-col w-full ~bg-muted/50'>
      <div className='w-full max-w-7xl mx-0 px-0 flex flex-grow flex-col'>
        <div className='flex flex-grow flex-col'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
