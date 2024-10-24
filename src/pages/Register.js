import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from 'axios';

export default function Register() {

    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [fpassword, setFpassword] = useState("");
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [ redirect, setRedirect ] = useState(false);
    const [ str, setStr ] = useState('Confirm');
    const [otpbuttonstr, setOtpbuttonstr] = useState('Send Code');

    // states for errors
    const [emailerror, setEmailerror] = useState('warningOff');
    const [otperror, setOtperror] = useState('warningOff');
    const [nameerror, setNameerror] = useState('warningOff');
    const [usererror, setUsererror] = useState('warningOff');
    const [passerror, setPasserror] = useState('warningOff');
    const [networkerror, setNetworkerror] = useState('warningOff');
    // verify email
    function isValidEmail(emailadd) {
        // Regular expression to validate email addresses
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        // Test the email against the regular expression
        return emailRegex.test(emailadd);
    }
    
    // navigating through register page
    const [basic, setBasic] = useState('regOn');
    const [auth, setAuth] = useState('erOff');
    const [confirm, setConfirm] = useState('unclickable');

    function checkBasicInput() {
        const names = firstname !=='' && lastname !=='';
        const user = username !== '';
        let pass = password !== '' && fpassword !== '';
        if (!names) {
            setNameerror('warning')
        } else { setNameerror('warningOff')};
        if (!user) {
            setUsererror('warning')
        } else {setUsererror('warningOff')};
        if (!pass) {
            setPasserror('warning')
        } else { setPasserror('warningOff')};
        if (pass) {
            if (password !== fpassword ) { 
                setPasserror('warning');
                pass = false;
             }  else { setPasserror('warningOff')};
        }
        if (names && user && pass) {
            return true;
        } else { return false}
    };

    function toConfirm(e) {
        e.preventDefault();
        const filled = checkBasicInput();
        if (filled) {
            setBasic('regOff');
            setAuth('erOn')
        }
    }
    function toBasic() {
        setBasic('regOn');
        setAuth('erOff')
    }

    //create OTP and send to email-----------------------------------------
    const [sendotp, setSendotp] = useState('sendCode');
    const [second, setSecond] = useState(60);
    const [minute, setMinute] = useState(1);
    const [ startcount, setStartcount] = useState(false);
    const [countertext, setCountertext] = useState('counterOff');

    // counter block-------------------------------------------------------
    setTimeout(() => {
        if (startcount) {
            if (second>=0) {
                if (second===0) {
                    if (minute!==0) {
                        setMinute(minute-1);
                        setSecond(60);
                    } else {
                        setCountertext('counterOff');
                        setStartcount(false);
                        setSendotp('sendCode');
                        setOtpbuttonstr('Send Code');
                    }
                } else {
                    setSecond(second-1);
                }
            }  
        }
    }, 1000);

    // sending OTP function---------------------------------------------------------
    async function sendOTP(e) {
        e.preventDefault();
        if (countertext==='counterOff') {
            if( isValidEmail(email)) {
                setOtpbuttonstr('Sending...');
                const data = { email };

                    // send a request to the backend to send and OTP----------------
                await axios.post('https://paperplane-blog-api.onrender.com/send-otp',data)
                .then(response => {
                        setNetworkerror('warningOff');
                        setCountertext('counterOn');
                        setSecond(60);
                        setMinute(1)
                        setOtpbuttonstr('Sent')
                        setSendotp('unclickable');
                        setStartcount(true);
                        setConfirm('next');
                })
                .catch((error) => {
                    setOtpbuttonstr('Send Code');
                    setNetworkerror('warning');

                })
            } else {
                console.log('invalid email address');
                setEmailerror('warning');
            } 
        }
    }


    //registers user and creates an account for users---------------------------------
     function register(){
       const data = { otp };
       if ( confirm !== 'unclickable') {
            setStr('confirming...');
            axios.post('https://paperplane-blog-api.onrender.com/verify-otp', data)
            .then( async (response) => {
                if(response.data.verification) {
                    console.log('OTP was verified');
                    setStr('Registering...');

                    // register user
                    const response = await fetch("https://paperplane-blog-api.onrender.com/register", {
                        method:"POST",
                        body:JSON.stringify({ username: username.toLowerCase(), password, firstname, lastname, email }),
                        headers:{"content-type":"application/json"},
                    })
                    console.log(response);
                    if (response.status === 200) {
                        setRedirect(true);
                    } else {
                        setStr('Confirm');
                        setOtperror('warning');
                        setNetworkerror('warning');
                    }

                } else {
                    console.log('invalid OTP code');
                    setStr('Confirm');
                    setEmailerror('warning');
                }
            })
            .catch( error => {
                setNetworkerror('warning');
            })
       }

    };

    if (redirect) {
        return <Navigate to={'/registration-success'}/>
    }
    return (
        <div className="lr">
            <h1 className="signtext">Sign up</h1>
            <form className={basic} onSubmit={toConfirm} >
                <div className="formDiv">
                    <input id="inputS1" className="inputForm" onChange={ e => { setFirstname(e.target.value) } } value={firstname} type="text" placeholder="First name"/>
                    <input id="inputS2" className="inputForm" onChange={ e => { setLastname(e.target.value) } } value={lastname} type="text" placeholder="Last name"/>
                </div>
                <span className={nameerror}>Firstname and Lastname are required*</span>
                <input className="inputForm"  onChange={ e => { setUsername(e.target.value) } } value={username} type="text" placeholder="Username"/>
                <span className={usererror}>Username is required*</span>
                <input className="inputForm"  onChange={ e => { setFpassword(e.target.value) } } value={fpassword} type="password" placeholder="Password"/>
                <input className="inputForm"  onChange={ e => { setPassword(e.target.value) } } value={password} type="password" placeholder="Confrim assword"/>
                <span className={passerror}>passwords do not match*</span>
                <button type="submit" className="submit">Next</button>
            </form>
            <div className={auth}>
                <span className="erText">Confirm your Email</span>
                <span className={networkerror}>Network error, please Check your internet connection</span>
                <form onSubmit={sendOTP} className="formDiv">
                    <input id="inputS3" value={email} onChange={ e => { setEmail(e.target.value)}} type="email" placeholder="Email"/>
                    <button id="sendCode" type="submit" className={sendotp}>{otpbuttonstr}</button>
                </form>
                <span className={emailerror}>You need to enter a valid email address</span>
                <input className="inputForm"  onChange={ e => { setOtp(e.target.value) } } value={otp} type="text" placeholder="Enter OTP code here"/>
                <span className={otperror}>invalid OTP code</span>
                <span className={countertext}>OTP code sent to your email (check spam folder), You can request a new OTP in 0{minute}:{second<10?('0'+second):second}</span>
                <div className="formDiv">
                    <button onClick={toBasic} className="prev">Back</button>
                    <button id='next' onClick={register} className={confirm}>{str}</button>
                </div>
            </div>
        </div>
    );
};