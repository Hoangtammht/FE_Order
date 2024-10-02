import axios from 'axios';
import queryString from 'query-string';

const baseURL = `https://tvr.zapto.org:8443`;

const AxiosClient = axios.create({
    baseURL,
    paramsSerializer: (params) => queryString.stringify(params)
});

AxiosClient.interceptors.request.use(async (config:any) => {
    config.headers = {
        Authorization: '',
        Accept: 'application/json',
        ...config.headers,
    };

    return config;
});

axios.interceptors.response.use((res) => {
    if(res.data && res.status >= 200 && res.status < 300){
        return res.data.data;
    }else{
    return Promise.reject(res.data);
    }
}, error => {
    const {response} = error;
    return Promise.reject(response.data);
});

export default AxiosClient;