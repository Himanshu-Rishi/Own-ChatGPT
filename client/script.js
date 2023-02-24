import bot from "./assets/bot.png";
import user from "./assets/programmer.png";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
const textarea = document.querySelector('textarea');
let preloader = document.getElementById("preloader");

let loadInterval;

// window.addEventListener("load", function()
// {
//   setInterval(() => {
//     preloader.style.display = "none";
//   }, 1050);
// })

function waiting_loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function animated_text(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function token() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chat_identifier(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                      class="chat_profile"
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  if(textarea.value.trim())
  {
    const data = new FormData(form);
    chatContainer.innerHTML += chat_identifier(false, data.get("prompt"));
    form.reset();
    const uniqueId = token();
    chatContainer.innerHTML += chat_identifier(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);
    waiting_loader(messageDiv);
  
    const response = await fetch("https://godseyebackend.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.get("prompt"),
      }),
    });
    clearInterval(loadInterval);
    messageDiv.innerHTML = ' '
    if(response.ok)
    {
      const data = await response.json();
      const parsed_data = data.bot.trim();
      animated_text(messageDiv, parsed_data)
    }
    else
    {
      const err= await response.text();
      messageDiv.innerHTML = "Something went wrong...";
      alert(err);
    }
  }

};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
