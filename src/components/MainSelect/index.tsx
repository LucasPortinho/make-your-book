import { IaModel } from "@/models/ia-model";
import { Dispatch, SetStateAction } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type MainSelectProps = {
    state: string;
    selectMap: Record<string, string>;
    setState: Dispatch<SetStateAction<string>>;
}

export function MainSelect({ state, setState, selectMap }: MainSelectProps) {
    return (
        <div className="flex flex-col space-y-1.5">
            <Label htmlFor="style">Estilo da I.A.</Label>
            
            <Select value={state} onValueChange={setState}>
                <SelectTrigger className="w-full bg-white cursor-pointer">
                    <SelectValue placeholder="Selecione o estilo da inteligência artificial"/>
                </SelectTrigger>

                <SelectContent position="popper">
                    {Object.entries(selectMap).map((subarray) => {
                        return <SelectItem 
                        key={subarray[0]} 
                        className="cursor-pointer transition" 
                        value={subarray[0]}>
                            {subarray[1]}
                        </SelectItem>
                    })}
                </SelectContent>
            </Select>

        </div>
    )
}