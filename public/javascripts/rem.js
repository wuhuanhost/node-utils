        (function() {
            var width1 = document.documentElement.clientWidth
            var width2 = 750
            if (width1 > 750) {
                width1 = 460
            };
            var zoom = width1 / width2
            document.querySelector('html').style.fontSize = zoom * 100 + 'px'
            document.querySelector('html').style.height = '100%'
            document.querySelector('html').setAttribute('data-dpr', window.devicePixelRatio)
        })()