// InsightBuddy frontend logic
document.addEventListener('DOMContentLoaded', () => {
  // Application state
  let currentMode = 'ask';
  let currentLevel = 'easy';
  let selectedTopicId = null;

  // DOM references
  const modeButtons = document.querySelectorAll('.mode-btn');
  const difficultySelect = document.getElementById('difficulty');
  const topicListEl = document.getElementById('topics');
  const chatArea = document.getElementById('chat-area');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');

  // Sample topic data to mirror backend JSON
  const topics = [
    { id: 'phy_gravity', title: 'Gravity Basics', description: 'Why objects fall' },
    { id: 'bio_cells', title: 'Cells 101', description: 'Building blocks of life' },
    { id: 'math_linear', title: 'Linear Equations', description: 'Solve for x' },
    { id: 'chem_states', title: 'States of Matter', description: 'Solid, liquid, gas' }
  ];

  // Render the topic list in the sidebar
  function renderTopics() {
    topics.forEach(topic => {
      const li = document.createElement('li');
      li.className = 'topic-item';
      li.dataset.id = topic.id;
      li.innerHTML = `<h3>${topic.title}</h3><p>${topic.description}</p>`;
      li.addEventListener('click', () => selectTopic(topic.id, li));
      topicListEl.appendChild(li);
    });
  }

  // Highlight active topic and store selection
  function selectTopic(topicId, element) {
    selectedTopicId = topicId;
    document.querySelectorAll('.topic-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
  }

  // Update mode state and button styles
  function setMode(mode) {
    currentMode = mode;
    modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  }

  // Update difficulty selection
  function setDifficulty(level) {
    currentLevel = level;
  }

  // Append user message bubble to chat
  function appendUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'message user';
    bubble.innerHTML = `<div class="bubble">${text}</div>`;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Append AI message bubble to chat
  function appendAiMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'message ai';
    bubble.innerHTML = `
      <div class="avatar-placeholder">IB</div>
      <div class="bubble">${text}</div>
    `;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Send message to backend based on current mode
  async function sendMessage(message) {
    const endpointMap = {
      ask: 'ask',
      topic: 'explain_topic',
      quiz: 'quiz'
    };
    const endpoint = endpointMap[currentMode];

    const payload = {
      message,
      topicId: selectedTopicId,
      mode: currentMode,
      level: currentLevel
    };

    try {
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      appendAiMessage(data.reply || 'Here is your quiz data! Check console.');

      // Basic handling for quiz lists
      if (currentMode === 'quiz' && data.quiz) {
        appendAiMessage(
          data.quiz
            .map(
              (q, index) =>
                `<strong>Q${index + 1}:</strong> ${q.question}<br/>${q.options
                  .map(opt => `• ${opt}`)
                  .join('<br/>')}`
            )
            .join('<br/><br/>')
        );
      }
    } catch (error) {
      appendAiMessage('Oops! Something went wrong. Please try again.');
      console.error(error);
    }
  }

  // Event listeners
  modeButtons.forEach(btn =>
    btn.addEventListener('click', () => setMode(btn.dataset.mode))
  );

  difficultySelect.addEventListener('change', event =>
    setDifficulty(event.target.value)
  );

  chatForm.addEventListener('submit', event => {
    event.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
s
    appendUserMessage(text);
    sendMessage(text);
    userInput.value = '';
  });

  // Initialize UI
  renderTopics();
  setMode('ask');
  setDifficulty('easy');
  appendAiMessage('Hello! I am InsightBuddy. Select a mode and ask me anything.');
});


