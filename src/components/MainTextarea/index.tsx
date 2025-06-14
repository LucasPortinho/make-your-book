import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MainTextareaProps = {
    labelTitle: string;
    placeholder: string;
    descriptionMessage: string;
} & React.ComponentProps<'textarea'>

export function MainTextarea({ labelTitle, placeholder, descriptionMessage, ...props }: MainTextareaProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="textarea">{labelTitle}</Label>
            <Textarea {...props} placeholder={placeholder} />
            <p className="text-muted-foreground text-sm">
                {descriptionMessage}
            </p>
        </div>
    )
}