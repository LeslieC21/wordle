export type LetterProp = {
    letter: string;
    guess: 0 | 1 | 2 | 3;       // 0 is not guessed - 1 is black - 2 is yellow - 3 is green
}

export default function Letter({ letter, guess }: LetterProp) {
    const classMap = {
        0: "border outline-[#3a3a3c]",
        1: "bg-[#3a3a3c]",
        2: "bg-[#b59f3b]", 
        3: "bg-[#538d4e]"
    }
    return (
        <div className={`bg-[#3a3a3c] w-[62px] h-[62px] flex items-center justify-center text=[1em] font-bold text-[#fff] m-[2px] ${classMap[guess]}`}>
            { letter }
        </div>
    );
}