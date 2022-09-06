import axios, {Method} from 'axios';
import cookie from 'react-cookies';



interface IPramsRequest{
    path: string,
    method: Method,
    headers?: any,
    data?: any,
    endpoint?: string,
    params?: any,
}


export async function baseApi<T>({path, method, headers, data, endpoint, params}: IPramsRequest): Promise<T>{
    return new Promise((resolve, reject) => {
        // console.log("process.env.ENDPOINT ", process.env.ENDPOINT)
        return axios({
            url: (endpoint || process.env.ENDPOINT) + path,
            method,
            headers:{
                Authorization: 'Bearer ' + cookie.load('access_token'), 
                ...headers
            },
            data,
            params
        }).then(({data})=>{
            resolve(data)
        }).catch(e => reject(e))
    })
}