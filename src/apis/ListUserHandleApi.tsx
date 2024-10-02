import AxiosClient from "./AxiosClient";

const ListUserHandleApi = async (
    url: string,
    data?: any,
    method: 'post' | 'put' | 'get' | 'delete' = 'get'
  ) => {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const accessToken = authData?.access_token || ''; // Retrieve token from localStorage
  
    return await AxiosClient(url, {
      method,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add Bearer token to headers
      },
    });
  };

export default ListUserHandleApi;
  