import react, { useEffect, useState } from 'react'

function useMountState() {
    const [isMounted, setMounted] = useState(null);

    useEffect(() => {
        setMounted(true);
        return () => {setMounted(false)}
    }, [])

    return [isMounted]
}
