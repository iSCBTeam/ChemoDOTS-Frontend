const _getWrapperElement = (id) => {
  const re = new RegExp(/^#.*/);
  if (typeof id !== "string") {
    return null;
  }
  // remove hash mark if present
  return document.getElementById(re.test(id) ? id.substr(1) : id);
};

// return marvin from window of iframe .
const _getPackage = (wrapperElement) => {
  if (typeof wrapperElement.contentWindow.marvin != "undefined") {
    return wrapperElement.contentWindow.marvin;
  }
  return null;
};

// return marvin .
const _createPackage = (elementId, resolve, reject) => {
  if (elementId == null) {
    reject("Element id can not be null.");
    return;
  }

  const wrapperElement = _getWrapperElement(elementId);

  if (wrapperElement == null) {
    reject("Unable to get element with id: " + elementId);
    return;
  }

  const marvinPackage = _getPackage(wrapperElement);
  if (marvinPackage) {
    marvinPackage.onReady(function () {
      resolve(marvinPackage);
    });
  } else {
    // use listener
    wrapperElement.addEventListener("load", function handleSketchLoad(e) {
      const marvin = _getPackage(wrapperElement);
      if (marvin) {
        marvin.onReady(function () {
          resolve(marvin);
        });
      } else {
        reject("Unable to find marvin package");
      }
    });
  }
};

const _createEditor = (elementId, resolve, reject) => {
  if (elementId == null) {
    reject("Element id can not be null.");
    return;
  }

  const wrapperElement = _getWrapperElement(elementId);

  if (wrapperElement == null) {
    reject("Unable to get element with id: " + elementId);
    return;
  }

  const marvinPackage = _getPackage(wrapperElement);
  if (marvinPackage) {
    marvinPackage.onReady(function () {
      if (typeof marvinPackage.sketcherInstance != "undefined") {
        resolve(_getPackage(wrapperElement).sketcherInstance);
        return;
      } else {
        reject(
          "Unable to find sketcherInstance in element with id: " + elementId
        );
        return;
      }
    });
  } else {
    // use listener
    wrapperElement.addEventListener("load", function handleSketchLoad(e) {
      const marvin = _getPackage(wrapperElement);
      if (marvin) {
        marvin.onReady(function () {
          if (typeof marvin.sketcherInstance != "undefined") {
            resolve(marvin.sketcherInstance);
          } else {
            reject(
              "Unable to find sketcherInstance in iframe with id: " + elementId
            );
          }
        });
      } else {
        reject(
          "Unable to find marvin package, cannot retrieve sketcher instance"
        );
      }
    });
  }
};

const MarvinJSUtil = {
  getEditor: function getEditor(elementId) {
    function createEditor(resolve, reject) {
      _createEditor(elementId, resolve, reject);
    }

    return new Promise(createEditor);
  },
  getPackage: function getPackage(elementId) {
    function createPackage(resolve, reject) {
      _createPackage(elementId, resolve, reject);
    }

    return new Promise(createPackage);
  },
};

export default MarvinJSUtil;
