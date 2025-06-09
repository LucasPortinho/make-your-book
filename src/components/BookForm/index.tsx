'use client'

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label'
import { illustrateAction } from "@/actions/books/illustrate-action";
import { summaryAction } from "@/actions/books/summary-action";
import { comicAction } from "@/actions/books/comic-action";
import { useActionState, useEffect, useRef, useState } from "react";
import { NotebookPen, UploadIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { IaModel } from "@/models/ia-model";
import { MainSelect } from "../MainSelect";


type BookFormProps = {
    mode: 'illustrate' | 'summary' | 'comic';
    title: string;
    description: string;
    buttonText: string;
    maxFileBytes: number;
}

export function BookForm({ mode, title, description, buttonText, maxFileBytes }: BookFormProps) {
    const actionsMap = {
        illustrate: illustrateAction,
        summary: summaryAction,
        comic: comicAction
    }
    
    const inputRef = useRef<HTMLInputElement>(null)
    const [imageStyleState, setImageStyleState] = useState('')
    const [summaryStylesState, setSummaryStyleState] = useState('')

    const initialState = {
        errors: [''],
        success: '',
    }

    const [state, formAction, isPending] = useActionState(actionsMap[mode], initialState)

    const imageStylesMap: Record<IaModel['style'], string> = {
        drawer: 'Desenhista',
        anime: 'Anime',
        colorful: 'Colorido',
        cartoon: 'Cartoon',
        magic: 'Mágico',
        realistic: 'Magic'
    }

    const summaryStylesMap = {
        explanatory: 'Explicatório',
        funny: 'Engraçado',
        dynamic: 'Dinâmico',
        organizer: 'Organizar o conteúdo',
        translator: 'Tradutor',
    }

    // TODO: Adicionar inputRef para o select também
    function handleClick() {
        if (!inputRef.current) return

        inputRef.current.click()
    }   

    function handleFile() {
        toast.dismiss()
        if (!inputRef.current) return;
        
        const fileInput = inputRef.current
        const file = fileInput.files?.[0]

        if (!file) return

        if (file.size > maxFileBytes) {
            toast.error('Arquivo muito grande!')
            return
        }
    }

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
                        <Label htmlFor="title">Nome do projeto</Label>
                        <Input 
                        id="title" 
                        name="title"
                        placeholder="Nome do projeto" 
                        minLength={3} maxLength={80}  
                        className="bg-white" 
                        required/>
                    </div>

                    {mode === 'summary' ? (
                        <MainSelect 
                        labelTitle="Estilo da I.A"
                        placeholder="Selecione o estilo da inteligência artificial"
                        setState={setSummaryStyleState} 
                        state={summaryStylesState} 
                        selectMap={summaryStylesMap} />
                    ) : (
                        <MainSelect 
                        labelTitle="Estilo da I.A"
                        placeholder="Selecione o estilo da inteligência artificial"
                        setState={setImageStyleState} 
                        state={imageStyleState} 
                        selectMap={imageStylesMap} />
                    )}
                </div>

                <input type="hidden" name="style" value={imageStyleState} />

                </CardContent>
                <CardFooter className="flex flex-col mt-6">
                    <input onChange={handleFile} ref={inputRef} type="file" accept=".epub,.pdf,.mobi,.azw,.azw3,.kfx,.txt" className="hidden" name='file' />
                    <Button 
                    className="w-full transition cursor-pointer bg-white text-slate-800 hover:bg-slate-100" 
                    type="button" 
                    onClick={handleClick}>
                        Enviar arquivo <UploadIcon />
                    </Button>

                    <Button className="w-full transition cursor-pointer mt-2" type="submit" >
                        {buttonText} <NotebookPen />
                    </Button>

                </CardFooter>
            </Card>
        </form>
    )
}