export const isValidValue = (value: any) => {
    if (value === null || value === undefined) return "---";
    if (value === "") return "---";
    if (Number.isNaN(value)) return "---";

    // object rỗng {}
    if (typeof value === "object" && !Array.isArray(value)) {
        return "---";
    }

    // array rỗng []
    if (Array.isArray(value)) {
        return value.length > 0 ? value : "---";
    }

    return value;
};


export const buildQuery = (params: Record<string, any>) => {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            search.append(key, String(value));
        }
    });

    return search.toString();
};

export const pushWithCompany = (router: any, link: string) => {
    const company = new URLSearchParams(window.location.search).get("company");

    router.replaceQuery(link, {
        ...(company && { company }),
    });
};

