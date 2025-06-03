type IFrameProps = {
    src: string,
    labelTitle: string,
} & React.ComponentProps<'iframe'>

export function IFrame({ src, labelTitle, ...props }: IFrameProps) {
    return (
        <div className="flex flex-col flex-1 items-center justify-center text-center mb-30">
            <h1 className="text-3xl font-bold mb-6">Projeto: {labelTitle}</h1>
            <iframe {...props} src={src} className="xl:w-2xl w-xs rounded-xl min-h-[500px] md:min-h-[800px] mx-3" />
        </div>
    )
}