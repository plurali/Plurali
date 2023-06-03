import { Footer } from "@/components/landing/layout/Footer";
import { Navbar } from "@/components/landing/layout/Navbar";
import { AnimatePresence } from "framer-motion";
import { PropsWithChildren } from "react";

export const LandingLayout = ({ children }: PropsWithChildren) => (
    <div className="min-h-screen">
        <div className="w-full h-full p-6 pt-0">
            <Navbar />
            <AnimatePresence>
                {children}
            </AnimatePresence>
            <Footer/>
        </div>
    </div>
)