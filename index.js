const fs = require("fs")
const ytdl = require('ytdl-core');
const Youtube = require('youtube-search-api');
const login = require("facebook-chat-api")
const axios = require('axios');
YouTube_API = 'AIzaSyDvPsnqssxLHDNx_HFEYZH5iVIrTtufl-s'

const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
const time = `${hours}:${minutes}:${seconds}`

login({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }, (err, api) => {
    if (err) return console.error(err)
    api.listenMqtt((err, message) => {
        text = message.body
        id = message.senderID
        if (message.isGroup === true) {
            id = message.threadID
        }
        if (id !== undefined && text !== undefined) {
            console.log(`${time} ${id} : ${text}`)
            if (text === 'loikhuyen') {
                list = ['Liều nhiều thì ăn nhiều', 'Đôi khi chúng ta tốn quá nhiều thời gian để nghĩ về một người trong khi họ chẳng nghĩ đến chúng ta nổi 1 giây', 'Thực ra những người hay cười, lại luôn cần người khác yêu thương', 'Sáu ba ra một', 'FreeFire sống dai thành huyền thoại', 'Làm hoặc làm không. Không có thử.', 'Gacha tiếp đi anh']
                random = Math.floor(Math.random() * (list.length))
                res = list[random]
                api.sendMessage({ body: res }, id);
                console.log(`${time} Bot -> ${id} :`, res)
            }
            if (text.split(' ')[0] === 'sing') {
                async function downloadMusicFromYoutube(link, path) {
                    var timestart = Date.now();
                    if (!link) return 'Thiếu link'
                    var resolveFunc = function () { };
                    var rejectFunc = function () { };
                    var returnPromise = new Promise(function (resolve, reject) {
                        resolveFunc = resolve;
                        rejectFunc = reject;
                    });
                    ytdl(link, {
                        filter: format =>
                            format.quality == 'tiny' && format.audioBitrate == 48 && format.hasAudio == true
                    }).pipe(fs.createWriteStream(path))
                        .on("close", async () => {
                            var data = await ytdl.getInfo(link)
                            var result = {
                                title: data.videoDetails.title,
                                dur: Number(data.videoDetails.lengthSeconds),
                                viewCount: data.videoDetails.viewCount,
                                likes: data.videoDetails.likes,
                                author: data.videoDetails.author.name,
                                timestart: timestart
                            }
                            resolveFunc(result)
                        })
                    return returnPromise
                }
                async function search(keyword) {
                    const results = await Youtube.GetListByKeyword(keyword, false, 1);
                    if (results.items.length > 0) {
                        return results.items[0]
                    }
                    return null
                }
                async function sing(keyword) {
                    const video = await search(keyword)
                    if (video) {
                        path = `${video.id}.mp3`
                        const mp3FilePath = await downloadMusicFromYoutube(video.id, path);
                        if (mp3FilePath) {
                            api.sendMessage({
                                body: mp3FilePath.title,
                                attachment: fs.createReadStream(`./${path}`)
                            }, id)

                        } else {
                            console.log('Không thể chuyển đổi video thành MP3.');
                        }
                    } else {
                        console.log('Không tìm thấy video.');
                    }
                }
                name = text.split('sing')[1]
                sing(name)
            }
            if (text === 'hello' || text === 'hi' || text === 'Hello' || text === 'Hi') {
                res = 'Chào mừng đến với bình nguyên vô tận\nĐây là Project ChatBot của Tuấn'
                api.sendMessage({ body: res }, id)
                console.log(`${time} Bot -> ${id} :`, res)
            }
            if ((text === 'hacker lỏ' || text === 'Hacker lỏ' || text === 'hacker lỏd' || text === 'Hacker lỏd')) {
                res = 'Đéo nhé tao là Tuấn Developer'
                api.sendMessage({ body: res }, id)
                console.log(`${time} Bot -> ${id} :`, res)
            }
            if (text === 'chitay' || text === 'Chitay') {
                res = 'Cả thế giới đang chỉ tay vào bạn'
                api.sendMessage({ body: res, attachment: fs.createReadStream(`./chitay.png`) }, id)
            }
            if (text === 'paimon') {
                res = 'Con Kẹc'
                api.sendMessage({ body: res, attachment: fs.createReadStream(`./paimon.png`) }, id)
            }
            if (text === 'help' || text === 'Help') {
                res = 'Hiện tại có những lệnh sau \n[/]help\n[/]chitay\n[/]sing\n[/]loikhuyen\n[/]paimon\nVà 1 số lệnh ẩn'
                api.sendMessage(res, id)
                console.log(`${time} Bot -> ${id} :`, res)
            }
            
        }
    })
})