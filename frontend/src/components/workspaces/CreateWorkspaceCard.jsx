import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Input, Label } from "../ui/Input";

function CreateWorkspaceCard({
    form,
    fieldErrors,
    isSubmitting,
    onChangeForm,
    onSubmit,
}) {
    return (
        <Card className="border-dashed border-2 border-slate-700 bg-slate-900/30 transition-colors hover:bg-slate-900/50">
            <CardContent className="p-6">
                <div className="mb-6 flex items-start gap-4">
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-400">
                        <Plus size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            Criar novo workspace
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                            Separe projetos por cliente, produto ou equipe num
                            ambiente isolado.
                        </p>
                    </div>
                </div>

                <form
                    className="grid gap-4 md:grid-cols-12"
                    onSubmit={onSubmit}
                    autoComplete="off"
                >
                    <div className="space-y-1 md:col-span-4">
                        <Label
                            htmlFor="workspace-name"
                            className="text-slate-300"
                        >
                            Nome do Workspace
                        </Label>
                        <Input
                            id="workspace-name"
                            autoComplete="off"
                            placeholder="Ex.: App V2"
                            value={form.name}
                            onChange={(event) =>
                                onChangeForm("name", event.target.value)
                            }
                            className={`border-slate-700 bg-slate-950 text-slate-100 ${fieldErrors.name ? "border-red-500" : ""}`}
                        />
                        {fieldErrors.name ? (
                            <p className="mt-1 text-xs font-medium text-red-400">
                                {fieldErrors.name}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-1 md:col-span-6">
                        <Label
                            htmlFor="workspace-description"
                            className="text-slate-300"
                        >
                            Descrição (opcional)
                        </Label>
                        <Input
                            id="workspace-description"
                            autoComplete="off"
                            placeholder="Qual é o objetivo deste ambiente?"
                            value={form.description}
                            onChange={(event) =>
                                onChangeForm("description", event.target.value)
                            }
                            className="border-slate-700 bg-slate-950 text-slate-100"
                        />
                    </div>

                    <div className="flex items-end md:col-span-2">
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            className="w-full"
                        >
                            Criar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default CreateWorkspaceCard;
