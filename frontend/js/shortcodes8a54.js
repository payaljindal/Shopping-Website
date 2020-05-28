(function($) {
    "use strict";
    google.load('visualization', '1', {'packages':['geochart','corechart','table']});
    function shortcodes_piegraph(idElement, percent, color, radius) {
        var canvas = document.getElementById(idElement),
                context = canvas.getContext('2d'),
                x = canvas.width / 2,
                y = canvas.height / 2,
                fullPercent = 2 * Math.PI,
                startAngle = 1.5 * Math.PI,
                endAngle = ((percent / 100) * fullPercent) + startAngle,
                counterClockwise = false;
        context.lineWidth = 5;
        context.strokeStyle = 'rgba(255,255,255,0.5)';
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(x, y, radius, startAngle, (fullPercent + startAngle), counterClockwise);
        context.stroke();
        context.fillStyle = "#ffffff";
        context.font = "17px 'raleway'";
        context.textAlign = 'center';
        context.textBaseline = "middle";
        context.fillText(percent + "%", radius + 12, radius + 12);
        context.strokeStyle = color;
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
        context.stroke();
    }
    function number(num, content, target, duration) {
        if (duration) {
            var count = 0;
            var speed = parseInt(duration / num);
            var interval = setInterval(function() {
                if (count - 1 < num) {
                    target.html(count);
                }
                else {
                    target.html(content);
                    clearInterval(interval);
                }
                count++;
            }, speed);
        } else {
            target.html(content);
        }
    }
    $(document).ready(function() {
        /* Zoom image */
        var native_width = 0;
        var native_height = 0;
        $(".magnify").mousemove(function(e) {
            if (!native_width && !native_height)
            {
                var image_object = new Image();
                image_object.src = $(".small", this).attr("src");
                native_width = image_object.width;
                native_height = image_object.height;
            }
            else
            {
                var magnify_offset = $(this).offset();
                var mx = e.pageX - magnify_offset.left;
                var my = e.pageY - magnify_offset.top;
                if (mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0)
                {
                    $(".large", this).fadeIn(100);
                }
                else
                {
                    $(".large", this).fadeOut(100);
                }
                if ($(".large", this).is(":visible"))
                {
                    var rx = Math.round(mx / $(".small", this).width() * native_width - $(".large", this).width() / 2) * -1;
                    var ry = Math.round(my / $(".small", this).height() * native_height - $(".large", this).height() / 2) * -1;
                    var bgp = rx + "px " + ry + "px";

                    var px = mx - $(".large", this).width() / 2;
                    var py = my - $(".large", this).height() / 2;
                    $(".large", this).css({left: px, top: py, backgroundPosition: bgp});
                }
            }
        })
        /* End Zoom image */
        /* Start pie-graph */
        $('.pie-graph').each(function() {
            var color = $(this).attr('data-color');
            var piecanvas = $(this).attr('data-id');
            var radius = $(this).attr('data-radius');
            var percent = $(this).attr('data-percent');
            shortcodes_piegraph(piecanvas, percent, color, (radius - 12));
        });
        /* End pie-graph */
        /* Stats */
        $('.stats .num').each(function() {
            //$(this).appear(function(){
            var container = $(this);
            var num = container.attr('data-num');
            var content = container.attr('data-content');
            number(num, content, container, 300);
            //});
        });
        /* End Stats */
        /* Google Chart */
        $('.google-chart').each(function() {
            var container = $(this);
            var data_string = container.attr('data-data-string');
            data_string = jQuery.parseJSON(data_string);
            var title = container.attr('data-title');
            var style = container.attr('data-style');
            var id = container.attr('id');
            if (style == 'pie') {
                google.setOnLoadCallback(function() {
                    var data = google.visualization.arrayToDataTable(data_string);
                    var options = {
                        title: title,
                        legend: 'true',
                        is3D: 'true',
                        pieSliceText: '',
                        colors: ['#69bd43', '#6576c2', '#cc2149', '#ff804e', '#008dff', '#a16a2a'],
                        slices: {
                            1: {offset: 0.2},
                            2: {offset: 0.2},
                            3: {offset: 0.2},
                        },
                    };

                    var piechart = new google.visualization.PieChart(document.getElementById(id));
                    piechart.draw(data, options);
                    if (window.addEventListener) {
                        window.addEventListener('resize', function() {
                            piechart.draw(data, options);
                        }, false);
                    }
                    else if (window.attachEvent) {
                        window.attachEvent('onresize', function() {
                            piechart.draw(data, options);
                        });
                    }
                });
            }
            if (style == 'geo') {
                google.setOnLoadCallback(function() {
                    var data = google.visualization.arrayToDataTable(data_string);
                    var options = {region: 'world',
                        displayMode: 'regions',
                        colorAxis: {colors: ['#69bd43']}
                    };

                    var geochart = new google.visualization.GeoChart(document.getElementById(id));
                    geochart.draw(data, options);
                    if (window.addEventListener) {
                        window.addEventListener('resize', function() {
                            geochart.draw(data, options);
                        }, false);
                    }
                    else if (window.attachEvent) {
                        window.attachEvent('onresize', function() {
                            geochart.draw(data, options);
                        });
                    }
                });
            }
        });
        /* End Google Chart */
    });
})(jQuery);