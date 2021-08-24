const Vue = require("vue/dist/vue");
const ipcRenderer = require('electron').ipcRenderer;


require("bootstrap");

const fs = require("fs")

new Vue({
    el: '#vueApp',
    methods: {
        async btnStartClicked() {
            let screeStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        minWidth: 1920,
                        maxWidth: 1920,
                        minHeight: 1080,
                        maxHeight: 1080
                    }
                }
            });

            let audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });

            screeStream.getVideoTracks().forEach(el => {
                console.log("el",el)
                audioStream.addTrack(el);
            });
            this.$refs.preview.srcObject = screeStream;

            this._recorder = new MediaRecorder(audioStream,{mimeType: "video/webm;codecs=h264"});
            this._recorder.start();

            this._recorder.ondataavailable= async (e)=>{
                this._data = e.data;

                ipcRenderer.invoke("show_dialog").then(async (filePath)=>{
                    if(!filePath){
                        return;
                    }
                    console.log("filePath",filePath)
                    fs.writeFileSync(filePath,new Uint8Array(await this._data.arrayBuffer()));



                });
                
            }
        },



        btnStopClicked: function (){
           this._recorder.stop();

        }
    },
})