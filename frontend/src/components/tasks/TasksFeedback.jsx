function TasksFeedback({ errorMessage, successMessage }) {
    return (
        <>
            {errorMessage ? (
                <p className="mb-4 rounded-md border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
                    {errorMessage}
                </p>
            ) : null}

            {successMessage ? (
                <p className="mb-4 rounded-md border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
                    {successMessage}
                </p>
            ) : null}
        </>
    );
}

export default TasksFeedback;
