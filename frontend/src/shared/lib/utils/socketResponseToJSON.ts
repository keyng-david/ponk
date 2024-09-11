export function socketResponseToJSON<T extends Record<string, unknown>>(data: string): T  {
    const splitIndex = (data as string).indexOf(':')
    const stringify = data.slice(splitIndex + 1, data.length)
    return JSON.parse(stringify)
}