
console.log('👨‍💻 Author: Saurav Hathi \n🌟 GitHub: https://github.com/sauravhathi \n🚀Linkedin: https://www.linkedin.com/in/sauravhathi');

document.addEventListener("keydown", (e) => {
    if ((e.altKey && (e.key === "x" || e.key === "c")) || (e.ctrlKey && e.shiftKey)) {
        const chatContainer = document.getElementById("chat-container");
        if (chatContainer.classList.contains("hidden")) {
            chatContainer.classList.remove("hidden");
        }
        else {
            chatContainer.classList.add("hidden");
        }
    }
});

const chatContainer = document.createElement("div");
chatContainer.id = "chat-container";

function watchForElement() {
    const observer = new MutationObserver(function (mutations) {
        const parent = document.querySelector("div[aria-labelledby='each-type-question']");
        if (parent) {
            parent.appendChild(chatContainer);
            observer.disconnect();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
}


const topBar = document.createElement("div");
topBar.id = "top-bar";
chatContainer.appendChild(topBar);

const accessKey = document.createElement("input");
accessKey.id = "access-key";
accessKey.placeholder = "Access Key";
accessKey.value = localStorage.getItem("accessKey") || "access-key";
topBar.appendChild(accessKey);

const engineSelect = document.createElement("select");
engineSelect.id = "engine-select";
engineSelect.innerHTML = `
  <option value="gpt3" selected>GPT-3</option>
  <option value="bard">Bard</option>
`;
topBar.appendChild(engineSelect);

const chatMessages = document.createElement("div");
chatMessages.id = "chat-messages";
chatContainer.appendChild(chatMessages);

const userInput = document.createElement("div");
userInput.id = "user-input";
chatContainer.appendChild(userInput);

const inputField = document.createElement("textarea");
inputField.type = "text";
inputField.id = "message-input";
inputField.placeholder = "Type your message...";
inputField.scrollTo({
    top: chatMessages.scrollHeight,
    behavior: 'smooth',
});
userInput.appendChild(inputField);

const sendButton = document.createElement("button");
sendButton.id = "send-button";
sendButton.textContent = "Send";
userInput.appendChild(sendButton);

const loadingIndicator = document.createElement("div");
loadingIndicator.id = "loading-indicator";
loadingIndicator.innerHTML = "Loading...";
chatMessages.append(loadingIndicator)

function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();
    if (message) {

        if (accessKey.value === "") {
            alert("Please enter your access key");
            return;
        }

        localStorage.setItem("accessKey", accessKey.value);

        const inputHeight = document.getElementById("message-input").scrollHeight;
        const padding = inputHeight;
        chatMessages.style.paddingBottom = padding + 50 + "px";
        addChatMessage(message, true);
        messageInput.value = "";
        sendMessageToChatbot(message);
    }
}

inputField.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

sendButton.addEventListener("click", () => {
    sendMessage();
});

let loading = false;

async function sendMessageToChatbot(message) {
    if (loading) {
        return;
    }

    loading = true;
    sendButton.disabled = true;
    inputField.disabled = true;

    loadingIndicator.style.display = 'block';
    chatContainer.classList.add("loading-active");

    const apiUrl = "https://web-ai-vuftqw44dq-uc.a.run.app/api/v1/completion";

    const data = {
        prompt: message,
        engine: engineSelect.value,
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessKey.value}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Chatbot API request failed");
        }

        const responseData = await response.json();
        const botReply = responseData.data;
        addChatMessage(botReply, false);

        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth',
        });
    } catch (error) {
        console.error("Error sending message to the chatbot:", error);
    } finally {
        loading = false;
        sendButton.disabled = false;
        inputField.disabled = false;

        loadingIndicator.style.display = 'none';

        chatContainer.classList.remove("loading-active");

        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth',
        });
    }
}

function addChatMessage(message, isUser) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(isUser ? "user-message" : "bot-message");
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
}

watchForElement();

