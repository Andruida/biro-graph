$(document).ready(function () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    if (!params.tantargy || !params.feladat) {
        console.log("nem megfelelő oldal")
        return;
    }

    restoreValues();
    $("#content").append("<div style=\"margin-top: 20px;\"><canvas id=\"score_chart\"></canvas></div>");

    setInterval(function () {
        if (restoreReady && !drawn) {
            draw();
            drawn = true;
        }
        restoreReady = true;
    }, 1000);
});
drawn = false;
restoreReady = false;
chart = null;

function restoreValues() {
    $("tbody tr").each(function () {
        const elem = this
        const a = $(elem).find("td a")
        const url = a[0].href.replace("riport.txt", "pont.txt")
        restoreReady = false;
        $.get(url, function (data, textStaus, jqXHR) {
            // console.log(parseFloat(data.trim()), new Date(jqXHR.getResponseHeader("Last-Modified")))
            const fields = $(elem).find("td")
            if (fields[1]) {
                fields[1].innerText =
                    new luxon.DateTime.fromJSDate(
                        new Date(jqXHR.getResponseHeader("Last-Modified")))
                        .toFormat("yyyy-MM-dd HH:mm:ss")
            }
            if (fields[3]) {
                fields[3].innerText = data.trim()
            }
            restoreReady = false;
            drawn = false;
        }).fail(function () {
            console.log("failed")
        })

    });
}

function loadValues() {
    const data = [];
    $("tbody tr").each(function () {
        const fields = $(this).find("td")
        if (fields[1] && fields[3]) {
            const date = new Date(fields[1].innerText)
            const score = parseFloat(fields[3].innerText)
            if (score != 0) {
                data.push({ x: date, y: score })
            }
        }
    });
    return data
}

function draw() {
    if (chart)
        chart.destroy()
    const data = loadValues();
    // console.log(data)

    const ctx = document.getElementById('score_chart');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Pontok',
                data,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    type: "time",

                }
            }
        }
    });
}

console.log("loaded")