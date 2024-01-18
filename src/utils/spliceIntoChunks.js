export default function spliceIntoChunks(arr, chunkSize) {
    if (arr.length < chunkSize) {
        return arr
    }
    const res = []
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize)
        res.push(chunk)
    }
    return res
}