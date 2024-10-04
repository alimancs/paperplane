import { useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext } from "react";

export default function Login() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ redirect, setRedirect ] = useState(false);
    const { userInfo, setUserInfo } = useContext(UserContext);



    async function logUserIn(e) {
        e.preventDefault();
        const response = await fetch("https://paperplane-blog-api.onrender.com/login", {
            method:'POST',
            body:JSON.stringify( { username, password } ),
            headers:{'Content-Type':'application/json', 'Access-Control-Allow-Origin': '*' },
            credentials:'include',
        })
        if (response.ok) {
            response.json().then( data => {
               setUserInfo(data.userData);
               localStorage.setItem('authToken', data.authToken);
               setRedirect(true);
            })
        } else {
            alert("invalid username or password");
        }
    }

    if (redirect) {
        return <Navigate to={'/'}/>
        window.location.reload();
    }

    return(
        <div className="lr">
            <h1>Login</h1>
            <form onSubmit={ logUserIn }>
                <input type="text" placeholder="Username" value={ username } onChange={ ev=> setUsername(ev.target.value) }/>
                <input type="text" placeholder="Password" value={ password } onChange={ ev=> setPassword(ev.target.value) }/>
                <button className="submit" type="submit">Login</button>
            </form>
        </div>
    );
};