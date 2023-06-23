

let bardTab = document.getElementById("bardTab")
let gptTab = document.getElementById("gptTab")
let bard_section_div = document.getElementById("bard_section_div")
let gpt_section_div = document.getElementById("gpt_section_div")
let chatTextDiv = document.getElementById("chatTextDiv")
let inputBox = document.getElementById("inputBox")
let bardResult = document.getElementById("bard-result")
let gptResult = document.getElementById("gpt-result")
let bard_login = document.getElementById("bard_login_box")
let gpt_login = document.getElementById("gpt_login_box")
let bardLoader = document.getElementById("bardLoader")
let gptLoader = document.getElementById("gptLoader")
let mode = document.getElementById("mode")

let search = document.getElementById("enterImg")
let popupContainer = document.getElementById("popupContainer")
let titleLogo = document.getElementById("titleLogo")
let loginText = document.querySelectorAll("#loginTextDiv1")
let headerSection = document.getElementById("headerSection")

let codeTags = document.querySelectorAll("#panel code");
let copyDivs = document.querySelectorAll("#copyDiv")
let copyBtns = document.querySelectorAll("#copyBtn")
let copyPanel = document.querySelectorAll("#copyPanel")
let bardResponseDiv = document.getElementsByClassName("bardResponseDiv")
let gptResponseDiv = document.getElementsByClassName("gptResponseDiv")
let titleRating = document.getElementById("titleRating")

let ratingStorage = chrome.storage.local.get(["rated"])

let query = ""
let gptquery = ""
let bardquery = ""
let bard_conv_id = {
    Cval: "",
    Rval: "",
    RCval: ""
}
let gptResponseCopy = false

window.onload = function () {

    inputBox.focus()
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



    bard_section_div.style.display = "flex"
    bardLoader.style.display = "none"

    chrome.storage.local.get(["mode"], (result) => {
        if (result.mode === "on") {

            darkmode()

        } else {
            lightmode()

        }
    })

    ratingStorage.then((e) => {
        if (e.rated) {
           titleRating.style.display = "none"
        }

    })

}

titleRating.addEventListener(("click"), ()=>{
    chrome.storage.local.set({ rated: true })

})
mode.addEventListener("click", () => {
    if (modeLogo.src.match("lightmoon")) {
        darkmode()
        chrome.storage.local.set({ mode: "on" })
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.sendMessage(tab.id, { message: 'dark' });
            });
        });

    } else {
        lightmode()
        chrome.storage.local.set({ mode: "off" })
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.sendMessage(tab.id, { message: 'light' });
            });
        });

    }
})

const darkmode = () => {
    popupContainer.style.background = "#0d1117"
    modeLogo.src = "../static/images/darkmoon.svg"
    titleLogo.src = "../static/images/bardGptLogowhite.png"
    bard_section_div.style.color = "#ffffff"
    gpt_section_div.style.color = "#ffffff"
    copyLogo.src = "../static/images/copyIconDark.svg"
    inputBox.style.background = "#0D0D0D"
    inputBox.style.border = "1px solid #242424"
    // bardTab.style.color = "#fff"
    // gptTab.style.color = "#fff"
    headerSection.style.background = "#2A2A2A"

    let codeTags = document.querySelectorAll("#panel code");
    let copyDivs = document.querySelectorAll("#copyDiv")
    let copyBtns = document.querySelectorAll("#copyBtn")
    let copyPanel = document.querySelectorAll("#copyPanel")

    for (let i = 0; i < bardResponseDiv.length; i++) {
        bardResponseDiv[i].style.background = "#161B22";
    }

    for (let i = 0; i < gptResponseDiv.length; i++) {
        gptResponseDiv[i].style.background = "#161B22";
    }

    loginText.forEach((e) => {
        e.style.color = "#fff"
    })

    if (bard_section_div.style.display === "flex") {
        bardTab.style.background = "#0D0D0D"
        gptTab.style.background = "transparent"

        bardTab.style.color = "#fff"
        gptTab.style.color = "#fff"
    }

    if (gpt_section_div.style.display === "flex") {
        gptTab.style.background = "#0D0D0D"
        bardTab.style.background = "transparent"
        bardTab.style.color = "#fff"
        gptTab.style.color = "#fff"

    }

    codeTags.forEach((codeTag) => {
        codeTag.style.background = "#161B22";
        codeTag.style.color = "#fff";
        // copyDiv.style.color="#E7E8EB"

    });

    copyDivs.forEach((copyDiv) => {
        copyDiv.style.color = "#E7E8EB"

    });
    copyBtns.forEach((copyBtn) => {
        copyBtn.src =  "../static/images/copyIcon.svg"
    })
    copyPanel.forEach((copyPane) => {
        copyPane.style.background = "#1E2336";
    })


}
const lightmode = () => {
    popupContainer.style.background = "#fff"
    modeLogo.src = "../static/images/lightmoon.svg"
    titleLogo.src = "../static/images/bardGptLogo.png"
    bard_section_div.style.color = "#4d5156"
    gpt_section_div.style.color = "#4d5156"
    copyLogo.src = "../static/images/copyIconDark.svg"
    inputBox.style.background = "#FFFFFF"
    inputBox.style.border = "1px solid #E8E8E8"
    // bardTab.style.color = "#000"
    // gptTab.style.color = "#000"
    headerSection.style.background = "#EFEFEF"

    let codeTags = document.querySelectorAll("#panel code");
    let copyDivs = document.querySelectorAll("#copyDiv")
    let copyBtns = document.querySelectorAll("#copyBtn")
    let copyPanel = document.querySelectorAll("#copyPanel")

    for (let i = 0; i < bardResponseDiv.length; i++) {
        bardResponseDiv[i].style.background = "#F4F5FA";
    }

    for (let i = 0; i < gptResponseDiv.length; i++) {
        gptResponseDiv[i].style.background = "#F4F5FA";
    }


    loginText.forEach((e) => {

        e.style.color = "#000"
    })

    if (bard_section_div.style.display === "flex") {
        bardTab.style.background = "#fff"
        gptTab.style.background = "transparent"
        bardTab.style.color = "#000"
        gptTab.style.color = "#000"
    }

    if (gpt_section_div.style.display === "flex") {
        gptTab.style.background = "#fff"
        bardTab.style.background = "transparent"
        bardTab.style.color = "#000"
        gptTab.style.color = "#000"

    }

    codeTags.forEach((codeTag) => {
        codeTag.style.background = "#F4F5FA";
        codeTag.style.color = "#000";
        // copyDiv.style.color="#6170AB"

    });
    copyDivs.forEach((copyDiv) => {
        copyDiv.style.color = "#6170AB"

    });
    copyBtns.forEach((copyBtn) => {
        copyBtn.src =  "../static/images/copyIconDark.svg"
    })

    copyPanel.forEach((copyPane) => {
        copyPane.style.background = "#DADDEA";
    })

}
bardTab.addEventListener("click", () => {

    bardTab.style.background = "#fffff"
    bardTab.style.borderLeft = "3.5px solid #b5adad"
    bardTab.style.boxShadow = "0px 2px 2px rgba(0, 0, 0, 0.14)"
    bardTab.style.opacity = "1"
    bardTab.style.borderLeft = " 3.5px solid"


    gptTab.style.background = "transparent"
    gptTab.style.opacity = "0.5"
    gptTab.style.boxShadow = "none"
    gptTab.style.borderLeft = "none"

    bard_section_div.style.display = "flex"
    gpt_section_div.style.display = "none"

    chrome.storage.local.get(["mode"], (result) => {
        if (result.mode === "on") {
            bardTab.style.background = "#0D0D0D"
            gptTab.style.background = "transparent"
            bardTab.style.color = "#fff"
            gptTab.style.color = "#fff"



        } else {

            bardTab.style.background = "#fff"
            gptTab.style.background = "transparent"
            bardTab.style.color = "#000"
            gptTab.style.color = "#000"



        }
    })

    if (bardquery.trim() !== "") {
        if (bardResult.innerText === "" || bard_login.style.display === "flex") {

            bard_btn_listener(bardquery)

        }

    }

})


gptTab.addEventListener("click", () => {

    gptTab.style.background = "#fffff"
    gptTab.style.borderLeft = "3.5px solid #b5adad"
    gptTab.style.boxShadow = "0px 2px 2px rgba(0, 0, 0, 0.14)"
    gptTab.style.opacity = "1"
    gptTab.style.background = "#ffffff"
    gptTab.style.borderLeft = " 3.5px solid"


    bardTab.style.background = "transparent"
    bardTab.style.opacity = "0.5"
    bardTab.style.boxShadow = "none"
    bardTab.style.borderLeft = "none"

    bard_section_div.style.display = "none"
    gpt_section_div.style.display = "flex"

    chrome.storage.local.get(["mode"], (result) => {
        if (result.mode === "on") {
            gptTab.style.background = "#0D0D0D"
            bardTab.style.background = "transparent"
            gptTab.style.color = "#fff"
            bardTab.style.color = "#fff"


        } else {
            gptTab.style.background = "#fff"
            bardTab.style.background = "transparent"
            bardTab.style.color = "#000"
            gptTab.style.color = "#000"


        }
    })

    if (gptquery.trim() !== "") {

        if (gptResult.innerText === "" || gpt_login.style.display === "flex") {

            gpt_btn_listener(gptquery)

        }
    }

})

chatTextDiv.addEventListener("click", () => {
    rateChatDiv.style.display = "none"
    followUpDiv.style.display = "flex"
    document.getElementById("copy").style.display = "none"
    
    footer_section_div.style.border = "none"

    ratingStorage.then((e) => {
        if (!e.rated) {
            titleRating.style.display = "flex"
        }

    })
    
})


inputBox.addEventListener("change", () => {
    if (bard_section_div.style.display === "flex") {
        bardquery = inputBox.value

    } else if (gpt_section_div.style.display === "flex") {
        gptquery = inputBox.value

    }
})
inputBox.addEventListener("input", function () {
    if (bard_section_div.style.display === "flex") {
        bardquery = inputBox.value

    } else if (gpt_section_div.style.display === "flex") {
        gptquery = inputBox.value

    }
});



search.addEventListener("click", () => {
    if (bardquery.trim() !== "" || gptquery.trim() !== "") {
        // resultClear()
        inputBox.value = ""

        if (bard_section_div.style.display === "flex") {
            bard_btn_listener(bardquery)
        } else if (gpt_section_div.style.display === "flex") {

            gpt_btn_listener(qugptqueryery)
        }
    }


})

inputBox.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        if (bardquery.trim() !== "" || gptquery.trim() !== "") {
            // resultClear()
            inputBox.value = ""

            if (bard_section_div.style.display === "flex") {
                bard_btn_listener(bardquery)
            } else if (gpt_section_div.style.display === "flex") {

                gpt_btn_listener(gptquery)
            }
        }
    }
})



let bard_btn_listener = (quer) => {
    // resultClear()
    // bardResult.style.display = "none"
    bardLoader.style.display = "flex"
    bard_login.style.display = "none"
    // inputBox.innerText=""

    bardClientMsg(bardquery)
    bardResult.appendChild(bardLoader);

    chrome.runtime.sendMessage({ message: "popup-bard-searched", query: bardquery, bard_conv_id })
}

let gpt_btn_listener = () => {
    // gptResult.style.display = "none"
    gptLoader.style.display = "flex"
    gpt_login.style.display = "none"


    gptClientMsg(gptquery)
    gptResult.appendChild(gptLoader);


    gptResponseCopy = true


    chrome.runtime.sendMessage({ message: "popup-gpt-searched", query: gptquery })

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
            copyBtn.src = "../static/images/copyIconDark.svg"
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

let bardClientMsg = (quer) => {

    // let bardResult= document.getElementById("bardResult")
    let bardClientDiv = document.createElement("div")
    bardClientDiv.setAttribute("class", "bardClientDiv")
    bardResult.appendChild(bardClientDiv)
    bardClientDiv.innerText = quer

}

let gptClientMsg = (quer) => {
    // let gptResult= document.getElementById("gptResult")
    let gptClientDiv = document.createElement("div")
    gptClientDiv.setAttribute("class", "gptClientDiv")
    gptResult.appendChild(gptClientDiv)
    gptClientDiv.innerText = quer

}
const bardCopySection = (bardResponseDiv) => {
    chrome.storage.local.get(["mode"], (result) => {
        if (result.mode === "on") {
            let codeTags = document.querySelectorAll("#panel code");
            let copyDivs = document.querySelectorAll("#copyDiv")
            let copyBtns = document.querySelectorAll("#copyBtn")
            let copyPanel = document.querySelectorAll("#copyPanel")
    

            bardResponseDiv.style.background = "#161B22"

            codeTags.forEach((codeTag) => {
                codeTag.style.background = "#161B22";
                codeTag.style.color = "#fff";
            });
            copyDivs.forEach((copyDiv) => {
                copyDiv.style.color = "#E7E8EB"

            });
            copyBtns.forEach((copyBtn) => {
                copyBtn.src = "../static/images/copyIcon.svg"
            })
            copyPanel.forEach((cPanel) => {
                cPanel.style.background = "#1E2336"
            })
        } else {
            bardResponseDiv.style.background = "#F4F5FA"
            codeTags.forEach((codeTag) => {
                codeTag.style.background = "#F4F5FA";
                codeTag.style.color = "#000";

            });
            copyDivs.forEach((copyDiv) => {
                copyDiv.style.color = "#6170AB"

            });
            copyBtns.forEach((copyBtn) => {
                copyBtn.src = "../static/images/copyIconDark.svg"
            })


            copyPanel.forEach((cPanel) => {
                cPanel.style.background = "#DADDEA"
            })

        }
    })
}

let gptCopySection = (gptResponseDiv) => {
    chrome.storage.local.get(["mode"], (result) => {
        let codeTags = document.querySelectorAll("#panel code");
        let copyDivs = document.querySelectorAll("#copyDiv")
        let copyBtns = document.querySelectorAll("#copyBtn")
        let copyPanel = document.querySelectorAll("#copyPanel")


        if (result.mode === "on") {
            gptResponseDiv.style.background = "#161B22"

            codeTags.forEach((codeTag) => {
                codeTag.style.background = "#161B22";
                codeTag.style.color = "#fff";
            });

            copyDivs.forEach((copyDiv) => {
                copyDiv.style.color = "#E7E8EB"

            });
            copyBtns.forEach((copyBtn) => {
                copyBtn.src = "../static/images/copyIcon.svg"
            })
            copyPanel.forEach((cPanel) => {
                cPanel.style.background = "#1E2336"
            })

        } else {
            gptResponseDiv.style.background = "#F4F5FA"
            codeTags.forEach((codeTag) => {
                codeTag.style.background = "#F4F5FA";
                codeTag.style.color = "#000";
            });
            copyDivs.forEach((copyDiv) => {
                copyDiv.style.color = "#6170AB"

            });
            copyBtns.forEach((copyBtn) => {
                copyBtn.src = "../static/images/copyIconDark.svg"
            })
            copyPanel.forEach((cPanel) => {
                cPanel.style.background = "#DADDEA"
            })

        }
    })
}

let bardResponseMsg = (quer) => {
    let bardResponseDiv = document.createElement("div")
    bardResponseDiv.setAttribute("class", "bardResponseDiv")
    bardResult.appendChild(bardResponseDiv)
    bardResponseDiv.innerHTML = quer
    hljs.highlightAll()
    copyBtnListener()
    bardCopySection(bardResponseDiv)
    bardResult.scrollTop = bardResponseDiv.offsetTop;


    let copyBardRes = document.createElement("div")
    copyBardRes.setAttribute("id", "copyBardRes")
    bardResult.appendChild(copyBardRes)
    let bardResCopy = document.createElement("img")
    bardResCopy.setAttribute("id", "bardResCopy")
    bardResCopy.src = "../static/images/copyIconDark.svg"
    copyBardRes.appendChild(bardResCopy)

    bardResCopy.addEventListener("click", () => {
        navigator.clipboard.writeText(bardResponseDiv.innerText);

    })

}

let gptResponseMsg = (quer) => {

    let gptResponseDivLen = document.getElementsByClassName("gptResponseDiv").length
    let gptResponseDiv = document.getElementsByClassName("gptResponseDiv")[gptResponseDivLen - 1]

    // let gptResponseDiv = document.createElement("div")
    // gptResponseDiv.setAttribute("class", "gptResponseDiv")
    // bardResult.appendChild(gptResponseDiv)
    gptResponseDiv.innerHTML = quer
    hljs.highlightAll()
    copyBtnListener()
    gptCopySection(gptResponseDiv)
    gptResult.scrollTop = gptResponseDiv.offsetTop;


    if (gptResponseCopy && quer != "") {
        let copyGptRes = document.createElement("div")
        copyGptRes.setAttribute("id", "copyGptRes")
        gptResult.appendChild(copyGptRes)
        // copyGptRes.style.display = "none"
        let gptResCopy = document.createElement("img")
        gptResCopy.setAttribute("id", "gptResCopy")
        gptResCopy.src = copyIconDark
        copyGptRes.appendChild(gptResCopy)

        gptResCopy.addEventListener("click", () => {
            navigator.clipboard.writeText(gptResponseDiv.innerText);

        })
        gptResponseCopy = false
    }
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

                bard_conv_id.Cval = final_bard_answer[1][0] || ""
                bard_conv_id.Rval = final_bard_answer[1][1] || ""
                bard_conv_id.RCval = final_bard_answer[4][0][0] || ""
                // bardResult.innerHTML = html
                // hljs.highlightAll()
                // copyBtnListener()
                bardResponseMsg(html)

                // chrome.storage.local.set({ bardResultStorage: html })

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
        gptResponseMsg(html)


    } else if (message === "gptErrAnswer") {
        gptResult.style.display = "none"
        gptLoader.style.display = "none"
        gpt_login.style.display = "flex"
        gptResult.innerHTML = "something went wrong"

    }


})
