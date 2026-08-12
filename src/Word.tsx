import Letter, { type LetterProp } from "./Letter";

type WordProp = {
    word: LetterProp[];
}

export default function Word({word}: WordProp) {
    const letters = word.map((obj, i) => {
        return <Letter letter={obj.letter} guess={obj.guess} key={i}/>
    })

    return (
        <main className="flex">
            { letters }
        </main>
    )
}