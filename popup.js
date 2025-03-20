document.getElementById("analyze").addEventListener("click", () => {
    let feature = document.getElementById("feature").value;
    let codeEditor = document.querySelector(".monaco-editor textarea");

    if (!codeEditor) {
        alert("Error: Unable to find LeetCode's code editor!");
        return;
    }

    let code = codeEditor.value.trim();
    
    chrome.runtime.sendMessage({ code, feature }, (response) => {
        alert(`AI Analysis Result:\n\n${response.result}`);
    });
});
