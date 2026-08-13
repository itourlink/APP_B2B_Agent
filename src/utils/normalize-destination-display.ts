const toDestinationText = (value: unknown): string => {
    if (value === null || value === undefined) return "";

    if (Array.isArray(value)) {
        return value
            .map(toDestinationText)
            .filter(Boolean)
            .join(", ");
    }

    if (typeof value === "object") return "";

    return String(value);
};

export const normalizeDestinationDisplay = (value: unknown = "") => {
    const map: Record<string, string> = {
        "Ha Noi": "Hanoi",
        "Hai Phong": "Haiphong",
        "Ho Chi Minh": "Ho Chi Minh City",
    };

    let result = toDestinationText(value);

    Object.entries(map).forEach(([key, val]) => {
        result = result.replaceAll(key, val);
    });

    return result;
};
