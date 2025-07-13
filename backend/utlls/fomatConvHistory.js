export async function formatConvHistory(messages){
    return messages.map((message,index) => {
        if(index % 2 === 0) {
            return `User: ${message}`;
        } else {
            return `AI: ${message}`;
        }
    }).join("\n");
}

