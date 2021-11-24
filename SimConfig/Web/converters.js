function replaceHtml(el, html) {
    var oldEl = typeof el === "string" ? document.getElementById(el) : el;
	/*@cc_on // Pure innerHTML is slightly faster in IE
		oldEl.innerHTML = html;
		return oldEl;
	@*/
    var newEl = oldEl.cloneNode(false);
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
	/* Since we just removed the old element from the DOM, return a reference
	to the new element, which can be used to restore variable references. */
    return newEl;
};

function fillDiv(div, proportional) {
    var currentWidth = parseInt(div.get(0).style.width, 10);
    var currentHeight = parseInt(div.get(0).style.height, 10);

    var availableHeight = window.innerHeight;
    var availableWidth = window.innerWidth;

    var scaleX = availableWidth / currentWidth;
    var scaleY = availableHeight / currentHeight;

    if (proportional) {
        scaleX = Math.min(scaleX, scaleY);
        scaleY = scaleX;
    }

    var translationX = Math.round((availableWidth - (currentWidth * scaleX)) / 2);
    var translationY = Math.round((availableHeight - (currentHeight * scaleY)) / 2);

    div.css({
        "position": "fixed",
        "left": "0px",
        "top": "0px",
        "-webkit-transform": "translate(" + translationX + "px, "
            + translationY + "px) scale3d("
            + scaleX + ", " + scaleY + ", 1)",
        "-webkit-transform-origin": "0 0"
    });
}

function isMobile() {
    try { document.createEvent("TouchEvent"); return true; }
    catch (e) { return false; }
}

function initialize() {
    var div = $("#fill");
    fillDiv(div, true);

    if ("onorientationchange" in window) {
        console.log("Using orientationchange");
        // There seems to be a bug in some Android variants such that the
        // metrics like innerHeight and outerHeight (used in fillDiv above)
        // are not updated when the orientationEvent is triggered. The
        // half-second delay gives the browser a chance to update the
        // metrics before rescaling the div.
        $(window).bind("orientationchange", function () { setTimeout(function () { fillDiv(div, true); }, 500) });
    } else if ("ondeviceorientation" in window) {
        console.log("Using deviceorientation");
        // Unlike the event above this not limited to a horzontal/vertical
        // flip and will trigger for any device orientation movement
        $(window).bind("deviceorientation", function () { setTimeout(function () { fillDiv(div, true); }, 500) });
    }
    console.log("No orientation supported, fallback to resize");
    $(window).resize(function () { fillDiv(div, true); });

    if (navigator.userAgent == "SimHub.Mobile") {
        setTimeout(function () { fillDiv(div, true); }, 0);
        setTimeout(function () { fillDiv(div, true); }, 50);
        setTimeout(function () { fillDiv(div, true); }, 500);
    }
}

function DrawPlayerStyle(mapctx, style, opp, rotation) {
    mapctx.save();
    mapctx.fillStyle = hex2rgba(style.DotColor);
    mapctx.strokeStyle = hex2rgba(style.DotBordercolor);
    mapctx.beginPath();
    mapctx.arc(opp.L, opp.T, style.DotRadius / 2, 0, 2 * Math.PI);
    mapctx.fill();
    mapctx.lineWidth = style.DotBorderThickness;
    mapctx.stroke();

    mapctx.fillStyle = hex2rgba(style.LabelColor);

    if (style.LabelFont == null) {
        mapctx.font = 'bold ' + style.LabelFontSize + 'px "Segoe UI"';
    } else {
        mapctx.font = 'bold ' + style.LabelFontSize + 'px ' + '"' + style.LabelFont + '"';
    }

    mapctx.textBaseline = "middle";
    mapctx.textAlign = "center";
    mapctx.translate(opp.L, opp.T);
    mapctx.rotate(-Math.radians(rotation));
    mapctx.translate(0, -style.DotRadius / 2);
    mapctx.fillText(opp.RPT, 0, style.DotRadius / 2);

    //if(opp.I != null){
    //        mapctx.textAlign = "left";
    //        mapctx.translate(style.DotRadius /2 +style.DotBorderThickness+ 2 ,-style.DotRadius /2 +style.DotBorderThickness+ 2 );
    //        mapctx.fillText(opp.I, 0, style.DotRadius / 2);
    //}

    mapctx.restore();
}

function ApplyPlayerStyle($item, style) {
    $item.width(style.DotRadius);
    $item.height(style.DotRadius);
    $item.addClass("noselect");
    $item.css("background", hex2rgba(style.DotColor));
    $item.css("color", hex2rgba(style.LabelColor));
    $item.css("border-radius", "50%");
    $item.css("text-align", "center");
    $item.css("vertical-align", "middle");
    $item.css("line-height", style.DotRadius + "px");
    $item.css('font-size', style.LabelFontSize + "px");
    $item.css('margin', "-" + (style.DotRadius / 2) + "px");
    $item.css('border', style.DotBorderThickness + "px solid " + hex2rgba(style.DotBordercolor));
    ApplyFont($item, style.LabelFont);
}

function ApplyRadarStyle($item, style) {
    $item.width(20);
    $item.height(40);
    $item.addClass("noselect");
    $item.css("box-sizing", "border-box");
    $item.css("background", hex2rgba(style.DotColor));
    $item.css("color", hex2rgba(style.LabelColor));
    $item.css("border-radius", "5px 5px 2px 2px");
    $item.css("text-align", "center");
    $item.css("vertical-align", "middle");
    $item.css("line-height", style.DotRadius + "px");
    $item.css('font-size', style.LabelFontSize + "px");
    $item.css('margin', "-" + (style.DotRadius / 2) + "px");
    $item.css('border', style.DotBorderThickness + "px solid " + hex2rgba(style.DotBordercolor));
    ApplyFont($item, style.LabelFont);
}

String.prototype.format = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function scale($el, scaleratio) {
    $el.css({
        '-webkit-transform': 'scale(' + scaleratio + 'deg)',
        '-moz-transform': 'scale(' + scaleratio + 'deg)',
        '-ms-transform': 'scale(' + scaleratio + 'deg)',
        '-o-transform': 'scale(' + scaleratio + 'deg)',
        'transform': 'scale(' + scaleratio + 'deg)',
    });
}

function toVerticalAlignment(value) {
    if (value == 0) {
        return "top";
    }
    if (value == 1) {
        return "center";
    }
    if (value == 2) {
        return "flex-end";
    }
    if (value == 3) {
        return "center";
    }
}

function toHorizontalAlignment(value) {
    if (value == 0) {
        return "flex-start";
    }
    if (value == 1) {
        return "center";
    }
    if (value == 2) {
        return "flex-end";
    }
    if (value == 3) {
        return "center";
    }
}

function toHorizontalTextAlign(value) {
    if (value === 0) {
        return "left";
    }
    if (value === 1) {
        return "center";
    }
    if (value === 2) {
        return "right";
    }
    if (value === 3) {
        return "center";
    }
}

var hex2rgba_patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
function hex2rgba(hex) {
    //extract the two hexadecimal digits for each color

    var matches = hex2rgba_patt.exec(hex);

    if (matches == null) {
        return "rgba(255,255,255,0)";
    }

    //convert them to decimal
    var a = Math.round(parseInt(matches[1], 16) / 2.55)/100;
    var r = parseInt(matches[2], 16);
    var g = parseInt(matches[3], 16);
    var b = parseInt(matches[4], 16);

    //create rgba string
    var rgba = "rgba(" + r + "," + g + "," + b + "," + a + ")";

    //return rgba colour
    return rgba;
}

function hex2alpha(hex) {
    //extract the two hexadecimal digits for each color

    var matches = hex2rgba_patt.exec(hex);

    if (matches == null) {
        return 0;
    }
    //convert them to decimal
    return parseInt(matches[1], 16) / 255;
}

function hex2rgbhex(hex) {
    //extract the two hexadecimal digits for each color

    var matches = hex2rgba_patt.exec(hex);

    if (matches == null) {
        return "#FFFFFF";
    }

    //convert them to decimal
    var a = parseInt(matches[1], 16) / 255;
    var r = parseInt(matches[2], 16);
    var g = parseInt(matches[3], 16);
    var b = parseInt(matches[4], 16);

    //create rgba string
    var hex2 = "#" + '' + matches[2] + '' + matches[3] + '' + matches[4];

    //return rgba colour
    return hex2;
}

function toVector(xCoord, yCoord, angle, length) {
    length = typeof length !== 'undefined' ? length : 10;
    angle = angle * Math.PI / 180; // if you're using degrees instead of radians
    return [length * Math.cos(angle) + xCoord, length * Math.sin(angle) + yCoord]
}

function toCSSTextShadow(ShadowDepth, ShadowBlur, ShadowDirection, ShadowColor) {
    if (ShadowDepth <= 0 && ShadowBlur <= 0) {
        return "";
    } else {
        var coordinates = toVector(0, 0, ShadowDirection + 90, ShadowDepth);

        return coordinates[0] + "px " + coordinates[1] + "px " + ShadowBlur + "px  " + hex2rgba(ShadowColor);
    }
}

function toCSSFontWeight(wpfWeight) {
    if (wpfWeight == 'Thin') return 100;
    if (wpfWeight == 'ExtraLight') return 200;
    if (wpfWeight == 'UltraLight') return 200;
    if (wpfWeight == 'Light') return 300;
    if (wpfWeight == 'Normal') return 400;
    if (wpfWeight == 'Regular') return 400;
    if (wpfWeight == 'Medium') return 500;
    if (wpfWeight == 'DemiBold') return 600;
    if (wpfWeight == 'SemiBold') return 600;
    if (wpfWeight == 'Bold') return 700;
    if (wpfWeight == 'ExtraBold') return 800;
    if (wpfWeight == 'UltraBold') return 800;
    if (wpfWeight == 'Black') return 900;
    if (wpfWeight == 'Heavy') return 900;
    if (wpfWeight == 'ExtraBlack') return 950;
    if (wpfWeight == 'UltraBlack') return 950;
}

function BorderStyleToCss($el, borderStyle) {
    var br = "{0}px {1}px {2}px {3}px".format(borderStyle.RadiusTopLeft, borderStyle.RadiusTopRight, borderStyle.RadiusBottomRight, borderStyle.RadiusBottomLeft);
    if (br === "0px 0px 0px 0px") {
        $el.css('border-radius', null);
    } else {
        $el.css('border-radius', br);
    }

    var tmp = $el.get(0);
    var bs = "{0}px {1}px {2}px {3}px".format(borderStyle.BorderTop, borderStyle.BorderRight, borderStyle.BorderBottom, borderStyle.BorderLeft);
    if (bs === "0px 0px 0px 0px") {
        tmp.style.borderStyle = null;
        tmp.style.borderWidth = null;
        tmp.style.borderColor = null;
    } else {
        tmp.style.borderStyle = 'solid';
        tmp.style.borderWidth = bs;
        tmp.style.borderColor = hex2rgba(borderStyle.BorderColor);
    }
}

function AntiMargin($el, borderStyle) {
    var bs = "-{0}px -{1}px -{2}px -{3}px".format(borderStyle.BorderTop, borderStyle.BorderRight, borderStyle.BorderBottom, borderStyle.BorderLeft);
    $el.get(0).style.margin = bs;
}

/**
 * return the angle between two points.
 *
 * @param {number} x1		x position of first point
 * @param {number} y1		y position of first point
 * @param {number} x2		x position of second point
 * @param {number} y2		y position of second point
 * @return {number} 		angle between two points (in degrees)
 */
Math.getAngle = function (x1, y1, x2, y2) {
    var dx = x1 - x2,
        dy = y1 - y2;

    return Math.atan2(dy, dx) * 57.2958;
};

Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

function BrushToCss($el, brush) {
    if (brush.SolidColorBrush != null) {
        $el.css({ "background-color": hex2rgba(brush.SolidColorBrush["#text"]) });
    }
    if (brush.LinearGradientBrush != null) {
        var sp = brush.LinearGradientBrush["@StartPoint"];
        if (sp == null) { sp = "0,0"; }
        var ep = brush.LinearGradientBrush["@EndPoint"];
        if (ep == null) { ep = "1,0"; }

        var x1 = Number(sp.split(",")[0]);
        var y1 = Number(sp.split(",")[1]);
        var x2 = Number(ep.split(",")[0]);
        var y2 = Number(ep.split(",")[1]);
        var angle = Math.getAngle(x1, y1, x2, y2) - 90;

        var stops = '';
        var stopsc = brush.LinearGradientBrush["LinearGradientBrush.GradientStops"]["GradientStop"];

        var allstops = new Array();
        for (var i in stopsc) {
            allstops.push(stopsc[i]);
        }

        //if (allstops.length > 1) {
        //    if (allstops[0]["@Offset"] > allstops[allstops.length - 1]["@Offset"]) {
        //        allstops.reverse();
        //        //angle = angle-180;
        //    }
        //}

        allstops.sort(function (a, b) {
            return Number(a["@Offset"]) - Number(b["@Offset"]);
        });

        for (var i in allstops) {
            if (stops != '') {
                stops = stops + ', ';
            }
            stops = stops + hex2rgba(allstops[i]["@Color"]);
            stops = stops + " " + (allstops[i]["@Offset"] * 100) + "%";
        }
        $el.css({ "background": "linear-gradient(" + angle + "deg," + stops + ")" });
    }
    if (brush.RadialGradientBrush != null) {
        var center = brush.RadialGradientBrush["@Center"];
        if (center == null) { sp = "0.5,0.5"; }
        var centerx = Number(center.split(",")[0]);
        var centery = Number(center.split(",")[1]);
    }
}

function rotate($el, degrees) {
    if (degrees == 0) {
        $el.css({
            '-webkit-transform': '',
            '-moz-transform': '',
            '-ms-transform': '',
            '-o-transform': '',
            'transform': '',
        });
    } else {
        $el.css({
            '-webkit-transform': 'rotate(' + degrees + 'deg)',
            '-moz-transform': 'rotate(' + degrees + 'deg)',
            '-ms-transform': 'rotate(' + degrees + 'deg)',
            '-o-transform': 'rotate(' + degrees + 'deg)',
            'transform': 'rotate(' + degrees + 'deg)',
        });
    }
}

function blur($el, radius) {
    radius = radius / 2;
    var blur = radius > 0 ? 'blur(' + radius + 'px)' : '';
    $el.css({
        '-webkit-filter': blur,
        '-moz-filter': blur,
        '-ms-filter': blur,
        '-o-filter': blur,
        'transform': blur
    });
}

function guessImageMime(data) {
    if (data.charAt(0) == '/') {
        return "image/jpeg";
    } else if (data.charAt(0) == 'R') {
        return "image/gif";
    } else if (data.charAt(0) == 'i') {
        return "image/png";
    }
}

function GetImageSrcFromBase64(base64) {
    if (base64 == null) {
        return "";
    }
    return "data:" + guessImageMime(base64) + ";base64," + base64;
}

function GetImageFromBase64(base64) {
    if (base64 == null) {
        return "";
    }
    return "url('data:" + guessImageMime(base64) + ";base64," + base64 + "')";
}

function ApplyFont($item, font) {
    if (font == null) {
        $item.css("font-family", '"Segoe UI"');
    } else {
        $item.css("font-family", '"' + font + '"');
    }
}

/**
 * jQuery alterClass plugin
 *
 * Remove element classes with wildcard matching. Optionally add classes:
 *   $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
 *
 * Copyright (c) 2011 Pete Boere (the-echoplex.net)
 * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
(function ($) {
    $.fn.alterClass = function (removals, additions) {
        var self = this;

        if (removals.indexOf('*') === -1) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass(removals);
            return !additions ? self : self.addClass(additions);
        }

        var patt = new RegExp('\\s' +
            removals.
                replace(/\*/g, '[A-Za-z0-9-_]+').
                split(' ').
                join('\\s|\\s') +
            '\\s', 'g');

        self.each(function (i, it) {
            var cn = ' ' + it.className + ' ';
            while (patt.test(cn)) {
                cn = cn.replace(patt, ' ');
            }
            it.className = $.trim(cn);
        });

        return !additions ? self : self.addClass(additions);
    };
})(jQuery);