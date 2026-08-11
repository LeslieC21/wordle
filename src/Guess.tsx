type GuessProp = {
    letters?: [];
}

export default function Guess({letters}: GuessProp) {
    return (
        <>
            <button>{letters ?? ""}</button>
        </>
    )
}