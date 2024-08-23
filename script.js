let clickCounter = 0;

document.getElementById('range').addEventListener('input', e => {
  const value = Math.max(0, Math.min(e.target.value, 5)); // Ensure value is between 1 and 5
  const graphContainer = document.querySelector('.graph-container');
  graphContainer.style.setProperty('--rating', value); 

  const emotionText = document.getElementById('emotion-text');
  const submitEmotionButton = document.getElementById('submit-emotion');

  if (value <= 1) {
    emotionText.textContent = "Very Sad";
  } else if (value <= 2) {
    emotionText.textContent = "Sad";
  } else if (value <= 3) {
    emotionText.textContent = "Neutral";
  } else if (value <= 4) {
    emotionText.textContent = "Happy";
  } else if (value <= 5){
    emotionText.textContent = "Very Happy";
  }

  submitEmotionButton.style.display = 'block';
});

document.getElementById('submit-emotion').addEventListener('click', () => {
  const emotion = document.getElementById('emotion-text').textContent;
  const reasonInput = document.getElementById('emotion-reason');
  const submitReasonButton = document.getElementById('submit-reason');

  reasonInput.style.display = 'block';
  submitReasonButton.style.display = 'block';

  // Save emotion without reason first
  saveEmotion({ emotion, reason: '', response: getResponse(emotion) });

  displayMessage("Emotion recorded. You can now add a reason.");
});

document.getElementById('submit-reason').addEventListener('click', () => {
  const reason = document.getElementById('emotion-reason').value.trim();

  if (reason) {
    let emotions = JSON.parse(localStorage.getItem('emotions')) || [];
    const lastEmotion = emotions[emotions.length - 1];
    lastEmotion.reason = reason;
    lastEmotion.response = getResponse(lastEmotion.emotion, reason);

    localStorage.setItem('emotions', JSON.stringify(emotions));
    
    clearForm();
    displayMessage(lastEmotion.response);
    updateEmotionLog();
    clearEmotionTextAfterTimeout();
  } else {
    displayMessage("Please enter a reason before submitting.");
  }
});

document.addEventListener('click', (event) => {
  if (event.pointerType === 'mouse') {
    clickCounter++;
    
    if (clickCounter === 10) {
      document.getElementById('log-container').style.display = 'block';
      updateEmotionLog();
      document.getElementById('remove-all').style.display = 'block';
      clickCounter = 0;
    }
  }
});

document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchend', handleTouch);

let touchStartTime;

function handleTouch(event) {
  if (event.type === 'touchstart') {
    touchStartTime = new Date().getTime();
  } else if (event.type === 'touchend') {
    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - touchStartTime;
    
    if (touchDuration < 300) { // Consider it a tap if less than 300ms
      clickCounter++;
      
      if (clickCounter === 10) {
        document.getElementById('log-container').style.display = 'block';
        updateEmotionLog();
        document.getElementById('remove-all').style.display = 'block';
        clickCounter = 0;
      }
    }
  }
}

document.getElementById('remove-all').addEventListener('click', () => {
  localStorage.removeItem('emotions');
  updateEmotionLog();
  document.getElementById('remove-all').style.display = 'none';
  displayMessage('All emotions removed.');
});

document.getElementById('close-log').addEventListener('click', () => {
  document.getElementById('log-container').style.display = 'none';
});

function saveEmotion(newEmotion) {
  try {
    let emotions = JSON.parse(localStorage.getItem('emotions')) || [];
    newEmotion.date = new Date().toLocaleString();
    emotions.push(newEmotion);
    localStorage.setItem('emotions', JSON.stringify(emotions));
  } catch (error) {
    console.error('Error saving emotion:', error);
    displayMessage('An error occurred while saving the emotion.');
  }
}

function updateEmotionLog() {
  const emotionLog = document.getElementById('emotion-log');
  emotionLog.innerHTML = ''; // Clear existing log
  
  let emotions = JSON.parse(localStorage.getItem('emotions')) || [];
  
  emotions.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${entry.date} - ${entry.emotion}: ${entry.reason || "No reason provided"}`;
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-emotion');
    removeButton.addEventListener('click', () => {
      emotions.splice(index, 1);
      localStorage.setItem('emotions', JSON.stringify(emotions));
      updateEmotionLog();
      if (emotions.length === 0) {
        document.getElementById('remove-all').style.display = 'none';
      }
      displayMessage('Emotion removed.');
    });
    
    li.appendChild(removeButton);
    emotionLog.appendChild(li);
  });

  if (emotions.length === 0) {
    document.getElementById('log-container').style.display = 'none';
  }
}

function getResponse(emotion, reason = '') {
  let response = '';
  switch (emotion) {
    case "Very Sad":
      response = "It's okay to feel sad sometimes. Take a deep breath, you got this!";
      break;
    case "Sad":
      response = "Things will get better, keep your head up.";
      break;
    case "Neutral":
      response = "It's a good day to reflect and find your balance.";
      break;
    case "Happy":
      response = "Keep spreading those good vibes!";
      break;
    case "Very Happy":
      response = "Awesome! Enjoy the moment and keep smiling!";
      break;
  }
  if (reason) {
    response += ` You mentioned: "${reason}". Thank you for sharing.`;
  }
  return response;
}

function displayMessage(message) {
  const feedbackMessage = document.getElementById('feedback-message');
  feedbackMessage.textContent = message;
  feedbackMessage.style.display = 'block';
  
  setTimeout(() => {
    feedbackMessage.style.display = 'none';
  }, 5000);
}

function clearForm() {
  document.getElementById('range').value = 0;
  document.getElementById('submit-emotion').style.display = 'none';
  document.getElementById('emotion-reason').style.display = 'none';
  document.getElementById('submit-reason').style.display = 'none';
  document.getElementById('emotion-reason').value = '';
  document.querySelector('.graph-container').style.setProperty('--rating', 0);
}

function clearEmotionTextAfterTimeout() {
  setTimeout(() => {
    document.getElementById('emotion-text').textContent = '';
  }, 5000); // Wait for messages to disappear before clearing
}