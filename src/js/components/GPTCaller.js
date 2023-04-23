const API_KEY = "poopybutthole";

const callGPT = async (text) => {
    const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Bearer': 'Bearer ' + API_KEY,
        },
        body: JSON.stringify({
            prompt: text,
            max_tokens: 5,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["\n", " Human:", " AI:"]
        })
    });
    const data = await response.json();
    return data;
}

export const beautify = async (text) => {
    await new Promise(r => setTimeout(r, 1000));
    
    return "<p>Text</p>";
}

export const askQuestion = async (text) => {

    //wait 1000ms to simulate a call to the GPT-3 API
    await new Promise(r => setTimeout(r, 1000));

    return "<p>"+text+"</p>";
}

export const fillBlanks = async (html) => {
    await new Promise(r => setTimeout(r, 1000));

    return html + "<p>Text</p>";
}



