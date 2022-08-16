function saveLocalData(key, newData) {
    const fileData = JSON.parse(localStorage.getItem('mainFile'));

    // if (!fileData[key]) {
    //   return;
    // }
    const rowData = {...(fileData[key] || {}), ...newData};

    localStorage.setItem('mainFile', JSON.stringify({
        ...fileData,
        [key]: rowData,
    }));
}
function readLocalData() {
    return JSON.parse(localStorage.getItem('mainFile'));
}

function get(id) {
    if (!id) {
        throw new Error('NO ID found');
    }
    const dataKeys = readLocalData();
    const data = {};
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in dataKeys) {
        const idReg = new RegExp(id.replace('*', '.*?'), 'gi');
        if (idReg.test(key)) {
            data[key] = dataKeys[key];
        }
    }
    return data;
}
function addRow(id, data) {
    if (!id) {
        throw new Error('NO ID found');
    }
    saveLocalData(id, data);
}

function clientRequestHandler(request, sender, sendResponse) {
    console.debug('Message from the content script:', request);
    let response = null;
    try {
        switch (request.end) {
        case 'add': {
            const {id} = request.data;
            delete request.data.id;
            response = addRow(id, request.data);
        } break;
        case 'get': {
            const {id} = request.data;
            delete request.data.id;
            response = get(id);
        } break;
        default: return false;
        }
        sendResponse({
            error: false,
            data: response,
        });
    } catch (e) {
        sendResponse({
            error: true,
            message: e.message,
        });
    }
}

function setup() {
    localStorage.setItem('mainFile', JSON.stringify({}));
    // eslint-disable-next-line no-undef
    browser.runtime.onMessage.addListener(clientRequestHandler);
}

setup();
