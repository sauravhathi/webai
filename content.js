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

// Create a container for the chat UI
const chatContainer = document.createElement("div");
chatContainer.id = "chat-container";
document.body.appendChild(chatContainer);

const topBar = document.createElement("div");
topBar.id = "top-bar";
chatContainer.appendChild(topBar);

// accessk key
const accessKey = document.createElement("input");
accessKey.id = "access-key";
accessKey.placeholder = "Access Key";
topBar.appendChild(accessKey);

// Create an engine selection dropdown
const engineSelect = document.createElement("select");
engineSelect.id = "engine-select";
engineSelect.innerHTML = `
  <option value="gpt3" selected>GPT-3</option>
  <option value="bard">Bard</option>
`;
topBar.appendChild(engineSelect);

// Create a chat area
const chatMessages = document.createElement("div");
chatMessages.id = "chat-messages";
chatContainer.appendChild(chatMessages);

// Create a user input field
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

// Create a loading indicator
const loadingIndicator = document.createElement("div");
loadingIndicator.id = "loading-indicator";
loadingIndicator.innerHTML = "Loading...";
chatMessages.append(loadingIndicator)

// Add event listeners for the buttons
sendButton.addEventListener("click", () => {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();
    if (message) {
        // get hegit text areta then add padding bottm of chat-messages
        const inputHeight = document.getElementById("message-input").scrollHeight;
        const padding = inputHeight;
        chatMessages.style.paddingBottom = padding + 50 + "px";
        addChatMessage(message, true);
        messageInput.value = "";
        sendMessageToChatbot(message);
    }
});

let loading = false; // Add this variable to track loading state

async function sendMessageToChatbot(message) {
    if (loading) {
        return; // Do nothing if already loading
    }

    loading = true;
    sendButton.disabled = true; // Disable the send button during loading
    inputField.disabled = true; // Disable the input field during loading

    // Show the loading indicator
    loadingIndicator.style.display = 'block';

    // Add the loading-active class to the chat container when loading starts
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
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Chatbot API request failed");
        }

        const responseData = await response.json();
        const botReply = responseData.data;
        addChatMessage(botReply, false);

        // Scroll down to the latest message with smooth scrolling
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth',
        });
    } catch (error) {
        console.error("Error sending message to the chatbot:", error);
    } finally {
        loading = false;
        sendButton.disabled = false; // Enable the send button
        inputField.disabled = false; // Enable the input field

        // Hide the loading indicator
        loadingIndicator.style.display = 'none';

        // Remove the loading-active class from the chat container when loading is completed

        chatContainer.classList.remove("loading-active");

        // Scroll down to the latest message after the API call is completed
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth',
        });
    }
}

// Function to add a chat message to the chat area
function addChatMessage(message, isUser) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(isUser ? "user-message" : "bot-message");
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
}