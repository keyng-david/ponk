import { createEffect } from "effector";
import { createGate, useUnit } from "effector-react";
import { useEffect } from "react";

export function createFetch<T extends () => Promise<unknown>>(request: T) {
    const FetchGate = createGate<number>()

    const fetchFx = createEffect(request)
    
    const $isPending = fetchFx.pending

    const useFetchGate = () => {
        useEffect(() => {
            FetchGate.open(0)
        }, [])
    
        return {
            isLoading: useUnit($isPending)
        }
    }

    return [FetchGate, fetchFx, useFetchGate] as const
}