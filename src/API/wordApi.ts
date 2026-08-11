export function getWord(): Promise<string> {
    const request: RequestInfo = new Request('https://random-word-api.herokuapp.com/word?number=1&length=5', {
        method: 'GET',
    })

    return fetch(request)
    .then(res => res.json())
    .then((res: string[]) => {
        return res[0]
    })
}