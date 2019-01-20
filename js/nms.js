var charList = "ABCĆČDEFGHIJKLMNOPQRSŠTUVWXYZŽabcčćdefghijklmnopqrsštuvwxyzžАБВГҐДЂЕЁЄЖЗЅИІЇЙЈКЛЉМНЊОПРСТЋУЎФХЦЧЏШЩЪЫЬЭЮЯабвгґдђеёєжзѕиіїйјклљмнњопрстћуўфхцчџшщъыьэюяΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψωάΆέέίϊΐόύΰϋΫĂÂÊÔƠƯăâêôơư1234567890?!(%)[#]{@}/\\-+÷×=$€£¥¢.*",
    skipChars = [" ", "\n", "\t"],
    blocks = 4,
    ctx, img,
    baseDelay = 2000,
    addDelay = 1000,
    decryptDelaySeed = 50,
    decryptDelayMultiplier = 500,
    iterationMultiplier = 10,
    typeSpeed = 1
    readyToDecrypt = true

var errorCodes = {
    400: "error: bad request",
    401: "error: unauthorized",
    403: "error: not allowed",
    404: "error: page not found",
    500: "error: server fault"
}

function encrypt(str) {
    var newstr = ""
    for (var i = 0; i <= str.length-1; i++) {
        if (skipChars.indexOf(str[i]) >= 0) {
            newstr += str[i]
        } else {
            newstr += charList[Math.floor(Math.random() * charList.length)]
        }
    }
    return newstr
}
function type_encypted(el, str) {
    if (str.length == 0) {
        readyToDecrypt = true
        return
    }
    readyToDecrypt = false
    var char = str[0]
    var newChar = (skipChars.indexOf(char) >= 0) ? char : charList[Math.floor(Math.random() * charList.length)]
    el.text(el.text() + newChar)
    setTimeout(type_encypted, typeSpeed, el, str.slice(1))
}

function decrypt (pos, src, el, i) {
    if (!readyToDecrypt) {
        setTimeout(decrypt, addDelay, pos, src, el, i)
        return
    }
    var newChar = (i == 0) ? src : charList[Math.floor(Math.random() * charList.length)]
    var str = el.text()
    str = str.slice(0, pos) + newChar + str.slice(pos+1, str.length)
    el.text(str)
    if (i > 0) {
        i -= 1
        setTimeout(decrypt, Math.ceil(Math.random() * decryptDelayMultiplier + decryptDelaySeed), pos, src, el, i)
    }
}

function nms(el, str) {
    // if str is empty use current content
    if (typeof(str) !== 'string' || str.length == 0) {
        str = el.text()
        el.text("")
    }
    type_encypted(el, str)
    for (var i = 0; i < str.length; i++) {
        if (skipChars.indexOf(str[i]) < 0) {
            setTimeout(decrypt, baseDelay, i, str[i], el, Math.ceil(Math.random() * iterationMultiplier + 1))
        }
    }
}

function loadUserIcon(src) {
    /// (C) Ken Fyrstenberg Nilsen, Abdias Software, CC3.0-attribute.
    ctx = usericon.getContext('2d')
    img = new Image()
    ctx.mozImageSmoothingEnabled = false
    ctx.webkitImageSmoothingEnabled = false
    ctx.imageSmoothingEnabled = false
    img.onload = pixelate
    img.src = src
    setTimeout(toggleAnim, baseDelay)
}
function pixelate(v) {
    var size = (parseInt(v) ? v : blocks) * 0.01,
        w = usericon.width * size,
        h = usericon.height * size;
    ctx.drawImage(img, 0, 0, w, h)
    ctx.drawImage(usericon, 0, 0, w, h, 0, 0, usericon.width, usericon.height)
}
function toggleAnim() {
    if (!readyToDecrypt) {
        setTimeout(toggleAnim, addDelay)
        return
    }
    var v = Math.min(50, parseInt(blocks, 10)), dx = 0.5;
    anim()
    function anim() {
        v += dx
        pixelate(v)
        if (v <= 50 ) {
            requestAnimationFrame(anim)
        } else {
            icon.removeChild(usericon)
            icon.appendChild(img)
        }
    }
}
requestAnimationFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 500);
    };
})();
