/**
 * Módulo base para conexión con API pública.
 * La URL base y los endpoints se configurarán una vez definido el cliente.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
