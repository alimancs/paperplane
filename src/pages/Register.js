import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ redirect, setRedirect ] = useState(false);

    async function register(e){
       e.preventDefault();
       const response = await fetch("https://paperplane-blog-api.onrender.com/register", {
        method:"POST",
        body:JSON.stringify({ username, password }),
        headers:{"content-type":"application/json"},
       })
       console.log(response);
       if (response.status === 200) {
         setRedirect(true);
       } else {
        alert("Something went wrong please try again");
       }
    };

    if (redirect) {
        return <Navigate to={'/registration-success'}/>
    }
    return (
        <div className="lr">
            <h1>Register</h1>
            <form onSubmit={register} >
                <input onChange={ e => {setUsername(e.target.value)}} value={username} type="text" placeholder="Username"/>
                <input onChange={ e => {setPassword(e.target.value)}} value={password} type="text" placeholder="Password"/>
                <button className="submit">Register</button>
            </form>
        </div>
    );
};