

export const SetToString = (wordsSet) => {
    return [...wordsSet].join('\n')
}

export const StringToSet = (words) => {
    const wordsSet = new Set()
    const wordsList = words.split('\n')
    for(let w of wordsList) {
        wordsSet.add(w)
    }
    return wordsSet;
}