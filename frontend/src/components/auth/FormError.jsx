function FormError({ message }) {
    if (!message) {
        return null;
    }

    return (
        <p className="rounded-md border border-red-900 bg-red-950/40 p-2 text-sm text-red-300">
            {message}
        </p>
    );
}

export default FormError;
