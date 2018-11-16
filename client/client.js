/**************************************
 *      Joice Andrea Miranda
 *      Carnet 15552
 ***************************************/


/*
*               REFERENCIAS
*https://www.youtube.com/watch?v=tVQgfKqbX3M
*https://www.w3schools.com/js/js_htmldom_nodes.asp
*https://stackoverflow.com/questions/14380442/make-one-section-of-simple-web-page-have-own-scroll-bar
*/
const url = 'http://34.210.35.174:7000/'; 
const messages ="";
const chat = document.querySelector(".chat")
const nick= document.querySelector(".nick")
const name=document.querySelector(".name")
const id=document.querySelector(".id")
const text = document.querySelector(".message")
var socket = io.connect("http://localhost:8080", {'forceNew':true});
var id_ver= id.value

const btnsend = document.querySelector("#btnSend").addEventListener("click",function(){
   sendMessage(id.value, nick.value, text.value) 
})

function showPosts(){
    console.log("showPost")
    socket.on('old_messages', function(val){
        console.log('resolve')
        console.log(val)
        val.forEach(function(element) {
            var parraf= document.createElement("p"); 
            var strong= document.createElement("strong"); 
            var strongText=document.createTextNode(element.nick+ ": ")
            var text= document.createTextNode(element.text);
            strong.appendChild(strongText);
            parraf.appendChild(strong);
            parraf.appendChild(text);
            chat.appendChild(parraf);    
        })
    chat.scrollTop = chat.scrollHeight;
    })
}

function newMessage(){
    socket.on('new_message', function(val){
        if (id.value ===val.student_id){
            var parraf= document.createElement("p"); 
            var strong= document.createElement("strong"); 
            var strongText=document.createTextNode(val.nick+ ": ")
            var text= document.createTextNode(val.text);
            strong.classList.add("mystyle");
            strong.appendChild(strongText);
            parraf.appendChild(strong);
            parraf.appendChild(text);
            chat.appendChild(parraf);

        }else{
            var parraf= document.createElement("p"); 
            var strong= document.createElement("strong"); 
            var strongText=document.createTextNode(val.nick+ ": ")
            var text= document.createTextNode(val.text);
            strong.appendChild(strongText);
            parraf.appendChild(strong);
            parraf.appendChild(text);
            chat.appendChild(parraf);
        }
   
        chat.scrollTop = chat.scrollHeight;
    })
}


function sendMessage(id, nick, text_string){

    console.log(id)
    console.log(nick)
    console.log(text_string)

    if (text_string === "") {
		alert('No hay mensaje');
		return;
    }
    if (text_string.length>140) {
        alert('Tu mensaje debe ser menor de 140 caracteres');
        return;
    }

    if (id === "") {
        alert('Debes ingresar un id');
        return;
    }

    if (nick==="") {
        alert('Debes ingresar un nickname');
        return;
    }

      let datos= {
        "id": id,
        "nick": nick,
        "text":text_string
      }

      console.log("tratando de enviar con socket")
      console.log(datos)
      socket.emit("send_message", JSON.stringify(datos))
      showPosts()
  }

showPosts()
newMessage()

