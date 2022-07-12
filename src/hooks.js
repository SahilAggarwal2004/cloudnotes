import { useState } from "react";
import { GrVolume, GrVolumeMute } from "react-icons/gr";

export function useSpeech({ _id, title, description, tag }) {
    const [speechIcon, setSpeechIcon] = useState(<GrVolume onClick={speech} />)

    let speechId = null;
    function speech() { handleSpeech(_id) }
    function handleSpeech(clickId) {
        // speechSynthesis is an API which enables to convert text into speech
        const speaking = speechSynthesis.speaking; // speechSynthesis.speaking checks it speechSynthesis is speaking or not
        const newSpeech = () => {
            speechId = clickId;
            setSpeechIcon(<GrVolumeMute onClick={speech} />)
            const text = `The tag is ${tag}. The title is ${title}. The description is ${description}.`;
            // below is the method to speak:
            // speechSynthesis.speak(new SpeechSynthesisUtterance(text to be spoken))
            const utterance = new SpeechSynthesisUtterance(text.replace(/\s/g, ' '))
            speechSynthesis.speak(utterance)
            utterance.onend = () => {
                speechId = null
                setSpeechIcon(<GrVolume onClick={speech} />)
            }
        }

        if (!speaking) return newSpeech()
        speechSynthesis.cancel()
        if (speechId !== clickId) return newSpeech()
        speechId = null;
        setSpeechIcon(<GrVolume onClick={speech} />)
    }

    return speechIcon
}