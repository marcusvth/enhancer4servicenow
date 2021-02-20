var lastChatAccepted = null;
var audioUrl = chrome.runtime.getURL('ring.mp3');
var audio = new Audio(audioUrl);

setInterval(checkForActiveChats, 2000);
setInterval(checkInbox, 500);

function checkInbox(){
    var inbox = document.querySelector('sn-inbox').shadowRoot;
    var inboxCards = inbox.querySelectorAll('sn-inbox-card');

    if (!inboxCards.length)
        console.log('%cNo inbox cards found...', 'color: purple;');
    
        inboxCards.forEach(card => {
        audio.play();
        var currentChatId = card.shadowRoot.querySelector('div.sn-card-header').textContent;
        console.log(`${currentChatId} detected!`);
        if (lastChatAccepted == currentChatId) return;
        console.log(`Checking for buttons...`);
        var nowButtons = card.shadowRoot.querySelectorAll('now-button');
        console.log(`${nowButtons.length} button elements detected. Performing action.`);
        nowButtons.forEach(nowButton => {
            if (!isAcceptButton(nowButton)) return;
            var acceptButton = nowButton.shadowRoot.querySelector('button');
            console.log(`Accept button found: ${acceptButton}.`);
            acceptButton.click();
            console.log('Click event triggered.');     
            lastChatAccepted = currentChatId;
            console.log(`%c${lastChatAccepted} accepted.`, 'color: green;');
        });
    })
}
    
// Check for active chats every x seconds.

function checkForActiveChats() {   
    var chatElements = document.querySelector('sn-workspace-content')?.shadowRoot.querySelectorAll('div[id^=chrome] > sn-interaction-custom-renderer');
    if (chatElements)
        chatElements.forEach(appendCopyButton);
}

function isAcceptButton(nowButton) {
    var hasAcceptText = nowButton.shadowRoot.textContent.toLowerCase().includes('accept');
    var isAcceptClass = nowButton.shadowRoot.querySelector('button').className == 'now-button -secondary -positive -sm';

    return hasAcceptText || isAcceptClass;
}

// Get the user data inside of the fields of the chatbox.

function getSnowUserData(chatBox) {
    var name = navigateShadowDOM(chatBox, 'span.sn-widget-user-profile-name')?.textContent;
    var jobTitle = navigateShadowDOM(chatBox, 'span.sn-widget-user-profile-title.csm-360--titlespan')?.textContent;
    var email = navigateShadowDOM(chatBox, 'sn-customer360-list', 'sn-customer360-field[label="Email"]').getAttribute('value');
    var phone = navigateShadowDOM(chatBox, 'sn-customer360-list', 'sn-customer360-field[label="Mobile phone"]').getAttribute('value');
    var location = navigateShadowDOM(chatBox, 'sn-customer360-list', 'sn-customer360-field[label="Location"]').getAttribute('value');
    var country = navigateShadowDOM(chatBox, 'sn-customer360-list', 'sn-customer360-field[label="Location.Country"]').getAttribute('value')

    var phoneFormat = country == 'Brazil'? '+55 <insert the phone number>' : '<insert the phone number>';
    return 'Description:\n\n' +
            'User Information:\n\n' +
            `\u25CF Name: ${name}\n` +
            `\u25CF Job Title: ${coalesceData(jobTitle, '—')}\n` +
            `\u25CF Phone Number: ${coalesceData(phone, phoneFormat)}\n` +
            `\u25CF Email: ${coalesceData(email, '<insert the email>')}\n` +
            `\u25CF Location: ${coalesceData(location, '—')}, ${coalesceData(country, '—')}`;
}

// Append a copy button to the chat box.

function appendCopyButton(chatElement){  
   
    var chatBox =  navigateShadowDOM(chatElement,'now-record-form-connected', 'sn-form-internal-workspace-form-layout', 'sn-form-internal-header-layout', 'sn-component-ribbon-container', 'sn-component-workspace-customer360');
    var header = navigateShadowDOM(chatBox, 'div.sn-widget-header');

    if (!header) return;   
    var button = $(header).find('#copyBtn')[0] ?? getCopyButton()[0];
    button.onclick = () => { 
        copyToClipboard(getSnowUserData(chatBox));
    }; 
    header.append(button);
}

function getCopyButton() {
    var button = $('<button id="copyBtn" class="btn-primary" style="background-color: rgb(31, 132, 118); color: rgb(255, 255, 255); border: 1px solid transparent; border-radius: 3px;">Copy</button>');
    button.css('font-family','"Calibri Light", "Source Sans Pro"');
    button.css('cursor', 'pointer');
    return button;
}

function copyToClipboard(text) {
    var $clipboard = $('<textarea>');
    $('body').append($clipboard);
    $clipboard.val(text).select();
    document.execCommand('copy');
    $clipboard.remove();
}

function navigateShadowDOM(...args){
    return args.reduce((prev, current) => {
        var root = $(prev)
        return $(root[0]?.shadowRoot).find(current)[0]
    })
}

function coalesceData(data, alternative){
let NULL_DATA = ['###', 'TBA', 'null'];
    data = data?.trim()
    if (NULL_DATA.includes(data) || !data)
        return alternative;
    return data;
}