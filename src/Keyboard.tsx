import { useState, forwardRef, useImperativeHandle, useEffect } from "react";

interface KeyboardProps {
    onKeyDown: (key: string) => void;
}

export interface KeyboardRef {
    updateKeyGuess: (updates: Record<string, string>) => void;
    playAgain: () => void;
}

export const Keyboard = forwardRef<KeyboardRef, KeyboardProps>(({ onKeyDown }, ref) => {
    const rows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Bck"],
    ];

    const [keyStatus, setKeyStatus] = useState(resetButtons());

    useEffect(() => {
    }, [keyStatus]);


    function selectKey(key: string) {
        if(key === "Bck")
            onKeyDown("Backspace")
        else 
            onKeyDown(key);
    }


    function playAgain() {
        setKeyStatus(resetButtons());
    }


    function resetButtons(): Record<string, string> {
        const status: Record<string, string> = {};
        rows.flat().forEach((key) => {
            status[key] = ' bg-[#818384]' ;
        });

        return status;
    }


    function updateKeyGuesses(updates: Record<string, string>) {
        setKeyStatus((prevStatus) => {
            return {
                ...prevStatus,
                ...updates
            };
        });
    }

    
    useImperativeHandle(ref, () => ({
        updateKeyGuess: updateKeyGuesses,
        playAgain: playAgain
    }));

    return (
        <div className="flex flex-col items-center w-[70%]">
            {rows.map((row, i) => (
                <div key={i} className="flex mb-[6px]">
                    {row.map((key) => {
                        const isSpecialKey = key === "Enter" || key === "Bck";
                        const widthClass = isSpecialKey ? "px-4 min-w-[72px]" : "px-2 min-w-[58px]";

                        return (
                            <button 
                                onClick={() => selectKey(key)}
                                key={key}
                                className={`flex flex-1 justify-center items-center h-[58px] mr-[6px] font-bold text-[1.25em] text-[#f8f8f8] rounded-[4px] ${widthClass} ${keyStatus[key]}`}
                            >
                                {key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
});