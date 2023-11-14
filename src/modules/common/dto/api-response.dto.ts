export interface ApiResponseDto<T> {
  statusCode: number;
  data: T;
}
