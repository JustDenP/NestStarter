export interface IErrorResponse {
  statusCode: number;
  message: string | undefined;
  errors: any;
  details: {
    path: string;
    timestamp: string;
    method: string;
  };
}
