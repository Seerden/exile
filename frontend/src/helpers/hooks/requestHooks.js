import react, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export function useRequest({ url }) {
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [options, setOptions] = useState(null);
    const source = new axios.CancelToken.source();

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

            axios({
                method: options.method,
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