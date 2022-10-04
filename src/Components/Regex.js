import { useState } from 'react'
import {Input} from 'reactstrap'

export default function Regex() {
    
    const [textRegex, setTextRegex] = useState("");
    const [match, setMatch] = useState(false);

    function testRegex(text)
    {
        const regexObj = new RegExp(`^${textRegex}$`);

        return regexObj.test(text);
    }

    return <>
    
    <h1>Regex Input</h1>

    <Input 
        onChange={(e)=> {
            setTextRegex(e.target.value);
        }}
    />    

    <h1>Testing Input</h1>

    <Input 
        onChange={(e)=> {
            setMatch(testRegex(e.target.value));
        }}
        style={{border: !!match ? "3px solid green" : "3px solid red"}}
    />    
    
    </>
}