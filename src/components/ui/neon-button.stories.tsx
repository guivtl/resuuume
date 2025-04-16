import { NeonButton } from "@/components/ui/neon-button"
import React from 'react';

const Default = () => {
    return (
        <>
            <div className="flex flex-col gap-3 p-4 bg-background">
                <NeonButton>Default (Neon)</NeonButton>
                <WithNoNeon />
                <Solid />
            </div>
        </>
    )
}

const WithNoNeon = () => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <NeonButton neon={false}>No Neon</NeonButton>
            </div>
        </>
    )
}

const Solid = () => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <NeonButton variant={"solid"}>Solid (Neon)</NeonButton>
                <NeonButton variant={"solid"} neon={false}>Solid (No Neon)</NeonButton>
            </div>
        </>
    )
}

export { Default, WithNoNeon, Solid } 