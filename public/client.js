var socket = io();


let nameGlobal;

const messageSendButton = document.getElementById("messageSendButton");
messageSendButton.addEventListener("click", messageSend);

const chatInput = document.getElementById("chatInput");
chatInput.addEventListener("keyup", messageSendKey);


const idSendButton = document.getElementById("idSendButton");
idSendButton.addEventListener("click", idSend);


const idSendRandomButton = document.getElementById("idSendRandomButton");
idSendRandomButton.addEventListener("click", idSendRandom);

const idClose = document.getElementById("idClose");
idClose.addEventListener("click", idCloseSend);


var myModal = new bootstrap.Modal(document.getElementById('modalUsername'), {});
myModal.toggle();

function messageSendKey(event) {

    if (event.key === "Enter") {
        let inputText;
        inputText = document.getElementById("chatInput").value;
        document.getElementById("chatInput").value = "";

        socket.emit("message", {inputText: inputText, name: nameGlobal});
    }
}


function messageSend() {

    let inputText;
    inputText = document.getElementById("chatInput").value;
    document.getElementById("chatInput").value = "";

    socket.emit("message", {inputText: inputText, name: nameGlobal});

}


/************************************************************************/


// Fiziksel özellik sıfat dizisi
const physicalAdjectives = [
    "uzun", "kısa", "zayıf", "şişman", "esnek", 
    "güçlü", "ince", "geniş", "dar", "yumuşak", 
    "sert", "hızlı", "yavaş", "sıcak", "soğuk",
    "parlak", "mat", "pürüzsüz", "kabuklu", "tüylü",
    "kaslı", "büyük", "küçük", "pürüzlü", "büyülü"
];

// Kişilik özellik sıfat dizisi
const personalityAdjectives = [
    "cesur", "nazik", "neşeli", "sakin", "enerjik",
    "sadık", "dürüst", "yaratici", "sabırlı", "coşkulu",
    "zeki", "merhametli", "sosyal", "düşünceli", "kararlı",
    "heyecanlı", "güvenilir", "yaratici", "odaklı", "dikkatli"
];

// Hayvan dizisi
const animals = [
    "kuş", "kedi", "köpek", "at", "kaplumbağa",
    "balina", "panda", "timsah", "maymun", "zebra",
    "aslan", "papağan", "fil", "sincap", "ördek",
    "kanguru", "geyik", "örümcek", "kurt", "tilki"
];

// Rastgele sıfat seçimi
function getRandomAdjective(adjectiveArray) {
    const randomIndex = Math.floor(Math.random() * adjectiveArray.length);
    return adjectiveArray[randomIndex];
}

function getRandomAnimal() {
    const randomIndex = Math.floor(Math.random() * animals.length);
    return animals[randomIndex];
}




function idSend() {

    nameGlobal = document.getElementById("idInput").value;

    socket.emit("id", {name: nameGlobal});
    document.getElementById("usernameTitle").innerHTML = "Username: " + "<i>" + nameGlobal + "</i>";

}


function idSendRandom() {

    const randomPhysicalAdjective = getRandomAdjective(physicalAdjectives);
    const randomPersonalityAdjective = getRandomAdjective(personalityAdjectives);
    const randomAnimal = getRandomAnimal();

    let randomName = `${randomPhysicalAdjective} ${randomPersonalityAdjective} ${randomAnimal}`;
    document.getElementById("idInput").value = randomName;

}


function idCloseSend() {

    const randomPhysicalAdjective = getRandomAdjective(physicalAdjectives);
    const randomPersonalityAdjective = getRandomAdjective(personalityAdjectives);
    const randomAnimal = getRandomAnimal();

    let randomName = `${randomPhysicalAdjective} ${randomPersonalityAdjective} ${randomAnimal}`;
    nameGlobal = randomName;

    
    socket.emit("id", {name: randomName});
    document.getElementById("usernameTitle").innerHTML = "Username: " + "<i>" + randomName + "</i>";

}



/************************************************************************/





let chatDisplay = {
    counter: 0
}

let tags = [];
let messages = [];
let positionsTag = [];
let positionsMessage = [];


socket.on('newMessage', function(data) {


    if(chatDisplay.counter > 9) {

        for(let i = 0; i < 9; i++) {

            tags[i] = tags[i + 1];
            messages[i] = messages[i + 1];

            positionsTag[i] = positionsTag[i + 1];
            positionsMessage[i] = positionsMessage[i + 1];

            document.getElementById("chatTag" + i).innerHTML = tags[i + 1];
            document.getElementById("chatMessage" + i).innerHTML = messages[i + 1];

            document.getElementById("chatTag" + i).removeAttribute("class");
            document.getElementById("chatMessage" + i).removeAttribute("class");

            document.getElementById("chatTag" + i).setAttribute("class", positionsTag[i]);
            document.getElementById("chatMessage" + i).setAttribute("class", positionsMessage[i]);

            
        }

        chatDisplay.counter = 9;
    }




    document.getElementById("chatTag" + chatDisplay.counter).removeAttribute("class");
    document.getElementById("chatMessage" + chatDisplay.counter).removeAttribute("class");

    if(data.name == nameGlobal) {
        document.getElementById("chatTag" + chatDisplay.counter).setAttribute("class", "chatDisplay chatTagRight");
        document.getElementById("chatMessage" + chatDisplay.counter).setAttribute("class", "chatDisplay chatMessageRight");
        positionsTag[chatDisplay.counter] = "chatDisplay chatTagRight";
        positionsMessage[chatDisplay.counter] = "chatDisplay chatMessageRight";
    }
    else {
        document.getElementById("chatTag" + chatDisplay.counter).setAttribute("class", "chatDisplay chatTagLeft");
        document.getElementById("chatMessage" + chatDisplay.counter).setAttribute("class", "chatDisplay chatMessageLeft");
        positionsTag[chatDisplay.counter] = "chatDisplay chatTagLeft";
        positionsMessage[chatDisplay.counter] = "chatDisplay chatMessageLeft";
    }



    document.getElementById("chatTag" + chatDisplay.counter).innerHTML = "<b>" + data.name + "</b>" + "  " + "<i>" + data.time + "</i>";
    document.getElementById("chatMessage" + chatDisplay.counter).innerHTML = data.message;

    tags[chatDisplay.counter] =  "<b>" + data.name + "</b>" + "  " + "<i>" + data.time + "</i>";
    messages[chatDisplay.counter] = data.message;

    console.log(chatDisplay.counter);
    
    chatDisplay.counter++;

    // notifyMe();
    
});

