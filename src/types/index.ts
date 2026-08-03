/**
 * Tipos e interfaces globales del proyecto.
 * Se agregarán los tipos específicos una vez definido el cliente y la API.
 */

export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}
