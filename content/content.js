

let query = ""
let gpt_access_token_validity   
let panelHeight
let gptDone = 0
let bardDone = 0
let targetLocation = window.location.hostname

let icon = chrome.runtime.getURL("static/images/icon64.png")
let gptLogo = chrome.runtime.getURL("static/images/gptLogo.svg")
let bardLogo = chrome.runtime.getURL("static/images/bardLogo.svg")
let infoIcon = chrome.runtime.getURL("static/images/info.png")
let loaderIcon = chrome.runtime.getURL("static/images/loader.png")
let maximizeIcon = chrome.runtime.getURL("static/images/maximizeIcon.png")
let minimizeIcon = chrome.runtime.getURL("static/images/minimizeIcon.png")
let editingIcon = chrome.runtime.getURL("static/images/editingIcon.svg")
let searchIcon = chrome.runtime.getURL("static/images/searchIcon.svg")
let copyIcon = chrome.runtime.getURL("static/images/copyIcon.svg")
let closeIcon = chrome.runtime.getURL("static/images/closeIcon.png")

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
            chrome.runtime.sendMessage({ message: 'bard_key_check', bard_keyVal, bardPath })

            clearInterval(bard_interval)
        }
    }, 1000);
}

if (window.location.href === "https://bard.google.com/") {
    bard_key_func()
}

if (targetLocation.includes("www.google.")) {
    chrome.storage.local.get(["toggleState"], (result) => {
        if(result.toggleState==="on"){
            waitUntilVideoElementLoads()
        }
    })
}

async function waitUntilVideoElementLoads() {
    return await new Promise((resolve) => {
        const interval = setInterval(() => {
            let element = document.querySelector(".GyAeWb")

            let finalState = true;

            if (!element) finalState = false;

            if (finalState) {
                let searchContent = document.querySelectorAll(`[aria-label="Search"]`)[0].value
                query = searchContent

                const panel = document.createElement("div");
                panel.setAttribute("id", "panel");

                let google_inner_div = document.querySelector(".TQc1id.rhstc4")
                let google_map_page = document.querySelector("#search > div")
                let google_page_page1 = document.querySelector(".TQc1id.rhstc5.N4Xssf")



                if (google_inner_div) {
                    google_inner_div.prepend(panel)

                } else if (google_page_page1) {
                    google_page_page1.prepend(panel)
                } else if (google_map_page) {
                    element.style.flexWrap = "wrap"
                    google_map_page.appendChild(panel)
                    google_map_page.style.display = "flex"
                    google_map_page.style.width = "180%"
                    if (document.querySelector("#rso")) {
                        let rsoElem = document.querySelector("#rso").children

                        for (let i = 0; i < rsoElem.length; i++) {
                            rsoElem[i].style.width = "600px"
                            panel.style.marginLeft = "85px";
                        }
                    }
                }
                else {
                    element.style.flexWrap = "nowrap"
                    element.appendChild(panel)
                }

                header(panel)
                bard_section(panel)
                gpt_section(panel)

                clearInterval(interval);
            }
        }, 1000);
    });
}

const header = (panel) => {
    let headerSection = document.createElement("div")
    headerSection.setAttribute("id", "header_section")
    panel.appendChild(headerSection)

    Bard_Header_creation(headerSection)
    gpt_Header_creation(headerSection)

}

let Bard_Header_creation = (headerSection) => {
    // BARD Header
    let bard_header = document.createElement("div")
    bard_header.setAttribute("id", "bard_header")
    headerSection.appendChild(bard_header)

    let bard_header_container = document.createElement("div")
    bard_header_container.setAttribute("id", "bard_header_container")
    bard_header.appendChild(bard_header_container)



    let bard_header_border = document.createElement("div")
    bard_header_border.setAttribute("id", "bard_header_border")
    bard_header.appendChild(bard_header_border)


    // Bard icon
    let bard_header_Icon = document.createElement("img")
    bard_header_Icon.setAttribute("id", "bardIcon")
    bard_header_Icon.setAttribute("alt", "bard for google")
    bard_header_Icon.src = bardLogo
    bard_header_container.appendChild(bard_header_Icon)

    // Bard Text
    let bard_header_Text = document.createElement("p")
    // bard_header_Text.setAttribute("id", "")
    bard_header_Text.innerText = "Bard AI"
    bard_header_container.appendChild(bard_header_Text)

    bard_header.addEventListener("click", bard_btn_listener)


    //mouse hove and mouse out event on header
    bard_header.addEventListener("mouseover", () => {
        if (document.getElementById("bard_section_div").style.display !== "flex") {
            bard_header_container.style.opacity = "1"
        }

    })
    bard_header.addEventListener("mouseout", () => {

        if (document.getElementById("bard_section_div").style.display !== "flex") {
            bard_header_container.style.opacity = "0.5"

        }
    })

}
let bard_btn_listener = () => {
    // bard header Event

    let bard_section_div = document.getElementById("bard_section_div")
    let gpt_section_div = document.getElementById("gpt_section_div")
    let gpt_header_border = document.getElementById("gpt_header_border")
    let bard_header_border = document.getElementById("bard_header_border")
    let bard_header_container = document.getElementById("bard_header_container")
    let gpt_header_container = document.getElementById("gpt_header_container")
    bard_section_div.style.display = "flex"
    gpt_section_div.style.display = "none"
    bard_section_div.style.flexDirection = "column"
    gpt_header_border.style.display = "none"
    bard_header_border.style.display = "block"
    bard_header_container.style.opacity = "1"
    gpt_header_container.style.opacity = "0.5"


    if (document.getElementById("bard_section_div").innerText === "") {

        if (!document.getElementById("bard_loader")) {
            let bard_loader = document.createElement("img")
            bard_loader.setAttribute("alt", "bard for google loader")

            bard_loader.setAttribute("id", "bard_loader")
            bard_loader.src = loaderIcon
            bard_section_div.appendChild(bard_loader)
            bard_section_div.style.justifyContent = "center"
            bard_section_div.style.alignItems = "center"
        }

        bardDone = 0
        chrome.runtime.sendMessage({ message: 'search-occured-bard', query: query })
    }


    // })
}

let gpt_Header_creation = (headerSection) => {
    // gpt Header
    let gpt_header = document.createElement("div")
    gpt_header.setAttribute("id", "gpt_header")
    headerSection.appendChild(gpt_header)

    let gpt_header_container = document.createElement("div")
    gpt_header_container.setAttribute("id", "gpt_header_container")
    gpt_header.appendChild(gpt_header_container)

    let gpt_header_border = document.createElement("div")
    gpt_header_border.setAttribute("id", "gpt_header_border")
    gpt_header.appendChild(gpt_header_border)

    // gpt icon
    let gpt_header_Icon = document.createElement("img")
    gpt_header_Icon.setAttribute("alt", "gpt for google loader")

    gpt_header_Icon.setAttribute("id", "gptIcon")
    gpt_header_Icon.src = gptLogo
    gpt_header_container.appendChild(gpt_header_Icon)

    // gpt Text
    let gpt_header_Text = document.createElement("p")
    gpt_header_Text.innerText = "ChatGPT"
    gpt_header_container.appendChild(gpt_header_Text)

    gpt_header.addEventListener("click", gpt_btn_listener)

    //mouse hove and mouse out event on header
    gpt_header.addEventListener("mouseover", () => {
        if (document.getElementById("gpt_section_div").style.display !== "flex") {
            gpt_header_container.style.opacity = "1"
        }

    })
    gpt_header.addEventListener("mouseout", () => {

        if (document.getElementById("gpt_section_div").style.display !== "flex") {
            gpt_header_container.style.opacity = "0.5"

        }
    })



}

// gpt btn listener
const gpt_btn_listener = () => {

    let bard_section_div = document.getElementById("bard_section_div")
    let gpt_section_div = document.getElementById("gpt_section_div")
    let gpt_header_border = document.getElementById("gpt_header_border")
    let bard_header_border = document.getElementById("bard_header_border")
    let bard_header_container = document.getElementById("bard_header_container")
    let gpt_header_container = document.getElementById("gpt_header_container")
    bard_section_div.style.display = "none"
    gpt_section_div.style.display = "flex"
    gpt_header_border.style.display = "block"
    bard_header_border.style.display = "none"
    bard_header_container.style.opacity = "0.5"
    gpt_header_container.style.opacity = "1"



    if (document.getElementById("gpt_section_div").innerText === "") {
        // check gpt token validity
        let access = chrome.storage.sync.get("accessToken")
        access.then((e) => {
            if (e.accessToken) {
                gpt_access_token_validity = true

                if (!document.getElementById("gpt_loader")) {
                    let gpt_loader = document.createElement("img")
                    gpt_loader.setAttribute("alt", "gpt for google loader")

                    gpt_loader.setAttribute("id", "gpt_loader")
                    gpt_loader.src = loaderIcon
                    gpt_section_div.appendChild(gpt_loader)
                    gpt_section_div.style.justifyContent = "center"
                    gpt_section_div.style.alignItems = "center"
                    gptDone = 0
                    chrome.runtime.sendMessage({ message: 'search-occured-gpt', query: query })

                }

            } else {
                gpt_section_login(gpt_section_div)
            }
        })
    } else {
        return
    }


}

// bard section
const bard_section = (panel) => {
    let bard_section_div = document.createElement("div")
    bard_section_div.setAttribute("id", "bard_section_div")
    panel.appendChild(bard_section_div)

    let bard_access_token = chrome.storage.local.get(["bard_api_key"])
    bard_access_token.then((e) => {
        if (e.bard_api_key) {

            if (!document.getElementById("bard_loader")) {

                let bard_loader = document.createElement("img")
                bard_loader.setAttribute("alt", "bard for google loader")

                bard_loader.setAttribute("id", "bard_loader")
                bard_loader.src = loaderIcon
                bard_section_div.appendChild(bard_loader)
                chrome.runtime.sendMessage({ message: 'search-occured-bard', query: query })

            }


        } else {
            bard_section_login(bard_section_div)
        }
    })




}

const bard_section_login = (bard_section_div) => {
    if (!document.getElementById("bard_login_box")) {
        let bard_login_box = document.createElement("div")
        bard_login_box.setAttribute("id", "bard_login_box")
        bard_section_div.appendChild(bard_login_box)

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
        warnInfoText.innerText = "Cloudflare Security check required"

        let loginTextDiv1 = document.createElement("div")
        loginTextDiv1.setAttribute("id", "loginTextDiv1")
        bard_login_box.appendChild(loginTextDiv1)

        let span1 = document.createElement("span")
        span1.innerText = "Please login "
        loginTextDiv1.appendChild(span1)

        let chatGptLink = document.createElement("a")
        chatGptLink.setAttribute("id", "chatGptLink")
        loginTextDiv1.appendChild(chatGptLink)
        chatGptLink.innerText = "bard.google.com"
        chatGptLink.href = "https://bard.google.com/"
        chatGptLink.target = "_blank"

        let span2 = document.createElement("span")
        span2.innerText = " once and come back"
        loginTextDiv1.appendChild(span2)

        // let bard_warn_text = document.createElement("div")
        // bard_warn_text.setAttribute("id", "bard_warn_text")
        // bard_warn_text.innerText = "NOTE: Bard may not currently supported in your country"
        // bard_login_box.appendChild(bard_warn_text)

    }

}

//gpt section
const gpt_section = (panel) => {

    let gpt_section_div = document.createElement("div")
    gpt_section_div.setAttribute("id", "gpt_section_div")
    panel.appendChild(gpt_section_div)


}

const gpt_section_login = (gpt_section_div) => {
    if (!document.getElementById("gpt_login_box")) {
        let gpt_login_box = document.createElement("div")
        gpt_login_box.setAttribute("id", "gpt_login_box")
        gpt_section_div.appendChild(gpt_login_box)

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
        warnInfoText.innerText = "Cloudflare Security check required"

        let loginTextDiv1 = document.createElement("div")
        loginTextDiv1.setAttribute("id", "loginTextDiv1")
        gpt_login_box.appendChild(loginTextDiv1)

        let span1 = document.createElement("span")
        span1.innerText = "Please login "
        loginTextDiv1.appendChild(span1)

        let chatGptLink = document.createElement("a")
        chatGptLink.setAttribute("id", "chatGptLink")
        loginTextDiv1.appendChild(chatGptLink)
        chatGptLink.innerText = "chat.openai.com"
        chatGptLink.href = "https://chat.openai.com/chat"
        chatGptLink.target = "_blank"

        let span2 = document.createElement("span")
        span2.innerText = " once and come back"
        loginTextDiv1.appendChild(span2)
    }



}
//dragging effect
const draggin = (draggableDiv, draggingPanel) => {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX = 50;
    let initialY = 50;
    let xOffset = 0;
    let yOffset = 0;

    draggingPanel.addEventListener("mousedown", dragStart);
    draggingPanel.addEventListener("mouseup", dragEnd);
    draggingPanel.addEventListener("mousemove", drag);

    draggingPanel.addEventListener("mouseleave", dragEnd); // add mouseleave listener

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === draggingPanel) {
            isDragging = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, draggableDiv);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

}

const editBtn = (draggableDiv) => {
    let panel_edit_panel = document.createElement("div")
    panel_edit_panel.setAttribute("id", "panel_edit_panel")
    panel_edit_panel.style.width = "30px"
    draggableDiv.appendChild(panel_edit_panel)
    let edit_Icon = document.createElement("img")
    edit_Icon.setAttribute("alt", "bard for google ")
    edit_Icon.setAttribute("id", "edit_Icon")
    edit_Icon.src = editingIcon
    panel_edit_panel.appendChild(edit_Icon)




    // creating searchDiv
    let search_Div = document.createElement("div")
    search_Div.setAttribute("id", "search_Div")
    panel_edit_panel.appendChild(search_Div)

    // creating input and search
    let editInput = document.createElement("input")
    editInput.setAttribute("id", "editInput")
    editInput.setAttribute("type", "text")
    editInput.value = query

    search_Div.appendChild(editInput)

    let search_Icon = document.createElement("img")
    search_Icon.setAttribute("alt", "bard for google search")
    search_Icon.setAttribute("id", "search_Icon")
    search_Icon.src = searchIcon
    search_Div.appendChild(search_Icon)


    //editing button event
    edit_Icon.addEventListener("click", () => {
        if (panel_edit_panel.style.width === "30px") {
            panel_edit_panel.style.width = "325px"
            search_Div.style.display = "flex"
        } else {
            panel_edit_panel.style.width = "30px"
            search_Div.style.display = "none"

        }
    })





    //search button event
    search_Icon.addEventListener("click", () => {
        if (document.getElementById("gpt_section_div").style.display === "flex") {
            query = editInput.value
            draggableDivContainer("askGpt")
            panel_edit_panel.style.width = "30px"
            search_Div.style.display = "none"

        } else if (document.getElementById("bard_section_div").style.display === "flex") {
            query = editInput.value
            draggableDivContainer("askBard")
            panel_edit_panel.style.width = "30px"
            search_Div.style.display = "none"
        }

    })
    editInput.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            if (document.getElementById("gpt_section_div").style.display === "flex") {
                query = editInput.value
                draggableDivContainer("askGpt")
                panel_edit_panel.style.width = "30px"
                search_Div.style.display = "none"

            } else if (document.getElementById("bard_section_div").style.display === "flex") {
                query = editInput.value
                draggableDivContainer("askBard")
                panel_edit_panel.style.width = "30px"
                search_Div.style.display = "none"
            }
        }
    });

}

// draggable all url panel creation
const draggableDivContainer = (contexVal) => {

    if (document.getElementById("bard_section_div")) {
        document.getElementById("bard_section_div").innerText = ""

    }
    if (document.getElementById("gpt_section_div")) {
        document.getElementById("gpt_section_div").innerText = ""

    }
    if (document.getElementById("editInput")) {
        document.getElementById("editInput").value = query
    }


    if (document.querySelector("#panel")) {
        if (contexVal === "askGpt") {
            gpt_btn_listener()
        } else if (contexVal === "askBard") {
            bard_btn_listener()
        }
    } else {
        let draggableDiv = document.createElement("div")
        draggableDiv.setAttribute("id", "draggable_bard_gpt")
        document.querySelector("body").appendChild(draggableDiv)


        // creating drag head part
        let draggingPanel = document.createElement("div")
        draggingPanel.setAttribute("id", "dragging_panel_gpt")
        draggableDiv.appendChild(draggingPanel)



        // editing button section
        editBtn(draggableDiv)

        //minimize btn section
        let panel_minimize_panel = document.createElement("div")
        panel_minimize_panel.setAttribute("id", "panel_minimize_panel")
        draggingPanel.appendChild(panel_minimize_panel)
        let max_min_Icon = document.createElement("img")
        max_min_Icon.setAttribute("alt", "max min icon")
        max_min_Icon.setAttribute("id", "max_min_Icon")
        max_min_Icon.src = minimizeIcon
        panel_minimize_panel.appendChild(max_min_Icon)
        panel_minimize_panel.addEventListener("click", () => {
            let panel = document.querySelector("#panel")
            if (max_min_Icon.src === minimizeIcon) {
                max_min_Icon.src = maximizeIcon
                panel.style.display = "none"
                panel_edit_panel.style.display = " none"
                // draggable_bard_gpt
                draggableDiv.style.padding = "0px 10px 0px 10px"
            } else {
                max_min_Icon.src = minimizeIcon
                panel.style.display = "block"
                panel_edit_panel.style.display = " flex"
                draggableDiv.style.padding = "0px 10px 10px 10px"


            }
        })


        //close  btn section
        let panel_close_panel = document.createElement("div")
        panel_close_panel.setAttribute("id", "panel_close_panel")
        draggingPanel.appendChild(panel_close_panel)

        // close Icon
        let closeimg = document.createElement("img")
        closeimg.setAttribute("id", "closeImg")
        closeimg.src = closeIcon
        closeimg.setAttribute("alt", "close Icon bard")
        panel_close_panel.appendChild(closeimg)

        panel_close_panel.addEventListener("click", () => {
            draggableDiv.remove()
        })



        // mouse hover effect on draggableDiv
        draggableDiv.addEventListener("mouseover", () => {
            panel_minimize_panel.style.display = "flex"
            panel_close_panel.style.display = "flex"
            if (document.getElementById("gpt_section_div").style.display === "flex" && gptDone === 1 && panel.style.display === "block") {
                document.getElementById("panel_edit_panel").style.display = "flex"
            } else if (document.getElementById("bard_section_div").style.display === "flex" && bardDone === 1 && panel.style.display === "block") {
                document.getElementById("panel_edit_panel").style.display = "flex"

            }

        })
        draggableDiv.addEventListener("mouseout", () => {
            panel_minimize_panel.style.display = "none"
            panel_close_panel.style.display = "none"
            if (document.getElementById("gpt_section_div").style.display === "flex") {
                document.getElementById("panel_edit_panel").style.display = "none"
            } else if (document.getElementById("bard_section_div").style.display === "flex") {
                document.getElementById("panel_edit_panel").style.display = "none"
            }
        })

        const panel = document.createElement("div");
        panel.setAttribute("id", "panel");
        draggableDiv.appendChild(panel)
        header(panel)
        bard_section(panel)
        gpt_section(panel)

        if (contexVal === "askGpt") {
            gpt_btn_listener()
        } else if (contexVal === "askBard") {
            bard_btn_listener()
        }
        draggin(draggableDiv, draggingPanel)

    }

    max_min_Icon.src = minimizeIcon
    panel.style.display = "block"



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
            copyBtn.src = copyIcon
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
        // let copyPanel = document.createElement("div")
        // copyPanel.setAttribute("id", "copyPanel")
        // e.parentNode.insertBefore(copyPanel, e);

    })
}

// response handling 
chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {

    if (response.message === 'answer') {
        // return
        if (document.getElementById("gpt_loader")) {
            document.getElementById("gpt_loader").remove()

        }

        let gpt_section_div = document.getElementById("gpt_section_div")
        gpt_section_div.style.justifyContent = "flex-start"
        gpt_section_div.style.alignItems = "flex-start"



        let { answer } = response

        const markdown = window.markdownit()
        const html = markdown.render(answer)
        gpt_section_div.innerHTML = html
        hljs.highlightAll()
        copyBtnListener()




    } else if (response.message === "gptErrAnswer") {
        if (document.getElementById("gpt_loader")) {
            document.getElementById("gpt_loader").remove()

        }

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
        }






    } else if (response.message === "bardAnswer") {
        let bard_section_div = document.getElementById("bard_section_div")

        if (document.getElementById("bard_loader")) {
            document.getElementById("bard_loader").remove()

        }
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
                bard_section_div.innerHTML = html
                hljs.highlightAll()
                copyBtnListener()
                bardDone = 1

            } catch (error) {
                bard_section_login(bard_section_div)

            }
        }



    } else if (response.message === "bardNotAvailable") {
        if (document.getElementById("gpt_loader")) {
            document.getElementById("gpt_loader").remove()

        }
        let bard_section_div = document.getElementById("bard_section_div")
        bard_section_div.innerHTML = "Bard isn't currently supported in your country. Stay tuned!"

    } else if (response.message === "askBard") {
        let { selectedText } = response
        query = selectedText
        draggableDivContainer("askBard")
    } else if (response.message === "askGpt") {
        let { selectedText } = response
        query = selectedText
        draggableDivContainer("askGpt")
    } else if (response.message === "done") {
        if (document.getElementById("panel_edit_panel") && document.getElementById("gpt_section_div").style.display === "flex") {
            gptDone = 1
        }
    }
})




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
                    bard_btn_listener()

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


  