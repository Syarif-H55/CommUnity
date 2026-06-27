"use client";

import Navbar from "@/components/layout/Navbar";

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
