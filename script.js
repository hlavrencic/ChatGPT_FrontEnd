document
  .getElementById('chat-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    addMessage(userInput, 'user-message');
    document.getElementById('user-input').value = '';

    // Show the loading spinner
    toggleLoadingSpinner(true);

    try {
      // Fetch ChatGPT response
      const chatGptResponse = await getChatGptResponse(userInput);
      addMessage(chatGptResponse, 'gpt-message');
    } catch (error) {
      console.error('Error fetching response:', error);
      addMessage(
        'Error: Unable to fetch response. Please try again later.',
        'gpt-message'
      );
    } finally {
      // Hide the loading spinner regardless of success or error
      toggleLoadingSpinner(false);
    }
  });

function addMessage(text, className) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', className);
  messageElement.textContent = text;

  document.getElementById('chat-log').appendChild(messageElement);
  messageElement.scrollIntoView({ behavior: 'smooth' });
}

function toggleLoadingSpinner(show) {
  const spinner = document.getElementById('loading-spinner');
  spinner.style.display = show ? 'block' : 'none';
}

async function getChatGptResponse(userInput) {
  try {
    const response = await fetch('https://api.yourchatgpt.com/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: userInput }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.answer || 'Sorry, there was an issue with the response format.';
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
