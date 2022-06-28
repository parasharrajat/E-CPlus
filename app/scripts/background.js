function setup() {
  localStorage.setItem('mainFile', JSON.stringify({}));
  browser.runtime.onMessage.addListener(clientRequestHandler);

}


function saveLocalData(key, newData) {
  const fileData = JSON.parse(localStorage.getItem('mainFile'));
  // if (!fileData[key]) {
  //   return;
  // }
  const rowData = { ...(fileData[key] || {}), ...newData};

  localStorage.setItem('mainFile', JSON.stringify({
    ...fileData,
    [key]: rowData
  }));
}

function addRow(id, data) {
  if (!id) {
    throw new Error('NO ID found');
  }
  saveLocalData(id, data);
}


function clientRequestHandler(request, sender, sendResponse) {
  console.log("Message from the content script:", request);
  let response = null;
  try {
    switch (request.end) {
      case 'add': {
        const id = request.data.id;
        delete request.data.id;
        response = addRow(id, request.data);
      } break;
      default: return false;
    }
    sendResponse({
      error: false,
      data: response
    });

  } catch (e) {
    sendResponse({
      error: true,
      message: e.message
    });
  }
}



setup();
