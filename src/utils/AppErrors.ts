export class AppError {
  response: { data: { data: string | null | object; message: string[]; success: boolean } };

  constructor(response: { data: { data: string | null; message: string[]; success: boolean } }) {
    this.response = response;
  }
}
