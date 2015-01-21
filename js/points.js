(function () {

    'use strict';

    function $(id) {
        return document.getElementById(id);
    }

    var canvas = $('canvas');
    var ctx = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = window.innerHeight;


    var POINTERS = 200000;
    var STEP = 10;

    var sin = Math.sin;
    var cos = Math.cos;

    var param = {
        a0: 1,
        a1: 1,
        a2: 1,
        b0: 1,
        b1: 1,
        b2: 1
    }

    var offsetColor;

    var x = [Math.random() - 0.5];
    var y = [Math.random() - 0.5];

    function init() {
        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

        initParam();

        animate();
        //draw();
    };

    function initParam () {
        var temp = ['a0', 'a1', 'a2', 'b0', 'b1', 'b2'];

        for (var k in temp) {
            param[temp[k]] = Math.random() * 360 >> 0;
        }

        offsetColor = Math.random() * 360 >> 0;
    }

    function draw () {
        ctx.fillRect(0, 0, width, height);

        var minx = 0;
        var miny = 0;
        var maxx = 0;
        var maxy = 0;

        var pixels = ctx.getImageData(0, 0, width, height);
        var data = pixels.data;

        var temp_a0 = sin(param.a0 * Math.PI / 360) * 2;
        var temp_a1 = sin(param.a1 * Math.PI / 360) * 2;
        var temp_a2 = sin(param.a2 * Math.PI / 360) * 2;
        var temp_b0 = sin(param.b0 * Math.PI / 360) * 2;
        var temp_b1 = sin(param.b1 * Math.PI / 360) * 2;
        var temp_b2 = sin(param.b2 * Math.PI / 360) * 2;

        for (var i = 1; i < POINTERS; i ++) {
            var x1 = x[i - 1];
            var y1 = y[i - 1];

            x[i] = temp_a0 * sin(temp_a1 * y1) - cos(temp_a2 * x1);
            y[i] = temp_b0 * sin(temp_b1 * x1) - cos(temp_b2 * y1);

            if (x1 < minx){ minx = x1;}
            if (x1 > maxx){ maxx = x1;}
            if (y1 < miny){ miny = y1;}
            if (y1 > maxy){ maxy = y1;}
        }

        var xrange = maxx - minx;
        var yrange = maxy - miny;

        for (var i = 0; i < POINTERS; i ++) {
            var px = (x[i] - minx) / xrange + 0.1;
            var py = (y[i] - miny) / yrange + 0.1;
            var ix = (px * width) >> 0;
            var iy = (py * height) >> 0;

            var index = (ix + iy * width) * 4;

            data[index] += STEP;
            data[index + 1] += STEP;
            data[index + 2] += STEP;
            data[index + 3] = 255;

        }

        ctx.putImageData(pixels, 0, 0);

        drawColor();
    }


    function drawColor() {
        var pixels = ctx.getImageData(0, 0, width, height);
        var data = pixels.data;
        var _l = data.length;


        for (var i = 0; i < _l; i += 4) {
            var ix = (i / 4) % width;
            var iy = (i / 4) / width;
            var h = ((( ix + iy ) /  1000 * 200  + offsetColor) % 360) / 360;

            data[i] = (data[i] / 255) * getColor(h + 1 / 3);
            data[i + 1] = (data[i + 1] / 255) * getColor(h);
            data[i + 2] = (data[i + 2] / 255) * getColor(h - 1 / 3);

        }

        ctx.fillRect(0, 0, width, height);
        ctx.putImageData(pixels, 0, 0);
    }

    function getColor(delta) {
        if (delta < 0) {
            delta += 1;
        }
        else if (delta > 1) {
            delta -= 1;
        }
        return  (-12 * (delta - 0.5) * (delta - 0.5 ) + 1.5) * 255;
    }


    function animate() {
        var seed = 0;
        var itemName = ['a0', 'a1', 'a2', 'b0', 'b1', 'b2'];
        var change = 0;

        setInterval(function () {
            draw();

            seed = seed % 6;
            var item = itemName[seed];
            change ++;

            if (change > 360) {
                seed ++;
                change = 0;
            }

            param[item] ++;
        }, 40);
    }


    init();

})();