import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MainTextareaProps = {
    labelTitle: string;
    placeholder: string;
}

export function MainTextarea({ labelTitle, placeholder }: MainTextareaProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="textarea">{labelTitle}</Label>
            <Textarea placeholder={placeholder} />
        </div>
    )
}