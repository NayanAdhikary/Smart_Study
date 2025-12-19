import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { FaPaperPlane, FaRobot } from 'react-icons/fa'; // Fallback icon
import logo from '../assets/study-ai-logo.svg';
import './PredictorPage.css';

function PredictorPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      { sender: 'bot', text: 'Hello! I am your AI Study Partner. 🧠\n\nI can predict import questions for your exams. To get started, please tell me your *Course* (e.g., BCA, MCA, B.Tech).' }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBotResponse = async (userInput) => {
    const userText = userInput.toLowerCase();

    // Simulate thinking state
    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    try {
      // First acknowledgment
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `Analyzing database for ${userText.toUpperCase()}... 📊\n\nConnecting to ML Model...`
      }]);

      await delay(800);

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userInput })
      });

      const data = await response.json();

      if (response.ok && data.questions) {
        // Check if data is structured (Has 'high_probability')
        if (data.questions.high_probability) {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: '', // Empty text, will render 'data' 
            data: data.questions
          }]);
        } else if (Array.isArray(data.questions)) {
          // Fallback for flat array (or error message)
          let questionText = "";
          if (data.questions.length > 0 && (typeof data.questions[0] === 'string' && (data.questions[0].startsWith("Error") || data.questions[0].startsWith("No specific")))) {
            questionText = data.questions[0];
          } else if (data.questions.error) {
            questionText = data.questions.error;
          } else {
            questionText = data.questions.map((q, i) => {
              if (typeof q === 'object') {
                return `**Q${q.question_number}. ${q.question_template}**\n   *(Topic: ${q.topic} | Difficulty: ${q.difficulty} | Points: ${q.expected_points})*`;
              }
              return `${i + 1}. ${q}`;
            }).join("\n\n");
          }
          const predictionText = `Here are the results from the ML Model for ${userInput}:\n\n` + questionText;
          setMessages(prev => [...prev, { sender: 'bot', text: predictionText }]);
        } else if (data.questions.error) {
          setMessages(prev => [...prev, { sender: 'bot', text: data.questions.error }]);
        }

      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: "I couldn't find specific predicted questions for that topic. Please try keywords like 'AI', 'DBMS', 'Java', 'Networking'." }]);
      }

    } catch (error) {
      console.error("Prediction Error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Error connecting to the study brain. Please make sure the backend is online." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    handleBotResponse(inputValue);
    setInputValue('');
  };

  return (
    <div className="predictor-page-wrapper">
      <Navbar />
      <main className="predictor-content">
        <div className="chat-container">

          <div className="chat-header">
            <span role="img" aria-label="robot" style={{ fontSize: '1.5rem' }}>🤖</span>
            <h3>Exam Question Predictor</h3>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.sender}-wrapper`}>
                {msg.sender === 'bot' && (
                  <div className="bot-avatar">
                    <img src={logo} alt="Bot" style={{ width: '100%', height: '100%' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '🤖' }} />
                  </div>
                )}
                <div className={`message ${msg.sender}`}>
                  {/* Check if msg.data exists (Structured ML output) */}
                  {msg.data ? (
                    <div className="ml-results">
                      <h4>📊 Analysis Results for {msg.data.subject}</h4>

                      <div className="probability-section">
                        <h5>🔥 High Probability Topics (Must Study)</h5>
                        <ul>
                          {msg.data.high_probability?.map((item, i) => (
                            <li key={i}>
                              <span className="topic-name">{i + 1}. {item.topic}</span>
                              <span className="topic-score">{item.score}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="probability-section medium">
                        <h5>⚠️ Medium Probability Topics (Important)</h5>
                        <ul>
                          {msg.data.medium_probability?.map((item, i) => (
                            <li key={i}>
                              <span className="topic-name">{i + 1}. {item.topic}</span>
                              <span className="topic-score">{item.score}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="recommendations-section">
                        <h5>💡 Study Recommendations</h5>
                        {msg.data.recommendations?.map((rec, i) => (
                          <div key={i} className="recommendation-card">
                            <strong>{rec.title}</strong>
                            <p>Topics: {rec.topics}</p>
                            <p>Reason: {rec.reason}</p>
                          </div>
                        ))}
                      </div>

                      <div className="questions-section">
                        <h5>📝 Sample Practice Questions</h5>
                        {msg.data.sample_questions?.map((q, i) => (
                          <div key={i} className="question-card">
                            <p><strong>Q{i + 1}.</strong> {q.question}</p>
                            <div className="q-meta">
                              <span>Topic: {q.topic}</span> | <span>Points: {q.points}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : (
                    msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line || <br />}</p>
                    ))
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message-wrapper bot-wrapper">
                <div className="bot-avatar">🤖</div>
                <div className="message bot typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for predictions (e.g., 'BCA 3rd Sem DBMS')..."
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="send-btn" disabled={isLoading || !inputValue.trim()}>
              <FaPaperPlane />
            </button>
          </form>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PredictorPage;