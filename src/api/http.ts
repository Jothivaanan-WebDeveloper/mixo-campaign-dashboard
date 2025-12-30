const BASE_URL = "https://mixo-fe-backend-task.vercel.app";

export async function fetcher<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`);

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
}
