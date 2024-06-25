// ==UserScript==
// @name         noVNC Paste-typer for Proxmox
// @namespace    http://tampermonkey.net/
// @version      0.2b
// @description  Pastes text into a noVNC window (for use with Proxmox specifically) inspired by the script by Chester Enright
// @author       Greg Grammon
// @match        https://*:8006/
// @include      /^.*novnc.*/
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @license MIT 
// @grant        none
// ==/UserScript==
const delay = 100
;(function () {
    'use strict'
    window.sendString = function(text) {
        var el = document.getElementById("canvas-id")
        text.split("",64).forEach(x=>{
            setTimeout(()=>{
                 var needs_shift = x.match(/[A-Z!@#$%^&*()_+{}:\"<>?~|]/)
                 let evt
                 if (needs_shift) {
                     evt = new KeyboardEvent("keydown", {keyCode: 16})
                     el.dispatchEvent(evt)
                     evt = new KeyboardEvent("keydown", {key: x, shiftKey: true})
                     el.dispatchEvent(evt)
                     evt = new KeyboardEvent("keyup", {keyCode: 16})
                     el.dispatchEvent(evt)
                 }else{
                     evt = new KeyboardEvent("keydown", {key: x})
                }
                el.dispatchEvent(evt)
            }, delay)
        })
    }

    $(document).ready(function() {
        setTimeout(()=>{
            console.log("Starting up noVNC Copy/Paste (for Proxmox)")
            $("canvas").attr("id", "canvas-id")
            window.addEventListener("paste", (event) => {
                    let text = prompt("Enter text to paste. 64 char max:");
                    if (text != null) window.sendString(text);
            })
        }, 1000);
    })


})()
