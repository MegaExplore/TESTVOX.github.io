const GITHUB_BASE = 'https://raw.githubusercontent.com/MegaExplore/vox.github.io/main/schemas/';

export async function fetchData(path: string) {
    const url = path.startsWith('http') ? path : `${GITHUB_BASE}${path}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
    return await response.json();
}