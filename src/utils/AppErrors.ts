export class AppError {
  message: string;
  response?: { data: { data: string | null | object; message: string[]; success: boolean } };

  constructor(message: string | { data: { data: string | null; message: string[]; success: boolean } }) {
    if (typeof message === 'string') {
      this.message = message;
    } else {
      this.response = message;
      this.message = message?.data?.message.join(', ') || 'Erro desconhecido';
    }
  }
}
