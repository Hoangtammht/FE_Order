import axios from 'axios';
import queryString from 'query-string';
import { localDataNames } from '../constants/appInfos';
import store from '../reduxs/store';
import { removeAuth } from '../reduxs/reducers/authReducer';

const baseURL = `http://localhost:8080`;

const AxiosClient = axios.create({
    baseURL,
    paramsSerializer: (params) => queryString.stringify(params)
});

AxiosClient.interceptors.request.use(async (config: any) => {
    const storedData = localStorage.getItem(localDataNames.authData);
    const accessToken = storedData ? JSON.parse(storedData)?.access_token : '';

    if (accessToken) {
        config.headers = {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            ...config.headers,
        };
    }

    return config;
});

AxiosClient.interceptors.response.use(
    (res) => {
        return res;
    },
    async (error) => {
        const { config, response } = error;
        if (response.status === 403 && !config._retry) {
            config._retry = true;

            const storedData = localStorage.getItem(localDataNames.authData);            
            const parsedData = storedData ? JSON.parse(storedData) : null;
            const refreshToken = parsedData?.refresh_token;


            if (refreshToken) {
                try {
                    const res = await AxiosClient.post('/user/refresh', {}, {
                        headers: { Authorization: `Bearer ${refreshToken}` }
                    });

                    const updatedData = {
                        ...parsedData,
                        access_token: res.data.access_token
                    };

                    localStorage.setItem(localDataNames.authData, JSON.stringify(updatedData));

                    config.headers['Authorization'] = `Bearer ${res.data.access_token}`;
                    return AxiosClient(config);
                } catch (err) {
                    handleLogoutButton();
                    return Promise.reject(err);
                }
            } else {
                handleLogoutButton();
                return Promise.reject(new Error('Refresh token not found'));
            }
        }
        return Promise.reject(error);
    }
);


const handleLogoutButton = async() => {
    const storedData = localStorage.getItem(localDataNames.authData);
    const refreshToken = storedData ? JSON.parse(storedData)?.refresh_token : null;

    if (refreshToken) {
        try {
            await AxiosClient.post('/user/logout', {}, {
                headers: { Authorization: `Bearer ${refreshToken}` }
            });
        } catch (error) {
            console.error("Logout failed", error);
        }
    }
    localStorage.removeItem(localDataNames.authData);

    store.dispatch(removeAuth({}));

    window.location.href = '/';
};

export {AxiosClient, handleLogoutButton};