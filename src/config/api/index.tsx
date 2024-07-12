import axiosInstance from "../axios/axiosInstance";

export type IMutation<T> = {
  url: string;
  body: T;
};

export interface IGetDataWithParam<T> {
  url: string;
  params: T;
}

export interface IResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export async function getData<T>(url: string): Promise<T> {
  return await axiosInstance.get(url).then((response) => {
    return {
      data: response.data,
      statusCode: response.status,
    } as T;
  });
}

export async function getDataWithParams<T, P>(
  obj: IGetDataWithParam<P>
): Promise<T> {
  const { url, params } = obj;
  const data = await axiosInstance.get(url, { params }).then((response) => {
    return {
      data: response.data,
      statusCode: response.status,
    } as T;
  });
  return data;
}

export async function mutationPost<T>(obj: IMutation<object>): Promise<T> {
  const { url, body } = obj;
  return await axiosInstance.post(url, body).then((response) => {
    return {
      data: response.data,
      statusCode: response.status,
    } as T;
  });
}

export async function mutationPut<T>(obj: IMutation<object>): Promise<T> {
  const { url, body } = obj;
  return await axiosInstance.post(url, body).then((response) => {
    return {
      data: response.data,
      statusCode: response.status,
    } as T;
  });
}
