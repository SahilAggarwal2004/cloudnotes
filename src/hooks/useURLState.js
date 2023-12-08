import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"

export default function useURLState(param, defaultValue) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const value = searchParams.get(param) || defaultValue

    function setValue(value) {
        const paramObj = new URLSearchParams(searchParams.toString())
        if (value) paramObj.set(param, value)
        else paramObj.delete(param)
        const newParams = paramObj.toString()
        const url = router.pathname + (newParams ? '?' + newParams : '')
        router.replace(url)
    }

    return [value, setValue]
}
