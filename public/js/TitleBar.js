const topBarFunctions = function () {
    const closeBtn = document.getElementById('closeBtn');
    const minimizeBtn = document.getElementById('minimizeBtn');

    closeBtn.addEventListener('click', ()=>{
        electronAPI.closeApp()
    })
    minimizeBtn.addEventListener('click', ()=>{
        electronAPI.minimizeApp()
    })
};