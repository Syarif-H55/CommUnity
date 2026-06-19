"use client"

import { useState, createContext, useContext, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TabsContextType {
    activeTab: string
    setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

function useTabs() {
    const ctx = useContext(TabsContext)
    if (!ctx) throw new Error("Tabs compound components must be used within Tabs")
    return ctx
}

interface TabsProps {
    defaultValue: string
    children: ReactNode
    className?: string
    onValueChange?: (value: string) => void
}

function Tabs({ defaultValue, children, className, onValueChange }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue)

    function handleChange(value: string) {
        setActiveTab(value)
        onValueChange?.(value)
    }

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
            <div data-slot="tabs" className={cn("", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

function TabsList({ className, children, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="tabs-list"
            className={cn(
                "inline-flex items-center gap-1 rounded-xl bg-muted p-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

interface TabsTriggerProps extends React.ComponentProps<"button"> {
    value: string
}

function TabsTrigger({ className, value, children, ...props }: TabsTriggerProps) {
    const { activeTab, setActiveTab } = useTabs()
    const isActive = activeTab === value

    return (
        <button
            data-slot="tabs-trigger"
            data-state={isActive ? "active" : "inactive"}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
                className
            )}
            onClick={() => setActiveTab(value)}
            {...props}
        >
            {children}
        </button>
    )
}

function TabsContent({ className, value, children, ...props }: React.ComponentProps<"div"> & { value: string }) {
    const { activeTab } = useTabs()

    if (activeTab !== value) return null

    return (
        <div
            data-slot="tabs-content"
            data-state={activeTab === value ? "active" : "inactive"}
            className={cn("mt-4", className)}
            {...props}
        >
            {children}
        </div>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
