import Footer from "./Footer";
import Navbar from "./Navbar";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col py-4 xl:px-[200px] wrapper justify-between min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center mb-auto">{children}</div>
      <Footer />
    </div>
  );
}
