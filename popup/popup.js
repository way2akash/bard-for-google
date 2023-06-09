

let bardHeader = document.getElementById("bardHeader")
let gptHeader = document.getElementById("gptHeader")
let bard_section_div = document.getElementById("bard_section_div")
let gpt_section_div = document.getElementById("gpt_section_div")
let bard_header_border = document.getElementById("bard_header_border")
let gpt_header_border = document.getElementById("gpt_header_border")
let searchInput = document.getElementById("searchInput")
let bard_login = document.getElementById("bard_login")
let gpt_login = document.getElementById("gpt_login")
let bardLoader = document.getElementById("bardLoader")
let gptLoader = document.getElementById("gptLoader")
let bardResult = document.getElementById("bard-result")
let gptResult = document.getElementById("gpt-result")
let toggleBtn = document.getElementById("toggleBtn")
let toggleThumb = document.getElementById("toggleThumb")
let toggleText = document.getElementById("toggleText")
let popupContainer = document.getElementById("popupContainer")
let darkModeIcon = document.getElementById("darkModeIcon")
let title = document.getElementById("title")
let logo = document.getElementById("logo")
let headerSection = document.getElementById("headerSection")
let disableSection = document.getElementById("disableSection")
let loginText = document.querySelectorAll(".loginText")


let search = document.getElementById("search")
let query = ""


window.onload = function () {
    searchInput.focus();
    let bard_access_token = chrome.storage.local.get(["bard_api_key"])
    let access = chrome.storage.sync.get("accessToken")

    bard_access_token.then((e) => {
        if (!e.bard_api_key) {
            bard_login.style.display = "flex"
            bardResult.style.display = "none"
        }
    })

    access.then((e) => {
        if (!e.accessToken) {
            gpt_login.style.display = "flex"
            gptResult.style.display = "none"
            chrome.runtime.sendMessage({ message: 'session-check' })


        }
    })

    chrome.storage.local.get(["toggleState"], (result) => {
        const toggleState = result.toggleState;
        if (toggleState === "on") {
            toggleBtn.style.flexDirection = "row";
            toggleText.innerText = "ON";
            toggleThumb.style.background = "linear-gradient(90.17deg, #FDE561 0%, #C66CE0 49.27%, #C357F5 100%)";
        } else {
            toggleBtn.style.flexDirection = "row-reverse";
            toggleText.innerText = "OFF";
            toggleThumb.style.background = "linear-gradient(90.17deg, #888888 0%, #CCCCCC 49.27%, #333333 100%)";
        }
    });

    chrome.storage.local.get(["bardResultStorage"], (result) => {

        if (result.bardResultStorage.trim() !== "") {
            bardResult.innerHTML = result.bardResultStorage
            copyBtnListener()

        }
    })

    chrome.storage.local.get(["gptResultStorage"], (result) => {
        if (result.gptResultStorage.trim() !== "") {
            gptResult.innerHTML = result.gptResultStorage
            copyBtnListener()


        }
    })

    bard_section_div.style.display = "flex"
    bardLoader.style.display = "none"

    chrome.storage.local.get(["mode"], (result) => {
        if (result.mode === "on") {

            darkModeIcon.src = "../static/images/daymode.png"
            darkmode()

        } else {
            darkModeIcon.src = "../static/images/darkmode.png"
            daymode()

        }
    })
    localeFile()

};

const localeFile = () => {
    let disableText =document.getElementById("disableText")
    let rate= document.getElementById("rate")


    disableText.innerText= chrome.i18n.getMessage("appDisablingText")
    searchInput.setAttribute("placeholder",chrome.i18n.getMessage("appPlaceholder"))
    document.querySelectorAll(".cloudfare").forEach((e)=>e.innerText=chrome.i18n.getMessage("appCloudsecurity"))
    document.querySelectorAll(".loginText1").forEach((e)=>e.innerText=chrome.i18n.getMessage("appLogintext1"))
    document.querySelectorAll(".loginText2").forEach((e)=>e.innerText=chrome.i18n.getMessage("appLoginText"))
    rate.innerText=chrome.i18n.getMessage("appRating")
}

darkModeIcon.addEventListener("click", () => {
    if (darkModeIcon.src.match("darkmode")) {
        darkModeIcon.src = "../static/images/daymode.png"
        darkmode()
        chrome.storage.local.set({ mode: "on" })



        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.sendMessage(tab.id, { message: 'dark' });
            });
        });
    } else {
        daymode()
        darkModeIcon.src = "../static/images/darkmode.png"

        chrome.storage.local.set({ mode: "off" })

        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.sendMessage(tab.id, { message: 'day' });
            });
        });

    }
})

const darkmode = () => {
    title.style.background = "#151515"
    logo.src = "../static/images/bardGptLogowhite.png"
    headerSection.style.background = "#131314"
    headerSection.style.color = "#fff"
    bard_section_div.style.background = "#222327"
    bardResult.style.background = "#222327"
    bardResult.style.color = "#fff"

    gpt_section_div.style.background = "#222327"
    gptResult.style.background = "#222327"
    gptResult.style.color = "#fff"

    popupContainer.style.background = "#151515"
    disableSection.style.background = "#222327"
    disableSection.style.color = "#fff"
    toggleBtn.style.border = "1.2px solid #fff"
    searchInput.style.background = "#131314"
    searchInput.style.border = "2px solid #5D77A3"
    searchInput.style.color = "#fff"
    document.querySelector("body").style.background = "#131314"
    loginText.forEach((e) => {

        e.style.color = "#fff"
    })
}

const daymode = () => {
    title.style.background = "#F6F5F8"
    logo.src = "../static/images/bardGptLogo.png"
    headerSection.style.background = "#fff"
    headerSection.style.color = "#000"
    bard_section_div.style.background = "#fff"
    bardResult.style.background = "#fff"
    bardResult.style.color = "#000"

    gpt_section_div.style.background = "#fff"
    gptResult.style.background = "#fff"
    gptResult.style.color = "#000"

    popupContainer.style.background = "#F6F5F8"
    disableSection.style.background = "#fff"
    disableSection.style.color = "#000"
    toggleBtn.style.border = "1.2px solid #000"

    searchInput.style.background = "#F3F6FC"
    searchInput.style.border = "2px solid #E0E0E0"
    searchInput.style.color = "#000"
    document.querySelector("body").style.background = "#fff"

    loginText.forEach((e) => {
        e.style.color = "#000"
    })

}




toggleBtn.addEventListener("click", () => {
    if (toggleText.innerText === "ON") {
        toggleBtn.style.flexDirection = "row-reverse"
        toggleText.innerText = "OFF"
        toggleThumb.style.background = "linear-gradient(90.17deg, #888888 0%, #CCCCCC 49.27%, #333333 100%)"
        chrome.storage.local.set({ toggleState: "off" })

    } else {
        toggleBtn.style.flexDirection = "row"
        toggleText.innerText = "ON"
        toggleThumb.style.background = "linear-gradient(90.17deg, #FDE561 0%, #C66CE0 49.27%, #C357F5 100%)"
        chrome.storage.local.set({ toggleState: "on" })

    }
})


searchInput.addEventListener("change", () => {
    query = searchInput.value
})
search.addEventListener("click", () => {
    if (query.trim() !== "") {
        resultClear()
        if (bard_section_div.style.display === "flex") {
            bard_btn_listener(query)
        } else if (gpt_section_div.style.display === "flex") {

            gpt_btn_listener(query)
        }
    }


})

searchInput.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        if (query.trim() !== "") {
            resultClear()
            if (bard_section_div.style.display === "flex") {
                bard_btn_listener(query)
            } else if (gpt_section_div.style.display === "flex") {

                gpt_btn_listener(query)
            }
        }
    }
})

searchInput.addEventListener("input", function () {
    query = searchInput.value;
});


bardHeader.addEventListener("click", () => {
    bard_section_div.style.display = "flex"
    gpt_section_div.style.display = "none"
    bard_header_border.style.display = "block"
    gpt_header_border.style.display = "none"
    if (query.trim() !== "") {
        if (bardResult.innerText === "" || bard_login.style.display === "flex") {

            bard_btn_listener(query)

        }

    }

})



gptHeader.addEventListener("click", () => {

    bard_section_div.style.display = "none"
    gpt_section_div.style.display = "flex"
    bard_header_border.style.display = "none"
    gpt_header_border.style.display = "block"
    if (query.trim() !== "") {

        if (gptResult.innerText === "" || gpt_login.style.display === "flex") {

            gpt_btn_listener(query)

        }
    }


})

let bard_btn_listener = (query) => {
    // resultClear()
    bardResult.style.display = "none"
    bardLoader.style.display = "flex"
    bard_login.style.display = "none"

    // document.getElementById("bardLoader").style.display="block";

    chrome.runtime.sendMessage({ message: "popup-bard-searched", query: query })
}

let gpt_btn_listener = () => {
    gptResult.style.display = "none"
    gptLoader.style.display = "flex"
    gpt_login.style.display = "none"


    // resultClear()
    // gptLoader.style.display="block"

    chrome.runtime.sendMessage({ message: "popup-gpt-searched", query: query })

}

let resultClear = () => {
    bardResult.innerText = ""
    gptResult.innerText = ""

}



const copyBtnListener = () => {
    let allCodeTag = popupContainer.querySelectorAll("code")
    allCodeTag.forEach((e) => {

        let parentNode = e.parentNode;
        if (!parentNode.querySelector("#copyPanel")) {

            // Create copyPanel only if it doesn't exist
            let copyPanel = document.createElement("div")
            copyPanel.setAttribute("id", "copyPanel")
            parentNode.insertBefore(copyPanel, e);

            let copyDiv = document.createElement("div")
            copyDiv.setAttribute("id", "copyDiv")
            copyDiv.innerText = "Copy code"
            copyPanel.appendChild(copyDiv)

            let copyBtn = document.createElement("img")
            copyBtn.setAttribute("id", "copyBtn")
            copyBtn.setAttribute("alt", "bard for google copy icon")
            copyBtn.src = "../static/images/copyIcon.svg"
            copyDiv.appendChild(copyBtn)

            copyDiv.addEventListener("click", () => {

                copyDiv.innerText = "Copied"

                navigator.clipboard.writeText(e.innerText);
                setTimeout(() => {
                    copyDiv.innerText = "Copy code"
                    copyDiv.appendChild(copyBtn)

                }, 2000)
            })
        }

    })
}





chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let { message } = request
    if (message === "bardAnswer") {
        bardLoader.style.display = "none"

        let { bardAnswer } = request

        let final_bard_answer = JSON.parse(bardAnswer)
        if (final_bard_answer === null) {
            bard_login.style.display = "flex"
        } else {
            try {
                bardResult.style.display = "flex"
                const markdown = window.markdownit()
                const html = markdown.render(final_bard_answer[0][0])
                bardResult.innerHTML = html
                hljs.highlightAll()
                copyBtnListener()

                chrome.storage.local.set({ bardResultStorage: html })

            } catch (error) {
                bard_login.style.display = "flex"

            }
        }

    } else if (message === "bardNotAvailable") {
        bardResult.style.display = "none"
        bardLoader.style.display = "none"
        bard_login.style.display = "flex"

    } else if (message === "answer") {
        // gptLoader.style.display="none"
        gptResult.style.display = "flex"
        gptLoader.style.display = "none"
        gpt_login.style.display = "none"

        let { answer } = request
        const markdown = window.markdownit()
        const html = markdown.render(answer)
        gptResult.innerHTML = html
        hljs.highlightAll()
        copyBtnListener()

        chrome.storage.local.set({ gptResultStorage: html })

    } else if (message === "gptErrAnswer") {
        gptResult.style.display = "none"
        gptLoader.style.display = "none"
        gpt_login.style.display = "flex"
        // gptLoader.style.display="none"
        gptResult.innerHTML = "something went wrong"

    }


})

