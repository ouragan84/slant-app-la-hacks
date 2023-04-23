const API_KEY = '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'

const beautify_prompt = 
`
I will give you some raw, unformatted text and code, you need to fix all spelling, grammar, and syntax mistakes. Please keep the essence of the text the same, and keep any swear words intact. Add all the text to an HTML-type document. Do not add a header, just the elements that I ask you, wrapped inside a <div> </div> element. Add text that belongs to a section title inside an element of type <h1> text </h1>. Add text that belongs to a section sub-title inside an element of type <h2> text </h2>. Add text that belongs to an unordered list inside an element of type <ul> <li> text 1 </li> <li> text 2 </li> </ul>. Add text that belongs to an ordered list inside an element of type <ol> <li> text 1 </li> <li> text 2 </li> </ol>. Add any code to an element of type <pre> text </pre>. Add any text that belongs inside a normal paragraph to an element of type <p> text <\p>. Add a tag <br/> at any point where the text should return to the next line. Wrap any text in an element <i> text </i> to italicize it. Italicize text to emphasize quotations and important words, and math formulas. Wrap any text in an element <b> text </b> to bold it. Bold text to emphasize very important words. Wrap any text in an element <u> text </u> to underline it. Underline text to emphasize important words. Wrap any text in an element <strike> text </strike> to strike through it. Strike text to show that something is wrong or outdated. Please escape any characters that would break the HTML format.`

const fill_blanks_prompt = `
I will give you some HTML. In some places, there will be symbols like [___]. These symbols act as blank spaces. Replace them and fill in the blanks with information that makes sense from the surrounding text. Return to me the whole edited document. Do not add a header, just the edited HTML. Add text that belongs to a section title inside an element of type <h1> text </h1>. Add text that belongs to a section sub-title inside an element of type <h2> text </h2>. Add text that belongs to an unordered list inside an element of type <ul> <li> text 1 </li> <li> text 2 </li> </ul>. Add text that belongs to an ordered list inside an element of type <ol> <li> text 1 </li> <li> text 2 </li> </ol>. Add any code to an element of type <pre> text </pre>. Add any text that belongs inside a normal paragraph to an element of type <p> text <\p>. Add a tag <br/> at any point where the text should return to the next line. Wrap any text in an element <i> text </i> to italicize it. Italicize text to emphasize quotations and important words, and math formulas. Wrap any text in an element <b> text </b> to bold it. Bold text to emphasize very important words. Wrap any text in an element <u> text </u> to underline it. Underline text to emphasize important words. Wrap any text in an element <strike> text </strike> to strike through it. Strike text to show that something is wrong or outdated. Please escape any characters that would break the HTML format.
`

const question_prompt = `
I will tell you a prompt, and you need to answer it. Please be concise and write in clear language. Add your answer to an HTML-type document. Do not add a header, just the elements that I ask you, wrapped inside a <div> </div> element. Add text that belongs to a section title inside an element of type <h1> text </h1>. Add text that belongs to a section sub-title inside an element of type <h2> text </h2>. Add text that belongs to an unordered list inside an element of type <ul> <li> text 1 </li> <li> text 2 </li> </ul>. Add text that belongs to an ordered list inside an element of type <ol> <li> text 1 </li> <li> text 2 </li> </ol>. Add any code to an element of type <pre> text </pre>. Add any text that belongs inside a normal paragraph to an element of type <p> text <\p>. Add a tag <br/> at any point where the text should return to the next line. Wrap any text in an element <i> text </i> to italicize it. Italicize text to emphasize quotations and important words, and math formulas. Wrap any text in an element <b> text </b> to bold it. Bold text to emphasize very important words. Wrap any text in an element <u> text </u> to underline it. Underline text to emphasize important words. Wrap any text in an element <strike> text </strike> to strike through it. Strike text to show that something is wrong or outdated. Please escape any characters that would break the HTML format.
`


const sample_question = `
NOtes abut cats

resasons cats are cooL:
 - they're nice
 - their cute

I think cats are pretty cool, but maybe im mistaken

name = input("what's yor nam);
print(hello' + name)

Einstein said:
cats are fucking cool

Cons of cats:
1 they like milk
2 they are small

thanks

Actualy for math class I think the formula today was like area = d^2* pi/4 where d is the diameter.
`


const getBody = (my_prompt, my_question) => {
    return {
        "model": "gpt-3.5-turbo",
        "messages": [
            {role: 'system', content: my_prompt},
            {role: 'user', content: my_question}
        ]
      }
}



const callGPT = async (my_prompt, my_question) => {
    return fetch("https://api.openai.com/v1/chat/completions", 
    {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(getBody(my_prompt, my_question))
    }).then((data) => {
        return data.json();
    }).then((data) => {
        // console.log(data);
        // data.choices.forEach(c => {
        //     console.log(c.message)
        // });  

        return data.choices[0];
    });
}

export const beautify = async (text) => {
    // await new Promise(r => setTimeout(r, 1000));
    let response = await callGPT(beautify_prompt, text)
    console.log(response)
    
    return response.message.content;
}

export const askQuestion = async (text) => {

    //wait 1000ms to simulate a call to the GPT-3 API
    let response = await callGPT(question_prompt, text)
    console.log(response)

    
    return response.message.content;
}

export const fillBlanks = async (html) => {
    let response = await callGPT(fill_blanks_prompt, html)
    console.log(response)

    
    return response.message.content;
}



