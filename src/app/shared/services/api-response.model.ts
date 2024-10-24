
export interface ApiResponse {
  timestamp: string;
  statusCode: number;
  isError: boolean;
  fields: unknown;
  message: string;
  messageAr: string;
  exMessage: unknown;
  pagination: {
    noOfPages: number;
    pageIndex: number;
    pageSize: number;
    totalRecords: number;
  };
  data: Array<any>;
}
