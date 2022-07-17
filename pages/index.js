import { debounce } from "lodash";
import { useState, useCallback, useEffect, Fragment, useRef } from "react";
import { SetToString, StringToSet } from "../utils/words";
import styles from "./styles.module.scss";

export default function Home() {
  const [savedWords, setSavedWords] = useState(new Set());
  const [savedNewWords, setSavedNewWords] = useState(new Set());
  const [newWords, setNewWords] = useState([]);
  const [fireCount, setFireCount] = useState(0);
  const inputRef = useRef(null)

  const onInputChange = useCallback(
    (e) => {
      let words = inputRef.current.value ?? "";
      words = words
        .toLowerCase()
        .split(/(\s|\n)/)
        .map((x) => x.trim().replace(/[?.,;:!'"]/g, ""))
        .filter((x) => x !== "")
        .filter((x) => !/^\d+$/.test(x))
        .filter((x) => !savedWords.has(x))
        .filter((x) => !savedNewWords.has(x));

      setNewWords(words);
      setFireCount(fireCount + 1);
    },
    [setNewWords, setFireCount, fireCount, savedWords, savedNewWords]
  );

  useEffect(() => {
    fetch("/api/get-words")
      .then((x) => x.text())
      .then((words) => {
        setSavedWords(StringToSet(words));
      });

    fetch("/api/get-new-words")
      .then((x) => x.text())
      .then((words) => {
        setSavedNewWords(StringToSet(words));
      });
  }, []);

  const addWords = useCallback((e) => {
    const n = new Set(savedNewWords);
    for (const w of newWords) {
      n.add(w);
    }
    setSavedNewWords(n);
  }, [setSavedNewWords, savedNewWords, newWords]);

  const saveWords = useCallback((e) => {
    fetch("/api/update-words", {
      method: "POST",
      body: SetToString(savedWords),
    });
    fetch("/api/update-new-words", {
      method: "POST",
      body: SetToString(savedNewWords),
    });
  }, [savedWords, savedNewWords]);

  const removeNewWord = useCallback(
    (newWordToRemove) => {
      const newWordsWithoutRemovedWord = newWords.filter(
        (w) => w !== newWordToRemove
      );

      setNewWords(newWordsWithoutRemovedWord);
      setFireCount(fireCount + 1);
    },
    [setNewWords, setFireCount, fireCount]
  );

  const savedNewWordsArray = [...savedNewWords].filter((x) => x !== "");

  return (
    <div>
      <div className={styles.formContainer}>
        <textarea
          ref={inputRef}
          className={styles.input}
          onChange={debounce(onInputChange, 500)}
        />
        <div className={styles.newWordsContainer}>
          <div className={styles.statsContainer}>
            <div className={styles.newWordsCount}>
              <span className={styles.statLabel}>Count:</span> {newWords.length}
            </div>
            <div className={styles.fireCount}>
              <span className={styles.statLabel}>Fire:</span> {fireCount}
            </div>
          </div>
          <div>
            {newWords.map((w) => (
              <Fragment key={w}>
                <span
                  className={styles.newWord}
                  onClick={() => removeNewWord(w)}
                >
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.buttonProcess} onClick={addWords}>
            Add Words
          </button>
          <button className={styles.buttonSave} onClick={saveWords}>
            Save
          </button>
        </div>
      </div>
      <hr />
      <div className={styles.savedNewWordsContainer}>
        <div className={styles.newWordsContainer}>
          <span className={styles.statLabel}>Count:</span>{" "}
          {savedNewWordsArray.length}
        </div>
        <div>
          {savedNewWordsArray.map((w) => (
            <Fragment key={w}>
              <span>{w}</span>{" "}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
