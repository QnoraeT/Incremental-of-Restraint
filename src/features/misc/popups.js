let popupID = 0;
const popupList = [];

function spawnPopup(type = 0, text, title, timer, color) {
    popupList.push({
        id: popupID,
        maxlife: timer,
        life: timer,
        type: type,
        title: title,
        message: text,
        color: color,
        opacity: 0
    });
    popupID++;
    updateSpawnPopups();
};

function diePopupsDie() {
    let popupListChanged = false;
    for (let i = 0; i < popupList.length; i++) {
        popupList[i].life -= gameVars.delta;
        popupList[i].opacity = 1;
        if (popupList[i].maxlife - popupList[i].life < 0.2) {
            popupList[i].opacity = (popupList[i].maxlife - popupList[i].life) / 0.2;
        }
        if (popupList[i].life < 0.2) {
            popupList[i].opacity = popupList[i].life / 0.2;
        }
        if (popupList[i].life < 0) {
            popupList.splice(i, 1);
            popupListChanged = true;
        }
    }
    if (popupListChanged) {
        updateSpawnPopups();
    }
};

function updateSpawnPopups() {
    let txt = ``;
    for (let i = 0; i < popupList.length; i++) {
        txt += `
            <div id="popupID${i}" onclick="popupList[${i}].life = 0.2;" class="popup font" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-evenly; align-items: center; align-content: center; background-color: ${popupList[i].color}; opacity: ${popupList[i].opacity}; color: ${colorChange(popupList[i].color, 0.5, 1.0)}">
                <span style="font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 2px;">${popupList[i].title}</span>
                <span style="font-size: 12px; text-align: center">${popupList[i].message}</span>
            </div>
        `;
    }
    html['popup-container'].setHTML(txt);
    for (let i = 0; i < popupList.length; i++) {
        toHTMLvar(`popupID${i}`);
    }
}