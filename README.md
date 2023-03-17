# ChatGPTConsole

The WebApp that created React has a chat console using ChatGPT API.

You can ask a new question following the previous question, because of the app keeps chat histories.

In order to use, you need your secret API key that created by OpenAI account setting page.

<img src="https://user-images.githubusercontent.com/14244767/225990099-6e81afb0-0a33-4624-926c-92fdd9507a38.png" width="500px">

## Usage

### Setting

- Open "app/.env" file.

- Write your secret API key in "REACT_APP_OPENAI_API_KEY".


```.env
    REACT_APP_OPENAI_API_KEY="abcdefghijklmn"
```

### Build

       $ docker-compose run --rm app yarn install

### Run 
       $ docker-compose up -d

### How to access 
       http://[IP address]:3000