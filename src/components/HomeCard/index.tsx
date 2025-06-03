'use client'

import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookIcon, LucideIcon, MoveUpRight } from "lucide-react";

type BenefitModel = {
    title: string;
    description: string;    
}

type HomeCardProps = {
    mode: 'illustrate' | 'summary' | 'comic';
    benefits: BenefitModel[];
    title: string;
    description: string;
    buttonText?: string
}

export function HomeCard({ mode, benefits, title, description, buttonText='Experimentar' }: HomeCardProps) {
    function handleClick() {
        redirect(`/home/${mode}`)
    }

    return (
        <Card className="w-full bg-slate-100 row-span-20">
            <CardHeader>
                <CardTitle className="text-xl">
                    <div className="flex items-center text-center gap-2">
                        {title}
                        <BookIcon className="w-5 h-5" />
                    </div>
                </CardTitle>

                <CardDescription >{description}</CardDescription>
            </CardHeader>

            <Separator />

            <CardContent>
            <div>
            {benefits.map((benefit, index) => (
                <div
                key={index}
                className="grid grid-cols-[25px_1fr] items-start pb-8 last:mb-0 last:pb-0"
                >

                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-slate-800" />

                <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                    {benefit.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                    {benefit.description}
                    </p>
                </div>
                </div>
            ))}
            </div>
            </CardContent>
            <CardFooter className="py-6">
                <Button className="w-full transition cursor-pointer" type="button" onClick={handleClick}>
                    {buttonText}
                    <MoveUpRight />
                </Button>
            </CardFooter>
        </Card>
    )
}