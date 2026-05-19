import type { FC, ReactNode } from "react";

interface AuthPageLayoutProps {
  children: ReactNode;
}

const AuthPageLayout: FC<AuthPageLayoutProps> = ({ children }) => (
  <div className="flex min-h-screen bg-rx-bg">
    <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16">
      <div className="mx-auto w-full max-w-md">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-rx-muted">
          Shoe Store Management
        </p>
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight">
          RESOLER<span className="text-rx-accent">XS</span>
        </h1>
        <p className="mb-8 text-rx-muted">Inventory & Sales System</p>
        {children}
      </div>
    </div>
    <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-rx-surface lg:flex">
      <div className="absolute inset-0 bg-gradient-to-br from-rx-accent/20 via-transparent to-transparent" />
      <div className="relative z-10 max-w-lg px-12">
        <h2 className="text-5xl font-extrabold leading-tight tracking-tight">
          RUN YOUR
          <br />
          STORE WITH
          <br />
          <span className="text-rx-accent">CONFIDENCE.</span>
        </h2>
        <p className="mt-6 text-lg text-rx-muted">
          Track inventory, record sales, and monitor profit in real time.
        </p>
      </div>
    </div>
  </div>
);

export default AuthPageLayout;
