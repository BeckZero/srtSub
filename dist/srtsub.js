var srtSub;
(function (srtSub) {
    srtSub.config = function (conf) {
        conf = (conf) ? conf : {};
        var subtitles = [];
        var master = new masterSub(conf);
        conf.videoID = master.videoId.getAttribute('id') ? master.videoId.getAttribute('id') : false;
        subtitles.push(new VideoSubtitlestitles(master.subtitles[0], conf));
        if (master.dual)
            subtitles.push(new VideoSubtitlestitles(master.subtitles[1], conf, true));
        new selector(master.subtitles.slice(), subtitles, conf);
    };
    var masterSub = (function () {
        function masterSub(conf) {
            conf = typeof conf !== 'undefined' ? conf : true;
            this.subtitles = [];
            this.videoId = conf.videoID ? document.getElementById(conf.videoID) : document.getElementsByTagName('video')[0];
            this.validateID();
            this.validate(conf);
            this.dual = conf.dual ? true : false;
            this.defaultSubtitles();
        }
        masterSub.prototype.validateID = function () {
            if (this.videoId.tagName != 'VIDEO')
                this.videoId = this.videoId.querySelector('VIDEO');
        };
        masterSub.prototype.defaultSubtitles = function () {
            var count = 0;
            this.subtitles.sort(function (b, a) {
                return (a.def) - (b.def);
            });
            for (var i = this.subtitles.length - 1; i >= 0; i--) {
                if (this.subtitles[i].def)
                    count++;
            }
            if (count >= 2)
                this.dual = true;
            if (count == 0)
                this.subtitles[0].def = 1;
        };
        masterSub.prototype.validate = function (conf) {
            var validation;
            if (!conf.subtitles) {
                validation = this.validateByHtml();
            }
            else {
                validation = this.validateByJson(conf.subtitles);
            }
            if (!validation)
                throw new Error('Bad format!');
        };
        masterSub.prototype.validateByJson = function (subtitles) {
            var src;
            var label;
            var aux;
            var defa;
            for (var i = subtitles.length - 1; i >= 0; i--) {
                src = subtitles[i].url;
                label = subtitles[i].label;
                defa = subtitles[i].default ? 1 : 0;
                aux = { url: src, label: label, def: defa };
                this.subtitles.push(aux);
                if (src.indexOf('.srt') < 0)
                    return false;
            }
            return true;
        };
        masterSub.prototype.validateByHtml = function () {
            var src;
            var label;
            var aux;
            var defa;
            for (var i = this.videoId.querySelectorAll('track').length - 1; i >= 0; i--) {
                src = this.videoId.querySelectorAll('track')[i].getAttribute('src');
                label = this.videoId.querySelectorAll('track')[i].getAttribute('label');
                defa = typeof this.videoId.querySelectorAll('track')[i].getAttribute('default') != 'object' ? 1 : 0;
                aux = { url: src, label: label, def: defa };
                this.subtitles.push(aux);
                if (src.indexOf('.srt') < 0)
                    return false;
            }
            return true;
        };
        return masterSub;
    })();
    var selector = (function () {
        function selector(subs, subUse, conf) {
            conf = typeof conf !== 'undefined' ? conf : true;
            this.videoId = conf.videoID ? document.getElementById(conf.videoID) : document.getElementsByTagName('video')[0];
            this.subtitles = subs;
            this.subUse = subUse;
            this.config = conf;
            this.fontSize = conf.fontSize || 14;
            this.orderSubtitlesByLabel();
            this.structure();
            this.structureBox();
            this.events();
        }
        selector.prototype.orderSubtitlesByLabel = function () {
            this.subtitles.sort(function (a, b) {
                return b.label.toLocaleLowerCase() > a.label.toLocaleLowerCase();
            });
        };
        selector.prototype.structure = function () {
            var el = this.videoId;
            var exist = el.parentNode.querySelectorAll('.selectorSrtSub').length;
            var newElemeneto = document.createElement('div');
            var newElemenetoBox = document.createElement('div');
            var image = document.createElement('img');
            image.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAQAAAD01JRWAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQffChcWDQl8G2r2AAAEh0lEQVRIx7WVTYhdZxnHf8/7njP3ztyZTNKMsbHNh2mVkNQWS/zWii5ciu6kFAVXgqAudFEq2oVuXCiIlIAbXVVQqArShSBFKJRKQhtDLIJlOimNYEhMM5O5H+e8Pxfn3MkddanvgXOfc/7P+d2X9/mC//GKu+a97DLkDg1tCCFgAEgAhdRbnRwkK1YYM+Qpvr6fOySzQk5UZFhlQE1FRSaTSWQysWdV1AwYcR4yVc4rZIaLOxySuAMplxaA9eXJWhm5wtABNVXJKYhSUrGJGdMYcyfv1Nu3twEybaIsU5h0wIe4zIidRKkeLZ/zEU6wwVosU4v/9ZQCGsdsc52tuJR+07xEWi6P8yKvARwAUoL0ZLSIYZbuKlWbWlpaGhoa2mirltKp2ej90nc7wur8P3MeUn0IKUxTQ0tLOVwOzd3n+N5KbniwUCi0qWFKi9XH1kj5dIc7BRWk8xSmSVzzaV/1hte95A89uQDCI/7AK97wH170+x7p3k4p6efHoDrSAZchJC5gavGkf3ZxXffTYjKJD7u5T9vy/XZfxZUTiXmklwLWRnEtTGXZV9WJM1VnTtWbHjNMHnZrnzZR3/CgUcK4uXwP1F1W1wGDd8VOJeVb6tSiXvMNVafqT0T80Z521TfV4lR9Skols/oUVAnofuoHowmXyuu923MedOB3bN116paVB7xpcab+1BVH/tjiHadeMAzD6n2QO2BOUJ/N4jm1tTjxZB/Xa/1pPeAn1Zl6wwMiDh332gkpyeoc5AxVd47WAT4c0LDEa2ySCApf4z0UKnY4h7RUXOBtMoUxX+E+CokxINQdqQdGBXAUKMCbQNACv9yrj1MEAlsEgQQ/u1s8GnPSfIcCDHp9d8+z6u/j+QbY7cvR+ac0CwTuvg2I7f5h0He16J0LsLPXl/Zr8xYTzR4wgJgKXAUScAwJamY8wyeYMuDLXO574XEkyLT8grO0VHyRi2SYdkfZp83Su/MUT5fWYuvUMyKO/GcfyQd9VG0s3vKIiPfb9tpxMVmf2cvDOmD4jrgVpnKxz8NX/Iwf8Nfq2Jl/NTlwy9aZ+kcf8yO+oO4680UpyRgvHd8DDgLuWYrNLO0X1Illr1qLE/WbIn7jP7Sp+oSUbPx9dbUrYmAEqSJeoKQGn1UbJ06dOXGq/smhyWTl7/dpM/V5k6mhxEtArOwFqYL0bYxJsvb8vo7yB+8Vk2G46rP7tOdcM4wJpu890udyQJCjpX7n7IqHoljgg3w+zjKMqzzPryC6lA4EH+OznKZ2k9/6OyDCHG/XZ2Zv5WgKABsEOVVUH46XMRY6dHfFghX/poQYr1Qfr8gJDi3O5SpZnomvnvMhH6jui42y7iiWGbS1FZlkRKGlyU2aOHYn3/J6+xZ/i8vHX95sI7VlYY6tAhUpfZS8OPmRU9XGcH20urayvrS+dmB1tL58tH5ywSXIHCWlivmI6sXD3CYw2lTCjiV+yr8wpqVQaFgCEjX3cwlSN02DZC7JllVuLgLn673cZsQtprS0CNGxoaXqQ5MIg4qag2yzzJd4mv/j+hc+O02/40zxgwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNS0xMC0yM1QyMjoxMzowOS0wNDowMM5Lk8AAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTUtMTAtMjNUMjI6MTM6MDktMDQ6MDC/Fit8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg==');
            newElemeneto.appendChild(image);
            newElemeneto.classList.add('selectorSrtSub');
            newElemenetoBox.classList.add('selectorBoxSrtSub');
            if (exist == 0) {
                el.parentNode.appendChild(newElemeneto);
                el.parentNode.appendChild(newElemenetoBox);
            }
        };
        selector.prototype.structureBox = function () {
            var box = this.videoId.parentNode.querySelector('.selectorBoxSrtSub');
            var list = document.createElement('ul');
            for (var i = this.subtitles.length - 1; i >= 0; i--) {
                var element = document.createElement('li');
                element.textContent = this.subtitles[i].label;
                if (this.subtitles[i].def) {
                    element.setAttribute('class', 'select');
                }
                list.appendChild(element);
            }
            box.appendChild(list);
            box.style.display = 'none';
        };
        selector.prototype.events = function () {
            var there = this;
            var icon = this.videoId.parentNode.querySelector('.selectorSrtSub');
            var box = this.videoId.parentNode.querySelector('.selectorBoxSrtSub');
            this.videoId.parentNode.addEventListener('mouseover', function () {
                icon.querySelector('img').style.opacity = "1";
                box.style.opacity = "1";
            });
            this.videoId.parentNode.addEventListener('mouseout', function () {
                icon.querySelector('img').style.opacity = "0.0";
                box.style.opacity = "0.0";
            });
            icon.addEventListener('click', function () {
                box.style.display = (box.style.display == 'none') ? 'inline' : 'none';
            });
            box.addEventListener('click', function (e) {
                if (there.subUse.length == 2 && !e.target.classList.length)
                    there.subtitleSelected(there.subUse[0].label);
                if (e.target !== e.currentTarget)
                    there.subtitleSelected(e.target.textContent);
            });
        };
        selector.prototype.subtitleSelected = function (selected) {
            var nodes = this.videoId.parentNode.querySelectorAll('.selectorBoxSrtSub ul li');
            var exist = false;
            for (var i = this.subUse.length - 1; i >= 0; i--) {
                if (this.subUse[i].label == selected) {
                    exist = true;
                    this.subUse[i].destroy();
                    this.subUse.splice(i, 1);
                    if (this.subUse.length)
                        this.subUse[0].double = false;
                }
            }
            for (var i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].textContent == selected)
                    nodes[i].classList.toggle('select');
            }
            if (!exist)
                this.newSubtitle(selected);
        };
        selector.prototype.newSubtitle = function (selected) {
            for (var i = this.subtitles.length - 1; i >= 0; i--) {
                if (this.subtitles[i].label == selected) {
                    if (this.subUse.length == 1)
                        this.subUse.push(new VideoSubtitlestitles(this.subtitles[i], this.config, true));
                    else
                        this.subUse.push(new VideoSubtitlestitles(this.subtitles[i], this.config));
                }
            }
        };
        return selector;
    })();
    var VideoSubtitlestitles = (function () {
        function VideoSubtitlestitles(su, config, double) {
            config = typeof config !== 'undefined' ? config : true;
            this.subtitlesrc = su.url;
            this.label = su.label;
            this.myVideo = config.videoID ? document.getElementById(config.videoID) : document.getElementsByTagName('video')[0];
            this.listfilter = config.filterList || [];
            this.replaceFilter = config.replaceF || '';
            this.fontSize = config.fontSize || 14;
            this.double = (typeof double == 'undefined') ? false : true;
            this.wrapper();
            this.style();
            this.download();
            this.main();
        }
        VideoSubtitlestitles.prototype.videosubtitles_timecode_min = function (tc) {
            var tcpair = tc.split(' --> ');
            return this.videosubtitles_tcsecs(tcpair[0]);
        };
        VideoSubtitlestitles.prototype.videosubtitles_timecode_max = function (tc) {
            var tcpair = tc.split(' --> ');
            return this.videosubtitles_tcsecs(tcpair[1]);
        };
        VideoSubtitlestitles.prototype.videosubtitles_tcsecs = function (tc) {
            var tc1 = tc.split(',');
            var tc2 = tc1[0].split(':');
            var secs = Math.floor(tc2[0] * 60 * 60) + Math.floor(tc2[1] * 60) + Math.floor(tc2[2]);
            return secs;
        };
        VideoSubtitlestitles.prototype.updateState = function (currentTime) {
            var subcount = 0;
            while (this.subtitles && this.subtitles.length && this.videosubtitles_timecode_max(this.subtitles[subcount][1]) < currentTime.toFixed(1)) {
                subcount++;
                if (subcount > this.subtitles.length - 1) {
                    subcount = this.subtitles.length - 1;
                    break;
                }
            }
            return subcount;
        };
        VideoSubtitlestitles.prototype.destroy = function () {
            delete this.main;
            this.main = null;
            this.subtitles = [];
            if (this.myVideo.nextSibling.lastChild.getAttribute('data-label') == this.label)
                this.myVideo.nextSibling.lastChild.parentNode.removeChild(this.myVideo.nextSibling.lastChild);
            else
                this.myVideo.nextSibling.firstChild.parentNode.removeChild(this.myVideo.nextSibling.firstChild);
        };
        VideoSubtitlestitles.prototype.download = function () {
            var url = this.subtitlesrc;
            var there = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function (e) {
                there.subtitles = new Array();
                var records = this.response.split('\n\r');
                if (records.length == 1)
                    records = this.response.split('\n\n');
                for (var r = 0; r < records.length; r++) {
                    var record = records[r];
                    var newRecord = record.split('\r');
                    there.subtitles[r] = new Array();
                    if (newRecord.length == 1)
                        newRecord = record.split('\n');
                    for (var i = newRecord.length - 1; i >= 0; i--) {
                        newRecord[i] = newRecord[i].replace(/(\r\n|\n|\r)/gm, '');
                    }
                    there.subtitles[r] = newRecord;
                }
            };
            xhr.send();
        };
        VideoSubtitlestitles.prototype.filterSub = function (subtitle) {
            for (var i = this.listfilter.length - 1; i >= 0; i--) {
                if (subtitle.toLowerCase().indexOf(this.listfilter[i].toLowerCase()) > 0)
                    return subtitle = this.replaceFilter;
            }
            return subtitle;
        };
        VideoSubtitlestitles.prototype.wrapper = function () {
            if (!this.myVideo.parentNode.getAttribute('class') || !this.myVideo.parentNode.getAttribute('class').match(/(srtSubContainer|video-js)/gi)) {
                var video = this.myVideo.cloneNode(true);
                var wrapper = document.createElement('div');
                wrapper.classList.add('srtSubContainer');
                wrapper.appendChild(video);
                this.myVideo.parentNode.insertBefore(wrapper, this.myVideo);
                this.myVideo.parentNode.removeChild(this.myVideo);
                this.myVideo = video;
            }
        };
        VideoSubtitlestitles.prototype.style = function () {
            var el = this.myVideo;
            var exist = el.parentNode.querySelectorAll('.contentSubs').length;
            var newElemeneto = document.createElement('div');
            var elemento = document.createElement('div');
            if (el.nextSibling && exist == 0) {
                el.parentNode.insertBefore(newElemeneto, el.nextSibling);
            }
            else if (exist == 0) {
                el.parentNode.appendChild(newElemeneto);
            }
            newElemeneto.classList.add('contentSubs');
            newElemeneto.classList.add('srtsub');
            el.nextSibling.appendChild(elemento);
            if (this.double)
                elemento.classList.add('double');
            elemento.setAttribute('data-label', this.label);
            this.adjustContent();
        };
        VideoSubtitlestitles.prototype.adjustContent = function () {
            var elemento = this.myVideo.nextSibling;
            var fontsize = this.fontSize; //14;
            var videowidth = this.myVideo.offsetWidth;
            //button - class selector
            var elementoSelector = this.myVideo.parentNode.querySelector('.selectorSrtSub');
            var elementoBox = this.myVideo.parentNode.querySelector('.selectorBoxSrtSub');
            var fontBox = 16;
            //---
            if (videowidth > 400) {
                fontsize = fontsize + Math.ceil((videowidth - 400) / 100);
            }
            elemento.style.fontSize = fontsize + 'px';
            elemento.style.width = (videowidth * 0.90).toString() + 'px';
            //button -class selector
            if (elementoBox) {
                fontBox = ((fontsize - 5) >= 16) ? fontsize : 16;
                elementoBox.style.fontSize = (fontsize - 5) + 'px';
                elementoSelector.style.width = (videowidth * 0.98).toString() + 'px';
            }
            //---
            //adjust container with width static
            if (this.myVideo.width > 100)
                this.myVideo.parentNode.style.width = (videowidth) + 'px';
        };
        VideoSubtitlestitles.prototype.main = function () {
            var there = this;
            var el = this.myVideo;
            var subcount = 0;
            window.addEventListener("resize", function () {
                there.adjustContent();
            });
            el.addEventListener('play', function (an_event) {
                there.adjustContent();
                subcount = there.updateState(this.currentTime);
            });
            el.addEventListener('playing', function (an_event) {
                there.adjustContent();
            });
            el.addEventListener('ended', function (an_event) {
                subcount = 0;
            });
            el.addEventListener('seeked', function (an_event) {
                subcount = there.updateState(this.currentTime);
            });
            el.addEventListener('timeupdate', function (an_event) {
                var subtitle = '';
                if (!there.subtitles || !there.subtitles.length)
                    return;
                if (there.subtitles[subcount][0] = "")
                    there.subtitles[subcount].shift();
                if (this.currentTime.toFixed(1) > there.videosubtitles_timecode_min(there.subtitles[subcount][1]) && this.currentTime.toFixed(1) < there.videosubtitles_timecode_max(there.subtitles[subcount][1])) {
                    subtitle = there.subtitles[subcount][2];
                }
                if (this.currentTime.toFixed(1) > there.videosubtitles_timecode_max(there.subtitles[subcount][1]) && subcount < (there.subtitles.length - 1)) {
                    subcount++;
                }
                if (there.double)
                    this.nextSibling.lastChild.innerHTML = there.filterSub(subtitle);
                else
                    this.nextSibling.firstChild.innerHTML = there.filterSub(subtitle);
            });
        };
        return VideoSubtitlestitles;
    })();
})(srtSub || (srtSub = {}));
