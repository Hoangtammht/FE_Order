import AxiosClient from "./AxiosClient";

const MenuHandleApi = async (
    url: string,
    data?: any,
    method: 'post' | 'put' | 'get' | 'delete' = 'get'
  ) => {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const accessToken = authData?.access_token || '';
  
    return await AxiosClient(url, {
      method,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

export default MenuHandleApi;
  