/** JavaScript on WebKit
 *
 *  my_downloader.js
 *
 *
 *  Created by TVA on 3/28/15.
 *  Copyright (c) 2015 storagon. All rights reserved.
 */


//file_size > 50mb
var cypherWorker = new Worker('/js/worker.js');
var max_retry_failed = 10;
var received_size = 0;

var chunk_size;
var file_download_link;
var firstChunk = true;
var file_id = '10'
var file_name = '165251477_288272299405499_8046486622683903702_n.jpg'
var file_size = 287769
var loader = null
var current_file_size = 0
var progress = 0
var chunkNumber = 0
var downloadNext = false
var stored_file_name = file_id + '_' + file_name;

var start_date;
var completed = false;
var download_completed = false;
var current_chunk_number = 0;
var total_chunk_number = 0;
var blob_builder = null;
var blob_array = null;
var disableDecryptDownload = false;
var encodedKey;
var set_process;

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   
function niceBytes(x){

  let l = 0, n = parseInt(x, 10) || 0;

  while(n >= 1024 && ++l){
      n = n/1024;
  }
  
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
};

chunk_size = 10 * 1024 * 1024;

total_chunk_number = Math.floor(file_size / chunk_size);

var FileSystemType = window.PERSISTENT;
var FileSystemSpace = file_size * 3;
if (FileSystemSpace < 6 * 1024 * 1024 * 1024) FileSystemSpace = 6 * 1024 * 1024 * 1024;

function errorHandler(e) {
    console.log("Error:" + e.toString());
    console.log(e);
    if (typeof (e) == 'object' && 'name' in e)
        switch (e.name) {
            case "NotFoundError":
                // The File or Blob could not be found at the time the read was processed.
                break;
            case "SecurityError":
                // $('#modal-error p.modal-body').html("Security Error! If you are using browser in incognito" +
                //     " mode, you can only download encrypted file directly then use our app to decrypt it. " +
                //     "You can download decrypt tool by clicking this link: " +
                //     "<a href='http://storagon.com/download/storagon_tool/storagon_client_setup.rar'>Decrypt tool</a> (For Window).<br/>" +
                //     "If you still want to download decrypted file by browser, please switch your browser to normal mode.");
                // $('#modal-error a.close').html("Close");
                // $('#modal-error').foundation('reveal', 'open');
                // $('#freedl').hide();
                break;
            case "AbortError":
                // The read operation was aborted, typically with a call to abort().
                break;
            case "NotReadableError":
                // The File or Blob cannot be read, typically due due to permission problems that occur after a reference to a File or Blob has been acquired (concurrent lock with another application).
                break;
            case "EncodingError":
                // The length of the data URL for a File or Blob is too long.
                break;
        }
}
function requestFileSystemStorage() {
    console.log('navigator==',navigator.userAgent.indexOf('Chrome') === -1)
    if (navigator.userAgent.indexOf('Chrome') === -1) {//not Chrome
        console.log("test")
        if (file_size > 500 * 1024 * 1024) {
            disableDecryptDownload = true;
        }
        blob_builder = new Blob();
        if (total_chunk_number > 1) blob_array = new Array(total_chunk_number - 1);
        else blob_array = new Array(1);
    } else {
        blob_builder = null;//not use blob_builder but use FileSystem API
        console.log("Init temporary FileSystem: stored_file_name=" + stored_file_name);
    
        if (file_size >= chunk_size) {
            //FileSystemType = window.PERSISTENT;
            //FileSystemSpace = 10*1024*1024*1024;
            disableDecryptDownload = true;
            // navigator.webkitPersistentStorage.requestQuota(FileSystemSpace, function() {
            //     window.webkitRequestFileSystem(FileSystemType, FileSystemSpace, successHandler);
            //    })   
            window.webkitStorageInfo.requestQuota(FileSystemType, FileSystemSpace, function (grantedBytes) {
                disableDecryptDownload = false;
                console.log("requestQuota success");
                clearFileSystemStorage();
            }, function (e) {
                disableDecryptDownload = true;
                // $('#modal-error p.modal-body').html("You need to enable our website to store file in your machine in order to download this file due to its big size. Please reload page (F5) and choose Allow.");
                // $('#modal-error a.close').html("Close");
                // $('#modal-error').foundation('reveal', 'open');
                console.log("Error when requestQuota", e);
            });
        }
    
        if (!disableDecryptDownload) {
            clearFileSystemStorage();
        }
    }
}


function clearFileSystemStorage() {
    window.webkitRequestFileSystem(FileSystemType, FileSystemSpace, function (fs) {
        fs.root.getFile(stored_file_name, { create: false }, function (fileEntry) {
            fileEntry.remove(function () {
                console.log(stored_file_name + ' file removed.');
            });
        });
    }, errorHandler);

    navigator.webkitPersistentStorage.queryUsageAndQuota(function (storage_used, storage_left) {
        console.log("Storage used=" + storage_used + " left=" + storage_left);
        if (storage_left < file_size * 2.2) {
            console.log('Initiate clear filesystem storage');
            window.webkitRequestFileSystem(FileSystemType, FileSystemSpace, function (fs) {
                var dirReader = fs.root.createReader();
                var entries = [];

                // Call the reader.readEntries() until no more results are returned.
                var readEntries = function () {
                    dirReader.readEntries(function (results) {
                        if (!results.length) {
                            console.log('Clear all file in root');
                            removeAllFileEntries(fs, entries.sort());
                        } else {
                            entries = entries.concat(toArray(results));
                            readEntries();
                        }
                    }, errorHandler);
                };
                readEntries(); // Start reading dirs.
            }, errorHandler);
        }
    });
}



function toArray(list) {
    return Array.prototype.slice.call(list || [], 0);
}

function removeAllFileEntries(fs, entryList) {
    for (var i in entryList) {
        var fileEntry = entryList[i];
        if (fileEntry.isFile) {
            fileEntry.remove(function () {
                console.log(fileEntry.name + ' removed.');
            });
        }
    }
}


function calculateSizeBlobArray(blobArray) {
    var total_size = 0;
    for (var i in blobArray) {
        if (blobArray[i] === undefined) continue;
        total_size += blobArray[i].size;
    }
    return total_size;
}

function concatBlobBuilder(e) {
    var blob = e.data.decrypted_blob;
    if (e.data.lastChunk) {
        console.log('LastChunk2');

        blob_builder = new Blob(blob_array);
        const current_size = calculateSizeBlobArray(blob_array)
        console.log({ current_size })

        var paddingLength = (blob_builder.size + blob.size) - file_size;
        if (paddingLength > 0 && paddingLength <= 16) {
            if (current_size == 0) {
                blob_builder = new Blob([blob.slice(0, -paddingLength)]);
            } else {
                blob_builder = new Blob([blob_builder, blob.slice(0, -paddingLength)]);
            }

            console.log("removed paddingLength=" + paddingLength);
        } else {
            if (current_size == 0) {
                blob_builder = new Blob([blob]);
            } else {
                blob_builder = new Blob([blob_builder, blob]);
            }

            console.log("paddingLength=" + paddingLength);
        }


        console.log("LastChunk3");
        if (!completed) {
            // $('#result_file').attr('href', URL.createObjectURL(blob_builder));
            // $('#result_file').html("Decryption completed! Click me if your file is not saved automaticaly");
            // $('#result_file')[0].click();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob_builder);
            link.setAttribute(
                'download',
                file_name,
            );

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);

            completed = true;
        }
    } else {
        //blob_builder = new Blob([blob_builder,blob]);
        blob_array[e.data.chunkNumber - 1] = blob;
        //downloadNextChunk();
    }
    console.log('Concat completed.');
    //console.log('File lenght='+ blob_builder.size);

    current_file_size = calculateSizeBlobArray(blob_array);
    console.log('File lenght=' + current_file_size);

    if (download_completed && !completed) {
        progress = current_file_size / file_size;
        // $('#result_file').html("Download completed. Waiting for Decryption(" + (progress * 100).toFixed(1) + "%)");
    }

    console.log('blob.size=' + blob.size);
}

var saveDataReceivedFromWorker = function (e) {
    console.log({ e })
    if (e.data.cmd === 'save_decrypt_aes') {
        console.log("Received decrypt chunk_number=" + e.data.chunkNumber);
        //blob = e.data.decrypted_blob;
        //                  console.log(blob);

        if (blob_builder === null) {
            console.log("==Chrome");
            saveBlobTemporary(e.data.decrypted_blob, e.data.chunkNumber);
        }
        else {//not Chrome
            console.log("==other");
            concatBlobBuilder(e);
        }
    }
};



// assumes wordArray is Big-Endian (because it comes from CryptoJS which is all BE)
// From: https://gist.github.com/creationix/07856504cf4d5cede5f9#file-encode-js
var buffer_u8_array = new Uint8Array(chunk_size / 4 << 2);

function convertWordArrayToUint8Array(wordArray, arrayBuffer) {
    var len = wordArray.words.length, offset = 0, word, i;

    var u8_array;
    if (arrayBuffer !== null) u8_array = arrayBuffer;
    else u8_array = new Uint8Array(len << 2);

    for (i = 0; i < len; i++) {
        word = wordArray.words[i];
        u8_array[offset++] = word >> 24;
        u8_array[offset++] = (word >> 16) & 0xff;
        u8_array[offset++] = (word >> 8) & 0xff;
        u8_array[offset++] = word & 0xff;
    }
    return u8_array;
}


function readAndAppendFile(chunk_index, fileEntry, localstorage) {
    localstorage.root.getFile(stored_file_name + '_part_' + chunk_index, { exclusive: true }, function (fileChunkEntry) {
        console.log('Open file for concating: ' + stored_file_name + '_part_' + chunk_index);
        fileChunkEntry.file(function (fileChunk) {
            var reader = new FileReader();
            reader.readAsArrayBuffer(fileChunk);
            reader.onerror = function (e) {
                console.log("Error read chunk: " + stored_file_name + '_part_' + chunkNumber);
            };
            reader.onloadend = function (e) {
                //console.log("Reading data="+this.result);
                var chunk_blob = new Blob([this.result]);
                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.seek(fileWriter.length); // Start write position at EOF.

                    if (fileWriter.length + chunk_blob.size >= file_size) {
                        console.log('LastChunk: RemovePadding check');
                        var paddingLength = (fileWriter.length + chunk_blob.size) - file_size;
                        if (paddingLength > 0 && paddingLength <= 16) {//
                            fileWriter.write(chunk_blob.slice(0, -paddingLength));
                            console.log("removed paddingLength=" + paddingLength);
                        } else {
                            fileWriter.write(chunk_blob);
                            console.log("paddingLength=" + paddingLength);
                        }
                    } else {
                        fileWriter.write(chunk_blob);
                    }
                    // fileWriter.write(chunk_blob);
                    fileWriter.onwriteend = function (e) {
                        console.log('Write-append completed with chunk_index=' + chunk_index);
                        //fileChunkEntry.remove(function(){
                        //	console.log(fileChunkEntry.name + ' removed.');
                        //});
                        // $('#result_file').html("Download completed. Waiting for Decryption(" + (chunk_index * 100.0 / total_chunk_number).toFixed(1) + "%)");
                        if (chunk_index < total_chunk_number) {
                            readAndAppendFile(chunk_index + 1, fileEntry, localstorage);
                        } else {
                            //completed
                            // loader.setProgress(1);

                            console.log({ fileEntry })

                            const link = document.createElement('a');
                            link.href = fileEntry.toURL();
                            link.target = '_blank'
                            link.download = file_name
                            link.style.display = "none"

                            // Append to html link element page
                            document.body.appendChild(link);

                            // Start download
                            link.click();

                            // Clean up and remove the link
                            link.parentNode.removeChild(link);
                            // $('#result_file').attr('href', fileEntry.toURL());
                            // $('#result_file')[0].click();
                            // $('#result_file').html("Decryption completed! Click me if your file is not saved automaticaly");
                        }
                    };
                    //end file writing
                });
            };
        });
    }, function (e) {
        console.log("Error " + e + " open file: " + stored_file_name + '_part_' + chunk_index);
    }
    );
}

function concatFileEntry() {
    window.webkitRequestFileSystem(FileSystemType, FileSystemSpace, function (localstorage) {
        localstorage.root.getFile(stored_file_name, { create: true, exclusive: false }, function (fileEntry) {

            var chunk_index = 1;
            //for(chunk_index=1;chunk_index<=total_chunk_number;chunk_index++){

            readAndAppendFile(chunk_index, fileEntry, localstorage);

        });

    }, function (e) {
        console.log("Error " + e + " open file: " + stored_file_name);
    }
    );
}

function saveBlobTemporary(blob, chunkNumber) {
    // console.log('FileSystemSpace==', FileSystemSpace)

    function successHandler(localstorage) {
        //            console.log("Here1");

        //var createFile = false;
        //if (firstChunk){
        //	console.log("FirstChunk");//first chunk
        //	createFile = true;
        //	firstChunk = false;
        //}

        //localstorage.root.getFile(stored_file_name, {create:createFile, exclusive:true}, function(fileEntry){
        localstorage.root.getFile(stored_file_name + '_part_' + chunkNumber, { create: true, exclusive: false }, function (fileEntry) {
            console.log("Open file for writing chunk: " + stored_file_name + '_part_' + chunkNumber);
            fileEntry.createWriter(function (fileWriter) {
                //                    console.log("Here3");


                fileWriter.onerror = function (e) {
                    console.log('Write failed: ' + e.toString());
                };
                fileWriter.seek(fileWriter.length); // Start write position at EOF.

                if (chunkNumber == total_chunk_number){//lastchunk wrting
                	console.log('LastChunk2==='+received_size + ' blob_size ' + blob.size);
                	var paddingLength = received_size - file_size;
                	if (paddingLength > 0 && paddingLength <= 16){
                		fileWriter.write(blob.slice(0, -paddingLength));
                		console.log("removed paddingLength=" + paddingLength);
                	}else{
                		fileWriter.write(blob);
                		console.log("paddingLength=" + paddingLength);
                	}
                }else{
                	fileWriter.write(blob);
                }
                fileWriter.onwriteend = function (e) {
                    //console.log('Write-append completed.');
                    console.log('File lenght=' + fileWriter.length);
                    console.log('blob.size=' + blob.size);
                    if (chunkNumber >= total_chunk_number) {//lastchunk writed
                        console.log('LastChunk: All Chunk Received');
                        concatFileEntry();
                        if (!completed) {
                            completed = true;
                        }
                    } else {
                        if (download_completed && !completed) {
                            progress = chunkNumber * 1.00 / total_chunk_number;
                            // $('#result_file').html("Download completed. Waiting for Decryption(" + (progress * 100).toFixed(1) + "%)");
                            // $('#result_file').show();
                        }
                        //downloadNextChunk();
                    }
                };

            });
        }, function (e) {
            console.log("Error " + e + " open file: " + stored_file_name + '_part_' + chunkNumber);
        }
        );
    }
    navigator.webkitPersistentStorage.requestQuota(FileSystemSpace, function() {
        window.webkitRequestFileSystem(FileSystemType, FileSystemSpace, successHandler);
       })   
    
}

function downloadNextChunkIfChunkNotAlreadyExist() {
    var chunk_index = current_chunk_number + 1;
    console.log("test next")
    window.webkitRequestFileSystem(FileSystemType, FileSystemSpace, function (localstorage) {
        localstorage.root.getFile(stored_file_name + '_part_' + chunk_index, { exclusive: true }, function (fileChunkEntry) {
            //geting fileChunkSize
            fileChunkEntry.getMetadata(function (metadata) {
                console.log("fileChunk of chunk_index=" + chunk_index + " exist with fileChunkSize=" + metadata.size);
                downloadNext = true;
                // if (chunk_index === total_chunk_number) {
                //     //last chunk, check > 0 only
                //     if (metadata.size > 0) downloadNext = false

                // }
                //if(chunk_index==1){
                //	//first chunk, check for 2 case
                //	if(metadata.size>=chunk_size-16 && metadata.size<=chunk_size)downloadNext=false
                //
                //}
                // if (chunk_index >= 1 && chunk_index < total_chunk_number) {
                //     if (metadata.size === chunk_size) downloadNext = false;
                // }

                if (downloadNext === false) {
                    current_chunk_number += 1;
                    received_size += metadata.size;
                    console.log("chunk_number=" + current_chunk_number + " already exist");
                    var duration = new Date() - start_date;
                    var speed = received_size / duration;
                    var progress = received_size / file_size;
                    var timeLeft = (((file_size - received_size) / 1024) / speed).toFixed(0).toHHMMSS();
                    set_process({'speed':speed.toFixed(2),'progress':(progress * 100).toFixed(1),'timeLeft':timeLeft,'duration':(duration / 1000).toString().toHHMMSS()})
                    if (current_chunk_number === total_chunk_number) {//lastchunk received
                        console.log('LastChunk: All Chunk Received');
                        concatFileEntry();
                    } else {//keep going
                        downloadNextChunkIfChunkNotAlreadyExist();
                    }
                } else {
                    window.webkitRequestFileSystem(FileSystemType, FileSystemSpace, function (fs) {
                        fs.root.getFile(stored_file_name + '_part_' + chunk_index, { create: false }, function (fileEntry) {
                            fileEntry.remove(function () {
                                console.log(stored_file_name + '_part_' + chunk_index + ' file removed.');
                            });
                        });
                    }, errorHandler);
                    downloadNextChunk();
                }

            });

        }, function (e) {
            console.log("chunk_index=" + chunk_index + " not exist");
            downloadNextChunk();
        }
        );
    });
}

function handleError(error){
    console.log({error})
}


function downloadNextChunk() {
    if (received_size >= file_size) return;
    console.log("Downloading chunk_number=" + (current_chunk_number + 1));

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handleResponse;
    xhr.addEventListener("progress", updateProgressXHR, false);
    xhr.addEventListener("error", handleError, false);

    xhr.open("GET", file_download_link);
    if (received_size + 2 * chunk_size >= file_size) {
        xhr.setRequestHeader('Range', 'bytes=' + (received_size) + '-');
        console.log("LastChunk");
    } else {
        xhr.setRequestHeader('Range', 'bytes=' + (received_size) + '-' + (received_size + chunk_size - 1));
    }
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.responseType = 'arraybuffer';
    xhr.send();

    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'Range': 'bytes=' + (received_size) + '-',
    //         'Access-Control-Allow-Origin': '*'
    //     },
    // }

    // fetch(file_download_link, options).then(res => {
    //     console.log({res})
    //     return res.arrayBuffer()
    // }).then(response => {
    //     console.log({ response })
    //     return response
    // }).catch(err => {
    //     console.log({ err })
    //     console.info("__err__", err)
    // })
}

function handleResponse() {
    if (this.readyState === 4) {
        if (this.status === 206 || this.status === 200) {//OK or partial responded

            current_chunk_number += 1;
            received_size += this.response.byteLength;
            console.log('received_size=' + received_size + '/' + file_size);
            console.log({ response: this.response })
            if (received_size >= file_size) {//last chunk received
                console.log('Received lastchunk=' + this.response.byteLength);
                download_completed = true;
                // $('#result_file').html("Download completed. Waiting for Decryption...");
                // $('#result_file').show();
                cypherWorker.postMessage({
                    'cmd': 'decrypt_aes',
                    'response': this.response,
                    'chunkNumber': current_chunk_number,
                    'lastChunk': true
                });

            } else {
                var duration = new Date() - start_date;
                var speed = received_size / duration;
                var progress = received_size / file_size;
                var timeLeft = (((file_size - received_size) / 1024) / speed).toFixed(0).toHHMMSS();
                set_process({'speed':speed.toFixed(2),'progress':(progress * 100).toFixed(1),'timeLeft':timeLeft,'duration':(duration / 1000).toString().toHHMMSS()})
                // console.log('progress='+progress)
                //					$('#result_file').html("Downloading at " + speed.toFixed(2) + " KB/s (" + (progress * 100).toFixed(1) + "%)");//(1000 bytes/s)
                // loader.setValue(speed.toFixed(2) + " KB/s");
                // loader.setProgress(progress);
                
                cypherWorker.postMessage({
                    'cmd': 'decrypt_aes',
                    'response': this.response,
                    'chunkNumber': current_chunk_number,
                    'lastChunk': false
                });

                //enable concurrent downloading/decrypting
                if (blob_builder === null) {
                    downloadNextChunkIfChunkNotAlreadyExist();
                }
                else {
                    downloadNextChunk();
                }

            }
        } else {
            console.log("Failed to download chunk with error: " + this.statusText);
            max_retry_failed--;
            if (max_retry_failed > 0) {
                //downloadNextChunkIfChunkNotAlreadyExist(); //dont need to check because its already checked
                downloadNextChunk();
            }
        }
    }
}

function updateProgressXHR(oEvent) {
    
    var duration = new Date() - start_date;
    var speed = (received_size + oEvent.loaded) / duration;
    var progress = (received_size + oEvent.loaded) / file_size;
    var timeLeft = (((file_size - received_size) / 1024) / speed).toFixed(0).toHHMMSS();
    // console.log('progress=='+progress)
    // $('#result_file').html("Time start: " + (duration / 1000).toString().toHHMMSS() + ". Elapsed time: " + timeLeft);
    // loader.setValue(speed.toFixed(2) + " KB/s");
    // loader.setProgress(progress);
    set_process({'speed':speed.toFixed(2),'progress':(progress * 100).toFixed(1),'timeLeft':timeLeft,'duration':(duration / 1000).toString().toHHMMSS()})
}


function getEncodedKey() {
    return '101112131415161718191a1b1c1d1e1f'
    if (encodedKey) {
        console.log('Found encodedKey=' + encodedKey);
        return encodedKey;
    }
    if (!encodedKey || encodedKey.length !== 32) {
        // $('#modal-error p.modal-body').html("FileKey is not detected or malformed, you are not able to decrypt this file!");
        // $('#modal-error a.close').html("Close");
        // $('#modal-error').foundation('reveal', 'open');
        return null;
    }
}

export function decryptDownload(download_link, fileSize, fileName, setFileDownloadProcess) {
    if (disableDecryptDownload) return;
    console.log('addEventListener');
    cypherWorker.addEventListener('message', saveDataReceivedFromWorker, false);
    received_size = 0
    set_process = setFileDownloadProcess
    file_size = fileSize
    file_name = fileName
    blob_builder = null;
    stored_file_name = file_id + '_' + file_name
    total_chunk_number = Math.floor(file_size / chunk_size);
    current_chunk_number = 0
    var encodedKey = getEncodedKey();

    cypherWorker.postMessage({
        'cmd': 'init_decrypt_aes',
        'key': encodedKey,
        'file_size': file_size,
        'chunk_size': chunk_size,
        'store_file_name': stored_file_name,
        'download_link': download_link.replace('localhost', '192.168.31.105')
    });



    file_download_link = download_link.slice(0, download_link.lastIndexOf('/')) + '/';

    console.log('file_download_link=' + file_download_link);
    requestFileSystemStorage();
    downloadNextChunkIfChunkNotAlreadyExist(); //Alway download first chunk to avoid bug in resume decrypting


    start_date = new Date();

}