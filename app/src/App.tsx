import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, TextareaAutosize, Box, Divider, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledTextareaAutosize = styled(TextareaAutosize)({
  width: '100%',
  marginTop: '20px',
  fontSize: '18px',
  borderRadius: '5px',
  border: '1px solid gray',
  resize: 'none',
  '&:focus': {
    outline: 'none',
    border: '1px solid #2196f3',
  }
});

/**
* Chat history
*/
interface ChatMessage {
  question: string
  answer: string
}

/**
* fetch an answer from ChatGPT API with sending question
* @param inputText Question sentence
* @param chats Chat histories
* @returns Answer sentence
*/
async function fetchChatGPTResult(inputText: string, chats: ChatMessage[]): Promise<string> {
  try {
    const messageList: { 'role': string, 'content': string }[] = [];
    chats.forEach(c => {
      messageList.push({ 'role': 'user', 'content': c.question });
      messageList.push({ 'role': 'assistant', 'content': c.answer });
    })
    messageList.push({ 'role': 'user', 'content': inputText });

    const response = await axios.post(`https://api.openai.com/v1/chat/completions`, {
      // GPT model
      model: 'gpt-3.5-turbo',

      // Question and Answer
      messages: messageList
    }, {
      // Authorization
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      }
    });
    // Send to ChatGPT API
    const result = response.data.choices[0].message.content;
    return result;
  } catch (error) {
    console.error(error);
    return "error";
  }
}

const App = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = async () => {
    setLoading(true);
    const result = await fetchChatGPTResult(inputText, chatMessages);
    setOutputText(result);
    const newMessage: ChatMessage = { question: inputText, answer: result };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
    setLoading(false);
  };

  const convert = (message: string): string => {
    const text = message.replace(/```([\s\S]+?)```/g, (match, p1) => {
      return `<pre style="background: black; color: white;"><code class="${match}">${p1.trim()}</code></pre>`;
    });
    return text;
  }
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            ChatGPT Console
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ p: 1.5 }}>
        <Typography sx={{ mt: 1.0 }} variant="h4" align="left" gutterBottom>
          ChatGPT
        </Typography>
        <Typography sx={{ mt: 1.0 }} variant="body1" gutterBottom>
          The AI will respond to your questions.
        </Typography>
        <div>
          {chatMessages.map((message, index) => (
            <div key={index}>
              <Box sx={{ borderRadius: '4px 8px 8px 4px', bgcolor: 'aliceblue', mt: 0.5, p: 2, overflowWrap: 'break-word' }}>
                <Typography variant="caption">
                  Q{index + 1}. {message.question}
                </Typography>
              </Box>
              <Box sx={{ borderRadius: '4px 8px 8px 4px', bgcolor: 'lightyellow', mt: 0.5, p: 2, overflowWrap: 'break-word' }}>
                <Typography
                  variant="caption"
                  dangerouslySetInnerHTML={{ __html: `<pre><code>A${index + 1}.${convert(message.answer)}</code></pre>` }}
                />
              </Box>
            </div>
          ))}
        </div>
        <Divider sx={{ p: 1.0 }} />
        <div>
          <Box sx={{ mt: 0.5, p: 0.5 }}>
            <StyledTextareaAutosize
              minRows={5}
              maxRows={10}
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter text here" nonce={undefined} onResize={undefined} onResizeCapture={undefined}            />
            {
              isLoading ? (
                <CircularProgress />
              ) : (
                <Button variant="contained" color="primary" onClick={handleButtonClick} style={{ marginTop: '20px' }}>
                  Send
                </Button>
              )}
          </Box>
        </div>
      </Container>
    </div>
  );
}

export default App;