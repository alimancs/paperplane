import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import axios from 'axios';

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'], 
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula']]
}

export default function CreatePost() {
    const [ title, setTitle ] = useState("");
    const [ summary, setSummary ] = useState("");
    const [ content, setContent ] = useState("");
    const [ cover, setCover ] = useState('');
    const [ redirect, setRedirect ] = useState(false);
    const { userInfo } = useContext(UserContext);

    const data = new FormData();


   async function addPost(e) {
        e.preventDefault();
        const authToken = localStorage.getItem('authToken');
        data.append( 'title', title );
        data.append( 'summary', summary );
        data.append( 'content', content );
        // data.append( 'cover', cover );
        
        console.log(data);
        
        // const response = await fetch("https://paperplane-blog-api.onrender.com/addpost", {
        //     method:"POST",
        //     body:'this is a data',
        //     headers:{ 'Authorization':authToken,
        //              }
        // });
        axios.post("https://paperplane-blog-api.onrender.com/addpost", data )
        .then( response => {
            console.log(response.data)
        })
        .catch(error => {
            alert('something went wrong: try checking your internet connection');
        })

        // if (response.ok) {
        //     // setRedirect(true);
        // } else {
        //     alert('something went wrong: try checking your internet connection');
        // }

    }

    const handleImageChange = (e) => {

        const reader = new FileReader();
        reader.onloadend = () => {

            setCover( reader.result );
        };
        reader.readAsDataURL(e.target.files[0])

    }

    if ( redirect | userInfo === null)  {
       return <Navigate to={'/'}/>
    }
    return(
        <div className="bodyContainer"> 
            <form onSubmit={ addPost }>
                <textarea value={ title } onChange={ e => setTitle( e.target.value ) } type="title" placeholder="Title"></textarea>
                <textarea value={ summary } onChange={ e => setSummary( e.target.value ) } type="summary" placeholder="Summary"></textarea>
                <input  type="file" onChange={ handleImageChange } />
                <ReactQuill className="editor" value={ content } onChange={ val => setContent( val ) } theme="snow" modules={modules}></ReactQuill>
                <button className="submit" type="submit">Publish</button>
            </form>
        </div>
    )
}