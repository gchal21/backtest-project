import axios, {type AxiosError, type AxiosResponse, HttpStatusCode} from 'axios';

export const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL || 'http://localhost:3000';
export const FULL_URL = SERVER_URL.startsWith('http')
  ? SERVER_URL
  : `${window.location.origin}${SERVER_URL}`;

const axiosInstance = axios.create({baseURL: SERVER_URL});

interface ErrorResponseData {
  errorCode: number;
  message?: string;
}

const responseErrorInterceptor = async (error: AxiosError<ErrorResponseData>) => {
  if (error.response) {
    const {status, data} = error.response;
    console.log(status, data);

    responseHandler(status);
  } else {
    console.error('Connection error');
  }
  return Promise.reject(error.response?.data);
};

const responseHandler = (status: number) => {
  switch (status) {
    case HttpStatusCode.ExpectationFailed:
      console.error('handleExpectationFailed');
      break;

    case HttpStatusCode.Unauthorized:
    case HttpStatusCode.Forbidden:
      console.error('Unauthorized access');
      break;

    case HttpStatusCode.Ok:
      break;

    default:
      console.error(`Unknown error: ${status}`);
      break;
  }
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  responseErrorInterceptor
);

export const {get, post, put, delete: del} = axiosInstance;
export default axiosInstance;