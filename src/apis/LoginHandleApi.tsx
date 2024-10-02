import AxiosClient from "./AxiosClient";

const LoginHandleApi = async (
	url: string,
	data?: any,
	method?: 'post' | 'put' | 'get' | 'delete'
) => {
	return await AxiosClient(url, {
        method: method ?? 'get',
        data
    });
};

export default LoginHandleApi;