function WorkspaceFeedback({ errorMessage, successMessage }) {
    return (
        <>
            {errorMessage ? (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-sm font-medium text-red-400">
                        {errorMessage}
                    </p>
                </div>
            ) : null}

            {successMessage ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <p className="text-sm font-medium text-emerald-400">
                        {successMessage}
                    </p>
                </div>
            ) : null}
        </>
    );
}

export default WorkspaceFeedback;
