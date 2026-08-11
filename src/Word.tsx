import Letter, { type LetterProp } from "./Letter";

type WordProp = {
    word: LetterProp[];
}

export default function Word({word}: WordProp) {
    const letters = word.map(obj => {
        return <Letter letter={obj.letter} guess={obj.guess}/>
    })

    return (
        <main className="flex">
            { letters }
        </main>
    )
}