export const useJWTToken = () => {
    async function get() {
        return localStorage.getItem('jwt-token') ?? null
    }

    async function set(v: string) {
        localStorage.setItem('jwt-token', v)
    }

    function remove() {
        localStorage.removeItem('jwt-token')
    }

    return {
        get,
        set,
        remove
    }
}