export function converBase64toBlob(content: any, contentType: any) {
  content = content.replace('data:application/pdf;base64,', '');
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = window.atob(content);
  var byteArrays = [];
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  var blob = new Blob(byteArrays, {
    type: contentType,
  });

  return blob;
}
