export interface IErrorResponse {
  statusCode: number;
  error: string | undefined;
  message: any;
  details: {
    path: string;
    timestamp: string;
    method: string;
  };
}
