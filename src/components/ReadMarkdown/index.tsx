'use client'

import ReactMarkdown from "react-markdown"
import { useState, useTransition, useEffect } from 'react'
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { clsx } from "clsx"

type ReadMarkdownProps = {
    markdownSrc: string
}

export function ReadMarkdown({ markdownSrc }: ReadMarkdownProps) {
    const [content, setContent] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const markdownClasses = clsx('prose prose-slate w-full max-w-none px-15 py-6')

    // TODO: testar delay
    useEffect(() => {
        startTransition(async() => {
            const markdownResponse = await fetch(markdownSrc);
            if (!markdownResponse.ok) throw new Error('Conteúdo não encontrado');

            const contentText = await markdownResponse.text();
            setContent(contentText);
        })
    }, [markdownSrc])

    // TODO: colocar suspense
    return (
        <div className={markdownClasses}>
            {!isPending ? (
                <ReactMarkdown 
                remarkPlugins={[ remarkGfm ]} 
                rehypePlugins={[ rehypeSanitize ]}>{content}</ReactMarkdown>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    )
}