import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect} from "react"; 
import { useNavigate } from "react-router-dom";
import {io} from 'socket.io-client';
import { CameraPlus } from "@phosphor-icons/react";
import { Input } from "../Ui/input";
import { Dialog } from '@headlessui/react';
import '../index.css';


export default function Chattify() {

  const [search, setSearch] = useState([]);
  const [conversation, setconversation] = useState([]);
  const [convo, setConvo] = useState([]);
  const [convod, setConvod] = useState([]);
  const [newconvo, setNewconvo] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [pictureUpdates, setPictureUpdates] = useState(false);
  const [fileName, setFileName] = useState("");
  const [bio, setBio] = useState("");
  const [displayer, setDisplayer] = useState('');
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchToggle, setSearchToggle] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingStatus, setTypingStatus] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const socket = useRef();
  const sockett = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    const user = window.sessionStorage.getItem("user");
    const token = window.sessionStorage.getItem("chat-token");

    if (!user || !token) {
      navigate("/login");
    }
  }, [navigate]);
  
  const senderId = window.sessionStorage.getItem("user");
  const conversationID = window.sessionStorage.getItem('selectedConversationID')  

  //fetch for web-sockets

  useEffect(()=>{ 
     sockett.current = io("chatify-app-1-0r2j.onrender.com");
     socket.current = io("server-service-t3fu.onrender.com")
  }, [])

  useEffect(()=> { 
    sockett.current.emit("addmembers", senderId)
    sockett.current.on('getsenderId', users => { 
      setOnlineUsers(users)
    }) 
  }, [senderId]) 

  useEffect(() => { 
    console.log(onlineUsers)
  }, [onlineUsers])

  useEffect(() => { 
         sockett.current.on('showTyping', data => {
    setTypingStatus(data)
   }) 
   sockett.current.on('hideTyping', data => { 
        setTypingStatus(data)
      })
  },[])
  
  //typing status with socket 
   function TypingStatus(sender) { 
     sockett.current.emit("userStatus", sender, conversationID)
   
  }
 
    function HideStatus(sender) { 
      sockett.current.emit('hideStatus', sender)
     
  }

  useEffect(() => {
    sockett.current.on("getmessage", (data) => { 
      console.log(data); 
      const conversationID = window.sessionStorage.getItem('selectedConversationID')  
   if( conversationID === data.conversationId) { 
    setMessages((prevMessages) => [...prevMessages,
      {
        conversationID: data.conversationId,
        sender: data.senderId,
        context: data.context
      }
    ]);
   }
 });
 return () => {
  sockett.current.off("getmessage");
};
  }, []);

  const sendmsg = () => { 
    if(conversationID ) { 
      sockett.current.emit("sendtext", { 
        conversationId: conversationID, 
        content: { 
          sender: senderId, 
          context: message.trim(),
        }
      })
    }

    setMessage('')
    return () => {
      sockett.current.off("sendtext");
    };
  };
 
//fetch for http-requests

  useEffect(function() {
      async function verifyUser() {
          try {
              const response = await axios.get('https://server-service-t3fu.onrender.com/auth/verify', {
                  headers: {
                      'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
                  }
              });
              console.log(response);
              if (response.data.msg === 'successful') {
                  navigate('/');
              }
          } catch (err) {
              console.log(err);
          }
      } 
      verifyUser();
  }, [navigate]); 

  // search functionality here
  async function searchName() {
    if (!firstname.trim()) {
        console.log("Please enter a name.");
        return;
    }
    try {
        const res = await axios.get(`https://server-service-t3fu.onrender.com/client/search/${firstname.trim()}`, {
            headers: {
                'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
            }
        });
        
        if(res.data.search) { 
          window.sessionStorage.setItem('receiverid', res.data.search[0]._id);
          setSearch(res.data.search);
          setFirstname('');
        }
        
    } catch (err) {
        console.error("Error fetching data:", err);
    }
  }; 

  useEffect(() => {
    console.log(search); 
  }, [search]);

  // add conversation to server
  async function createConversation(id) { 
    const senderId = window.sessionStorage.getItem('user');
    const receiverId = window.sessionStorage.getItem('receiverid');

    if (!receiverId) {
      alert('Friend not found');
      return;
    }

    try { 
      const res = await axios.post('https://server-service-t3fu.onrender.com/client/conversations/', {senderId, receiverId}, {
        headers: {
            'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
        }
      })
      console.log(res.data);
    } catch(error) {
      alert(error);
    }
  };

  // get conversations from server
  useEffect(() => { 
    async function getConversation() { 
      const senderId = window.sessionStorage.getItem('user');
      try { 
        const res = await axios.get('https://server-service-t3fu.onrender.com/client/conversations/', { params : { senderId }, 
          headers: {
              'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
          }
        });
        const response = res.data
        console.log(response)
        const createdUserconversation = response.filter( resp => {
          return resp.members.includes(senderId)} )
        console.log(createdUserconversation)
        setconversation(response);
      } catch(error) {
        console.log(error);
      }
    }
    getConversation();
  }, []);



  //NOTE: essentially, this is literally the same function as the one above inside the useEffect function, only brought it out here for calling purposes. 
  async function getConversation() { 
    const senderId = window.sessionStorage.getItem('user');
    try { 
      const res = await axios.get('https://server-service-t3fu.onrender.com/client/conversations/', { params : { senderId }, 
        headers: {
            'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
        }
      });
      const response = res.data
      console.log(response)
      setconversation(response);
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(conversation);
  }, [conversation]);

  useEffect(() => {
    if (conversation.length > 0) {
      console.log(conversation)
      const senderId = window.sessionStorage.getItem('user');
      const friendId = conversation.map(conversations => {
        return conversations.members.filter(member => member !== senderId)
      }).flat();
      console.log(friendId); 

      async function getFilteredconversation() { 
        try { 
          const res = await axios.get('https://server-service-t3fu.onrender.com/client/conversation/', { params: { friendId },
            headers: {
                'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
            }
          });
          console.log(res.data);
          setConvo(res.data);
        } catch(error) {
          console.log(error);
        }
      }
     getFilteredconversation();
      setNewconvo(true);
    }
  }, [conversation]);

  useEffect(() => {
    console.log(convo);
  }, [convo]);

  useEffect(function RealtimeUpdates(){ 
    socket.current.on("conversationInserted", function (data) { 
  if(data.fullDocument.members.includes(String(senderId))){
    setconversation((prevConversations) => [...prevConversations, data.fullDocument])
  }
    })
    return () => {
      socket.current.off("conversationInserted");
    };
  }, [senderId])
  
async function getFilterChats(id) {
      const filteredFriend = convo.filter((conv) => conv._id === id);
      console.log(filteredFriend);
      window.sessionStorage.setItem('selectedChatId', id)
      setConvod(filteredFriend); 
 }; 

  async function getconversationid(memberID) { 
            const member =  convo.filter((conv) => conv._id === memberID)
            const memberId = member[0]._id
           const senderId = window.sessionStorage.getItem('user');

              if(memberId && senderId) { 
                try { 
                  const res = await axios.get('https://server-service-t3fu.onrender.com/client/getconversationid/', { params : {memberId, senderId}, 
                    headers: {
                        'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
                    }
                  }) 
                  console.log(res.data)
                const  membersID = res.data
                const getconversationID = membersID._id 
                window.sessionStorage.setItem('selectedConversationID', getconversationID)
                console.log(getconversationID)
                } catch(err) { 
                  console.log(err)
                }
              }
            }; 
  
  async function sendMessage() {  
    const conversationID = window.sessionStorage.getItem('selectedConversationID');
    const senderId = window.sessionStorage.getItem('user');

    if (!message.trim()) {
      console.log("Please enter a message.");
      return;
  }
    try{ 
        const res = await axios.post('https://server-service-t3fu.onrender.com/client/messages/', { 
        conversationID: conversationID,
        sender: senderId, 
        context: message}, {
          headers: {
              'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
          }
        }); 
        if(res.data){
          setMessage('');
        }
        console.log(res.data)

    } catch(error){ 
         console.log(error)
    }
  };


    async function getMessage() { 
      const conversationID = window.sessionStorage.getItem('selectedConversationID') 
      console.log(conversationID)
      try{
        const res = await axios.get(`https://server-service-t3fu.onrender.com/client/messages/${conversationID}` , {
          headers: {
              'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
          }
        });
        console.log(res.data)
        setMessages( res.data)
      } 
      catch(error){ 
         console.log(error)
      }
    };

  useEffect(() => { 
     console.log(messages)
  },[messages])

 // toggle functionality here
  const togconvo = (e) => {
    e.preventDefault();
    setNewconvo(newc => !newc);
  };

  const handle_file_change = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setFileName(file); 
  
    const reader = new FileReader();
    reader.onload = () => {
      setDisplayer(reader.result); 
    };
    reader.readAsDataURL(file); 
  };
  

  useEffect(() => { 
    console.log(fileName)
 },[fileName])

async function update_photo() { 
  const senderId = window.sessionStorage.getItem('user').toString();
   
  const formData = new FormData()
     formData.append("profile", fileName);
        formData.append("senderId", senderId);
          formData.append("bio", bio);  

  if(senderId) { 
    try{
      const res = await axios.patch(`https://server-service-t3fu.onrender.com/client/update/`, formData, {
        headers: {
            'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
        }
      });
      console.log(res.data)
    } 
    catch(error){ 
       console.log(error)
    }
  }
}; 

async function get_user_photo() {
  const senderId = window.sessionStorage.getItem('user').toString();

  try {
    const res = await axios.get(`https://server-service-t3fu.onrender.com/client/api/images/`, {
      params: { senderId }, 
      headers: {
        'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
      }
    });

    console.log(res.data);
    setImage(res.data);
  } catch (error) {
    console.log(error);
  }
}


useEffect( () =>{
  async function get_user_photo() {
    const senderId = window.sessionStorage.getItem('user').toString();
  
    try {
      const res = await axios.get(`https://server-service-t3fu.onrender.com/client/api/images/`, {
        params: { senderId },  
        headers: {
          'authorization': `Bearer ${window.sessionStorage.getItem('chat-token')}`
        }
      });
  
      console.log(res.data);
      setImage(res.data);  
    } catch (error) {
      console.log(error);
    }
  }
  
  get_user_photo()
}, []) 

const SearchedData = searchTerm
  ? convo.filter(item =>
      item.firstname?.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
  : []
console.log(SearchedData)

  return ( 
    <>
      <div className="bg-gray-200 w-full h-screen p-5">
        <div className="bg-white w-full h-full rounded-lg p-3 flex flex-col md:flex-row">
          <aside className="bg-white w-full md:w-20 h-full md:h-full p-3 flex flex-row md:flex-col justify-between">
            <div>
              <button className="bg-white w-10 h-10 pt-4">
                <img src="./meetme.png" alt="chaticon" />
              </button>
            </div>

            <div className="flex flex-row md:flex-col items-center space-y-0 md:space-y-4 space-x-4 md:space-x-0">
              <button className="bg-white w-7 h-7 pt-4">
                <img src="./notification.png" alt="notification"  onClick={()=>{ setIsOpen(true)}}/>
              </button>
            
              <button className="bg-white w-10 h-10 pt-4"  onClick={()=>{ setIsOpen(true)}}>
                <img src="./chat-bubbles-with-ellipsis.png" alt="chat-bubbles" />
              </button>
              <button className="bg-white w-8 h-8 pt-4" onClick={()=>{ setIsOpen(true)}} >
                <img src="./phone.png" alt="phone" />
              </button>
            </div>
                  <div className=" h-32 w-32"> 
                      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className={`${ isOpen ? 'relative z-50' : 'hidden'}`}>
                          {/* Backdrop */}
                          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

                          {/* Modal wrapper to center */}
                          <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                              <Dialog.Title className="text-lg font-bold">Oops! Feature Not Available Yet</Dialog.Title>
                              <p>Thank you for checking this out! Unfortunately, this feature isn't ready yet. In the meantime, you can explore other sections of the app.</p>
                              <button onClick={() => setIsOpen(false)} className="mt-4 bg-purple-800 text-white px-4 py-2 rounded hover:bg-black">
                                Okay, Got it.
                              </button>
                            </Dialog.Panel>
                          </div>
                        </Dialog>
                  </div>
    
            <div className="flex flex-row md:flex-col items-center space-y-0 md:space-y-4 space-x-4 md:space-x-0 pb-6">
              <button className="bg-white w-8 h-8 pt-4">
                <img src="./incorporation.png" alt="incorporation"  onClick={()=>{ setIsOpen(true)}}/>
              </button>
              <button className="bg-white w-8 h-8 pt-4" onClick={()=>{ setIsOpen(true)}}>
                <img src="./gear.png" alt="gear" />
              </button>
            </div>
          </aside>
                 

          <div className="bg-gray-200 w-full h-full rounded-lg mt-4 md:mt-0">
            <div className="flex w-full h-full flex-col md:flex-row space-x-0 md:space-x-2">
              <aside className="bg-gray-200 w-full md:w-1/5 h-1/4 md:h-full rounded-lg border-r-2 border-r-solid border-r-gray-300">
                <div className="p-5 md:p-10"> 

                  <div className={`${searchToggle === false ? 'hidden' : 'flex justify-center'}`}>
                    <button className="flex w-auto h-auto bg-white rounded-md" onClick={togconvo}>
                      <span className="bg-white w-6 h-6 m-2">
                        <img src="./addition.png" alt="addition" />
                      </span>
                      <span className="bg-white w-auto h-6 m-2 px-4 font-medium"> { newconvo ? 'New conversation' : 'Get back to chats'}</span>
                    </button>
                  </div>

                  <div className={ `${newconvo ? 'justify-center m-4' : 'hidden'}`}>
                    <div className="flex justify-between">
                      <h1 className="font-semibold text-xl">Chats</h1>
                      <button className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full h-12 w-12">
                        <img src="./option.png" alt="option" className=""/>
                      </button>
                    </div>
                  </div>

                  <div className={`${newconvo ? 'justify-center m-4 flex space-x-8' : 'hidden'}`}>
                    <div className="bg-gray-300 w-48 h-9 rounded-md "  onClick={()=> { setSearchToggle(false)}}>
                      <input
                        type="text"
                        placeholder="Please enter a name."
                        value={searchTerm}
                        className="bg-gray-300 rounded-md focus:outline-none p2 w-48 h-9 ml-4 focus:w-40"
                        onChange={ (e) => { setSearchTerm(e.target.value)}}
                        onClick={()=> { setSearchToggle(false)}}
                      />
                    </div> 
                      { searchTerm === "" 

                      }
                     <button className={`${searchTerm === "" && searchToggle ? "hidden" : " space-x-7 font-medium"}`} onClick={async () => {setSearchTerm(prev => ""); setSearchToggle(true);} }> 
                     Cancel 
                     </button>
                  </div>

                  {/* Users section */}
                  <div className={`${newconvo && searchToggle === true ? 'newconvo space-y-4 h-[650px] overflow-y-scroll scrollbar-hide' : 'hidden'}`}>

                    {convo.map((convos, index) => (
                      <div key={convos._id} className="flex items-center p-3 border-b-2 border-b-gray-300 hover:bg-white rounded-md" onClick={async () => {
                        getFilterChats(convos._id);
                        await getconversationid(convos._id); 
                        getMessage();
                      }}
                      >
                        <img
                          className="object-cover object-center h-12 w-12 rounded-full border-2"
                          src= {convos.photo === "" ? "user.png" : `https://server-service-t3fu.onrender.com/uploads/${convos.photo}`} 
                          alt="person"
                        />
                        <div className="ml-2" >
                          <span className="font-medium text-base">{convos.firstname} {convos.lastname}</span>
                          <br />
                          <span className="text-sm text-gray-500">{convos.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>  


                  {/* searchtoggle div */}
                  
                  <div className={`${searchToggle ? 'hidden'  : 'newconvo space-y-4 h-[650px] overflow-y-auto scrollable'}`} onClick={()=> { setSearchToggle(true)}}>

                        {SearchedData.map((SearchedDatas, index) => (
                          <div key={SearchedDatas._id} className="flex items-center p-3 border-b-2 border-b-gray-300 hover:bg-white rounded-md" onClick={async () => {
                            await setSearchTerm(prev => ""); 
                            getFilterChats(SearchedDatas._id);
                            await getconversationid(SearchedDatas._id); 
                            getMessage();
                          }}
                          >
                            <img
                              className="object-cover object-center h-12 w-12 rounded-full border-2"
                              src= {SearchedDatas.photo === "" ? "user.png" : `https://server-service-t3fu.onrender.com/uploads/${SearchedDatas.photo}`} 
                              alt="person"
                            />
                            <div className="ml-2" >
                              <span className="font-medium text-base">{SearchedDatas.firstname} {SearchedDatas.lastname}</span>
                              <br />
                              <span className="text-sm text-gray-500">{SearchedDatas.email}</span>
                            </div>
                          </div>
                        ))}
                        </div> 

                  {/* for finding users */}
                  <div> 
                    <div className={` ${newconvo ? 'hidden' : 'justify-center mt-2'} `}>
                    <div className="flex items-center bg-gray-300 h-9 rounded-md overflow-hidden px-2 max-w-xl transition-all duration-300">
                              <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                placeholder="Please start your search."
                                className={`bg-gray-300 focus:outline-none h-full transition-all duration-300 ${
                                  firstname.trim().length > 0 ? 'flex-grow w-2/3' : 'flex-grow w-full'
                                }`}
                              />
                              <button
                                onClick={searchName}
                                className={`${firstname.trim().length > 0 ? 'w-20 h-7 font-medium bg-gray-200 border border-black rounded-md flex flex-col items-center justify-start text-black'  : 'hidden'
                                }`}
                              >
                                Search
                              </button>
                            </div>
                    </div> 

                    <div className={`${newconvo ? 'hidden' : 'newconvo space-y-4 h-[650px] overflow-y-auto'}`}>
                          
                              

                         {search.length > 0 ?
                                            search.map((searchs, index) => {
                                              return (
                                                <div key={index} className="flex items-center p-3 border-b-2 border-b-gray-300 hover:bg-white rounded-md" onClick={async () => { 
                                                  await createConversation(searchs._id); getConversation(); setSearch([]);
                                                }} >
                                                  <img
                                                    className="object-cover object-center h-12 w-12 rounded-full border-2"
                                                    src={searchs?.photo === "" ? 'user.png' : `https://server-service-t3fu.onrender.com/uploads/${searchs?.photo}`} 
                                                    alt="man"
                                                  />
                                                  <div className="ml-2" >
                                                    <span className="font-medium text-base">{searchs.firstname} {searchs.lastname} </span>
                                                    <br />
                                                    <span className="text-sm text-gray-500">{searchs.email}</span>
                                                  </div>
                                                </div>
                                              );
                                            })
                                            :    <div> 
                                
                               <div className="p-5 rounded-lg max-w-md font-sans">
                                  <h2 className="text-2xl font-medium mb-2">Looking for someone?</h2>
                                  <br />
                                  <p className="font-normal">
                                    Start building your circle when you find and connect with friends. Just type in their name, username, or email.
                                  </p>
                                </div>
                              </div> 
                          }
                                                 
                     
                    </div> 
                  </div>
                </div>
              </aside>

              {/* Conversation section */}
              <aside className="bg-gray-200 w-full md:w-3/5 h-2/4 md:h-full rounded-md border-r-2 border-gray-300 relative">
               <div className={`${ convod.length > 0 ? 'h-full flex flex-col justify-between' : 'h-full flex flex-col justify-center items-center'}`}>
  {!convod.length > 0 ? (
    <div className="p-5 rounded-lg max-w-md font-sans justify-center items-center">
      <h2 className="text-2xl font-medium mb-2  text-gray-600">Tap into any conversation here.</h2>
      <br />
      <p className="font-normal text-gray-600">
        When you select a chat, this is where the magic happens. Send messages, share photos, voice notes, or even emojis—your full conversation experience all right here.
      </p>
    </div>
  ) : (
    <>
      <div className="p-4">
        {/* Conversation List */}
        <div className="flex bg-white p-3 rounded-lg flex-row justify-between">
          {convod.length > 0 &&
            convod.map((convodd) => (
              <div className="flex" key={convodd._id}>
                <img
                  src={convodd.photo === "" ? 'user.png' : `https://server-service-t3fu.onrender.com/uploads/${convodd.photo}`}
                  className="object-cover object-center h-10 w-10 rounded-full border-2"
                  alt="profile"
                />
                <span className="text-xl pt-1 ml-2">{convodd.firstname} {convodd.lastname}</span>
                {onlineUsers.some(user => user.senderId === convodd._id) ? (
                  <span className="text-green-500 text-lg font-medium pt-1 ml-2">Online</span>
                ) : (
                  <span className="text-gray-500 text-lg font-medium pt-1 ml-2">Offline</span>
                )}

                {typingStatus.length > 0 &&
                  typingStatus
                    .filter((Typingstats) => Typingstats.sender !== senderId && Typingstats.conversation === conversationID)
                    .map((TypingStat) => (
                      <div key={TypingStat.sender}>
                        <span className={`${typingStatus.length > 0 && TypingStat.sender !== senderId ? 'text-gray-500 text-lg font-medium pt-3 ml-2 animate-pulse' : 'hidden'}`}>
                          Typing....
                        </span>
                      </div>
                    ))}
              </div>
            ))}
          <div className="flex m-1 justify-end">
            <button className="bg-white w-7 h-7">
              <img src="./arrow.png" alt="arrow" />
            </button>
          </div>
        </div>

        <div className="relative flex flex-col p-4 space-y-4 max-h-[710px] overflow-y-scroll scrollbar-hide">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-1 w-auto h-auto rounded-md shadow-lg max-w-[400px] text-wrap ${
                message.sender === senderId ? "bg-purple-700 text-white self-end" : "bg-white self-start"
              }`}
            >
              <p className="text-sm leading-snug max-w-[600px] break-words overflow-hidden">{message.context}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 flex justify-between">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          className={`w-full px-4 py-2 rounded-lg`}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => { TypingStatus(senderId); }}
          onBlur={() => { HideStatus(senderId); }}
        />
        <button
          className={`${message.trim().length > 0 ? 'ml-4 bg-black text-white px-4 py-2 rounded-md' : 'hidden'}`}
          onClick={() => { sendMessage(); sendmsg(); HideStatus(senderId); }}
        >
          Send
        </button>
      </div>
    </>
  )}
</div>

              </aside> 
              <aside className="bg-gray-200 w-1/5 h-full rounded-md content-center"> 
    
              
     <div className="flex justify-center items-center">
  {pictureUpdates === false ? (
    // Profile with Camera Icon
    <div className="bg-white h-64 w-72 flex flex-col items-center justify-center rounded-lg mt-3">
      <div className="flex justify-center">
        <div className="relative w-40 h-40 mt-3">
        {image &&
            <img
              key={image?._id} 
              src={image?.photo === "" ? 'user.png' : `https://server-service-t3fu.onrender.com/uploads/${image?.photo}`} 
              alt="Tony Montaro"
              className="rounded-full w-full h-full object-cover"
            />
        }
          <div
            className="absolute top-1/2 left-full -ml-[30px] border border-gray-300 rounded-[30px] p-2 inline-flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-md hover:bg-black"
            style={{ transform: "translateY(calc(-50% + 30px))" }}
          >
            {/* Camera Icon Button */}
          
            <label htmlFor="file-uploadd" className="cursor-pointer">
                <input id="file-uploadd" type="file" className="hidden"  onChange={(e) => {
                           setPictureUpdates(prev => !prev); 
                           handle_file_change(e);
                            
                          }} />
                  <div 
                          className="flex justify-center items-center hover:bg-black rounded-md"
                        >
                          <CameraPlus size={24} weight="regular" className="hover:text-white"/>   
                        </div>
                      </label>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        { image && 
              <h5 className="text-lg font-semibold text-gray-700">{image.firstname} {image.lastname}</h5>
        }
      </div>

      <div className="flex justify-center">
        { image && 
             <p className="text-gray-400 text-sm">{image.Bio}</p>
        }
       
      </div>
    </div>
  ) : (
    // Profile with Input Field
    <div className="w-86 h-86 mt-3 bg-white shadow-sm rounded-md p-3 flex flex-col items-center justify-start">
      {/* Profile Picture */}
      <div className="w-32 h-32 rounded-full bg-white overflow-hidden mt-3">
      <label htmlFor="file-upload" className="cursor-pointer">
         <input id="file-upload" type="file" className="hidden" onChange={handle_file_change} />

        <img 
          src={!displayer && 'user.png'}   alt="Profile" className="w-full h-full object-cover" 
        />
        </label>
      </div>

      {/* Input Field */}
      <div className="w-72 mt-8">
  <Input 
    type="text" 
    placeholder="Enter at least 30 characters" 
    minLength={30} 
    maxLength={30}
    value={bio} 
    onChange={(e) => setBio(e.target.value)}
  />
</div> 

   <div className="mt-4 flex flex-row justify-between space-x-4"> 
      <button className=" w-20 h-7 font-medium bg-black shadow-sm rounded-md flex flex-col items-center justify-start text-white hover:bg-black"
       onClick={async (e) => {
        e.preventDefault();
        await update_photo();
        await get_user_photo();
        setPictureUpdates(prev => !prev);
      }}> 
           Update
      </button>
      <button className="w-20 h-7 font-medium bg-white border border-black shadow-sm rounded-md flex flex-col items-center justify-start text-black" 
      onClick={() => { setPictureUpdates(prev => !prev); }}> 
          Cancel
      </button>
   </div>

    </div>
  )}
</div>

     
  </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
