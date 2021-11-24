var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

var noSleep = new NoSleep();
function enableNoSleep() {
    //document.removeEventListener('click', enableNoSleep, false);
    try {
        //noSleep.disable();
        noSleep.enable();
    } catch (error) {
    }
}

function GetCurrentTemplate() {
    var hash = window.location.hash.substring(1);

    if (hash.indexOf("|nocontrols") >= 0) {
        $("#controls").removeClass("forcevisible").hide();
        $("#controls2").removeClass("forcevisible").hide();
    }

    var d = hash.split("|");
    return d[0];
}

if (!Math.sign) {
    Math.sign = function (x) {
        // If x is NaN, the result is NaN.
        // If x is -0, the result is -0.
        // If x is +0, the result is +0.
        // If x is negative and not -0, the result is -1.
        // If x is positive and not +0, the result is +1.
        return ((x > 0) - (x < 0)) || +x;
        // A more aesthetic pseudo-representation:
        //
        // ( (x > 0) ? 1 : 0 )  // if x is positive, then positive one
        //          +           // else (because you can't be both - and +)
        // ( (x < 0) ? -1 : 0 ) // if x is negative, then negative one
        //         ||           // if x is 0, -0, or NaN, or not a number,
        //         +x           // then the result will be x, (or) if x is
        //                      // not a number, then x converts to number
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

document.getElementById("loadingLabel").innerHTML = "Loading " + decodeURI(GetCurrentTemplate()).replace(/\+/g, " ");

if (window.location.hash) {
    var hash = window.location.hash.substring(1);

    if (hash.indexOf("|overlay") < 0) {
        $("body").css("background", "black");
    } else {
        $("body").addClass("overlay-mode");
    }

    if (hash.indexOf("|electron") < 0) {
        $("dragcontrols").show();
    }

    if (hash.indexOf("|nocontrols") >= 0) {
        $("#controls").removeClass("forcevisible").hide();
        $("#controls2").remove();
    } else {
        $("#controls2").css("opacity", 1);
    }
} else {
    $("#controls2").css("opacity", 1);
}

$(function () {
    // Enable wake lock.
    // (must be wrapped in a user input event handler e.g. a mouse or touch handler)
    // document.addEventListener('click', enableNoSleep, false);

    var closeTimeeout = 0;
    var oppenedFromWipe = false;

    function openControls() {
        $("#controls2").animate({ top: 0, opacity: 1 }, 250);
        console.log("mouse over");
        clearTimeout(closeTimeeout);
    }

    function closeControls(delay) {
        clearTimeout(closeTimeeout);
        closeTimeeout = setTimeout(function () {
            $("#controls2").animate({ top: -48, opacity: 0.00 }, 250, 'linear');
        }, delay);
        $(".mobilehelp").slideUp();
    }

    function detectTouch() {
        if (typeof window !== 'undefined') {
            return Boolean(
                'ontouchstart' in window ||
                window.navigator.maxTouchPoints > 0 ||
                window.navigator.msMaxTouchPoints > 0 ||
                window.DocumentTouch && document instanceof DocumentTouch
            );
        }
    }
    if (!detectTouch()) {
        $("#controls2").on("mouseenter", function () {
            openControls();
            oppenedFromWipe = false;
        });

        $("#controls2").on("mouseleave", function () {
            closeControls(500);
        });

        $("body").addClass("notouch");
    } else {
        $("body").addClass("touch");
    }

    function resizeControls() {
        var isFullScreen = document.fullScreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen;
        if (isFullScreen) {
            $("#controls2").css("transform", "scale(" + ($(".maincontainer").width() / 720) + ")");
        } else {
            $("#controls2").css("transform", "scale(1)");
        }
    }

    if (!detectTouch() || navigator.userAgent == "SimHub.Mobile") {
        openControls();
        closeControls(3000);
    } else {
        $(".mobilehelp").show();
        if (!iOS) {
            setInterval(function () {
                resizeControls();
            }, 100);
        }
    }

    if (navigator.userAgent == "SimHub.Mobile") {
        $("#fsbutton").hide();
    }

    function toggleControls() {
        if ($("#controls").hasClass("forcevisible")) {
            $("#controls").addClass("forcehidden");
            $("#controls").removeClass("forcevisible");
        } else {
            $("#controls").removeClass("forcehidden");
            $("#controls").addClass("forcevisible");
        }
    }

    $("body").touchwipe({
        wipeLeft: function () {
            window.simhub.client.actionTriggered(7, "NextScreen");
            enableNoSleep();
        },
        wipeRight: function () {
            window.simhub.client.actionTriggered(6, "PreviousScreen");
            enableNoSleep();
        },
        wipeUp: function () {
            oppenedFromWipe = true;
            openControls();
            closeControls(3000);
            enableNoSleep();
        },
        wipeDown: function () {
            closeControls(0);
            enableNoSleep();
        },
        min_move_x: 100,
        min_move_y: 75,
        preventDefaultEvents: false
    });

    function checkKey(e) {
        if (e.keyCode == 37) {
            window.simhub.client.actionTriggered(6, "PreviousScreen");
        } else if (e.keyCode == 39) {
            window.simhub.client.actionTriggered(7, "NextScreen");
        } else if (e.keyCode == 8) {
            location = "/";
        }
        //alert(e.keyCode);
        e.preventDefaultEvents = true;
    }

    window.addEventListener('keydown', checkKey, false);

    if (typeof reload2 != 'undefined')
        reload2.addEventListener("click", function () {
            location.reload();
        });

    if (typeof back2 != 'undefined')
        back2.addEventListener("click", function () {
            if (typeof SimHubMobile != 'undefined') {
                SimHubMobile.showToast("Back !");
            } else {
                location = "/";
            }
        });

    if (typeof prevscreen != 'undefined')
        prevscreen.addEventListener("click", function () {
            window.simhub.client.actionTriggered(6, "PreviousScreen");
            if (oppenedFromWipe) {
                enableNoSleep();
                closeControls(2000);
            }
        });

    if (typeof nextscreen != 'undefined')
        nextscreen.addEventListener("click", function () {
            window.simhub.client.actionTriggered(7, "NextScreen");
            if (oppenedFromWipe) {
                enableNoSleep();
                closeControls(2000);
            }
        });

    if (typeof goFS2 != 'undefined')
        //var goFS = document.getElementById("goFS");
        goFS2.addEventListener("click", function () {
            enableNoSleep();
            if (iOS) {
                closeControls(0);
                //return;
            }

            if (!document.fullscreenElement &&    // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                elem = $(".wrapper").get(0);
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                    resizeControls();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                    resizeControls();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                    resizeControls();
                } else {
                    return;
                }
                try {
                    var mode = screen.orientation.type;

                    if (simhub.CurrentDash != null && simhub.CurrentDash.BaseWidth > simhub.CurrentDash.BaseHeight) {
                        if (mode.indexOf("landscape") == -1) {
                            mode = "landscape-primary";
                        }
                    } else if (simhub.CurrentDash != null && simhub.CurrentDash.BaseWidth < simhub.CurrentDash.BaseHeight) {
                        if (mode.indexOf("portrait") == -1) {
                            mode = "portrait-primary";
                        }
                    }
                    screen.orientation.lock(mode);//"landscape-primary");
                } catch (ex) {
                }
                //$("#controls").removeClass("forcevisible");
                closeControls(500);
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                try {
                    screen.orientation.unlock();
                } catch (ex) {
                    closeControls(500);
                }

                $("#controls2").css("transform", "scale(1)");
            }
            //$("#goFS").hide();
        }, false);

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { callback(); };

    window.requestAnimationFrameEx = function (a) { a(); };

    window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

    var socket;
    window.simhub = {};

    var redlineblock = $(".redline");
    var redlinehidden = false;
    window.simhub.blinker = setInterval(function () {

        if (window.simhub.redline == true) {
            redlinehidden = false;
            requestAnimationFrame(function () { redlineblock.toggle(); });
        } else {
            if (!redlinehidden) {
                requestAnimationFrame(function () { redlineblock.hide(); });
            }
            redlinehidden = true;
        }

    }, 150);

    function reset() {
        $(".maincontainer").html("");
        window.simhub = {};
        window.simhub.client = {};
        window.simhub.server = {};
        window.simhub.server.MessagesSync = 0;
        window.SimHubCallbacks = [];
        window.SimHubWrapCallbacks = [];
        window.SimHubGameStateCallbacks = [];
        window.SimHubWrapItems = [];
        window.SimHubDataCallBacks = [];
        window.SimHubRegisteredComponents = {};
        window.SimHubRegisteredScreens = {};
        window.SimHubDelayedMessages = {};
        window.ActionCallbacks = [];
        window.SimHubDashCache = [];
        window.SimHubDashCacheCallbacks = [];
        window.GameState = null;
        window.simhub.did = 1;
        window.simhub.workers = 0;
        //window.simhub.blinker = null;
        window.simhub.redline = false;
        if (window.ImageStyleMap != null) {
            for (var s in window.ImageStyleMap) {
                window.ImageStyleMap[s].parentNode.removeChild(window.ImageStyleMap[s]);
            }
        }

        window.ImageStyleMap = {};
        window.simhub.server.registerComponents = function (data) {
            socket.send("registerComponents|" + JSON.stringify(data))
        }

        window.simhub.server.registerScreens = function (data) {
            socket.send("registerScreens|" + JSON.stringify(data))
        }

        window.simhub.server.componentDatas = function (data) {
            socket.send("componentDatas|" + JSON.stringify(data));
        }

        window.simhub.server.setScreenAsActive = function (screenId) {
            socket.send("setactive|" + screenId);
        }

        window.simhub.server.setMainDash = function (dashName) {
            socket.send("setMainDash|" + dashName);
        }

        window.simhub.client.pluginMessage = function (data) {
            //console.log(data);

            $("#message").css("transform", "scale(" + Math.min(1, $(".maincontainer").width() / 720) + ")");

            if (hash.indexOf("|nomessage") < 0 && simhub.EnableOnDashboardMessaging == true) {
                if (data === null) {
                    $("#message").animate({ opacity: 0 }, 200, 'linear');
                } else {
                    if (data.MinValue != null && data.MaxValue != null && data.CurrentValue != null) {
                        var percent = data.CurrentValue / (data.MaxValue - data.MinValue) * 100;
                        $("#pbvalue").width(percent + "%");
                        $("#messagepb").show();
                    } else {
                        $("#messagepb").hide();
                    }

                    $("#messagetitle").text(data.MessageTitle);
                    $("#messagevalue").text(data.Value);
                    $("#message").animate({ opacity: 1 }, 200, 'linear');
                }
            }
        }
        var oldFlashColor = "";
        window.simhub.client.componentsUpdated = function (data) {
            window.simhub.server.MessagesSync++;

            if (simhub.workers >= 0) {
                $(".progress").hide();
                $("#progressOverlay").hide();
                $(".maincontainer").show();
                simhub.workers = -1;
                initialize();
            }

            if (data.RL != null) {
                window.simhub.redline = data.RL;
            }

            if (data.FC != null && data.FC != oldFlashColor) {
                oldFlashColor = data.FC;

                $(".redline").css("background", hex2rgba(oldFlashColor));
            }

            for (componentId in data.D) {
                var cb = window.SimHubDataCallBacks[componentId]
                if (cb != null) {
                    cb(data.D[componentId]);
                }
            }

            var wrappedItem = null;
            var newValue = null;
            var component = null;
            var callback = null;
            for (componentId in data.C) {
                component = data.C[componentId];
                for (propertyName in component) {
                    newValue = component[propertyName];
                    wrappedItem = window.SimHubWrapItems[componentId];

                    var a = null;//propertyName.split('.');
                    if (propertyName.indexOf(".") > 0) {
                        if (wrappedItem != null) {
                            var a = propertyName.split('.');
                            var o = wrappedItem;

                            for (var i = 0; i < a.length - 1; i++) {
                                var n = a[i];
                                if (n in o) {
                                    o = o[n];
                                } else {
                                    o[n] = {};
                                    o = o[n];
                                }
                            }

                            o[a[a.length - 1]] = newValue;

                            var partialPName = a[0];
                            for (var i = 0; i < a.length; i++) {
                                if (i > 0) {
                                    partialPName = partialPName + "." + a[i];
                                }
                                var callback = window.SimHubWrapCallbacks[componentId + "," + partialPName];
                                if (callback != null) {
                                    callback(newValue, false);
                                }
                            }
                        }
                    } else {
                        wrappedItem[propertyName] = newValue;
                        callback = window.SimHubWrapCallbacks[componentId + "," + propertyName];
                        if (callback != null) {
                            callback(newValue, false);
                        }
                    }
                }
            }

            var sendState = false;
            if (!(data.IP === undefined) || window.InPit === undefined) {
                data.IP = data.IP == 1 ? true : false;
                window.InPit = data.IP;
                sendState = true;
            }

            if (!(data.GR === undefined) || window.GameState === undefined) {
                data.GR = data.GR == 1 ? true : false;
                window.GameState = data.GR;
                sendState = true;
            }

            if (sendState) {
                for (cidx in window.SimHubGameStateCallbacks) {
                    window.SimHubGameStateCallbacks[cidx](window.GameState, window.InPit);
                }
            }

            if (data.A > 0) {
                socket.send("acq|1");
            }

            window.simhub.server.MessagesSync -= 1;

            if (window.SimHubDelayedMessages != null) {
                var m = window.SimHubDelayedMessages;
                window.SimHubDelayedMessages = null;
                window.simhub.server.componentDatas(m);
            }
        }

        window.simhub.client.actionTriggered = function (actionId, actionName) {
            console.log("Action received : id " + actionId + " name " + actionName);
            if (window.ActionCallbacks[actionId] != null) {
                for (var cbId in window.ActionCallbacks[actionId]) {
                    window.ActionCallbacks[actionId][cbId](actionId, actionName);
                }
            }
        }
    }

    //reset();
    var reconnectMessage = $(".reconnectMessage");
    function ReConnect() {
        window.simhub.redline = false;
        reconnectMessage.show();
        var retry = setTimeout(function () {
            $.ajax({
                url: "/echo/",
                dataType: 'json',
                success: function (data) {
                    //clearInterval(retry);
                    Connect();
                },
                timeout: 500 //3 second timeout
            }).fail(ReConnect);
        }, 2000);
    }

    $("<li>Waiting for connection</li>").appendTo($(".progresslist"));
    var ti;
    function Connect() {
        var connected = false;
        reset();

        //socket = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port + "/ws");
        socket = new WebSocket("ws://" + window.location.hostname + ":" + (Number(window.location.port) + 1));

        //ti = setTimeout(function () {
        //    console.log("Reconnecting");
        //    socket.close();
        //    Connect();
        //}, 5000);

        socket.onopen = function () {
            $("<li>Connected</li>").appendTo($(".progresslist"));
            socket.send("echo|");
        };

        socket.onclose = function (evt) {
            console.log('WebSocket Closed ');
            connected = false;
            ReConnect();
        };

        socket.onerror = function (error) {
            console.log('WebSocket Error ' + error);
            ReConnect();
        };

        var componentsUpdatedType = "CU";
        var inputPressedType = "inputPressed";
        var pluginMessageType = "pluginMessage";

        window.ReceivedPackets = 0;

        function Ack(pid) {
            //if (pid % 2 == 0) {
            socket.send("pid|" + pid);
            //}
        }

        function RenderFrame(data, pid) {
            if (data.a === componentsUpdatedType) {
                window.simhub.client.componentsUpdated(data.d);
            }
            else if (data.a === pluginMessageType) {
                window.simhub.client.pluginMessage(data.d);
            } else if (data.a === inputPressedType) {
                if (hash.indexOf("|usbd480") < 0) {
                    window.simhub.client.actionTriggered(data.d.InputId, data.d.InputName);
                }
            }
            Ack(pid);
        }

        socket.onmessage = function (messageEvent) {
            var pid = messageEvent.data.substr(0, messageEvent.data.indexOf("|"));
            var messageEventData = messageEvent.data.substr(messageEvent.data.indexOf("|") + 1)

            if (ti != null) {
                clearTimeout(ti);
            }

            ti = null;
            if (!connected) {
                reconnectMessage.hide();
                Connected();
            }
            connected = true;

            if (messageEventData === "echo") {
                Ack(pid);
                return;
            }

            var data = JSON.parse(messageEventData);
            //Ack(pid);
            requestAnimationFrame(function () { RenderFrame(data, pid) });
        };
    }

    Connect();
});

function GetBaseType(component) {
    return component.$type;
    //var tt = window.SimHubMapType[component.$type];
    //if (tt == null) {
    //    tt = component.$type;
    //}
    //return tt;
}

function RegisterGameState(callback) {
    window.SimHubGameStateCallbacks.push(callback);
}

function RegisterAction(actionId, callback) {
    if (window.ActionCallbacks[actionId] == null) {
        window.ActionCallbacks[actionId] = [];
    }
    window.ActionCallbacks[actionId].push(callback);
}

function RegisterScreenScripts(screen) {
    window.SimHubRegisteredScreens[screen.ScreenId] = {};
    window.SimHubRegisteredScreens[screen.ScreenId]["ScreenScript"] = screen.ScreenScript.Expression;
}

function RegisterComponent(dashboard, component, screen, ownerscreen) {
    if (window.SimHubRegisteredComponents[dashboard.Path] == null) {
        window.SimHubRegisteredComponents[dashboard.Path] = {};
    }

    window.SimHubRegisteredComponents[dashboard.Path][dashboard.tname + '_' + component.Sid] = {};
    window.SimHubRegisteredComponents[dashboard.Path][dashboard.tname + '_' + component.Sid].OwnerScreenId = null;
    window.SimHubRegisteredComponents[dashboard.Path][dashboard.tname + '_' + component.Sid].TargetScreenId = screen.ScreenId;
    window.SimHubRegisteredComponents[dashboard.Path][dashboard.tname + '_' + component.Sid].SourceId = component.Sid;

    if (ownerscreen != null) {
        window.SimHubRegisteredComponents[dashboard.Path][dashboard.tname + '_' + component.Sid].OwnerScreenId = ownerscreen.ScreenId;
    }
}

function SendComponentMessage(dashboard, component, message, allowAggregate) {
    if (allowAggregate) {
        if (window.SimHubDelayedMessages == null) {
            window.SimHubDelayedMessages = {};
        }
        window.SimHubDelayedMessages[dashboard.tname + '_' + component.Sid] = message;
    } else {
        var m = {};
        m[dashboard.tname + '_' + component.Sid] = message;
        window.simhub.server.componentDatas(m);
    }
}

function NotifyRegisteredComponents() {
    var o = window.SimHubRegisteredComponents;
    $("<li>Registering " + Object.keys(window.SimHubRegisteredComponents).length + " components</li>").appendTo($(".progresslist"));
    window.simhub.server.registerComponents(o);
    //console.log(window.SimHubRegisteredComponents);
    window.SimHubRegisteredComponents = {};
    window.SimHubDashCache = [];
}

function NotifyRegisteredScreens() {
    var o = window.SimHubRegisteredScreens;
    $("<li>Registering " + Object.keys(window.SimHubRegisteredScreens).length + " screens</li>").appendTo($(".progresslist"));
    window.simhub.server.registerScreens(o);
    //console.log(window.SimHubRegisteredScreens);
    window.SimHubRegisteredScreens = {};
}

function Connected() {
    $("body").css("overflow", "hidden");
    if (window.location.hash) {
        window.simhub.server.setMainDash(GetCurrentTemplate());
        LoadTemplate(GetCurrentTemplate());
    } else {
        LoadTemplate("ControlCenter");
    }
}

function workerFinished() {
    if (window.simhub.workers == 0) {
        NotifyRegisteredComponents();
        $("<li>Waiting for data</li>").appendTo($(".progresslist"));
        window.SimHubDashCache = [];
        window.SimHubDashCacheCallbacks = [];
    }

    for (cidx in window.SimHubGameStateCallbacks) {
        if (window.GameState != null) {
            window.SimHubGameStateCallbacks[cidx](window.GameState);
        }
    }
}

function getDashJson(path, downloadpath, callback) {
    window.simhub.workers++;

    if (window.SimHubDashCache[path] != null) {
        //setTimeout(function () {
        console.log('Loaded from cache : ' + path);
        callback(JSON.parse(window.SimHubDashCache[path]));
        window.simhub.workers--;
        workerFinished();
        //});
        return;
    } else {
        var firstCB = false;
        if (window.SimHubDashCacheCallbacks[path] == null) {
            window.SimHubDashCacheCallbacks[path] = [];
            firstCB = true;
        }
        window.SimHubDashCacheCallbacks[path].push(callback);
        if (!firstCB) {
            console.log('Added to callback queue : ' + path);
            return;
        }
    }
    console.log('Requesting : ' + path);
    $.getJSON(downloadpath, function (data) {
        data["Path"] = path;

        data.Images.$values.forEach(function (image) {
            image.Uid = Math.random().toString(36).substr(2, 9);
            createImageStyle(image.Uid, image.Data, image.WebPath);
        });

        window.SimHubDashCache[path] = JSON.stringify(data);

        window.SimHubDashCacheCallbacks[path].forEach(function (cb) {
            cb(JSON.parse(window.SimHubDashCache[path]));
            window.simhub.workers--;
            workerFinished();
        });
    }).fail(function () {
        window.SimHubDashCacheCallbacks[path].forEach(function (cb) {
            window.simhub.workers--;
            workerFinished();
        });
    });
}

function LoadTemplate(template, widget, container, isWidget, widgetItem, ownerscreen) {
    if (widget == null) {
        widget = template + ".djson";
    }

    if (isWidget != true) {
        $(".maincontainer").hide();
        $(".progresslist").html("");
        //$(".progress").show();
        $("<li>Loading template " + decodeURI(template) + "</li>").appendTo($(".progresslist"));
        $("#loadingLabel").html("Loading " + decodeURI(template).replace(/\+/g, " "));
    } else {
        $("<li>Loading widget " + decodeURI(widget) + "</li>").appendTo($(".progresslist"));
    }

    var downloadpath = "/Dashtemplates/Definition/?dash={0}&widget={1}".format(encodeURIComponent(template), encodeURIComponent(widget));
    var path = "/Dashtemplates/{0}/{1}".format(template, widget);

    getDashJson(path, downloadpath, function (data) {
        var did = window.simhub.did++;

        data['tname'] = did;
        data['templateName'] = template;
        data['widgetName'] = widget;
        data['isWidget'] = isWidget;

        RenderTemplate(data, container, isWidget == null ? false : true, widgetItem, ownerscreen);
    })
}

function SetImage($elt, imageName, dashboard) {
    $elt.alterClass('img*', GetImageClass(imageName, dashboard));
}

function GetDynamicImageClass(id, data) {
    var cssclass = '_dynamic_' + id;
    return createImageStyle(cssclass, data);
}

String.prototype.hexEncode = function () {
    var hex, i;

    var result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }

    return result
}

function GetImageClass(imagename, dashboard) {
    if (imagename != null && imagename.startsWith("library:")) {
        var id = "libpic_" + imagename.hexEncode();
        createImageStyle(id, null, "\"/imagelibrary?Picture=" + encodeURI(imagename.substring(8)) + "\"");
        return 'img' + id;
    }

    var result = '';
    if (imagename != null) {
        dashboard.Images.$values.forEach(function (element) {
            if (element.Name == imagename) {
                result = 'img' + element.Uid;//+ dashboard.tname + '_' + element.imageId;
            }
        });
    }
    return result;
}

function GetImage(imagename, dashboard, isSrc) {
    var result = '';
    if (imagename != null) {
        if (imagename.startsWith("library:")) {
            return "/imagelibrary?Picture=" + encodeURI(imagename.substring(8));
        }

        dashboard.Images.$values.forEach(function (element) {
            if (element.Name == imagename) {
                if (isSrc != null && isSrc == true) {
                    if (element.WebPath !== undefined) {
                        result = element.WebPath;
                    } else {
                        result = GetImageSrcFromBase64(element.Data);
                    }
                } else {
                    result = GetImageFromBase64(element.Data);
                }
            }
        });
    }
    return result;
}

function createImageStyle(id, base64data, webPath) {
    var cssclass = 'img' + id;

    var style = window.ImageStyleMap[cssclass];
    if (style == null) {
        style = document.createElement('style');
        window.ImageStyleMap[cssclass] = style;
        style.type = 'text/css';
        style.setAttribute("id", cssclass);
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    if (webPath === undefined) {
        style.innerHTML = '.' + cssclass + ' { background-image: ' + GetImageFromBase64(base64data) + '; }';
    } else {
        style.innerHTML = '.' + cssclass + ' { background-image:url(' + webPath + ') ;} ';
    }

    return cssclass;
}

function RenderTemplate(dashboard, container, isWidget, widgetItem, ownerscreen) {
    if (container == null) {
        container = $(".maincontainer");
    }

    var iid = 0;
    container.attr("data-path", dashboard.File);

    var dash = $("<div id='_" + dashboard.tname + "' />");
    dash.css("overflow", "hidden");

    dash.width(dashboard.BaseWidth);
    dash.height(dashboard.BaseHeight);

    container.width(dashboard.BaseWidth);
    container.height(dashboard.BaseHeight);

    dash.appendTo(container);

    var shown = false;
    screenIdx = 0;
    dashboard.Screens.$values.forEach(function (element) {
        element.ScreenId = "s_" + dashboard.tname + "_" + screenIdx

        var screen = RenderScreen(dash, dashboard, element, ownerscreen);

        screen.attr("id", element.ScreenId);

        if (!shown && element.InGameScreen && isWidget) {
            screen.show();
            window.simhub.server.setScreenAsActive(screen.attr("id"));
            screen.addClass("active");
            shown = true;
        }
        screenIdx++;
    });

    if (!isWidget) {
        RegisterGameState(
            function (gameState, inpit) {
                SetDashGameState(gameState, inpit, dash);
            });

        simhub.CurrentDash = dashboard;
        simhub.EnableOnDashboardMessaging = dashboard.EnableOnDashboardMessaging;
        RegisterAction(7, function (actionId, actionName) {
            nextScreen(dash);
        });

        RegisterAction(6, function (actionId, actionName) {
            previousScreen(dash);
        });

        if (window.GameState != null) {
            SetDashGameState(window.GameState, dash);
        }
    } else {
        RegisterAction(widgetItem.NextScreenCommand, function (actionId, actionName) {
            nextScreen(dash);
        });

        RegisterAction(widgetItem.PreviousScreenCommand, function (actionId, actionName) {
            previousScreen(dash);
        });
    }
}

function nextScreen(dash) {
    var haspitscreen = dash.children(".pit").length > 0;
    var cssclass = "";
    if (haspitscreen) {
        cssclass = window.GameState ? (window.InPit ? "pit" : "ingame") : "idle";
    } else {
        cssclass = window.GameState ? "ingame" : "idle";
    }

    var ascreen = dash.children(".active." + cssclass);

    var next = ascreen.nextAll("." + cssclass).first();
    if (next.length == 0) {
        next = dash.children("." + cssclass + ":first").first();
    }

    if (next.length > 0) {
        dash.children(".screen").hide();
        ascreen.removeClass("active");
        next.show();
        window.simhub.server.setScreenAsActive(next.attr("id"));
        next.addClass("active");
    }
}

function previousScreen(dash) {
    var haspitscreen = dash.children(".pit").length > 0;
    var cssclass = "";
    if (haspitscreen) {
        cssclass = window.GameState ? (window.InPit ? "pit" : "ingame") : "idle";
    } else {
        cssclass = window.GameState ? "ingame" : "idle";
    }

    var ascreen = dash.children(".active." + cssclass);

    var next = ascreen.prevAll("." + cssclass).first();
    if (next.length == 0) {
        next = dash.children("." + cssclass).last();
    }

    if (next.length > 0) {
        dash.children(".screen").hide();
        ascreen.removeClass("active");
        next.show();
        window.simhub.server.setScreenAsActive(next.attr("id"));
        next.addClass("active");
    }
}

function SetDashGameState(gameState, inpit, dash) {
    var haspitscreen = dash.children(".pit").length > 0;
    var cssclass = "";
    if (haspitscreen) {
        cssclass = window.GameState ? (window.InPit ? "pit" : "ingame") : "idle";
    } else {
        cssclass = window.GameState ? "ingame" : "idle";
    }

    var current = dash.children(".active:visible");
    var next = [];
    if (current.hasClass(cssclass)) {
        return;
    }
    var next = dash.children(".active." + cssclass);
    if (next.length == 0) {
        next = dash.children("." + cssclass).first();
    }
    if (next.length == 0) {
        next = dash.children(".screen").first();
    }
    if (next.length > 0) {
        dash.children(".screen").hide();
        next.show();
        window.simhub.server.setScreenAsActive(next.attr("id"));
        next.addClass("active");
    }
}

function wrap(dashboard, item, propertyName, action, linkedproperties) {
    window.SimHubWrapItems[dashboard.tname + '_' + item.Sid] = item;

    if (linkedproperties !== undefined) {
        for (var i = 0; i < linkedproperties.length; i++) {
            window.SimHubWrapCallbacks[dashboard.tname + '_' + item.Sid + "," + linkedproperties[i]] = action;
        }
    }

    window.SimHubWrapCallbacks[dashboard.tname + '_' + item.Sid + "," + propertyName] = action;
    action(item[propertyName], true);
}

function registerCustomData(dashboard, item, action) {
    window.SimHubDataCallBacks[dashboard.tname + '_' + item.Sid] = action;
}

function RenderScreen(container, dashboard, screendata, ownerscreen) {
    var screen = $("<div class='screen' />");

    if (screendata.InGameScreen) {
        screen.addClass("ingame");
    }

    if (screendata.IdleScreen) {
        screen.addClass("idle");
    }

    if (screendata.PitScreen) {
        screen.addClass("pit");
    }

    screen.width(dashboard.BaseWidth);
    screen.height(dashboard.BaseHeight);

    if (!dashboard.isWidget) {
        var bg = hex2rgba(screendata.BackgroundColor);
        if (bg === "rgba(255, 255, 255, 0)") bg = null;
        screen.css({ "background-color": bg });
    }

    SetImage(screen, screendata.Background, dashboard);
    screen.get(0).style.backgroundSize = dashboard.BaseWidth + 'px ' + dashboard.BaseHeight + 'px';

    screendata.Items.$values.forEach(function (element) {
        RenderItem(screen, element, dashboard, screendata, ownerscreen);
    });

    screen.hide();
    screen.appendTo(container);

    RegisterScreenScripts(screendata);

    return screen;
}

function RenderItem(container, element, dashboard, screen, ownerscreen) {
    element.uid = dashboard.tname + '_' + element.Sid;
    var elementcontainer = $("<div></div>");
    elementcontainer.css("-webkit-transform", "translate3d(0,0,0)");
    var htmlelementcontainer = elementcontainer.get(0);
    elementcontainer.attr("id", dashboard.tname + '_' + element.Sid);
    //elementcontainer.data("data-name", element.name);
    elementcontainer.addClass("nopointerevents");

    wrap(dashboard, element, 'Visible', function (value, initialLoad) {
        if (initialLoad) {
            if (value) {
                htmlelementcontainer.style.display = 'block';
            } else {
                htmlelementcontainer.style.display = 'none';
            }
        }
    });

    wrap(dashboard, element, 'VisibleEx', function (value, initialLoad) {
        if (!initialLoad) {
            if (value) {
                htmlelementcontainer.style.display = 'block';
            } else {
                htmlelementcontainer.style.display = 'none';
            }
        }
    });

    wrap(dashboard, element, 'BorderStyle', function (value) {
        BorderStyleToCss(elementcontainer, element.BorderStyle);
    });

    wrap(dashboard, element, 'Width', function (value) {
        elementcontainer.css({ 'width': value + "px" });
    });

    wrap(dashboard, element, 'Opacity', function (value) {
        if (value === 100) {
            elementcontainer.css("opacity", "");
        } else {
            elementcontainer.css("opacity", value / 100);
        }
    });

    wrap(dashboard, element, 'BlurRadius', function (value) {
        if (value > 0) {
            elementcontainer.css({ "filter": "blur(" + (value / 2) + "px)" });
        } else {
            elementcontainer.css({ "filter": null });
        }
    });

    wrap(dashboard, element, 'Height', function (value) {
        elementcontainer.css({ 'height': value + "px" });
    });

    wrap(dashboard, element, 'Left', function (value) {
        elementcontainer.css({ "left": value + "px" });
    });

    wrap(dashboard, element, 'Top', function (value) {
        elementcontainer.css({ "top": value + "px" });
    });

    wrap(dashboard, element, 'BackgroundColor', function (value) {
        var bg = hex2rgba(value);
        //if (bg === "rgba(255,255,255,0)");// bg = null;
        elementcontainer.css({ "background-color": bg });
    });

    wrap(dashboard, element, "Rotation", function (value) {
        rotate(elementcontainer, element.Rotation);
    });

    elementcontainer.css("overflow", "hidden");
    elementcontainer.css("position", "absolute");
    elementcontainer.css("box-sizing", "border-box");
    elementcontainer.css("-moz-box-sizing", "border-box");
    elementcontainer.css("-webkit-box-sizing", "border-box");
    elementcontainer.attr("data-name", element.Name);
    var elementType = GetBaseType(element);
    var regex = /\.([A-z]*),/g;
    var m = regex.exec(elementType);
    var componentType = m[1];
    elementcontainer.addClass(componentType);
    //elementcontainer.addClass(element.Name);

    if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.RectangleItem, SimHub.Plugins" || element.IsRectangleItem) {
        // Nothing to do
    }
    else if (element.$type === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.Layer, SimHub.Plugins") {
        element.Childrens.$values.forEach(function (element) {
            elementcontainer.css({ "left": "0px" });
            elementcontainer.css({ "top": "0px" });
            elementcontainer.width(dashboard.BaseWidth);
            elementcontainer.height(dashboard.BaseHeight);
            RenderItem(elementcontainer, element, dashboard, screen, ownerscreen);
        });
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.OutlinedTextItem, SimHub.Plugins") {
        renderOutlinedTextItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.TextItem, SimHub.Plugins" || element.IsTextItem) {
        renderTextItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.OutlinedTextItem, SimHub.Plugins") {
        renderTextItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.GeneratedStaticMapItem, SimHub.Plugins") {
        renderGeneratedStaticMapItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.GeneratedMapItem, SimHub.Plugins") {
        renderGeneratedMapItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.WidgetItem, SimHub.Plugins") {
        renderWidgetItem(element, elementcontainer, dashboard, screen);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.ImageItem, SimHub.Plugins") {
        renderImageItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.ImageFromFileItem, SimHub.Plugins") {
        renderImageFromFileItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.MediaCoverItem, SimHub.Plugins") {
        renderImageFromFileItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.ImageFromUrlItem, SimHub.Plugins") {
        renderImageFromFileItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.ToggleImageItem, SimHub.Plugins" || element.IsToggleImage) {
        renderToggleImageItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.EllipseItem, SimHub.Plugins") {
        renderEllipseItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.ButtonItem, SimHub.Plugins") {
        renderButtonItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.LinearGaugeItem, SimHub.Plugins" || element.IsLinearGauge) {
        renderLinearGauge(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.VerticalLinearGaugeItem, SimHub.Plugins") {
        renderVerticalLinearGauge(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.GradientItem, SimHub.Plugins") {
        renderGradientItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.DialGaugeItem, SimHub.Plugins") {
        renderDialGauge(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.RadarItem, SimHub.Plugins") {
        renderRadarItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.CircularGaugeItem, SimHub.Plugins") {
        renderCircularGaugeItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.ETSMap, SimHub.Plugins") {
        renderETSMap(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.WebPageItem, SimHub.Plugins") {
        renderWebPageItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.IntegratedLedItem, SimHub.Plugins") {
        renderIntegratedLedItem(element, elementcontainer, dashboard);
    }
    else if (elementType === "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.ChartItem, SimHub.Plugins") {
        renderChartItem(element, elementcontainer, dashboard);
    }
    else {
        console.log("Unsupported component type : " + element.$type);
        return;
    }

    elementcontainer.appendTo(container);
    RegisterComponent(dashboard, element, screen, ownerscreen);
    element.Binding = null;
}

function renderETSMap(item, container, dashboard) {
    var content = $("<iframe></iframe>");
    content.css("pointer-events", "auto");
    AntiMargin(content, item.BorderStyle);
    content.width(item.Width);
    content.height(item.Height);

    content.attr("src", "/maps/map.html#norefresh");

    content.appendTo(container);
    registerCustomData(dashboard, item, function (data) {
        if (content.get(0).contentWindow != null && content.get(0).contentWindow.document.setPosition != null) {
            content.get(0).contentWindow.document.setPosition(data[0], data[1], data[3], data[2]);
        }

    });
}

function renderRadarItem(item, container, dashboard) {
    var htmlcontainer = container.get(0);
    var host = $("<img class='noselect' style='position:absolute'></img>");
    var ohost = $("<div style='position:absolute'></div>");
    item.opps = [];
    var renderIdx = 0;

    registerCustomData(dashboard, item, function (data) {
        if (data.PT == "pv") {
            if (isVisible(container)) {
                SendComponentMessage(dashboard, item, "visible", true);
            }
            return;
        }

        if (!isVisible(container)) {
            SendComponentMessage(dashboard, item, "hidden", true);
            return;
        }

        renderIdx = (renderIdx + 1 % 100);
        for (var idx in data) {
            opponent = data[idx];
            var htmlopp = item.opps[opponent.Id];
            if (htmlopp == null) {
                $htmlopp = $("<div><div></div></div>");

                $htmlopp.addClass("o" + opponent.Id);
                $htmlopp.css("position", "absolute");
                item.opps[opponent.Id] = $htmlopp.get(0);
                htmlopp = $htmlopp.get(0);
                $htmlopp.css("transform", "scale(" + item.Scale + ")");
                if (opponent.IP) {
                    ApplyRadarStyle($htmlopp.children().first(), item.PlayerStyle);
                } else {
                    ApplyRadarStyle($htmlopp.children().first(), item.OpponentStyle);
                }
                scale($(htmlopp.children[0]), item.Scale);

                htmlopp.originalStyle = htmlopp.getAttribute('style');
                htmlopp.children[0].originalStyle = htmlopp.children[0].getAttribute('style');

                $htmlopp.appendTo(ohost);
            }

            htmlopp.renderIdx = renderIdx;
            var degrees = opponent.A;
            htmlopp.setAttribute('style', htmlopp.originalStyle + "margin:0 ;position:absolute;left:" + opponent.L + "px; top:" + opponent.T + "px");
            htmlopp.children[0].setAttribute('style', htmlopp.children[0].originalStyle + ';-webkit-transform : rotate(' + degrees + 'deg);'
                + '-moz-transform : rotate(' + degrees + 'deg);'
                + '-ms-transform : rotate(' + degrees + 'deg);'
                + '-o-transform : rotate(' + degrees + 'deg);'
                + 'transform : rotate(' + degrees + 'deg);');
        }
        for (var i in item.opps) {
            if (item.opps[i].renderIdx != null && item.opps[i].renderIdx != renderIdx) {
                if (item.opps[i].parentNode != null) {
                    item.opps[i].style.display = 'none';
                    //item.opps[i].parentNode.removeChild(item.opps[i]);
                    //item.opps[i] = null;
                }
            }
        }
    });
    host.appendTo(container);
    ohost.appendTo(container);
}

function isVisible(item) {
    item = item[0];
    while (item != null) {
        if (item.style != null && item.style.display == "none") {
            return false;
        }
        item = item.parentNode;
    }
    return true;
}

function CreateMessage(item, message) {
    var discardmessage = $("<div class='flex' style=';font-family: \"Segoe UI\"; font-size:15px;position:absolute;display:none;color:white;opacity:0.8'>" + message + "</div>");
    discardmessage.width(item.Width);
    discardmessage.height(item.Height);
    discardmessage.css("justify-content", "center"); /* align horizontal */
    discardmessage.css("align-items", "center"); /* align vertical */

    return discardmessage;
}

function renderGeneratedStaticMapItem(item, container, dashboard) {
    var htmlcontainer = container.get(0);
    var host = $("<img class='noselect' style='position:absolute'></img>");
    var ohost = $("<div style='position:absolute;display:none'></div>");

    item.CurrentMapDiscarded = false;
    item.MapReady = true;
    var discardmessage = CreateMessage(item, "Waiting for map generation");
    var waitingmessage = CreateMessage(item, "Recording map, please do a valid timed lap");
    wrap(dashboard, item, "CurrentMapDiscarded", function (value) {
        discardmessage.toggle(value);
    });
    wrap(dashboard, item, "MapReady", function (value) {
        waitingmessage.toggle(!value);
    });

    item.opps = [];
    var renderIdx = 0;

    registerCustomData(dashboard, item, function (data) {
        if (data.PT == "pv") {
            if (isVisible(container)) {//container.is(":visible")) {
                SendComponentMessage(dashboard, item, "visible", true);
            }
            return;
        }

        else if (data.PT == "mapurl") {
            maploaded = false;

            host.attr("src", data.MapUrl);
            host.width(data.Width);
            host.height(data.Height);
            host.get(0).style.marginTop = ((item.Height - data.Height) / 2) + "px";
            host.get(0).style.marginLeft = ((item.Width - data.Width) / 2) + "px";
            ohost.get(0).style.marginTop = ((item.Height - data.Height) / 2) + "px";
            ohost.get(0).style.marginLeft = ((item.Width - data.Width) / 2) + "px";
            ohost.width(data.Width);
            ohost.height(data.Height);
            ohost.toggle(data.MapUrl != null);
            host.toggle(data.MapUrl != null);
            return;
        }

        else if (data.PT == "opponnents") {
            if (!isVisible(container)) {
                SendComponentMessage(dashboard, item, "hidden", true);
                return;
            }

            renderIdx = (renderIdx + 1 % 100);
            for (var idx in data.Opponents) {
                opponent = data.Opponents[idx];
                var htmlopp = item.opps[opponent.Id];
                if (htmlopp == null) {
                    $htmlopp = $("<div></div>");

                    $htmlopp.addClass("o" + opponent.Id);
                    $htmlopp.css("position", "absolute");
                    item.opps[opponent.Id] = $htmlopp.get(0);
                    htmlopp = $htmlopp.get(0);

                    if (opponent.IP) {
                        ApplyPlayerStyle($htmlopp, item.PlayerStyle);
                    } else {
                        ApplyPlayerStyle($htmlopp, item.OpponentStyle);
                    }
                    htmlopp.originalStyle = htmlopp.getAttribute('style');
                    $htmlopp.appendTo(ohost);
                }

                htmlopp.renderIdx = renderIdx;
                htmlopp.setAttribute('style', htmlopp.originalStyle + ";position:absolute;left:" + opponent.L + "px; top:" + opponent.T + "px");
                if (htmlopp.lasttextContent != opponent.RPT) {
                    htmlopp.textContent = opponent.RPT;
                    htmlopp.lasttextContent = opponent.RPT;
                }
            }
            for (var i in item.opps) {
                if (item.opps[i].renderIdx != renderIdx) {
                    if (item.opps[i].parentNode != null) {
                        item.opps[i].parentNode.removeChild(item.opps[i]);
                    }
                }
            }
        }
    });

    host.appendTo(container);
    discardmessage.appendTo(container);
    waitingmessage.appendTo(container);
    ohost.appendTo(container);
}

function renderGeneratedMapItem(item, container, dashboard) {
    var htmlcontainer = container.get(0);
    var radialCanvas = $("<canvas></canvas>");

    item.CurrentMapDiscarded = false;
    item.MapReady = true;
    var discardmessage = CreateMessage(item, "Waiting for map generation");
    var waitingmessage = CreateMessage(item, "Recording map, please do a valid timed lap");
    wrap(dashboard, item, "CurrentMapDiscarded", function (value) {
        discardmessage.toggle(value);
    });
    wrap(dashboard, item, "MapReady", function (value) {
        waitingmessage.toggle(!value);
        radialCanvas.toggle(value);
    });

    var pancontainer = $("<div  class='noselect' style='position:absolute;margin:1px'></div>");
    pancontainer.appendTo(container);

    item.opps = [];
    var renderIdx = 0;

    radialCanvas.css({ "position": "absolute" });
    radialCanvas.get(0).setAttribute("width", item.Width);
    radialCanvas.get(0).setAttribute("height", item.Height);
    var mapctx = radialCanvas.get(0).getContext('2d');

    radialCanvas.appendTo(pancontainer);

    discardmessage.appendTo(container);
    waitingmessage.appendTo(container);

    var mapImageCanvas = document.createElement('canvas');

    var mapworking = false;
    var maploaded = false;
    var lastorender = (new Date()).getTime() - 1000;
    var lastAf = 0;
    function drawmap() {
        try {
            mapctx.save();
            var opps = item.opps;

            mapctx.clearRect(0, 0, item.Width, item.Height);

            mapctx.scale(item.DisplayScale, item.DisplayScale);

            mapctx.translate(item.Width / 2 / item.DisplayScale, item.Height / 2 / item.DisplayScale);
            mapctx.rotate(Math.radians(item.rotationAngle));
            mapctx.translate(-item.ttX2, -item.ttY2);

            var diagonal = Math.sqrt(item.Width * item.Width + item.Height * item.Height) / item.DisplayScale;

            var sx = (item.ttX2 - diagonal / 2);
            var sy = (item.ttY2 - diagonal / 2);
            var swidth = diagonal;
            var sheight = diagonal;

            var x = (item.ttX2 - diagonal / 2);
            var y = (item.ttY2 - diagonal / 2);

            var width = diagonal;
            var height = diagonal;

            if (sx < 0) {
                x -= sx;
                sx = 0;
            }
            if (sy < 0) {
                y -= sy;
                sy = 0;
            }

            if (sy + sheight > mapImageCanvas.height) {
                sheight = mapImageCanvas.height - sy;
                height = sheight;
            }
            if (sx + swidth > mapImageCanvas.width) {
                swidth = mapImageCanvas.width - sx;
                width = swidth;
            }

            mapctx.drawImage(mapImageCanvas, sx, sy, swidth, sheight, x, y, width, height);

            for (var i in opps) {
                var opp = opps[i];
                if (!opp.IP) {
                    DrawPlayerStyle(mapctx, item.OpponentStyle, opp, item.rotationAngle);
                }
            }

            for (var i in opps) {
                var opp = opps[i];
                if (opp.IP) {
                    DrawPlayerStyle(mapctx, item.PlayerStyle, opp, item.rotationAngle);
                }
            }
        } catch (error) {
        }
        mapctx.restore();
        mapworking = false;
    }

    registerCustomData(dashboard, item, function (data) {
        if (data.PT == "pv") {
            if (isVisible(pancontainer)) {
                SendComponentMessage(dashboard, item, "visible", true);
            }
            return;
        }

        else if (data.PT == "mapurl") {
            maploaded = false;
            var mapImage = new Image();

            mapImageCanvasCtx = mapImageCanvas.getContext("2d");
            mapImageCanvasCtx.clearRect(0, 0, mapImageCanvas.width, mapImageCanvas.height);

            mapImage.onload = function () {
                mapImageCanvas.width = mapImage.naturalWidth;
                mapImageCanvas.height = mapImage.naturalHeight;
                mapImageCanvasCtx = mapImageCanvas.getContext("2d");
                mapImageCanvasCtx.drawImage(mapImage, 0, 0, mapImage.naturalWidth, mapImage.naturalHeight, 0, 0, mapImage.naturalWidth, mapImage.naturalHeight);
                maploaded = true;
                mapworking = false;
            }

            if (data.MapUrl != null) {
                mapImage.src = data.MapUrl;
            }
            return;
        }

        else if (data.PT == "opponnents") {
            if (maploaded && (!mapworking || lastorender < (new Date()).getTime() - 500)) {
                lastorender = (new Date()).getTime() - 1000;
                mapworking = true;

                if (!isVisible(pancontainer)) {
                    SendComponentMessage(dashboard, item, "hidden", true);
                    return;
                }
                item.opps = data.Opponents;
                //cancelAnimationFrame(lastAf);
                //lastAf = requestAnimationFrame(drawmap);
                drawmap();
            }
        }
    });
}

function renderCircularGaugeItem(item, container, dashboard) {
    var c2 = $("<div class='dialcontainer'></div>");
    c2.appendTo(container);

    var itemWidth = Math.min(item.Width, item.Height);
    var itemHeight = Math.min(item.Width, item.Height);
    var radius = itemHeight / 2;

    var radialCanvas = $("<canvas></canvas>");
    radialCanvas.css({ "position": "absolute" });
    radialCanvas.get(0).setAttribute("width", itemWidth);
    radialCanvas.get(0).setAttribute("height", itemHeight);
    var radialctx = radialCanvas.get(0).getContext('2d');
    radialCanvas.appendTo(c2);

    item.ValueEx = 0;
    function refreshRadial() {
        radialctx.clearRect(0, 0, itemWidth, itemHeight);

        radialctx.save();
        radialctx.lineWidth = item.StrokeThickness;

        radialctx.beginPath();
        radialctx.arc(Math.round(itemWidth / 2), Math.round(itemHeight / 2), Math.max(0, Math.round(itemHeight / 2 - item.StrokeThickness / 2) - 1),
            Math.radians(item.MinAngle - 90), Math.radians(item.MaxAngle - 90), false)
        radialctx.strokeStyle = hex2rgba(item.CircleGaugeBackgroundColor);
        radialctx.stroke();

        radialctx.beginPath();
        radialctx.arc(Math.round(itemWidth / 2), Math.round(itemHeight / 2), Math.max(0, Math.round(itemHeight / 2 - item.StrokeThickness / 2) - 1),
            Math.radians(item.MinAngle - 90), Math.radians(item.MinAngle + item.ValueEx - 90), false)
        radialctx.strokeStyle = hex2rgba(item.CircleGaugeColor);
        radialctx.stroke();
        radialctx.restore();
    }

    wrap(dashboard, item, "ValueEx", function (value) {
        //if (isVisible(container)) {
        requestAnimationFrameEx(refreshRadial);

        // }
    });
}

function renderDialGauge(item, container, dashboard) {
    var c2 = $("<div class='dialcontainer'></div>");

    c2.appendTo(container);

    //var mRadius = Math.max(item.Width, item.Height);
    var itemWidth = item.OuterRadius * 2;
    var itemHeight = item.OuterRadius * 2;

    c2.css("margin-top", Math.max(0, (item.Height - (item.OuterRadius * 2)) / 2) + "px");
    c2.css("margin-left", Math.max(0, (item.Width - (item.OuterRadius * 2)) / 2) + "px");

    var backgroundHost = $("<div class='centerbg'></div>");
    AntiMargin(backgroundHost, item.BorderStyle);
    backgroundHost.width(itemWidth);
    backgroundHost.height(itemHeight);
    backgroundHost.css({ "position": "absolute" });

    var tickHost = $("<div class='centerbg'></div>");
    AntiMargin(tickHost, item.BorderStyle);
    tickHost.width(itemWidth);
    tickHost.height(itemHeight);
    tickHost.css({ "position": "absolute" });

    var glassHost = $("<div class='centerbg'></div>");
    AntiMargin(glassHost, item.BorderStyle);
    glassHost.width(itemWidth);
    glassHost.height(itemHeight);
    glassHost.css({ "position": "absolute" });

    var caphost = $("<div class='caphost'></div>");
    caphost.css({ "position": "absolute" });

    caphost.css("margin-top", (itemHeight - (item.CapRadius)) / 2 + "px");
    caphost.css("margin-left", (itemWidth - (item.CapRadius)) / 2 + "px");
    caphost.css({ "position": "absolute" });
    caphost.css("box-sizing", "border-box");

    var optimalCanvas = $("<canvas></canvas>");
    optimalCanvas.css({ "position": "absolute" });
    optimalCanvas.get(0).setAttribute("width", itemWidth);
    optimalCanvas.get(0).setAttribute("height", itemHeight);
    var optimalctx = optimalCanvas.get(0).getContext('2d');

    var radialCanvas = $("<canvas></canvas>");
    radialCanvas.css({ "position": "absolute" });
    radialCanvas.get(0).setAttribute("width", itemWidth);
    radialCanvas.get(0).setAttribute("height", itemHeight);
    var radialctx = radialCanvas.get(0).getContext('2d');

    var needleCanvas = $("<canvas></canvas>");
    needleCanvas.css({ "position": "absolute" });
    needleCanvas.get(0).setAttribute("width", itemWidth);
    needleCanvas.get(0).setAttribute("height", itemHeight);

    var needleTmp = null;
    var needleTmpCtx = null;

    var needlectx = needleCanvas.get(0).getContext('2d');
    var needleYOffset = 0;
    if (item.NeedleImage != null && item.NeedleImage != 'None') {
        var needleImage = new Image();
        needleImage.onload = function () {
            needleTmp = document.createElement('canvas');

            needleTmp.width = item.NeedleLength;
            needleTmp.height = Math.round(item.NeedleLength / needleImage.naturalWidth * needleImage.naturalHeight);

            if (item.NeedleOffset >= 0) {
                needleTmpCtx = needleTmp.getContext("2d");
                needleTmpCtx.drawImage(needleImage,
                    0, 0, needleImage.naturalWidth - item.NeedleOffset / item.NeedleLength * needleImage.naturalWidth, needleImage.naturalHeight,
                    item.NeedleOffset,//target X
                    0, //target Y
                    item.NeedleLength - item.NeedleOffset, // Width
                    needleTmp.height);//Math.round((item.NeedleLength - item.NeedleOffset) / needleImage.naturalWidth * needleImage.naturalHeight));

                needleXOffset = 0;
            } else {
                needleTmpCtx = needleTmp.getContext("2d");
                needleTmpCtx.drawImage(needleImage,
                    0, 0, needleImage.naturalWidth, needleImage.naturalHeight,
                    0,//target X
                    0, //target Y
                    item.NeedleLength, // Width
                    needleTmp.height);

                needleXOffset = item.NeedleOffset;
            }
            needleYOffset = -needleTmp.height / 2;
            refreshNeedle();
        };
        needleImage.src = GetImage(item.NeedleImage, dashboard, true);
    } else {
        needleTmp = document.createElement('canvas');
        needleTmp.width = item.NeedleLength;
        needleTmp.height = item.NeedleThickness;
        needleTmpCtx = needleTmp.getContext("2d");

        //var p = new Path2D('M1,1 L1,10 L156,6 L156,4 z');
        var p = new Path2D('M1,1 L1,' + Math.round(item.NeedleThickness - 2) + ' L' + Math.round(item.NeedleLength - 2)
            + ',' + Math.round(item.NeedleThickness * 6 / 10) + ' L' + (item.NeedleLength - 2) + ',' + Math.round(item.NeedleThickness * 4 / 10) + ' z');

        //needleTmpCtx.scale(item.NeedleLength / 158, item.NeedleThickness / 12);
        needleYOffset = -item.NeedleThickness / 2;
        needleTmpCtx.fillStyle = 'red';
        var grd = needleTmpCtx.createLinearGradient(0, 0, 0, item.NeedleThickness);
        grd.addColorStop(0.197, hex2rgba("#FF890A0A"));
        grd.addColorStop(0.610, hex2rgba("#FFE32323"));
        grd.addColorStop(1, hex2rgba("#FFC40808"));
        needleTmpCtx.fillStyle = grd;

        needleTmpCtx.strokeStyle = hex2rgba("#FFE91C1C");
        needleTmpCtx.trokeThickness = 2;

        needleTmpCtx.fill(p);
        needleTmpCtx.stroke(p);
        needleXOffset = 0;
    }

    var cap = $("<div class='pointercap'><div class='insidecap'></div></div>")
    cap.css("width", (item.CapRadius) + "px");
    cap.css("height", (item.CapRadius) + "px");

    var insidecap = $(".insidecap", cap);
    insidecap.css("width", (item.CapRadius - 8) + "px");
    insidecap.css("height", (item.CapRadius - 8) + "px");

    backgroundHost.appendTo(c2);
    optimalCanvas.appendTo(c2);

    if (item.ShowRadialGauge) {
        radialCanvas.appendTo(c2);
    }
    tickHost.appendTo(c2);
    cap.appendTo(caphost);

    var showneedle = item.ShowNeedle;
    if (item.ShowNeedle && (item.NeedleImage == null || item.NeedleImage != "")) {
        showneedle = true;
        needleCanvas.appendTo(c2);
    }

    if (item.CapRadius > 0) {
        caphost.appendTo(c2);
    }

    glassHost.appendTo(c2);

    var glass = $('<div class="centerbg dialbackhost" style=" display:none;   -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC); margin: 0px; width: 526px; height: 526px; position: absolute;background-position: center center; border-radius:50% 50% ;overflow:hidden"><div class="centerbg" style="top:262px;margin: 0px; width: 700px; height: 400px; position: absolute;background-position: center center; background:rgba(255,255,255,0.12); border-radius:50% 50%"></div></div>');
    glass.css("width", itemWidth + "px");
    glass.css("height", itemHeight + "px");

    //glass.show();
    glass.children().first().css("width", (itemWidth * 7 / 5) + "px");
    glass.children().first().css("height", itemWidth + "px");
    //glass.css("top", "0px");
    glass.children().first().css("top", itemHeight / 2 + "px");

    glass.appendTo(c2);

    wrap(dashboard, item, "ShowDialGlassEffect", function (value) {
        glass.toggle(value);
    });

    item.CurrentAngle = item.StartAngle;
    var lastNeedleAngle = -9999;
    var needleXOffset = 0;
    var lastrender = 0;
    var naf = 0;
    var lastRequest = 0;
    function refreshNeedle() {
        naf = 0;

        var newangle = item.CurrentAngle;

        if (lastNeedleAngle == -9999) {
            lastNeedleAngle = newangle - 1;
        }

        var diff = newangle - lastNeedleAngle;

        newdelta = Math.max(Math.min(4, Math.pow(diff / 4, 2) * Math.sign(diff)), -4);//4 : 0.5;
        //newdelta = diff > 0 ? 4 : -4;

        var minspeed = 0.7;
        if (newdelta < 0 && newdelta > -minspeed) { newdelta = -minspeed }
        if (newdelta > 0 && newdelta < minspeed) { newdelta = minspeed }

        if (lastrender != 0) {
            var pnow = performance.now();
            var td = (pnow - lastrender);
            if (td < 50 && td > 5) {
                var rate = td / (500.0 / 60.0);
                newdelta = newdelta * rate;
            }
        }

        var delta = newdelta;

        var angle = lastNeedleAngle + delta;

        if (lastNeedleAngle <= newangle && angle >= newangle) {
            angle = newangle;
        } else if (lastNeedleAngle >= newangle && angle <= newangle) {
            angle = newangle;
        }

        if (showneedle) {
            var drawoversize = 2

            if (needleTmp != null) {
                needlectx.save();
                needlectx.translate(Math.round(itemWidth / 2), Math.round(itemHeight / 2));
                {
                    needlectx.save();
                    needlectx.rotate(Math.radians(lastNeedleAngle));
                    needlectx.translate(needleXOffset, needleYOffset);
                    needlectx.clearRect(-drawoversize, -drawoversize, needleTmp.width + drawoversize * 2, needleTmp.height + drawoversize * 2);
                    needlectx.restore();
                }
                needlectx.rotate(Math.radians(angle));
                needlectx.translate(needleXOffset, needleYOffset);

                needlectx.drawImage(needleTmp, 0, 0);
                needlectx.restore();
            }
        }

        if (item.ShowRadialGauge) {
            radialctx.clearRect(0, 0, itemWidth, itemHeight);
            radialctx.save();
            radialctx.lineWidth = item.RadialGaugeThickness;
            radialctx.beginPath();
            radialctx.arc(Math.round(itemWidth / 2), Math.round(itemHeight / 2), Math.max(0, Math.round(item.RadialGaugeRadius + item.RadialGaugeThickness / 2) - 1),
                Math.radians(item.StartAngle + item.RadialGaugeStartOffset), Math.radians(angle), item.SweepAngle < 0);
            radialctx.strokeStyle = hex2rgba(item.RadialGaugeColor);
            radialctx.stroke();
            radialctx.restore();
        }

        lastNeedleAngle = angle;

        if (angle != newangle || delta > 0) {
            naf = window.requestAnimationFrame(refreshNeedle);
            lastrender = performance.now();
        } else {
            lastrender = 0;
        }
    }

    function drawArc(ctx, startAngle, endAngle, radius, thickness, color) {
        if (startAngle == endAngle) {
            return;
        }
        if (startAngle > endAngle) {
            var tmp = startAngle;
            startAngle = endAngle;
            endAngle = tmp;
        }

        if (thickness == 0) {
            return;
        }
        optimalctx.lineWidth = thickness;
        optimalctx.beginPath();
        optimalctx.strokeStyle = hex2rgba(color);
        var isReflexAngle1 = Math.abs(endAngle - startAngle) > 180.0;

        optimalctx.arc(Math.round(itemWidth / 2), Math.round(itemHeight / 2),
            Math.max(0, Math.round(radius + thickness / 2) - 1),
            Math.radians(startAngle), Math.radians(endAngle), false);
        optimalctx.stroke();
    }

    function refreshOptimal() {
        var MaxValue = item.Maximum;
        var MinValue = item.Minimum;
        var ScaleSweepAngle = item.SweepAngle;
        var gaugeStartAngle = item.StartAngle;
        var OptimalRangeStartValue = item.RangeOptimalStartValue;
        var OptimalRangeEndValue = item.RangeOptimalEndValue;

        var realworldunit = (ScaleSweepAngle / (MaxValue - MinValue));
        optimalRangeStartValue = Math.max(OptimalRangeStartValue, MinValue);
        OptimalRangeEndValue = Math.min(OptimalRangeEndValue, MaxValue);

        var optimalRangeStartValueRelative = optimalRangeStartValue - MinValue;
        var optimalStartAngle = ((optimalRangeStartValueRelative * realworldunit));
        var optimalStartAngleFromStart = (gaugeStartAngle + optimalStartAngle);

        var optimalRangeEndValueRelative = OptimalRangeEndValue - MinValue;
        var optimalEndAngle = ((optimalRangeEndValueRelative * realworldunit));
        var optimalEndAngleFromStart = (gaugeStartAngle + optimalEndAngle);

        // calculating the angle for optimal Start value
        var gaugeEndAngle = gaugeStartAngle + ScaleSweepAngle;

        optimalctx.clearRect(0, 0, itemWidth, itemHeight);
        optimalctx.save();

        drawArc(optimalctx, optimalStartAngleFromStart, optimalEndAngleFromStart, item.RangeIndicatorRadius, item.RangeIndicatorThickness, item.OptimalStyle.ArcColor);
        drawArc(optimalctx, item.StartAngle, optimalStartAngleFromStart, item.RangeIndicatorRadius, item.RangeIndicatorThickness, item.BelowOptimalStyle.ArcColor);
        drawArc(optimalctx, optimalEndAngleFromStart, gaugeEndAngle, item.RangeIndicatorRadius, item.RangeIndicatorThickness, item.AboveOptimalStyle.ArcColor);

        optimalctx.restore();
    }

    wrap(dashboard, item, "RangeOptimalStartValue", function (value) {
        requestAnimationFrameEx(refreshOptimal);
    });

    wrap(dashboard, item, "RangeOptimalEndValue", function (value) {
        requestAnimationFrameEx(refreshOptimal);
    });

    wrap(dashboard, item, "Minimum", function (value) {
        requestAnimationFrameEx(refreshOptimal);
    });

    wrap(dashboard, item, "Maximum", function (value) {
        requestAnimationFrameEx(refreshOptimal);
    });

    wrap(dashboard, item, "CurrentAngle", function (value) {
        if (isVisible(container)) {
            if (showneedle || item.ShowRadialGauge) {
                // delta = 0;
                if (naf === 0) {
                    requestAnimationFrameEx(refreshNeedle);
                }
            }
        }
    });

    if (showneedle || item.ShowRadialGauge) {
        requestAnimationFrameEx(refreshNeedle);
    }

    registerCustomData(dashboard, item, function (data) {
        backgroundHost.addClass(GetDynamicImageClass("backgroundHost" + item.uid, data.GH));
        backgroundHost.get(0).style.backgroundPosition = "center";
        tickHost.addClass(GetDynamicImageClass("tickHost" + item.uid, data.DH));
        tickHost.get(0).style.backgroundPosition = "center";

        glassHost.addClass(GetDynamicImageClass("glassHost" + item.uid, data.Glass));
        glassHost.get(0).style.backgroundPosition = "center";
    });
}

function renderWidgetItem(item, container, dashboard, ownerscreen) {
    var content = $("<div></div>");

    LoadTemplate(dashboard.templateName, item.FileName, content, true, item, ownerscreen);

    content.width(item.Width);
    content.height(item.Height);
    content.css("transform", "scale(" + item.AutoSizeScale + ")");
    content.css("transform-origin", "top left");
    AntiMargin(content, item.BorderStyle);

    content.appendTo(container);
}

function renderIntegratedLedItem(item, container, dashboard) {
    var content = $("<div style='margin:15px' class='ledhost'></div>");

    var bg = '<svg width="80" height="80" viewbox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><circle fill="#808080" stroke="#A9A9A9" stroke-width="10" cx="40" cy="40" r="35" id="svg_1" /></svg>';
    var fg = '<svg width="80" height="80" viewbox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><circle fill="#FF0000" class="innercolor" cx="40" cy="40" r="40" id="svg_1" /></svg>';
    var fgcenter = '<svg width="80" height="80" viewbox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><circle fill="#FF0000" class="innercolor" cx="40" cy="40" r="30" id="svg_1" /></svg>';

    function createLed(idx, svgcontent) {
        if (item.Vertical) {
            return createLedVertical(idx, svgcontent);
        } else {
            return createLedHorizontal(idx, svgcontent);
        }
    }

    function createLedHorizontal(idx, svgcontent) {
        var ledcontainer = $("<div class='ledcontainer'>" + svgcontent + "</div>");
        ledcontainer.width((item.Width - 30) / item.LedCount);
        ledcontainer.css("left", 15 + (item.Width - 30) / item.LedCount * idx);
        if (item.Height - 30 < (item.Width - 30) / item.LedCount) {
            $("svg", ledcontainer).height(item.Height - 30);
        }
        else {
            $("svg", ledcontainer).width((item.Width - 30) / item.LedCount);
        }

        $("svg", ledcontainer).css("padding", "0 " + item.MinimumLedSpacing + "px");
        return ledcontainer;
    }

    function createLedVertical(idx, svgcontent) {
        var ledcontainer = $("<div class='ledcontainer'>" + svgcontent + "</div>");
        ledcontainer.height((item.height - 30) / item.LedCount);
        ledcontainer.css("top", 15 + (item.Height - 30) / item.LedCount * idx);
        if (item.Width - 30 < (item.Height - 30) / item.LedCount) {
            $("svg", ledcontainer).width(item.Width - 30);
        }
        else {
            $("svg", ledcontainer).height((item.Height - 30) / item.LedCount);
        }

        $("svg", ledcontainer).css("padding", item.MinimumLedSpacing + "px 0");
        return ledcontainer;
    }

    var bgleds = [];
    var fgleds = [];
    var fgcenterleds = [];

    for (var j = 0; j < item.LedCount; j++) {
        var bgled = createLed(j, bg);
        bgled.appendTo(content);
        bgleds[j] = bgled;
    }

    for (var j = 0; j < item.LedCount; j++) {
        var fgled = createLed(j, fg);
        fgled.css("filter", "blur(15px)");
        fgled.hide();
        fgled.appendTo(content);
        fgleds[j] = fgled;
    }

    for (var j = 0; j < item.LedCount; j++) {
        var fgcenterled = createLed(j, fgcenter);
        fgcenterled.appendTo(content);
        fgcenterled.hide();
        fgcenterleds[j] = fgcenterled;
    }

    content.width(item.Width - 30);
    content.height(item.Height - 30);
    content.appendTo(container);

    registerCustomData(dashboard, item, function (data) {
        for (var i = 0; i < data.length; i++) {
            var ldata = data[i];
            var lindex = ldata.I;

            if (!item.Vertical) {
                $("svg", fgleds[lindex])[0].style["margin-top"] = Math.trunc(ldata.M) + "px";
                $("svg", fgcenterleds[lindex])[0].style["margin-top"] = ldata.M + "px";
                $("svg", bgleds[lindex])[0].style["margin-top"] = ldata.M + "px";
            }
            if (ldata.A) {
                $(".innercolor", fgleds[lindex]).attr("fill", ldata.C);
                $(".innercolor", fgcenterleds[lindex]).attr("fill", ldata.C);

                fgleds[lindex].show();
                fgcenterleds[lindex].show();
            } else {
                fgleds[lindex].hide();
                fgcenterleds[lindex].hide();
            }
        }
    });
}

function renderEllipseItem(item, container, dashboard) {
    var content = $("<div></div>");

    content.css("box-sizing", "border-box");
    content.get(0).style.borderRadius = "50% 50%";

    content.width(item.Width);
    content.height(item.Height);

    wrap(dashboard, item, "EllipseThickness", function (value) {
        content.get(0).style.borderWidth = (value) + "px";
        //content.get(0).style.borderColor = hex2rgba(value);
    });
    wrap(dashboard, item, "EllipseBackbroundImage", function (value) {
        SetImage(content, value, dashboard);
        content.get(0).style.backgroundSize = item.Width + 'px ' + item.Height + 'px';
    });

    wrap(dashboard, item, "FillColor", function (value) {
        SetImage(content, value, dashboard);
        content.get(0).style.backgroundColor = hex2rgba(value);
    });

    wrap(dashboard, item, "EllipseColor", function (value) {
        SetImage(content, value, dashboard);
        content.get(0).style.borderStyle = 'solid';
        content.get(0).style.borderColor = hex2rgba(value);
    });

    wrap(dashboard, item, "EllipseBackgroundImage", function (value) {
        SetImage(content, value, dashboard);
        //content.get(0).style.borderStyle = 'solid';
        //content.get(0).style.borderColor = hex2rgba(value);
    });

    content.appendTo(container);
}

function renderWebPageItem(item, container, dashboard) {
    var content = $("<iframe></iframe>");
    content.css("pointer-events", "auto");
    AntiMargin(content, item.BorderStyle);
    content.width(item.Width);
    content.height(item.Height);

    content.attr("src", item.StartAddress);

    content.appendTo(container);
}

function renderImageItem(item, container, dashboard) {
    var content = $("<div></div>");
    AntiMargin(content, item.BorderStyle);
    content.width(item.Width);
    content.height(item.Height);

    wrap(dashboard, item, "Image", function (value) {
        SetImage(content, value, dashboard);
        content.get(0).style.backgroundSize = item.Width + 'px ' + item.Height + 'px';
    });

    content.appendTo(container);
}

function renderImageFromFileItem(item, container, dashboard) {
    var content = $("<img style='object-fit: contain;'></img>");
    AntiMargin(content, item.BorderStyle);
    content.width(item.Width);
    content.height(item.Height);

    registerCustomData(dashboard, item, function (data) {
        if (data === "") {
            content.hide();
        } else {
            content.attr("src", data);
            content.show();
        }
    });

    content.appendTo(container);
}

function renderToggleImageItem(item, container, dashboard) {
    var contentOn = $("<div style='position:absolute'></div>");
    AntiMargin(contentOn, item.BorderStyle);
    contentOn.width(item.Width);
    contentOn.height(item.Height);

    var contentOff = $("<div style='position:absolute'></div>");
    AntiMargin(contentOff, item.BorderStyle);
    contentOff.width(item.Width);
    contentOff.height(item.Height);

    wrap(dashboard, item, "OnImage", function (value) {
        SetImage(contentOn, value, dashboard);
        contentOn.get(0).style.backgroundSize = item.Width + 'px ' + item.Height + 'px';
    });

    wrap(dashboard, item, "OffImage", function (value) {
        SetImage(contentOff, value, dashboard);
        contentOff.get(0).style.backgroundSize = item.Width + 'px ' + item.Height + 'px';
    });

    var htmlContentOn = contentOn.get(0);
    var htmlContentOff = contentOff.get(0);
    wrap(dashboard, item, "Value", function (value) {
        if (value) {
            htmlContentOn.style.display = "block";

            if (!item.StackImagesWhenOn) {
                htmlContentOff.style.display = "none";
            } else {
                htmlContentOff.style.display = "block";
            }
        } else {
            htmlContentOn.style.display = "none";
            htmlContentOff.style.display = "block";
        }
    });

    contentOff.appendTo(container);
    contentOn.appendTo(container);
}

function vibrate(vibrationDelay) {
    if (!window) {
        return;
    }

    if (!window.navigator) {
        return;
    }

    if (!window.navigator.vibrate) {
        return;
    }

    //window.navigator.vibrate(vibrationDelay);
}

function renderButtonItem(item, container, dashboard) {
    //console.log(item);
    var content = $("<div style=\"    background-size: contain;    background-repeat: no-repeat;background-position: center\"></div>");
    content.css("pointer-events", "auto");
    content.css("-webkit-app-region", "no-drag");

    wrap(dashboard, item, "Image", function (value) {
        SetImage(content, value, dashboard);

        content.get(0).style.backgroundSize = 'contain';
    });

    AntiMargin(content, item.BorderStyle);
    content.width(item.Width);
    content.height(item.Height);
    content.appendTo(container);

    var isTouchDevice = (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));

    content.click(function (ev) {
        SendComponentMessage(dashboard, item, "clicked", false);
        ev.preventDefault();
    });

    if (!isTouchDevice) {
        content.mousedown(function (ev) {
            if (!isTouchDevice) { }
            SendComponentMessage(dashboard, item, "pressed", false);
            $(this).data('down', true);
            SetImage(content, item.PressedImage, dashboard);
            e.stopImmediatePropagation();
            vibrate(50);
        });

        content.mouseup(function (ev) {
            SendComponentMessage(dashboard, item, "released", false);
            $(this).data('down', false);
            SetImage(content, item.Image, dashboard);
            e.stopImmediatePropagation();
        });
    }
    else {
        content.bind('touchstart', function (ev) {
            SendComponentMessage(dashboard, item, "pressed", false);
            $(this).data('down', true);
            SetImage(content, item.PressedImage, dashboard);
            e.stopImmediatePropagation();
            vibrate(50);
        })
        content.bind('touchend', function (ev) {
            SendComponentMessage(dashboard, item, "released", false);
            $(this).data('down', false);
            SetImage(content, item.Image, dashboard);
            e.stopImmediatePropagation();
  
        });
    }
}

function renderGradientItem(item, container, dashboard) {
    var content = $("<div></div>");

    AntiMargin(content, item.BorderStyle);

    wrap(dashboard, item, "Color", function (value) {
        BrushToCss(content, value)
    });

    content.width(item.Width);
    content.height(item.Height);
    content.appendTo(container);
}

function renderOutlinedTextItem(item, container, dashboard) {
    //container.css("overflow", "visible");
    var content = $("<div class='noselect'></div>");
    var htmlcontent = content.get(0);

    var content2 = $("<div class='noselect'></div>");
    var htmlcontent2 = content2.get(0);

    content.addClass("flex");
    content.width(item.Width);
    content.height(item.Height);

    content2.addClass("flex");
    content2.width(item.Width);
    content2.height(item.Height);

    wrap(dashboard, item, "TextWrapping", function (value) {
        if (value != 1) {
            content.addClass("forcewarp");
            content2.addClass("forcewarp");
        }
        else {
            content.removeClass("forcewarp");
            content2.removeClass("forcewarp");
        }
    });

    wrap(dashboard, item, "Text", function (value) {
        if (value == null) {
            htmlcontent.textContent = "";
            htmlcontent2.textContent = "";
            return;
        }
        htmlcontent2.textContent = value;
        htmlcontent.textContent = value;
    });

    content.css("text-shadow", toCSSTextShadow(item.ShadowDepth, item.ShadowBlur, item.ShadowDirection, item.ShadowColor));
    content2.css("text-shadow", toCSSTextShadow(item.ShadowDepth, item.ShadowBlur, item.ShadowDirection, item.ShadowColor));

    content.css("white-space", "pre");
    content2.css("white-space", "pre");

    content2.css("position", "absolute");
    content2.css("top", "0");
    content2.css("left", "0");

    content.css("position", "absolute");
    content.css("top", "0");
    content.css("left", "0");

    wrap(dashboard, item, "Font", function (value) {
        ApplyFont(content, value);
        ApplyFont(content2, value);
    });

    wrap(dashboard, item, "FontWeight", function (value) {
        content.get(0).style.fontWeight = toCSSFontWeight(value);
        content2.get(0).style.fontWeight = toCSSFontWeight(value);
    });

    content2.get(0).style["paintOrder"] = "stroke fill";

    wrap(dashboard, item, "FillColorEx", function (value) {
        //htmlcontent.style.color = hex2rgba(value);
        content.css("-moz-text-fill-color", hex2rgba(value));
        content.css("-webkit-text-fill-color", hex2rgba(value));
        content2.css("-moz-text-fill-color", hex2rgba(value));
        content2.css("-webkit-text-fill-color", hex2rgba(value));
    });

    wrap(dashboard, item, "StrokeColorEx", function (value) {
        htmlcontent2.style.color = hex2rgba(value);
        content2.css("-moz-text-stroke-color", hex2rgba(value));
        content2.css("-webkit-text-stroke-color", hex2rgba(value));
    });

    wrap(dashboard, item, "StrokeThickness", function (value) {
        htmlcontent2.style.color = hex2rgba(value);
        content2.css("-moz-text-stroke-width", value + "px");
        content2.css("-webkit-text-stroke-width", value + "px");
    });

    wrap(dashboard, item, "FontStyle", function (value) {
        if (value != null) {
            content.css('font-style', value.toLowerCase());
            content2.css('font-style', value.toLowerCase());
        }
    });

    wrap(dashboard, item, "FontSize", function (value) {
        content.css('font-size', value + "px");
        content2.css('font-size', value + "px");
    });

    wrap(dashboard, item, "HorizontalAlignment", function (value) {
        content.css("justify-content", toHorizontalAlignment(value)); /* align horizontal */
        content2.css("justify-content", toHorizontalAlignment(value)); /* align horizontal */
    });

    wrap(dashboard, item, "VerticalAlignment", function (value) {
        content.css("align-items", toVerticalAlignment(value)); /* align vertical */
        content2.css("align-items", toVerticalAlignment(value)); /* align vertical */
    });

    AntiMargin(content2, item.BorderStyle);
    content2.appendTo(container);

    AntiMargin(content, item.BorderStyle);
    content.appendTo(container);
}

function renderTextItem(item, container, dashboard) {
    //container.css("overflow", "visible");
    var content = $("<div class='noselect'></div>");
    var htmlcontent = content.get(0);

    content.addClass("flex");

    content.width(item.Width);
    content.height(item.Height);

    wrap(dashboard, item, "TextWrapping", function (value) {
        if (value != 1) content.addClass("forcewarp");
        else {
            content.removeClass("forcewarp");
        }
    });

    function monospacedWidth(character) {
        return (item.SpecialChars.indexOf(character) > -1 ? item.SpecialCharsWidth : item.CharWidth);
    }

    wrap(dashboard, item, "Text", function (value) {
        if (value == null) {
            htmlcontent.textContent = "";
            return;
        }

        if (item.UseMonospacedText === true) {
            var res = "";
            var textMask = item.TextMask || "";
            var mask = (textMask).substring(0, Math.max((textMask).length - (item.Text || "").length, 0));

            for (var i = 0; i < mask.length; i++) {
                res += "<span style='display: inline-block;max-height:" + item.Height + "px;color:" + hex2rgba(item.TextMaskColor) + "; text-align: center;width:" + monospacedWidth(mask.charAt(i)) + "px'>" + mask.charAt(i) + "</span>";
            }

            for (var i = 0; i < value.length; i++) {
                res += "<span style='display: inline-block;max-height:" + item.Height + "px;text-align: center;width:" + monospacedWidth(value.charAt(i)) + "px'>" + value.charAt(i) + "</span>";
            }
            htmlcontent.innerHTML = res;
        } else {
            htmlcontent.textContent = value;
        }
    }, ["TextMask", "TextMaskColor", "UseMonospacedText", "SpecialChars", "SpecialCharsWidth", "CharWidth"]);

    content.css("text-shadow", toCSSTextShadow(item.ShadowDepth, item.ShadowBlur, item.ShadowDirection, item.ShadowColor));

    content.css("white-space", "pre");

    wrap(dashboard, item, "Font", function (value) {
        ApplyFont(content, value);
    });

    wrap(dashboard, item, "FontWeight", function (value) {
        content.get(0).style.fontWeight = toCSSFontWeight(value);
    });

    wrap(dashboard, item, "TextColor", function (value) {
        htmlcontent.style.color = hex2rgba(value);
    });

    wrap(dashboard, item, "FontStyle", function (value) {
        if (value != null) {
            content.css('font-style', value.toLowerCase());
        }
    });

    wrap(dashboard, item, "FontSize", function (value) {
        content.css('font-size', value + "px");
    });

    wrap(dashboard, item, "HorizontalAlignment", function (value) {
        content.css("justify-content", toHorizontalAlignment(value)); /* align horizontal */
        content.css("text-align", toHorizontalTextAlign(value)); /* align horizontal */
    });

    wrap(dashboard, item, "VerticalAlignment", function (value) {
        content.css("align-items", toVerticalAlignment(value)); /* align vertical */
    });

    AntiMargin(content, item.BorderStyle);
    content.appendTo(container);
}

function renderLinearGauge(item, container, dashboard) {
    var contentwrapper = $("<div class='flex'></div>");

    var content = $("<div></div>");
    var htmlcontent = content.get(0);
    var htmlcontainer = container.get(0);

    wrap(dashboard, item, "GaugeAlignment", function (value) {
        contentwrapper.css("justify-content", toHorizontalAlignment(value));
    });

    wrap(dashboard, item, "PAW", function (value) {
        htmlcontent.style.width = (value == null ? 0 : value) + "px";
    });

    wrap(dashboard, item, "GaugeImage", function (value) {
        SetImage(content, value, dashboard);
        htmlcontent.style.backgroundSize = item.Width + 'px ' + item.Height + 'px';
    });

    wrap(dashboard, item, "GaugeColor", function (value) {
        htmlcontent.style.backgroundColor = hex2rgba(value);
    });

    wrap(dashboard, item, "BackgroundImage", function (value) {
        SetImage(container, value, dashboard);
        htmlcontainer.style.backgroundSize = item.Width + 'px ' + item.Height + 'px';
    });

    wrap(dashboard, item, "GaugeImage", function (value) {
        SetImage(content, value, dashboard);
        htmlcontent.style.backgroundSize = item.Width + 'px ' + item.Height + 'px';
    });

    content.height(item.Height);
    AntiMargin(content, item.BorderStyle);
    content.appendTo(contentwrapper);
    contentwrapper.appendTo(container);
}

function renderChartItem(item, container, dashboard) {
    var dataStack = [];

    var htmlcontainer = container.get(0);

    var chartCanvas = null;
    var context = null;

    function RenderChart() {
        if (!chartCanvas) {
            chartCanvas = $("<canvas></canvas>").get(0);

            chartCanvas.style.position = "absolute";
            chartCanvas.setAttribute("width", item.Width);
            chartCanvas.setAttribute("height", item.Height);

            context = chartCanvas.getContext('2d');
            $(chartCanvas).appendTo(container);
        }

        var min = item.Minimum;
        var max = item.Maximum;
        if (!item.UseMaximum) {
            max = Math.max.apply(null, dataStack);
        }
        if (!item.UseMinimum) {
            min = Math.min.apply(null, dataStack);
        }
        if (min == max && !item.UseMaximum && !item.UseMinimum) {
            var tmp = min;
            max = tmp + 1;
            min = tmp - 1;
        }

        else if (min == max && !item.UseMaximum) {
            max = min + 1;
        }

        var yMargin = 10;
        var xMargin = 10;

        context.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        context.save();

        context.lineWidth = 1;
        context.strokeStyle = 'transparent';

        //context.beginPath();
        context.rect(xMargin, yMargin, chartCanvas.width - xMargin * 2, chartCanvas.height - yMargin * 2);
        context.stroke();
        context.clip();

        // invert the y scale so that that increments
        // as you move upwards
        // move context to center of canvas
        context.translate(xMargin, chartCanvas.height - yMargin);
        context.scale(1, -1);

        context.lineWidth = item.LineTickness;
        context.strokeStyle = hex2rgba(item.LineColor);

        context.beginPath();
        context.lineJoin = 'bevel';
        scaleX = (chartCanvas.width - xMargin * 2) / item.PointsCount;
        scaleY = (chartCanvas.height - yMargin * 2) / (max - min);

        context.moveTo(dataStack[0].x * scaleX, dataStack[0].y * scaleY);

        for (var n = 0; n < dataStack.length; n++) {
            var point = { x: n, y: dataStack[n] - min };

            //point.y = Math.min(Math.max(point.y, min), max);

            // draw segment
            context.lineTo(point.x * scaleX, point.y * scaleY);

            context.moveTo(point.x * scaleX, point.y * scaleY);
        }
        context.stroke();

        context.closePath();

        context.restore();
    }

    var lastAfRequest = 0;

    registerCustomData(dashboard, item, function (data) {
        if (data.Points !== null) {
            for (var i = 0; i < data.Points.length; i++) {
                dataStack.push(data.Points[i]);
            }

            while (dataStack.length > item.PointsCount) {
                dataStack.shift();
            }
        }
        if (isVisible(container)) {
            SendComponentMessage(dashboard, item, "visible", true);
            //window.cancelAnimationFrame(lastAfRequest);
            //lastAfRequest = window.requestAnimationFrame(RenderChart);
            RenderChart();
        }
        else {

            $(chartCanvas).remove();
            chartCanvas = null;
            context = null;

            SendComponentMessage(dashboard, item, "hidden", true);
            return;
        }
    });
}

function renderVerticalLinearGauge(item, container, dashboard) {
    var htmlcontainer = container.get(0);

    var gaugeCanvas = $("<canvas></canvas>").get(0);
    gaugeCanvas.style.position = "absolute";
    gaugeCanvas.setAttribute("width", item.Width);
    gaugeCanvas.setAttribute("height", item.Height);
    var gaugectx = gaugeCanvas.getContext('2d');

    $(gaugeCanvas).appendTo(container);

    var bgCanvas = $("<canvas></canvas>").get(0);
    bgCanvas.setAttribute("width", item.Width);
    bgCanvas.setAttribute("height", item.Height);
    var bgctx = bgCanvas.getContext('2d');

    var fillCanvas = $("<canvas></canvas>").get(0);
    fillCanvas.setAttribute("width", item.Width);
    fillCanvas.setAttribute("height", item.Height);
    var fillctx = fillCanvas.getContext('2d');

    function CreateRessources() {
        bgctx.clearRect(0, 0, item.width, item.height);
        fillctx.clearRect(0, 0, item.Width, item.Height);
        fillctx.fillStyle = hex2rgba(item.GaugeColor);
        fillctx.fillRect(0, 0, item.Width, item.Height);

        if (item.GaugeImage != null && item.GaugeImage !== 'None') {
            var bgImage = new Image();

            bgImage.onload = function () {
                fillctx.drawImage(bgImage,
                    0, 0,
                    bgImage.width, bgImage.height,
                    0, 0,
                    item.Width, item.Height);

                RenderGauge();
            };
            bgImage.src = GetImage(item.GaugeImage, dashboard, true);
        } else {
            RenderGauge();
        }
    }

    oldPaw = 0;
    function RenderGauge() {
        gaugectx.clearRect(0, 0, item.Width + 10, item.Height + 10);
        if (item.GaugeAlignment == 0) {// TOP
            //gaugectx.clearRect(0, 0, item.Width + 10, item.Height + 10);
            //gaugectx.clearRect(0, 0, item.Width, oldPaw + 10);
            if (item.PAW > 0)
                gaugectx.drawImage(fillCanvas,
                    0, 0,
                    item.Width, item.PAW,
                    0, 0,
                    item.Width, item.PAW);
        }

        if (item.GaugeAlignment == 1) {// CENTER
            //gaugectx.clearRect(0, 0, item.Width + 10, item.Height + 10);
            //gaugectx.clearRect(0, (item.Height - oldPaw - 5) / 2, item.Width, oldPaw + 10);
            if (item.PAW > 0)
                gaugectx.drawImage(fillCanvas,
                    0, (item.Height - item.PAW) / 2,
                    item.Width, item.PAW,
                    0, (item.Height - item.PAW) / 2,
                    item.Width, item.PAW);
        }

        if (item.GaugeAlignment == 2) {// BOTTOM
            //gaugectx.clearRect(0, item.Height - op - 5, item.Width + 5, op+10);
            if (item.PAW > 0)
                gaugectx.drawImage(fillCanvas,
                    0, item.Height - item.PAW,
                    item.Width, item.PAW,
                    0, item.Height - item.PAW,
                    item.Width, item.PAW);
        }
        oldPaw = item.PAW;
    }

    wrap(dashboard, item, "GaugeAlignment", function (value, init) {
        if (!init) {
            RenderGauge();
        }
    });

    wrap(dashboard, item, "PAW", function (value, init) {
        if (!init) {
            RenderGauge();
        }
    });

    wrap(dashboard, item, "GaugeImage", function (value, init) {
        if (!init) {
            CreateRessources();
        }
    });

    wrap(dashboard, item, "GaugeColor", function (value, init) {
        if (!init) {
            CreateRessources();
        }
    });

    wrap(dashboard, item, "BackgroundImage", function (value, init) {
        SetImage(container, value, dashboard);
        htmlcontainer.style.backgroundSize = item.Width + 'px ' + item.Height + 'px';
    });

    wrap(dashboard, item, "GaugeImage", function (value, init) {
        if (!init) {
            CreateRessources();
        }
    });

    CreateRessources();
}