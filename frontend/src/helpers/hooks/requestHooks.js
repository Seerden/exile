import react, { useEffect, useState } from 'react';
import axios from 'axios';

export function useRequest({ url }) {
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [options, setOptions] = useState(null);
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
            console.log(options);
            axios({
                method: options.method,
                url,
                data: options.data
            })
                .then(res => {
                    setResponse(res.data)
                })
                .catch(err => {
                    setError(err)
                })
        }
    }, [options])

    useEffect(() => {
        response && console.log(response);
        error && console.log(error);

    }, [response, error])

    return [setOptions, response, error]
}