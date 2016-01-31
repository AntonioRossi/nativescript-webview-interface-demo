import {Page} from 'ui/page';
import {WebView, LoadEventData} from 'ui/web-view';
import {webViewInterfaceDemoVM} from './main-view-model';
import {TextField} from 'ui/text-field';
import {alert} from 'ui/dialogs';
var webViewInterfaceModule = require('nativescript-webview-interface');
var page: Page;
var oLangWebViewInterface;

export function pageLoaded(args){
    page = <Page>args.object;
    page.bindingContext = webViewInterfaceDemoVM;
    setupWebViewInterface(page) 
}

/**
 * Initializes webViewInterface for communication between webview and android/ios
 */
function setupWebViewInterface(page: Page){
    var webView = <WebView>page.getViewById('webView');
    oLangWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView);
    
    // loading languages in dropdown, on load of webView.
    webView.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
        if (!args.error) {
            loadLanguagesInWebView();
        }
    });
    
    listenLangWebViewEvents();
}

/**
 * Sends intial list of languages to webView, once it is loaded 
 */
function loadLanguagesInWebView(){
    oLangWebViewInterface.emit('loadLanguages', webViewInterfaceDemoVM.lstLanguages);
}

/**
 * Handles any event/command emitted by language webview.
 */
function listenLangWebViewEvents(){  
    // handles language selectionChange event.
    oLangWebViewInterface.on('languageSelection', (selectedLanguage) => {
        webViewInterfaceDemoVM.selectedLanguage = selectedLanguage;
    });
}

/**
 * Adds language to webView dropdown
 */
export function addLanguage(){
    var txtField = <TextField>page.getViewById('txtLanguage');
    oLangWebViewInterface.callJSFunction('addNewLanguage', [txtField.text]);
}

/**
 * Fetches currently selected language of dropdown in webView.
 */
export function getSelectedLanguage(){
   oLangWebViewInterface.callJSFunction('getSelectedLanguage', null, (oSelectedLang) => {
        alert(`Selected Language is ${oSelectedLang.text}`);
    });
}

/**
 * Fetches currently selected language of dropdown in webview.
 * The result will come after 2s. This function is written to show the support of differred result.
 */
export function getSelectedLanguageDiffered(){
   oLangWebViewInterface.callJSFunction('getSelectedLanguageDiffered', null, (oSelectedLang) => {
        alert(`Differed Selected Language is ${oSelectedLang.text}`);
    });     
}