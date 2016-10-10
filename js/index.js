$(function () {
    var canvas = $("#canvas").get(0)
    var cxt = canvas.getContext("2d")
    var width = canvas.width;
    var row = 15;
    var off = width / row;
    var flag = true
    var blocks = {}
    var blank = {}
    var ais = false
    var canvas1 = $("#canvas1").get(0)
    var cxt1 = canvas1.getContext("2d")
    var canvas2 = $("#canvas2").get(0)
    var cxt2 = canvas2.getContext("2d")
    var time = -1
    var times = -1
    var t
    var ts
    function blanks() {
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < row; j++) {
                blank[p2k(i, j)] = true
            }
        }
    }
    blanks()
    function p2k(x, y) {
        return x + "-" + y
    }

    function markcricl(x, y) {
        cxt.beginPath()
        cxt.arc(x * off + 0.5, y * off + 0.5, 4, 0, 2 * Math.PI)
        cxt.fill()
        cxt.closePath()
    }

    function o2k(ops) {
        var arr = ops.split("-")
        return {x: parseInt(arr[0]), y: parseInt(arr[1])}
    }

    function v2k(position) {
        return position.x + "-" + position.y
    }

    function draw() {

        //横线框
        cxt.beginPath()
        //0.5去除单线双像素
        for (var i = 0; i <= row; i++) {
            cxt.moveTo(0.5 * off + 0.5, i * off + 0.5 * off + 0.5)
            cxt.lineTo(14.5 * off + 0.5, i * off + 0.5 * off + 0.5)
        }
        cxt.stroke()
        cxt.closePath()
        //纵线框
        cxt.beginPath()
        //0.5去除单线双像素
        for (var i = 0; i <= row; i++) {
            cxt.moveTo(i * off + 0.5 * off + 0.5, 0.5 * off + 0.5)
            cxt.lineTo(i * off + 0.5 * off + 0.5, 14.5 * off + 0.5)
        }
        cxt.stroke()
        cxt.closePath()
        //棋盘中的小点
        //3.5 棋盘点到边缘的距离
        markcricl(3.5, 3.5)
        markcricl(row - 3.5, 3.5)
        markcricl(row / 2, row / 2)
        markcricl(3.5, row - 3.5)
        markcricl(row - 3.5, row - 3.5)
    }

    function drawchess(x, y, color) {
        cxt.save()
        cxt.beginPath()
        if (color == "black") {
            cxt.shadowOffsetX = 1
            cxt.shadowOffsetY = 1
            cxt.shadowBlur = 2
            cxt.shadowColor = "#555"
            bs = cxt.createRadialGradient(-5, -3, 2, 0, 0, 30)
            bs.addColorStop(0, "#aaa")
            bs.addColorStop(0.3, "#000")
            bs.addColorStop(1, "#000")
            cxt.fillStyle = bs
        } else {
            cxt.shadowOffsetX = 1
            cxt.shadowOffsetY = 1
            cxt.shadowBlur = 2
            cxt.shadowColor = "#555"
            ws = cxt.createRadialGradient(-5, -3, 2, 0, 0, 30)
            ws.addColorStop(0, "#fff")
            ws.addColorStop(0.3, "#ccc")
            ws.addColorStop(0.8, "#fff")
            ws.addColorStop(1, "#fff")
            cxt.fillStyle = ws
        }
        cxt.translate((x + 0.5) * off + 0.5, (y + 0.5) * off + 0.5)
        cxt.arc(0, 0, 10, 0, 2 * Math.PI)
        cxt.fill()
        cxt.closePath()
        cxt.restore()
        blocks[x + "-" + y] = color;
        delete blank[p2k(x, y)];
    }

    function check(pos, color) {
        var num = 1;
        var num1 = 1
        var tab = {}
        for (var i in blocks) {
            if (blocks[i] == color) {
                tab[i] = true;
            }
        }
        var tx = pos.x
        var ty = pos.y
        //横着判断棋子
        while (tab[p2k(tx + 1, ty)]) {
            num++;
            tx++;
        }
        tx = pos.x
        while (tab[p2k(tx - 1, ty)]) {
            num++;
            tx--;
        }
//纵着判断
        while (tab[p2k(tx, ty + 1)]) {
            num1++;
            ty++;
        }
        ty = pos.y
        while (tab[p2k(tx, ty - 1)]) {
            num1++;
            ty--;
        }
//右上判断
        var num2 = 1
        while (tab[p2k(tx + 1, ty - 1)]) {
            num2++;
            ty--;
            tx++;
        }
        ty = pos.y
        tx = pos.x
        while (tab[p2k(tx - 1, ty + 1)]) {
            num2++;
            ty++;
            tx--;
        }
//左上判断
        var num3 = 1
        while (tab[p2k(tx - 1, ty - 1)]) {
            num3++;
            ty--;
            tx--;
        }
        ty = pos.y
        tx = pos.x
        while (tab[p2k(tx + 1, ty + 1)]) {
            num3++;
            ty++;
            tx++;
        }
        return Math.max(num1, num, num2, num3);
    }

    function review() {
        var i = 0
        for (var ops in blocks) {
            i++;
            cxt.save()
            if (blocks[ops] == "black") {
                cxt.fillStyle = "#fff"
            } else if (blocks[ops] == "withe") {
                cxt.fillStyle = "#000"
            }
            cxt.font = "10px 微软雅黑"
            cxt.textAlign = "center"
            cxt.textBaseline = "middle"
            cxt.fillText(i, (o2k(ops).x + 0.5) * off, (o2k(ops).y + 0.5) * off)
            cxt.restore()
        }
    }

    function ai() {
        var max1 = -Infinity
        var max2 = -Infinity
        var scroll1
        var scroll2
        for (var i in blank) {
            var blank1 = check(o2k(i), "black")
            if (blank1 > max1) {
                max1 = blank1
                scroll1 = o2k(i)
            }
        }
        for (var i in blank) {
            var blank2 = check(o2k(i), "withe")
            if (blank2 > max2) {
                max2 = blank2
                scroll2 = o2k(i)
            }
        }
        if (max1 > max2) {
            return scroll1
        } else {
            return scroll2
        }
    }
//计时

    function drawzhen(cxt1,times){
        times++;
        cxt1.clearRect(0, 0, 100, 100)
        cxt1.save()
        cxt1.beginPath()
        cxt1.translate(50, 50)
        cxt1.rotate(2 * Math.PI * times/ 60)
        cxt1.strokeStyle = "#B8233F"
        cxt1.lineWidth = 3
        cxt1.beginPath()
        li = cxt1.createRadialGradient(0, 0, 2, 0, 0, 5)
        li.addColorStop(0, "#D6323A")
        li.addColorStop(1, "#000")
        cxt1.arc(0, 0, 5, 0, 2 * Math.PI)
        cxt1.fill()
        cxt1.closePath()
        cxt1.moveTo(0, 5)
        cxt1.lineTo(0, 10)
        cxt1.moveTo(0, -5)
        cxt1.lineTo(0, -30)
        cxt1.stroke()
        cxt1.closePath()
        cxt1.restore()
    }
    function move() {
        times++
        drawzhen(cxt1,times)
        if(times>=60){
            $(".alert-box").show()
            $(".alert-inner").text("恭喜！白棋赢了！你是否需要看棋盘")
            clearInterval(t)
            times=0
            $(canvas).off("click")
            return;
        }
    }
    function move1() {
        time++
        // cxt2.clearRect(0, 0, 100, 100)
        // cxt2.save()
        // cxt2.beginPath()
        // cxt2.translate(50, 50)
        // cxt2.rotate(2 * Math.PI * time/ 60)
        // cxt2.strokeStyle = "#B8233F"
        // cxt2.lineWidth = 3
        // cxt2.beginPath()
        // li = cxt2.createRadialGradient(0, 0, 2, 0, 0, 5)
        // li.addColorStop(0, "#D6323A")
        // li.addColorStop(1, "#000")
        // cxt2.arc(0, 0, 5, 0, 2 * Math.PI)
        // cxt2.fill()
        // cxt2.closePath()
        // cxt2.moveTo(0, 5)
        // cxt2.lineTo(0, 10)
        // cxt2.moveTo(0, -5)
        // cxt2.lineTo(0, -30)
        // cxt2.stroke()
        // cxt2.closePath()
        // cxt2.restore()
       drawzhen(cxt2,time)
        if(time>=60){
            $(".alert-box").show()
            $(".alert-inner").text("恭喜！黑棋赢了！你是否需要看棋盘")
            clearInterval(ts)
            time=0
            $(canvas).off("click")
            return;
        }
    }
    move()
    move1()
    function handleclick() {
        var e=e||window.event
        var position = {x: Math.round((e.offsetX - off / 2) / off), y: Math.round((e.offsetY - off / 2) / off)}
        if (blocks[v2k(position)]) {
            return
        }
        if (ais) {
            drawchess(position.x, position.y, "black")
            $("#clicks").get(0).play()
            if (check(position, "black") >= 5) {
                $(".alert-box").show()
                $(".alert-inner").text("恭喜！黑棋赢了！你是否需要看棋盘")
                return
            }
            var ss = ai()
            drawchess(ss.x, ss.y, "withe")
            if (check(ss, "withe") >= 5) {
                // alert("白骑赢了")
                // $("canvas").off("click")
                $(".alert-box").show()
                $(".alert-inner").text("恭喜！白棋赢了！你是否需要看棋盘")
                return
            }
            return;
        }
        if (flag) {
            drawchess(position.x, position.y, "black")
            clearInterval(t)
            times=0 
            drawzhen(cxt1,times)
            ts=setInterval(move1,1000)
            if (check(position, "black") >= 5) {
                $(".alert-box").show()
                $(".alert-inner").text("恭喜！黑棋赢了！你是否需要看棋盘")
                return
            }
        } else {
            drawchess(position.x, position.y, "withe")
            clearInterval(ts)
            time=0
            drawzhen(cxt2,time)
            t=setInterval(move,1000)
            if (check(position, "withe") >= 5) {
                // alert("白骑赢了")
                // $("canvas").off("click")
                $(".alert-box").show()
                $(".alert-inner").text("恭喜！白棋赢了！你是否需要看棋盘")
                return
            }
        }
        flag = !flag
        $("#clicks").get(0).play()
    }
    $(canvas).click(function (e) {
        handleclick()
    })
    function restart() {
        cxt.clearRect(0, 0, width, width)
        draw()
        blocks = {}
        flag = true
        $("canvas").off("click").on("click",handleclick)
    }
    draw()
    $(".button").click(function () {
        clearInterval(t)
        clearInterval(ts)
        review()
        $("canvas").off("click")
        $(".alert-box").hide()
    })
    $(".button1").click(function () {
        clearInterval(t)
        clearInterval(ts)
        $(".alert-box").hide()
        $("canvas").off("click")
    })
    $(".baton1").on("click",function(){
        if (confirm("是否要重新开局？")){
            blanks()
            restart()
        }else{
            return
        }
       })
    $(".baton").click(function () {
        clearInterval(t)
        clearInterval(ts)
        $(this).toggleClass("opens")
        $(".start").removeClass("opens")
        restart()
        ais = !ais;
    })
$(".start").click(function () {
    $(this).toggleClass("opens")
    $(".baton").removeClass("opens")
    $(".baton2").removeClass("opens")
    restart()
    ais = false;
    t=setInterval(move,1000)
})
$(".baton2").click(function(){
    clearInterval(t)
    clearInterval(ts)
    $(".regular").addClass("regular1")
    $(this).addClass("opens")
})
    $(".regular").click(function(){
        $(".regular").removeClass("regular1")
        $(".baton2").removeClass("opens")
    })
    $(".open").click(function(){
        $(".bg").addClass("bgs")
        $(".player1").addClass("player1s")
        $(".player2").addClass("player2s")
        $(this).hide()
        $(".stars").hide()
        $("#liushui").get(0).play()
    })
    $("#liushui").get(0).volume=0.3
    $("#liushui").on("ended",function () {
        $("#liushui").get(0).play()
    })
})