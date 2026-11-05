export interface HttpGateway {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
}

export const createHttpGateway = (baseUrl: string, fetchFn: typeof fetch = fetch): HttpGateway => {
  const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetchFn(`${baseUrl}${path}`, init);
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${path}`);
    return (await response.json()) as T;
  };

  return {
    get: (path) => request(path),
    post: (path, body) =>
      request(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
  };
};
