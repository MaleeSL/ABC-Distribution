export async function apiRequest(path, options = {}) {
    const response = await fetch(`/api/${path}`, options);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        throw new Error(`API returned an unexpected response (${response.status})`);
    }

    return response.json();
}
