import React, { useState }  from "react"; 
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login () { 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('') 
    const navigate = useNavigate()

   async function handlesubmit (e) {
        e.preventDefault();
        try { 
            const response =  await axios.post('http://localhost:5000/auth/login',  {email, password})
          if(response.data.msg === "successful") { 
            window.localStorage.setItem('chat-token', response.data.token)
            window.localStorage.setItem('user', response.data.user.id)
            navigate('/')
          }
        }
           catch(err) {
            console.log(err)}
    };
     
    return (
    <> 
        <div className=" flex justify-center bg-gray-400"> 
            <div className=" flex flex-col w-3/4 h-screen"> 
                <div className="bg-gray-400 flex p-20 w-full h-screen"> 
                    <aside className=" bg-purple-700 w-1/3 h-full flex justify-center py-60 rounded-tl-lg rounded-bl-lg"> 
                            <div> 
                                <div> 
                                    <div className=" flex justify-center"> 
                                        <button className=" bg-purple-900 w-20 h-20 rounded-lg flex-col"> 
                                        <img src="./meetme.png " alt=" " className=" w-20 h-20 object-cover rounded-md"/>
                                        </button>
                                    </div> 
                              <div className=" flex justify-center"> 
                                 <h4 className=" font-semibold flex-col text-2xl italic text-white"> Chatify</h4> 
                              </div>

                              <div className=" flex justify-center mt-4"> 
                                <h1 className=" flex-col text-lg text-white font-medium"> 
                                Log In. Link Up. 
                                </h1> 
                              </div>  

                              <div className=" flex justify-center"> 
                                <h1 className=" flex-col text-lg text-white font-medium"> 
                                Light Up the Conversation.
                                </h1> 
                              </div> 

                                </div>
                            </div>
                    </aside > 

                    <aside className=" w-2/3 h-full bg-white rounded-tr-lg rounded-br-lg"> 
                        <div className=" m-3"> 
                            <div className=" flex justify-end pr-3"> 
                                <button className=" flex-col bg-white"> 
                                    Need help? 
                                </button>
                            </div>
                        </div> 

                        <div className=" p-10 my-[110px]"> 
                            <div className=" flex justify-center "> 
                                <h1 className="flex-col bg-white text-xl font-semibold"> Login</h1>
                            </div>
                            
                            <div className=" flex justify-center mt-5"> 
                            <label htmlFor=" E-mail" className=" text-lg mt-4 flex-col"> 
                                E-mail <br /> 
                                <div className=" bg-white rounded-md border-2 border-2-solid border-gray-300 w-96 pl-2"> 
                                <input type="email" placeholder="Enter your e-mail here. "  className=" w-[360px] h-10 focus: outline-none" onChange={(e) => {setEmail(e.target.value) }} value={email}/>    
                                </div>
                             </label>
                            </div>
                               
                            <div className=" flex justify-center mt-3"> 
                            <label htmlFor=" E-mail" className=" text-lg mt-4 flex-col"> 
                                Password <br /> 
                                <div className="bg-white rounded-md border-2 border-2-solid border-gray-300 w-96 pl-2"> 
                                <input type="password" placeholder="Enter password here. " className=" w-[360px] h-10 focus: outline-none" onChange={(e) => {setPassword(e.target.value)}} value={password}/>    
                                </div>
                             </label>
                            </div> 
                                  
                                
                            <div className=" flex justify-center mt-7"> 
                                <button className=" bg-purple-700 w-96 h-10 flex-col rounded-md text-xl text-white hover:bg-black" onClick={handlesubmit}>
                                     Login 
                                </button>
                            </div>

                                <div className="flex justify-center items-center mt-7 h-auto w-auto"> 
                            <h2 className="font-semibold text-lg"> 
                                Don't have an account? 
                            </h2> 
                            <span>
                                 <button className=" w-22 mx-2 px-3 py-1 rounded-md font-semibold bg-purple-800 text-white hover:bg-black"> 
                                   <Link to ="..\register">Register</Link> 
                                </button>
                            </span>
                        </div>
                        </div>


                        
                    </aside>
                
                    
                  

                </div>
            </div>
        </div>
    </> 
    )
};