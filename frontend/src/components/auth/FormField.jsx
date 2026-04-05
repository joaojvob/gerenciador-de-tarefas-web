import { Input, Label } from "../ui/Input";

function FormField({ id, label, ...inputProps }) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-slate-200">
                {label}
            </Label>
            <Input
                id={id}
                className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
                {...inputProps}
            />
        </div>
    );
}

export default FormField;
