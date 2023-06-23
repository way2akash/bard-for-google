console.log("new content js")

let gptquery = ""
let bardquery = ""
let bardFirstAns = ""
let gptFirstAns = ""
let targetLocation = window.location.hostname
let selectors = ['.GyAeWb', '#b_context', '#right', '[data-area="sidebar"]', '#content_right', '.content__right','.kix-appview-editor-container']
let bard_conv_id = {
    Cval: "",
    Rval: "",
    RCval: ""
}
let gpt_conv_id = null
let hideChatMode = true
let gptResponseCopy = false


// images 
let bardGptLogo = chrome.runtime.getURL("static/images/bardGptLogo.svg")
let bardGptLogoWhite = chrome.runtime.getURL("static/images/bardGptLogowhite.png")
let lightmoon = chrome.runtime.getURL("static/images/lightmoon.svg")
let darkmoon = chrome.runtime.getURL("static/images/darkmoon.svg")
let copyIcon = chrome.runtime.getURL("static/images/copyIcon.svg")
let copyIconDark = chrome.runtime.getURL("static/images/copyIconDark.svg")
let gptLogo = chrome.runtime.getURL("static/images/gptLogo.svg")
let bardLogo = chrome.runtime.getURL("static/images/bardLogo.svg")
let chatIcon = chrome.runtime.getURL("static/images/chatIcon.svg")
let ratingStar = chrome.runtime.getURL("static/images/ratingStar.svg")
let enterIcon = chrome.runtime.getURL("static/images/enterIcon.svg")
let infoIcon = chrome.runtime.getURL("static/images/info.png")


// getting bard token and storing
const bard_key_func = () => {
    const bard_interval = setInterval(() => {
        let bard_key = document.querySelector('[data-id="_gd"]')
        if (bard_key) {
            let bard_key_innerText = bard_key.innerText
            let bard_key_slice_start = bard_key_innerText.indexOf("WIZ_global_data")
            let bard_key_slice_end = bard_key_innerText.indexOf(bard_key_innerText.length - 1)
            let bard_key_sliced = bard_key_innerText.slice(bard_key_slice_start + 18, bard_key_slice_end)

            let bard_key_parser = JSON.parse(bard_key_sliced)
            let bard_keyVal = bard_key_parser.SNlM0e
            let bardPath = window.location.pathname
            chrome.storage.local.set({ bard_api_key: bard_keyVal, bard_path: bardPath });

            clearInterval(bard_interval)
        }
    }, 1000);
}


//getting token from bard website
if (window.location.href === "https://bard.google.com/") {
    bard_key_func()
}


//search page domain list where div will be injected
if (targetLocation.includes("docs.google.") ||targetLocation.includes("www.google.") || targetLocation.includes("www.bing.") || targetLocation.includes("search.yahoo.") || targetLocation.includes("duckduckgo.") || targetLocation.includes("www.baidu.") || targetLocation.includes("yandex.")) {
    chrome.storage.local.get(["toggleState"], (result) => {
        if (result.toggleState === "on") {
            waitUntilVideoElementLoads()
        }
    })
}


//targeting search page div
async function waitUntilVideoElementLoads() {
    return await new Promise((resolve) => {
        const interval = setInterval(() => {
            let element = document.querySelector(selectors.map((e) => {
                return e;
            }))

            let finalState = true;

            if (!element) finalState = false;

            if (finalState) {
                if (targetLocation.includes("www.google.")) {
                    googleIntegration(element)
                } 
                else if(targetLocation.includes("docs.google.")){

                    docsintegration(element)

                }else if (targetLocation.includes("www.bing.")) {
                    bingIntegration(element)
                }
                else if (targetLocation.includes("search.yahoo.")) {
                    yahooIntegration(element)
                } else if (targetLocation.includes("duckduckgo.")) {
                    duckduckIntegration(element)
                } else if (targetLocation.includes("www.baidu.")) {
                    baiduIntegration(element)
                } else if (targetLocation.includes("yandex.")) {
                    yandexIntegration(element)
                }

                chrome.storage.local.get(["mode"], (result) => {
                    if (result.mode === "on") {
                        darkmode()
                    } else {
                        lightmode()
                    }
                })

                clearInterval(interval);
            }
        }, 1000);
    });
}


// google search page 
const googleIntegration = (element) => {
    let searchContent = document.querySelectorAll(`[aria-label="Search"]`)[0].value
    // query = searchContent
    gptquery = searchContent
    bardquery = searchContent

    // parent of panel
    let parentPanelDiv = document.createElement("div")
    parentPanelDiv.setAttribute("id", "parentPanelDiv")

    let google_inner_div = document.querySelector(".TQc1id.rhstc4")
    let google_map_page = document.querySelector("#search > div")
    let google_page_page1 = document.querySelector(".TQc1id.rhstc5.N4Xssf")

    if (google_inner_div) {
        google_inner_div.prepend(parentPanelDiv)

    } else if (google_page_page1) {
        google_page_page1.prepend(parentPanelDiv)
    } else if (google_map_page) {
        element.style.flexWrap = "wrap"
        google_map_page.appendChild(parentPanelDiv)
        google_map_page.style.display = "flex"
        google_map_page.style.width = "180%"
        if (document.querySelector("#rso")) {
            let rsoElem = document.querySelector("#rso").children

            for (let i = 0; i < rsoElem.length; i++) {
                rsoElem[i].style.width = "600px"
                parentPanelDiv.style.marginLeft = "85px";
            }
        }
    }
    else {
        element.style.flexWrap = "nowrap"
        element.appendChild(parentPanelDiv)
    }
    titleSecCreationFn(parentPanelDiv)

}

//docs integration
const docsintegration=(element)=>{
    gptquery = "Hi"
    bardquery = "Hi"
    let classfetch=document.querySelector(".kix-appview-editor-container")
    classfetch.style.display="flex"
    let canvafetch=document.querySelector(".kix-appview-editor")
    canvafetch.style.width="70%"
    let parentPanelDiv = document.createElement("div")
    parentPanelDiv.setAttribute("id", "parentPanelDiv")
    parentPanelDiv.style.margin="10px"
    
        element.append(parentPanelDiv)
        titleSecCreationFn(parentPanelDiv)
    
}

//bing search page
const bingIntegration = (element) => {
    let searchContent = document.querySelector("#sb_form_q").value
    // query = searchContent
    gptquery = searchContent
    bardquery = searchContent

    // parent of panel
    let parentPanelDiv = document.createElement("div")
    parentPanelDiv.setAttribute("id", "parentPanelDiv")

    element.prepend(parentPanelDiv)

    titleSecCreationFn(parentPanelDiv)
}

//yahoo search page
const yahooIntegration = (element) => {
    let searchContent = document.querySelector(".sbq").value
    // query = searchContent
    gptquery = searchContent
    bardquery = searchContent

    let parentPanelDiv = document.createElement("div")
    parentPanelDiv.setAttribute("id", "parentPanelDiv")

    element.prepend(parentPanelDiv)

    titleSecCreationFn(parentPanelDiv)

}


// duckduckgo search page
const duckduckIntegration = (element) => {
    let searchContent = document.querySelector("#search_form_input").value
    // query = searchContent
    gptquery = searchContent
    bardquery = searchContent

    let parentPanelDiv = document.createElement("div")
    parentPanelDiv.setAttribute("id", "parentPanelDiv")

    element.prepend(parentPanelDiv)

    titleSecCreationFn(parentPanelDiv)

}

//baidu search page
const baiduIntegration = (element) => {
    let searchContent = document.querySelector("#kw").value
    // query = searchContent
    gptquery = searchContent
    bardquery = searchContent

    let parentPanelDiv = document.createElement("div")
    parentPanelDiv.setAttribute("id", "parentPanelDiv")

    element.prepend(parentPanelDiv)

    titleSecCreationFn(parentPanelDiv)

}

//yandex search page
const yandexIntegration = (element) => {
    let searchContent = document.querySelector(".input__control").value
    // query = searchContent
    gptquery = searchContent
    bardquery = searchContent

    let parentPanelDiv = document.createElement("div")
    parentPanelDiv.setAttribute("id", "parentPanelDiv")

    element.prepend(parentPanelDiv)

    titleSecCreationFn(parentPanelDiv)

}


const titleSecCreationFn = (parentPanelDiv) => {
    //title section 
    let titleSection = document.createElement("div")
    titleSection.setAttribute("id", "titleSection")
    parentPanelDiv.appendChild(titleSection)

    // bard logo
    let titleLogo = document.createElement("img")
    titleLogo.setAttribute("id", "titleLogo")
    titleLogo.setAttribute("alt", "bard")
    titleLogo.src = bardGptLogo
    titleSection.appendChild(titleLogo)


    // header option div
    let titleOptionDiv = document.createElement("div")
    titleOptionDiv.setAttribute("id", "titleOptionDiv")
    titleSection.appendChild(titleOptionDiv)



    let titleRating = document.createElement("a")
    titleRating.setAttribute("id", "titleRating")
    titleRating.href = "https://chrome.google.com/webstore/detail/bard-for-google/hnadleianomnjcoeplifgbkiejchjmah/reviews"
    titleRating.setAttribute("target", "blank")
    titleOptionDiv.appendChild(titleRating)

    let ratingStorage = chrome.storage.local.get(["rated"])
    ratingStorage.then((e) => {
        if (e.rated) {
            titleRating.style.display = "none"
        }

    })

    let ratingIcon = document.createElement("img")
    ratingIcon.setAttribute("alt", "bard for google ")
    ratingIcon.setAttribute("id", "ratingIcon")
    ratingIcon.src = ratingStar
    titleRating.appendChild(ratingIcon)

    let rateText = document.createElement("div")
    rateText.setAttribute("id", "rateText")
    rateText.innerText = "Rate us"
    titleRating.appendChild(rateText)


    titleRating.addEventListener("click", () => {
        ratingRemoval()
    })

    // dark and light mode
    let mode = document.createElement("div")
    mode.setAttribute("id", "mode")
    titleOptionDiv.appendChild(mode)

    let modeLogo = document.createElement("img")
    modeLogo.setAttribute("id", "modeLogo")
    modeLogo.setAttribute("alt", "bard for google dark mode")
    modeLogo.src = lightmoon
    mode.appendChild(modeLogo)

    // eventlistener on dark/light mode div
    mode.addEventListener("click", () => {


        if (modeLogo.src === lightmoon) {
            darkmode()
            chrome.storage.local.set({ mode: "on" })
        } else {
            lightmode()
            chrome.storage.local.set({ mode: "off" })

        }
    })

    //copy button
    let copy = document.createElement("div")
    copy.setAttribute("id", "copy")
    titleOptionDiv.appendChild(copy)

    let copyLogo = document.createElement("img")
    copyLogo.setAttribute("id", "copyLogo")
    copyLogo.setAttribute("alt", "bard for google  copy icon")
    copyLogo.src = copyIcon
    copy.appendChild(copyLogo)

    copy.addEventListener("click", () => {
        let tempDiv = document.createElement("div")
        if (document.getElementById("bard_section_div").style.display === "flex") {
            tempDiv.innerHTML = bardFirstAns
            navigator.clipboard.writeText(tempDiv.innerText);

        } else {
            tempDiv.innerHTML = gptFirstAns
            navigator.clipboard.writeText(tempDiv.innerText)
        }
    })


    //panel creation
    const panel = document.createElement("div");
    panel.setAttribute("id", "panel");
    parentPanelDiv.appendChild(panel)


    header(panel)
    bard_section(panel)
    gpt_section(panel)
    footer_section(panel)

}


const loaderCreation = (val) => {
    let loaderDiv = document.createElement("div")
    loaderDiv.setAttribute("id", "loader")
    val.appendChild(loaderDiv)

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        loaderDiv.appendChild(dot);
    }
}

const loaderRemoval = () => {
    loaderDiv = document.getElementById("loader")
    if (loaderDiv) {
        loaderDiv.remove()
    }

}


const header = (panel) => {
    let headerSection = document.createElement("div")
    headerSection.setAttribute("id", "headerSection")
    panel.appendChild(headerSection)

    // bard tab 
    let bardTab = document.createElement("div")
    bardTab.setAttribute("id", "bardTab")
    headerSection.appendChild(bardTab)

    // let bardBorder= document.createElement("bardBorder")
    // bardBorder.setAttribute("id","bardBorder")
    // bardTab.appendChild(bardBorder)

    let bardTabLogo = document.createElement("img")
    bardTabLogo.setAttribute("id", "bardTabLogo")
    bardTabLogo.setAttribute("alt", "bard for google ")
    bardTabLogo.src = bardLogo
    bardTab.appendChild(bardTabLogo)


    let bardTabText = document.createElement("span")
    bardTabText.setAttribute("id", "bardTabText")
    bardTab.appendChild(bardTabText)
    bardTabText.innerText = "Bard AI"


    //     //  gpt tab
    let gptTab = document.createElement("div")
    gptTab.setAttribute("id", "gptTab")
    headerSection.appendChild(gptTab)

    let gptTabLogo = document.createElement("img")
    gptTabLogo.setAttribute("id", "gptTabLogo")
    gptTabLogo.setAttribute("alt", "gpt for google ")
    gptTabLogo.src = gptLogo
    gptTab.appendChild(gptTabLogo)

    let gptTabText = document.createElement("span")
    gptTabText.setAttribute("id", "gptTabText")
    gptTab.appendChild(gptTabText)
    gptTabText.innerText = "ChatGPT"

    bardTab.addEventListener("click", bard_btn_listener)
    gptTab.addEventListener("click", gpt_btn_listener)

}





const bard_btn_listener = () => {
    let bardTab = document.getElementById("bardTab")
    let gptTab = document.getElementById("gptTab")
    let bard_section_div = document.getElementById("bard_section_div")
    let gpt_section_div = document.getElementById("gpt_section_div")

    bardTab.style.borderLeft = "3.5px solid #b5adad"
    bardTab.style.boxShadow = "0px 2px 2px rgba(0, 0, 0, 0.14)"
    bardTab.style.opacity = "1"
    bardTab.style.borderLeft = " 3.5px solid"


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



}

const gpt_btn_listener = () => {
    let bardTab = document.getElementById("bardTab")
    let gptTab = document.getElementById("gptTab")
    let bard_section_div = document.getElementById("bard_section_div")
    let gpt_section_div = document.getElementById("gpt_section_div")

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


    if (document.getElementById("gpt_section_div").innerText === "") {
        // check gpt token validity
        let access = chrome.storage.sync.get("accessToken")
        access.then((e) => {
            if (e.accessToken) {
                // gpt_access_token_validity = true
                // gptDone=true
                gptClientMsg(gptquery)
                loaderCreation(gpt_section_div)

                let gptResult = document.getElementById("gptResult")
                let gptResponseDiv = document.createElement("div")
                gptResponseDiv.setAttribute("class", "gptResponseDiv")
                gptResult.appendChild(gptResponseDiv)

                if (document.getElementById("gpt_login_box")) {
                    document.getElementById("gpt_login_box").remove()
                }
                gptResult.style.display = "flex"



                gptResponseCopy = true

                chrome.runtime.sendMessage({ message: 'search-occured-gpt', query: gptquery, gpt_conv_id })



            } else {
                gpt_section_login(gpt_section_div)
            }
        })
    }

}


// bard section
const bard_section = (panel) => {
    let bard_section_div = document.createElement("div")
    bard_section_div.setAttribute("id", "bard_section_div")
    panel.appendChild(bard_section_div)
    bard_section_div.style.display = "flex"
    let bardResult = document.createElement("div")
    bardResult.setAttribute("id", "bardResult")
    bard_section_div.appendChild(bardResult)

    let bard_access_token = chrome.storage.local.get(["bard_api_key"])
    bard_access_token.then((e) => {
        if (e.bard_api_key) {


            bardClientMsg(bardquery)
            loaderCreation(bardResult)
            if (document.getElementById("bard_login_box")) {
                document.getElementById("bard_login_box").remove()
            }
            bardResult.style.display = "flex"

            chrome.runtime.sendMessage({ message: 'search-occured-bard', query: bardquery, bard_conv_id })

        } else {
            bard_section_login(bard_section_div)
        }
    })


}

//gpt section
const gpt_section = (panel) => {

    let gpt_section_div = document.createElement("div")
    gpt_section_div.setAttribute("id", "gpt_section_div")
    panel.appendChild(gpt_section_div)
    let gptResult = document.createElement("div")
    gptResult.setAttribute("id", "gptResult")
    gpt_section_div.appendChild(gptResult)


}

const bardCall = () => {
    let bardResult = document.getElementById("bardResult")
    bardClientMsg(bardquery)
    loaderCreation(bardResult)
    if (document.getElementById("bard_login_box")) {
        document.getElementById("bard_login_box").remove()
    }
    bardResult.style.display = "flex"

    chrome.runtime.sendMessage({ message: 'search-occured-bard', query: bardquery, bard_conv_id })
}

const gptCall = () => {
    let gptResult = document.getElementById("gptResult")
    gptClientMsg(gptquery)
    loaderCreation(gptResult)
    if (document.getElementById("gpt_login_box")) {
        document.getElementById("gpt_login_box").remove()
    }
    gptResponseCopy = true

    chrome.runtime.sendMessage({ message: 'search-occured-gpt', query: gptquery, gpt_conv_id })
}


// login section bard 
const bard_section_login = (bard_section_div) => {
    if (!document.getElementById("bard_login_box")) {
        let bard_login_box = document.createElement("div")
        bard_login_box.setAttribute("id", "bard_login_box")
        bard_section_div.appendChild(bard_login_box)
        document.getElementById("bardResult").style.display = "none"

        // creating inside of login page
        let infoSrc = infoIcon
        let info = new Image()
        info.setAttribute("id", "infoDiv")
        info.setAttribute("alt", "information icon")

        info.src = infoSrc
        bard_login_box.appendChild(info)

        let warnInfoText = document.createElement("p")
        warnInfoText.setAttribute("id", "warnInfoText")
        bard_login_box.appendChild(warnInfoText)
        warnInfoText.innerText = chrome.i18n.getMessage("appCloudsecurity")

        let loginTextDiv1 = document.createElement("div")
        loginTextDiv1.setAttribute("id", "loginTextDiv1")
        bard_login_box.appendChild(loginTextDiv1)


        let span1 = document.createElement("span")
        span1.innerText = chrome.i18n.getMessage("appLogintext1") + " "
        loginTextDiv1.appendChild(span1)

        let chatGptLink = document.createElement("a")
        chatGptLink.setAttribute("id", "chatGptLink")
        loginTextDiv1.appendChild(chatGptLink)
        chatGptLink.innerText = "bard.google.com"
        chatGptLink.href = "https://bard.google.com/"
        chatGptLink.target = "_blank"

        let span2 = document.createElement("span")
        span2.innerText = " " + chrome.i18n.getMessage("appLogintext")
        loginTextDiv1.appendChild(span2)


    }

}

// login section gpt
const gpt_section_login = (gpt_section_div) => {
    if (!document.getElementById("gpt_login_box")) {
        let gpt_login_box = document.createElement("div")
        gpt_login_box.setAttribute("id", "gpt_login_box")
        gpt_section_div.appendChild(gpt_login_box)
        document.getElementById("gptResult").style.display = "none"



        // creating inside of login page
        let infoSrc = infoIcon
        let info = new Image()
        info.setAttribute("alt", "bard for google information")

        info.setAttribute("id", "infoDiv")
        info.src = infoSrc
        gpt_login_box.appendChild(info)

        let warnInfoText = document.createElement("p")
        warnInfoText.setAttribute("id", "warnInfoText")
        gpt_login_box.appendChild(warnInfoText)
        warnInfoText.innerText = chrome.i18n.getMessage("appCloudsecurity")

        let loginTextDiv1 = document.createElement("div")
        loginTextDiv1.setAttribute("id", "loginTextDiv1 loginTextDiv2")
        gpt_login_box.appendChild(loginTextDiv1)


        let span1 = document.createElement("span")
        span1.innerText = chrome.i18n.getMessage("appLogintext1") + " "
        loginTextDiv1.appendChild(span1)

        let chatGptLink = document.createElement("a")
        chatGptLink.setAttribute("id", "chatGptLink")
        loginTextDiv1.appendChild(chatGptLink)
        chatGptLink.innerText = "chat.openai.com"
        chatGptLink.href = "https://chat.openai.com/chat"
        chatGptLink.target = "_blank"

        let span2 = document.createElement("span")
        span2.innerText = " " + chrome.i18n.getMessage("appLogintext")
        loginTextDiv1.appendChild(span2)
    }

}




// footer section
const footer_section = (panel) => {

    let footer_section_div = document.createElement("div")
    footer_section_div.setAttribute("id", "footer_section_div")
    panel.appendChild(footer_section_div)

    // footer lets chat text and rating div creation
    let rateChatDiv = document.createElement("div")
    rateChatDiv.setAttribute("id", "rateChatDiv")
    footer_section_div.appendChild(rateChatDiv)

    let chatTextDiv = document.createElement("div")
    chatTextDiv.setAttribute("id", "chatTextDiv")
    rateChatDiv.appendChild(chatTextDiv)

    let chatImg = document.createElement("img")
    chatImg.setAttribute("alt", "bard for google ")
    chatImg.setAttribute("id", "chatImg")
    chatImg.src = chatIcon
    chatTextDiv.appendChild(chatImg)

    let chatText = document.createElement("div")
    chatText.setAttribute("id", "chatText")
    chatText.innerText = "Let’s Chat"
    chatTextDiv.appendChild(chatText)
    // chatTextDiv.innerText="Let’s Chat"


    let rateDiv = document.createElement("a")
    rateDiv.setAttribute("id", "rateDiv")
    rateDiv.href = "https://chrome.google.com/webstore/detail/bard-for-google/hnadleianomnjcoeplifgbkiejchjmah/reviews"
    rateDiv.setAttribute("target", "blank")
    rateChatDiv.appendChild(rateDiv)

    let ratingStorage = chrome.storage.local.get(["rated"])
    ratingStorage.then((e) => {
        if (e.rated) {
            rateDiv.style.display = "none"
        }

    })

    let ratingIcon = document.createElement("img")
    ratingIcon.setAttribute("alt", "bard for google ")
    ratingIcon.setAttribute("id", "ratingIcon")
    ratingIcon.src = ratingStar
    rateDiv.appendChild(ratingIcon)

    let rateText = document.createElement("div")
    rateText.setAttribute("id", "rateText")
    rateText.innerText = "Rate us"
    rateDiv.appendChild(rateText)



    rateDiv.addEventListener("click", () => {
        ratingRemoval()
    })

    // footer followup section
    let followUpDiv = document.createElement("div")
    followUpDiv.setAttribute("id", "followUpDiv")
    footer_section_div.appendChild(followUpDiv)

    let inputBox = document.createElement("input")
    inputBox.setAttribute("id", "inputBox")
    inputBox.setAttribute("type", "text")
    inputBox.setAttribute("placeholder", "Ask me anything..")
    followUpDiv.appendChild(inputBox)


    let enterImg = document.createElement("img")
    enterImg.setAttribute("alt", "bard for google ")
    enterImg.setAttribute("id", "enterImg")
    enterImg.src = enterIcon
    followUpDiv.appendChild(enterImg)

    chatTextDiv.addEventListener("click", () => {
        rateChatDiv.style.display = "none"
        followUpDiv.style.display = "flex"
        document.getElementById("copy").style.display = "none"
        footer_section_div.style.border = "none"

        let bardResponseDiv = document.getElementsByClassName("bardResponseDiv")[0]

        chrome.storage.local.get(["mode"], (result) => {
            if (result.mode === "on") {

            } else {
                for (let i = 0; i < bardResponseDiv.length; i++) {
                    bardResponseDiv[i].style.background = "#161B22";
                }
                for (let i = 0; i < bardResponseDiv.length; i++) {
                    bardResponseDiv[i].style.background = "#F4F5FA";
                }
            }
        })
        bardResponseDiv.style.padding = "10px"

        // gptResponseDiv.style.background = "#F4F5FA"


        let ratingStorage = chrome.storage.local.get(["rated"])
        ratingStorage.then((e) => {
            if (!e.rated) {
                document.getElementById("titleRating").style.display = "flex"
            }

        })

        ChatMode()
        hideChatMode = false

    })
    let bardClientDiv = document.querySelectorAll(".bardClientDiv")
    let gptClientDiv = document.querySelectorAll(".gptClientDiv")

    inputBox.addEventListener("keydown", function (event) {

        if (event.keyCode === 13 && inputBox.value != "") {
            Array.from(bardClientDiv).forEach(function (element) {
                element.style.display = "flex";
            });

            Array.from(gptClientDiv).forEach(function (element) {
                element.style.display = "flex";
            });
            followUpFn()
        }
    });
    enterImg.addEventListener("click", () => {
        if (inputBox.value != "") {
            Array.from(bardClientDiv).forEach(function (element) {
                element.style.display = "flex";
            });

            Array.from(gptClientDiv).forEach(function (element) {
                element.style.display = "flex";
            });
            followUpFn()
        }
    })

}
const ChatMode = () => {
    let bardClientDiv = document.querySelectorAll(".bardClientDiv")
    let gptClientDiv = document.querySelectorAll(".gptClientDiv")
    let gptResponseDiv = document.querySelectorAll(".gptResponseDiv")
    let bardResponseDiv = document.querySelectorAll(".bardResponseDiv")

    Array.from(bardClientDiv).forEach(function (element) {
        element.style.display = "flex";
    });

    Array.from(gptClientDiv).forEach(function (element) {
        element.style.display = "flex";
    });

    Array.from(gptResponseDiv).forEach(function (element) {
        element.style.background = "#F6F8FA"
    });

    Array.from(bardResponseDiv).forEach(function (element) {
        element.style.background = "#F6F8FA"
    });

}
const followUpFn = () => {
    if (document.getElementById("gpt_section_div").style.display === "flex") {
        gptquery = inputBox.value

        // gpt_btn_listener()
        let gptResult = document.getElementById("gptResult")
        gptClientMsg(gptquery)
        loaderCreation(gptResult)

        let gptResponseDiv = document.createElement("div")
        gptResponseDiv.setAttribute("class", "gptResponseDiv")
        gptResult.appendChild(gptResponseDiv)

        if (document.getElementById("gpt_login_box")) {
            document.getElementById("gpt_login_box").remove()
        }
        gptResult.style.display = "flex"

        gptResponseCopy = true

        chrome.runtime.sendMessage({ message: 'search-occured-gpt', query: gptquery, gpt_conv_id })


    } else if (document.getElementById("bard_section_div").style.display === "flex") {
        bardquery = inputBox.value



        // bard_btn_listener()
        let bardResult = document.getElementById("bardResult")
        bardClientMsg(bardquery)
        loaderCreation(bardResult)
        if (document.getElementById("bard_login_box")) {
            document.getElementById("bard_login_box").remove()
        }
        bardResult.style.display = "flex"

        chrome.runtime.sendMessage({ message: 'search-occured-bard', query: bardquery, bard_conv_id })
    }
    inputBox.value = ""
}

const copyBtnListener = () => {
    let panel = document.querySelector("#panel")
    let allCodeTag = panel.querySelectorAll("code")
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
            copyBtn.src = copyIconDark
            copyDiv.appendChild(copyBtn)

            copyDiv.addEventListener("click", () => {

                copyDiv.innerText = "Copied"

                navigator.clipboard.writeText(e.innerText);
                setTimeout(() => {
                    copyDiv.innerText = "Copy code"
                    copyDiv.appendChild(copyBtn)

                }, 2000)
            })

            chrome.storage.local.get(["mode"], (result) => {
                if (result.mode === "on") {
                    copyPanel.style.background = "#1E2336"
                } else {
                    copyPanel.style.background = "#DADDEA"

                }
            })
        }


    })
}

let bardClientMsg = (quer) => {

    let bardResult = document.getElementById("bardResult")
    let bardClientDiv = document.createElement("div")
    bardClientDiv.setAttribute("class", "bardClientDiv")
    bardResult.appendChild(bardClientDiv)
    bardClientDiv.innerText = quer
    // bardResult.scrollTop = bardClientDiv.offsetTop;


}

let gptClientMsg = (quer) => {
    let gptResult = document.getElementById("gptResult")
    let gptClientDiv = document.createElement("div")
    gptClientDiv.setAttribute("class", "gptClientDiv")
    gptResult.appendChild(gptClientDiv)
    gptClientDiv.innerText = quer
    // gptResult.scrollTop = gptClientDiv.offsetTop;


}


//setting rated value in storage
// chrome.storage.local.set({ rated: false })
const ratingRemoval = () => {
    chrome.storage.local.set({ rated: true })

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
                // copyDiv.style.color="#E7E8EB"
            });
            copyDivs.forEach((copyDiv) => {
                copyDiv.style.color = "#E7E8EB"

            });
            copyBtns.forEach((copyBtn) => {
                copyBtn.src = copyIcon
            })
            copyPanel.forEach((cPanel) => {
                cPanel.style.background = "#1E2336"
            })
        } else {
            if (!hideChatMode) {

                bardResponseDiv.style.background = "#F4F5FA"
                bardResponseDiv.style.padding = "10px"


            }

            codeTags.forEach((codeTag) => {
                codeTag.style.background = "#F4F5FA";
                codeTag.style.color = "#000";
                // copyDiv.style.color = "#6170AB"

            });
            copyDivs.forEach((copyDiv) => {
                copyDiv.style.color = "#6170AB"

            });
            copyBtns.forEach((copyBtn) => {
                copyBtn.src = copyIconDark
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
                // copyDiv.style.color="#E7E8EB"

            });

            copyDivs.forEach((copyDiv) => {
                copyDiv.style.color = "#E7E8EB"

            });
            copyBtns.forEach((copyBtn) => {
                copyBtn.src = copyIcon
            })
            copyPanel.forEach((cPanel) => {
                cPanel.style.background = "#1E2336"
            })

        } else {
            // gptResponseDiv.style.background = "#F4F5FA"
            codeTags.forEach((codeTag) => {
                codeTag.style.background = "#F4F5FA";
                codeTag.style.color = "#000";
                // copyDiv.style.color="#6170AB"

            });
            copyDivs.forEach((copyDiv) => {
                copyDiv.style.color = "#6170AB"

            });
            copyBtns.forEach((copyBtn) => {
                copyBtn.src = copyIconDark
            })
            copyPanel.forEach((cPanel) => {
                cPanel.style.background = "#DADDEA"
            })

        }
    })
}


let bardResponseMsg = (quer) => {
    let bardResult = document.getElementById("bardResult")
    let bardResponseDiv = document.createElement("div")

    bardResponseDiv.setAttribute("class", "bardResponseDiv")
    bardResult.appendChild(bardResponseDiv)
    bardFirstAns = quer
    // hljs.highlightAll()
    bardResponseDiv.innerHTML = quer
    if (targetLocation.includes("www.google.") || targetLocation.includes("www.bing.") || targetLocation.includes("search.yahoo.") || targetLocation.includes("duckduckgo.") || targetLocation.includes("www.baidu.") || targetLocation.includes("yandex.")) {
        hljs.highlightAll()

    }
    copyBtnListener()
    bardCopySection(bardResponseDiv)
    document.getElementById("footer_section_div").style.display = "flex"
    bardResult.scrollTop = bardResponseDiv.offsetTop;

    let copyBardRes = document.createElement("div")
    copyBardRes.setAttribute("id", "copyBardRes")
    bardResult.appendChild(copyBardRes)
    let bardResCopy = document.createElement("img")
    bardResCopy.setAttribute("id", "bardResCopy")
    bardResCopy.src = copyIconDark
    copyBardRes.appendChild(bardResCopy)

    bardResCopy.addEventListener("click", () => {
        navigator.clipboard.writeText(bardResponseDiv.innerText);

    })


}

let gptResponseMsg = (quer) => {
    let gptResponseDivLen = document.getElementsByClassName("gptResponseDiv").length
    let gptResponseDiv = document.getElementsByClassName("gptResponseDiv")[gptResponseDivLen - 1]
    let gptResult = document.getElementById("gptResult")
    // let copyGptRes = document.querySelectorAll("#copyGptRes")

    gptFirstAns = quer
    // hljs.highlightAll()
    gptResponseDiv.innerHTML = quer
    if (targetLocation.includes("www.google.") || targetLocation.includes("www.bing.") || targetLocation.includes("search.yahoo.") || targetLocation.includes("duckduckgo.") || targetLocation.includes("www.baidu.") || targetLocation.includes("yandex.")) {
        hljs.highlightAll()

    }
    copyBtnListener()
    gptCopySection(gptResponseDiv)
    document.getElementById("footer_section_div").style.display = "flex"
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



chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    loaderRemoval()
    if (!hideChatMode) {
        ChatMode()
    }

    if (response.message === 'answer') {

        let gpt_section_div = document.getElementById("gpt_section_div")
        gpt_section_div.style.justifyContent = "flex-start"
        gpt_section_div.style.alignItems = "flex-start"
        gpt_section_div.style.flexDirection = "column"



        let { answer, gptConversationId } = response
        gpt_conv_id = gptConversationId

        const markdown = window.markdownit()
        const html = markdown.render(answer)
        gptResponseMsg(html)



    } else if (response.message === "gptErrAnswer") {



        let gpt_section_div = document.getElementById("gpt_section_div")
        gpt_section_div.style.justifyContent = "flex-start"
        gpt_section_div.style.alignItems = "flex-start"

        if (!document.getElementById("gptErrMsg")) {
            let gptErrMsg = document.createElement("div")
            gpt_section_div.appendChild(gptErrMsg)
            gptErrMsg.setAttribute("id", "gptErrMsg")
            gptErrMsg.innerHTML = "Something went wrong please reload page or visit  "

            let chatGptLink = document.createElement("a")
            chatGptLink.setAttribute("id", "chatGptLink")
            gpt_section_div.appendChild(chatGptLink)
            chatGptLink.innerText = "chat.openai.com"
            chatGptLink.href = "https://chat.openai.com/chat"
            chatGptLink.target = "_blank"

            setTimeout(() => {
                // gptFetchStats = 0

                gpt_btn_listener()
                gptErrMsg.remove()
                chatGptLink.remove()
            }, 5000);
        }

    } else if (response.message === "bardAnswer") {
        let bard_section_div = document.getElementById("bard_section_div")


        // bard_section_div.style.display="flex"
        bard_section_div.style.justifyContent = "flex-start"
        bard_section_div.style.alignItems = "flex-start"
        bard_section_div.style.flexDirection = "column"

        let { bardAnswer } = response
        let final_bard_answer = JSON.parse(bardAnswer)
        if (final_bard_answer === null) {
            bard_section_login(bard_section_div)
            document.getElementById("bard_login_box").style.display = "flex"

        } else {
            try {

                const markdown = window.markdownit()
                const html = markdown.render(final_bard_answer[0][0])

                bard_conv_id.Cval = final_bard_answer[1][0] || ""
                bard_conv_id.Rval = final_bard_answer[1][1] || ""
                bard_conv_id.RCval = final_bard_answer[4][0][0] || ""

                bardResponseMsg(html)

            } catch (error) {

                bard_section_login(bard_section_div)

            }
        }



    } else if (response.message === "bardNotAvailable") {

        let bard_section_div = document.getElementById("bard_section_div")
        // bard_section_div.innerHTML = "Bard isn't currently supported in your country. Stay tuned!"
        bard_section_login(bard_section_div)



    } else if (response.message === "askBard") {
        let { selectedText } = response
        // query = selectedText
        gptquery = searchContent
        bardquery = searchContent
        // draggableDivContainer("askBard")
    } else if (response.message === "askGpt") {
        let { selectedText } = response
        // query = selectedText
        gptquery = searchContent
        bardquery = searchContent
        // draggableDivContainer("askGpt")
    }

    else if (response.message === "light") {
        lightmode()
    } else if (response.message === "dark") {
        darkmode()
    }
})



const darkmode = () => {
    let parentPanelDiv = document.getElementById("parentPanelDiv")
    let bard_section_div = document.getElementById("bard_section_div")
    let gpt_section_div = document.getElementById("gpt_section_div")
    let loginTextDiv1 = document.getElementById("loginTextDiv1")
    let loginTextDiv2 = document.getElementById("loginTextDiv2")
    let headerSection = document.getElementById("headerSection")
    let bardResponseDiv = document.getElementsByClassName("bardResponseDiv")
    let gptResponseDiv = document.getElementsByClassName("gptResponseDiv")


    let bardTab = document.getElementById("bardTab")
    let gptTab = document.getElementById("gptTab")
    let inputBox = document.getElementById("inputBox")
    let codeTags = document.querySelectorAll("#panel code");
    let copyDivs = document.querySelectorAll("#copyDiv")
    let copyBtns = document.querySelectorAll("#copyBtn")
    let copyPanel = document.querySelectorAll("#copyPanel")


    modeLogo.src = darkmoon
    parentPanelDiv.style.background = "#0d1117"
    titleLogo.src = bardGptLogoWhite
    copyLogo.src = copyIconDark
    bard_section_div.style.color = "#ffffff"
    gpt_section_div.style.color = "#ffffff"
    inputBox.style.background = "#0D0D0D"
    inputBox.style.border = "1px solid #242424"
    // gptTab.style.color = "#fff"
    headerSection.style.background = "#2A2A2A"




    for (let i = 0; i < bardResponseDiv.length; i++) {
        bardResponseDiv[i].style.background = "#161B22";
    }

    for (let i = 0; i < gptResponseDiv.length; i++) {
        gptResponseDiv[i].style.background = "#161B22";
    }



    if (loginTextDiv1) {
        loginTextDiv1.style.color = "#fff"
    }
    if (loginTextDiv2) {
        loginTextDiv2.style.color = "#fff"
    }
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
        copyBtn.src = copyIcon
    })
    copyPanel.forEach((copyPane) => {
        copyPane.style.background = "#1E2336";
    })
}

const lightmode = () => {
    let parentPanelDiv = document.getElementById("parentPanelDiv")
    let bard_section_div = document.getElementById("bard_section_div")
    let gpt_section_div = document.getElementById("gpt_section_div")
    let loginTextDiv1 = document.getElementById("loginTextDiv1")
    let loginTextDiv2 = document.getElementById("loginTextDiv2")
    let headerSection = document.getElementById("headerSection")
    let bardResponseDiv = document.getElementsByClassName("bardResponseDiv")
    let gptResponseDiv = document.getElementsByClassName("gptResponseDiv")

    let bardTab = document.getElementById("bardTab")
    let gptTab = document.getElementById("gptTab")
    let inputBox = document.getElementById("inputBox")
    let codeTags = document.querySelectorAll("#panel code");
    let copyDivs = document.querySelectorAll("#copyDiv")
    let copyBtns = document.querySelectorAll("#copyBtn")
    let copyPanel = document.querySelectorAll("#copyPanel")
    // let gptResCopy = document.getElementById("gptResCopy")

    modeLogo.src = lightmoon
    parentPanelDiv.style.background = "#ffffff"
    titleLogo.src = bardGptLogo
    copyLogo.src = copyIcon
    bard_section_div.style.color = "#4d5156"
    gpt_section_div.style.color = "#4d5156"
    inputBox.style.background = "#FFFFFF"
    inputBox.style.border = "1px solid #E8E8E8"

    headerSection.style.background = "#EFEFEF"

    if (loginTextDiv1) {
        loginTextDiv1.style.color = "#000"
    }
    if (loginTextDiv2) {
        loginTextDiv2.style.color = "#000"
    }



    for (let i = 0; i < bardResponseDiv.length; i++) {
        bardResponseDiv[i].style.background = "#F4F5FA";
    }

    for (let i = 0; i < gptResponseDiv.length; i++) {
        gptResponseDiv[i].style.background = "#F4F5FA";
    }

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
        copyBtn.src = copyIconDark
    })

    copyPanel.forEach((copyPane) => {
        copyPane.style.background = "#DADDEA";
    })



}


window.addEventListener('focus', () => {

    if (document.getElementById("gpt_section_div") && document.getElementById("gpt_section_div").style.display === "flex") {


        let access = chrome.storage.sync.get("accessToken")
        access.then((e) => {
            if (e.accessToken) {

                if (document.getElementById("gpt_login_box")) {
                    document.getElementById("gpt_login_box").style.display = "none"
                    gpt_btn_listener()

                }

            } else {
                chrome.runtime.sendMessage({ message: 'session-check' })
                chrome.runtime.onMessage.addListener(async function (response, sender, sendResponse) {
                    if (response.message === "session-updated") {
                        let access = chrome.storage.sync.get("accessToken")
                        access.then((e) => {
                            if (e.accessToken) {

                                if (document.getElementById("gpt_login_box")) {
                                    document.getElementById("gpt_login_box").style.display = "none"
                                    gpt_btn_listener()

                                }

                            }
                        })
                    }

                })

            }
        })

    }

    if (document.getElementById("bard_section_div")) {

        let bard_access_token = chrome.storage.local.get(["bard_api_key"])
        bard_access_token.then((e) => {
            if (e.bard_api_key) {

                if (document.getElementById("bard_login_box")) {
                    document.getElementById("bard_login_box").style.display = "none"
                    // bard_btn_listener()
                    bardCall()

                }
            }
        }
        )
    }



    if (window.location.href.includes("https://bard.google.com/")) {
        bard_key_func()
    }

});


if (window.location.href.includes("https://bard.google.com/")) {
    bard_key_func()
}