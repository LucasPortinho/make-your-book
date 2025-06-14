'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BotIcon } from "lucide-react";
import { MainSelect } from "@/components/MainSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { IaModel } from "@/models/ia-model";
import { MainTextarea } from "@/components/MainTextarea";
import { createAgentAction } from "@/actions/agents/create-agent-action";
import { toast } from "react-toastify";

type AgentFormProps = {
    title: string;
    description: string;
    buttonText: string;
}

export function AgentForm({ title, description, buttonText }: AgentFormProps) {
    const [agentStyleState, setAgentStyleState] = useState('')
    const [agentModelState, setAgentModelState] = useState('')

    const agentStylesMap: Record<IaModel['style'], string> = {
        drawer: 'Desenhista',
        anime: 'Anime',
        colorful: 'Colorido',
        cartoon: 'Cartoon',
        magic: 'Mágico',
        realistic: 'Magic'
    }
    const agentModelsMap: Record<string, string> = {
        'dall-e-2': 'dall-e-2',
        'dall-e-3': 'dall-e-3',
        'gpt-image-1': 'gpt-image-1'
    }

    const initialState = {
        errors: [''],
        success: '',
    }

    const [state, formAction, isPending] = useActionState(createAgentAction, initialState)

    useEffect(() => {
        if (!state.errors) return;

        if (state.errors.length > 0) {
            state.errors.forEach(error => {
                if (error.length > 0) {
                    return toast.error(error)
                }
            })
        }
    }, [state])

    useEffect(() => {
        if (state.success) {
            toast.dismiss()
            toast.success('Agente criado com sucesso!')
        }
    }, [state.success])

    return (
        <form action={formAction} className="flex flex-1 items-center justify-center">
            <Card className="w-lg mx-3 bg-slate-200 sm:w-md lg:w-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <CardDescription >{description}</CardDescription>
                </CardHeader>

                <Separator className="bg-slate-300" />

                <CardContent>

                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="title">Nome do agente</Label>
                        <Input 
                        id="name" 
                        name="name"
                        placeholder="Nome do agente" 
                        minLength={3} maxLength={80}  
                        className="bg-white" 
                        required/>
                    </div>

                    <MainSelect 
                    labelTitle="Estilo da I.A."
                    placeholder="Selecione o estilo da inteligência artificial"
                    setState={setAgentStyleState} 
                    state={agentStyleState} 
                    selectMap={agentStylesMap} 
                    />

                    <MainSelect 
                    labelTitle="Modelo da I.A."
                    placeholder="Selecione o modelo da inteligência artificial"
                    setState={setAgentModelState} 
                    state={agentModelState} 
                    selectMap={agentModelsMap} 
                    />

                    
                    <MainTextarea
                    labelTitle="Instruções (opcional)"
                    placeholder="Digite as instruções que você deseja passar"
                    className="break-all resize-none"
                    descriptionMessage="Essas instruções servirão como base para tratamentos mais específicos do seu agente"
                    maxLength={600}
                    name="instructions"
                    />
                </div>
                
                <input type="hidden" name="style" value={agentStyleState} />
                <input type="hidden" name="model" value={agentModelState} />

                </CardContent>
                <CardFooter className="flex flex-col mt-6">
                    <Button disabled={isPending} className="w-full transition cursor-pointer mt-2" type="submit" >
                        {buttonText} <BotIcon />
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}