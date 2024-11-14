const chatDiv = document.getElementById("chat");
const inputForm = document.getElementById("inputForm");
const userInput = document.getElementById("userInput");

// Función para obtener la API Key de las cookies
function getApiKeyFromCookies() {
    const name = "apiKey=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

// Función para guardar la API Key en las cookies
function setApiKeyInCookies(apiKey) {
    const expirationDays = 30;
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = "apiKey=" + apiKey + ";" + expires + ";path=/";
}

// Función para obtener o pedir la API Key
async function getApiKey() {
    let apiKey = getApiKeyFromCookies();
    if (!apiKey) {
        apiKey = prompt("Por favor, introduce tu clave de API de OpenAI:");
        if (apiKey) {
            setApiKeyInCookies(apiKey);
        } else {
            alert("Se necesita una clave de API para continuar.");
        }
    }
    return apiKey;
}

// Función para enviar el mensaje a la API de OpenAI
async function sendMessage(message) {
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const apiKey = await getApiKey();

    if (!apiKey) return;

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const body = JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: message }]
    });

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: body
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;

        // Agrega el mensaje del usuario y la respuesta de ChatGPT al chat
        addMessage("Usuario", message);
        addMessage("ChatGPT", reply);

    } catch (error) {
        console.error("Error:", error);
        addMessage("ChatGPT", "Hubo un problema al conectar con la API.");
    }
}

// Función para agregar un mensaje al chat
function addMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatDiv.appendChild(messageDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Evento de envío del formulario
inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const message = userInput.value;
    sendMessage(message);
    userInput.value = "";
});
