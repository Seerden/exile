import { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

// axios.interceptors.request.use(request => {
//     console.log('Starting Request', JSON.stringify(request, null, 2))
//     return request
// })

interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE",
    params?: Object,
    data?: Object
}

type RequestReturnTuple = [React.Dispatch<React.SetStateAction<RequestOptions | null>>, AxiosResponse | null, AxiosError | null, boolean]

export function useRequest({ url }: { url: string}): RequestReturnTuple {
    const [error, setError] = useState<AxiosError | null>(null);
    const [response, setResponse] = useState<AxiosResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [options, setOptions] = useState<RequestOptions | null>(null);
    const source = axios.CancelToken.source();


    useEffect(() => {  // effect to track mount state, aids in canceling requests on unmount
        setMounted(true);

        return () => {
            setMounted(false)
            source.cancel('Cancel request. Reason: hook unmounted')
        }
    }, [])

    useEffect(() => {
        if (options && mounted) {
            setLoading(true);

            console.log(options);

            axios({
                method: options.method,
                params: options.params,
                url,
                data: options.data
            })
                .then(res => {
                    setLoading(false)
                    setResponse(res.data)
                })
                .catch(err => {
                    setLoading(false)
                    setError(err)
                })
        }
    }, [options])

    return [setOptions, response, error, loading]
}