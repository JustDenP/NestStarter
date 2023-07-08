export interface IFilterErrorResponse {
  statusCode: number;
  message: string | undefined;
  error: any;
  details: {
    path: string;
    timestamp: string;
    method: string;
    errorName: string;
    filter: string;
  };
}
