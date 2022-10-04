import { useState } from 'react'
import {Input} from 'reactstrap'

export default function Regex() {
    
    const [textRegex, setTextRegex] = useState("");

    console.log(textRegex);

    return <>
    
    <h1>Regex Input</h1>

    <Input 
        onChange={(e)=> {
            setTextRegex(e.target.value);
        }}
    />    
    
    </>
}