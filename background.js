
let abortController;
let abortSignal;

chrome.runtime.onInstalled.addListener((e) => {
    const logo = chrome.runtime.getURL("static/images/icon64.png");
    chrome.storage.local.set({ toggleState: "on" })

    chrome.notifications.create(
        "name-for-notification",
        {
            type: "basic",
            iconUrl: logo,
            title: "Bard For Google",
            message: `Bard For Google has been installed`,
        })

    // chrome.contextMenus.create({
    //     title: "Ask GPT",
    //     id: "gpt",
    //     contexts: ["selection"]
    // })
    // chrome.contextMenus.create({
    //     title: "Ask BARD",
    //     id: "bard",
    //     contexts: ["selection"]
    // })

    if (e.reason == chrome.runtime.OnInstalledReason.INSTALL) {

        chrome.tabs.create({
            url: 'https://bard.google.com/'
        })

        setTimeout(() => {
            chrome.tabs.create({
                url: 'https://www.google.com/search?q=cat'
            })
        }, 3000);


    }

}

)

chrome.contextMenus.onClicked.addListener((info, tab) => {
    let tabId = tab.id

    if (info.menuItemId === "gpt") {
        let selectedText = info.selectionText
        chrome.tabs.sendMessage(tabId, { message: 'askGpt', selectedText })

    } else if (info.menuItemId === "bard") {
        let selectedText = info.selectionText
        chrome.tabs.sendMessage(tabId, { message: 'askBard', selectedText })

    }

})


const setToStorage = (key, data) => {
    const obj = {}
    obj[key] = data
    chrome.storage.sync.set(obj)
}

const getFromStorage = async (key) => {
    const sres = await chrome.storage.sync.get(key)
    return sres[key]
}

const fetchAPI = async (url, config) => {
    try {
        let response = await fetch(url, config)
        return response.json()
    } catch (err) {
        return Promise.reject(err)
    }
}

const uuidv4 = () => {
    return crypto.randomUUID()
}

var handleError = function (err) {
    return null
};

const getAccessToken = async () => {
    const url = "https://chat.openai.com/api/auth/session"
    const config = {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await (fetch(url, config).catch(handleError))

    if (!response.ok) {
        throw new Error()
    }

    return response.json()
}

const getAllConversations = async (at) => {
    const url = "https://chat.openai.com/backend-api/conversations?offset=0&limit=20"

    const config = {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${at}`
        }
    }

    return await fetchAPI(url, config)
}

const createConversation = async (at, query, tabId) => {
    // if (abortController) {
    //     abortController.abort();
    // }

    abortController = new AbortController();
    abortSignal = abortController.signal;

    const url = "https://chat.openai.com/backend-api/conversation"

    const config = {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${at}`
        },
        signal: abortSignal,

        body: JSON.stringify({
            action: "next",
            messages: [{
                id: uuidv4(),
                role: "user",
                content: {
                    content_type: "text",
                    parts: [query]
                }
            }],
            model: "text-davinci-002-render-sha",
            parent_message_id: uuidv4() 
        })
    }

    let response = await fetch(url, config)

    if (!response.ok) {
        let cErr = await response.json();

        if (typeof cErr === "object") {
            if (cErr.detail.message) {
                throw new Error(cErr.detail.message);
            } else if (cErr.detail) {
                throw new Error(cErr.detail);

            }

        } else {
            throw new Error("Something went wrong");
        }
    } else {
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
        while (true) {
            const { value, done } = await reader.read()
            if (done) {
                if (tabId === "popupGpt") {
                    chrome.runtime.sendMessage({ message: "done" })

                } else {
                    chrome.tabs.sendMessage(tabId, { message: 'done' })

                }

                break
            }
            if (value.includes('data:')) {
                let parsedResponse = transform(value)
                if (parsedResponse && typeof parsedResponse === 'object' && !parsedResponse?.error) {
                    let answer = parsedResponse?.message?.content?.parts[0]
                    let gptConversationId = parsedResponse?.conversation_id

                    if (tabId === "popupGpt") {

                        chrome.runtime.sendMessage({ message: "answer", answer, gptConversationId })

                    } else {

                        chrome.tabs.sendMessage(tabId, { message: 'answer', answer, gptConversationId })
                    }
                }
            }
        }
    }

}

const transform = (s) => {
    let value = s.split("data: ")[1]

    if (IsJsonString(value)) {
        return JSON.parse(value)
    }

    return null
}

const IsJsonString = (str) => {
    try {
        if (typeof str !== 'string') return false

        var json = JSON.parse(str)
        return (typeof json === 'object')
    } catch (e) {
        return false;
    }
}

const main = async (query, tabId) => {
    let at = await getFromStorage('accessToken')

    if (!at) {
        chrome.runtime.sendMessage({ message: "gptErrAnswer", })
        // send message to content -type: "auth-error", message: "Please login"
        return
    }


    try {
        let response = await createConversation(at, query, tabId)


    } catch (err) {
        return err.message

    }
}

const sessionCheckAndSet = async () => {
    try {
        let userObj = await getAccessToken()

        let at = userObj ? userObj['accessToken'] : ''
        await setToStorage('accessToken', at)

        // stoarage updated
    } catch (err) {
        await setToStorage('accessToken', '')
        // send message too content -type: "error", message: "Something went wrong"

    }
}

(async () => {
    await sessionCheckAndSet()
})()


// on message for content page
chrome.runtime.onMessage.addListener(async function (response, sender, sendResponse) {
    const { message } = response

    const tabId = sender.tab.id
    // return;

    if (message === 'search-occured-gpt') {
        let { query } = response
        if (abortController) {
            abortController.abort();
            abortController = null;
        }

        let answer = await main(query, tabId)
        if (answer != undefined) {
            try {
                JSON.parse(answer);
                chrome.tabs.sendMessage(tabId, { message: 'answer', answer })

            } catch (error) {

                // let answer= 
                chrome.tabs.sendMessage(tabId, { message: 'gptErrAnswer' })

            }

        }

    } else if (message === "search-occured-bard") {
        let { query, bard_conv_id } = response
        bard(query, tabId, bard_conv_id)

    } else if (message === 'session-check') {
        await sessionCheckAndSet()
        chrome.tabs.sendMessage(tabId, { message: 'session-updated' })


    } else if (message === 'session-initial-check') {
        await sessionCheckAndSet()
        chrome.tabs.sendMessage(tabId, { message: 'session-updated' })
    }
})


// on message for popup
chrome.runtime.onMessage.addListener(async function (response, sender, sendResponse) {
    const { message } = response

    if (message === "popup-bard-searched") {
        let { query ,bard_conv_id} = response
        let tabId = "popupBard"
        bard(query, tabId, bard_conv_id)

    } else if (message === "popup-gpt-searched") {
        let { query } = response
        let tabId = "popupGpt"

        let answer = await main(query, tabId)
        if (answer != undefined) {
            try {
                JSON.parse(answer);
                chrome.runtime.sendMessage({ message: "answer", answer })


            } catch (error) {

                chrome.runtime.sendMessage({ message: "gptErrAnswer", })

            }

        }
    } else if (message === "session-check") {
        sessionCheckAndSet()
    }

})






const bard = async (query, tabId, bard_conv_id) => {

    chrome.storage.local.get(null, async (result) => {


        let preQuery = query
        let { Cval, Rval, RCval } = bard_conv_id

        let encodeData = `f.req=${encodeURIComponent(`[null,"[[\\"${preQuery}\\"],null,[\\"${Cval}\\",\\"${Rval}\\",\\"${RCval}\\"]]"]`)}&at=${encodeURIComponent(`${result.bard_api_key}`)}&`

        await fetch(`https://bard.google.com${result.bard_path}_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20230326.21_p0&_reqid=12758&rt=c`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: (
                encodeData
            )

        })
            .then(response => response.text())
            .then(data => {
                let slicingStartPoint = data.indexOf('[["wrb.fr",null,')
                let slicingEnPoint = data.indexOf('"af.httprm"')
                let slicedData = data.slice(slicingStartPoint, slicingEnPoint - 17)
                let otherSliceddata=data.slice(slicingStartPoint, slicingEnPoint - 18)

                let bardParser = JSON.parse(otherSliceddata)  
                let bardAnswer = bardParser[0][2]
                
                if (tabId === "popupBard") {
                    chrome.runtime.sendMessage({ message: "bardAnswer", bardAnswer })

                } else {
                    chrome.tabs.sendMessage(tabId, { message: 'bardAnswer', bardAnswer }).then(
                    )

                }


            })
            .catch((error) => {
                if (tabId === "popupBard") {
                    chrome.runtime.sendMessage({ message: "bardNotAvailable" })

                } else {
                    chrome.tabs.sendMessage(tabId, { message: 'bardNotAvailable' })
                }

            })

    });



}



