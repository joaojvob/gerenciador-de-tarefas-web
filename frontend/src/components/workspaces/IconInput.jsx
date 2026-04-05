function IconInput({
    icon: Icon,
    inputClassName = "",
    wrapperClassName = "",
    autoComplete = "off",
    ...props
}) {
    return (
        <div className={`relative ${wrapperClassName}`}>
            {Icon ? (
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Icon size={16} />
                </span>
            ) : null}
            <input
                {...props}
                autoComplete={autoComplete}
                className={`w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2.5 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${Icon ? "pl-10" : "pl-4"} ${inputClassName}`}
            />
        </div>
    );
}

export default IconInput;
