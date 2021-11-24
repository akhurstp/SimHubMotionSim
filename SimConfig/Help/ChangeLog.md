
# 6.6.0 Beta 1

- Rewrote the whole arduino commmunication protocol 
    - The new protocol will check for errors and timeout and try to recover from these situations, it can now sustain with no troubles 1 mega bauds
    - Support added for up to 8 encoders (also supported in gamepad mode for arduino micro)
    - Support added for PWM outputs for shakeIt
    - Support added for PL9823 leds
    - Reworked the Setup tool to show a basic wiring shematic and errors detection
    - Reading buttons won't slow down the refresh rate anymore and are totally asynchronous (lower response time  (only for new sketch)
    - Added "health" data for arduino communication (only for new sketch)
    - Custom protocol is now separate from the main sketch and a lot of entry points have been added to allow more complex use cases without touching the main sketch (Idle/loop/read/setup)
    - Additional buttons names where not unique in multiple arduino mode
    - Activated MS fix for crash when serial port is unplugged/unresponsive making simhub die at the same time
    - In idle it was not possible to cycle through screens
    - Added matrix redline blink option
    - Updated tone library for a version supporting arduino micro (tach support)
- Main UI
    - It's now possible to reorganize home page games (right click to access the option)
    - Translations : SimHub can now be translated, Franch translations (100%) and Italian translation (96%) have been added, some corners of simhub have not been yet made possible to translate but it will come progressively
- Dash studio 
    - Added more aggressive pictures re compression (to avoid 30Mb dashs :D)
    - Some fonts were not properly detected on WEB engine (bad font name detection)
    - Fixed crash when adding an invalid picture in a dash
    - Added a search engine in the component list
- ShakeIt
    - It's now possible to group similar settings (corner wheels/left/right)
    - Fixed a few error loops when Fmod was crashing for unknown reasons
    - Added optional dynamic compressor on output
    - Improved default quad channel mapping
- Input management : 
    - All inputs (Except rotary encoders which are pulses based) are now supporting properly short/long press and autorepeat
    - Except rotary encoders which are pulses based, all the inputs pressed status are now accessible using properties (InputStatus.xxxxx) (They will self declare when using the input, use isnull for safety)
    - Added two new kind of action  mappings : pressed/released 
- Iracing 
    - Fixed High CPU usage introduced by properties deep discovery in iracing
- Codies 
    - Detect UDP port already in use and prevent crash loop freeze
    - Sanitized closing and game switch
- F12018 
    - Fixed brake/clutch/throttle scales
    - Fixed a f12018 driver name typo
- GRally
    - Fixed type pressure units
- All games : Fixed BrakesTemperatureAvg, BrakesTemperatureMax, BrakesTemperatureMin showing the wrong data
- AC : 
    - Added AC pro support
    - Improved car model detection for mods using too long name
- Fixed a rare crash when on Nextion busy ports checking
- Added PlayerClassOpponentsCount property

# 6.5.6
- Iracing was detecting a double lap when crossing the line
- RRRE invalid lap detection was still not satisfying
- Added RGB encoding setting to arduino to cover more WS218B leds types variations.

# 6.5.5
- ShakeIt : Ability to rename motors
- ShakeIt BS : Fmod is now configured to output as raw, it means that it will never do any down mixing/upmixing ... It will prevent any channels mixing induced by FMod. (however the driver layer remains and can do some mixing by itself)
- ShakeIt BS : Fixed an issue where the reloaded profiles would apply a wrong white noise
- Shake IT BS/MOTORS : They will respect the "disable in replay" setting.
- IRacing : Enhanced property auto discover
- Arduino : Optimized led data transmission (requires firmware update)
- Arduino : It's now possible to control the "scan engine" within simhub instead of config file.
- Arduino : Added more logs when an error occurs when sending data
- RRE and other games, reworked new lap detection to avoid cumulated lap and false positives in fuel. The rules will be more strict but more accurate too.
- Dashstudio : Fixed some issues with the optimal range
- Dashstudio : reduced a little data sent when starting a dash.
- Dashstudio : Pictures sizes in the picture library will now be visible
- Fuel tracking : Added new properties Computed.Fuel_CurrentLapConsumption and Computed.Fuel_CurrentLapIsValidForTracking
- Statistics : It's now possible to delete a recorded session
- Lap tracking : fixed AllTimeBestLastLapDelta and SessionBestLastLapDelta
- Overlays : When closing the overlay layout editor the simhub window will open back
- USBD480 : displaying the same dash will force it to reload
- Dash studio : Blinking behaviour could not be combined with visibility.
- Nextion : updated nextion micro bridge to support led disabling for upload to avoid upload corruptions.

# 6.5.4 
- Implemented "Forza september update" new data : Gear / lap timing / tyre temp map (map can't be saved as the telemetry does not gives track name) and other data,
Take care ! You must change the in game settings to get new data (see game instructions)​
- Fixed Iracing Shakeit effects not working
- Enhanced pause/suspend detection in ACC (it's only a workaround since data does not gives the real status)
- Added Dash studio "deep" copy paste, dashstudio will resolve widgets and pictures dependencies and copy them automatically in another dash when pasting. This will make life easier when "picking" parts from another dash.
- Added a workaround option for HMD messing up with outputs to force audio interfaces reconnect after game enter/exit

# 6.5.3 
- I promised it, and it's here ! ACC early access support : Basic dash and shaker effects working, however the telemetry is reflecting the early access status of the game and is still really poor. Now ball is in the kunos side :D
- Iracing raw SessionData and telemetry will now be updated as soon as a new values are discovered in the api to allow full access to any data exposed by the game (no need to restart anymore simhub)
- RF2 Yellow flag finally working
- Made some changes on the "secondary monitor" management


# 6.5.2
- Fixed arduino reconnect loop when a motor board was connecting
- Changed back Iracing "in garage" state to connected (it will be reported as "in game menu" now (stopping any shakeit effects and hiding overlays (if option is enabled)
- Arduino speedo support minimum frequency has been unlocked, the soft lock has been replaced with a warning (as theoretical minimum is 31hz but in certain conditions lower values may work)
- Added logs for the dash "maximize to screen" feature for troubleshooting (damn windows HDPI scaling ... i'm almost losing my hairs on this one :D).
- Added a "cache busting" for critical resources of web dash (to avoid any caching preventing correct rendering.)
- Added tyre wear roles for nextion (both text and progress bar)

# 6.5.1
- MotoGP 18 support (offline only): 
    - I'm proud to add his game, Milestone have not been helpful on this one and refused to publish the telemetry structure, but with a bit of reverse engineering nothing is impossible :D, it's a pretty complete game support, with dash/map and shakers support ! ​

- RF2 : 
    - Updated to the latest plugin version with addition of new FFB data (Thanks to @The Iron Wolf for the update !)

- Arduino : I've been trying to clarify and make more understandable multiple arduino setup
    - Simhub will now update devices definition from actual devices instead of getting it once and keeping it as is).
    - Manual add has been removed and will be only possible from real hardware.
    - The "leds"/ "motors" and "displays" indexes will be clearly visible. 
    - Motors shields will now report exact number of motors instead of being multiples of 4 (4,8,12...) : It will also report configured board model for easier user assistance (as lot of people configure the wrong board Oo), you need to reupload the sketch to take profit of this change)
- Dash studio : 
    - Fixed dash auto start broken on last beta.
    - Fixed layer visibility bindings
- Nextion :
    - Removed Nextion reset at connect (introduced in 6.5.0 Betas) not behaving correctly on some hardware combos resulting with a black screen
- UDP forwarding : 
    - Improved compatibility of UDP forwarding option, as some apps did not liked how the data was sent.
- Shake It for bass shakers : 
    - Added default profiles for F12018 and MOTOGP 18

# 6.5.0 beta 1

- F12018 official support ! It kept me seriously busy :D
- ShakeIt :
   - Three new effects : Acceleration G-Force,Deceleration G-Force, and simulated road texture
Experimental : New option to introduce "noise" in the generated frequency (useful to reduce the "generated" feeling of the sound)
   - Automatic device list refresh after connect disconnect of audio device
   - Automatic device reconnect after connect disconnect of audio device.
   - Maintaining current volume and unmute to try to catch any "external factor" cutting the output (VR headset ...).
- Homepage:
   - The homepage received a good lifting, it's a first step lot of ideas are coming :D :

- Dash Studio
   - Added a new "blink" behavior available on any component, so you can avoid the formula "blink" function which can be confusing for beginners
   - Added a DRS status built it component.
- BMW M3 Challenge support: An old one :D, with auto setup process available to jump straight away in your BMW with telemetry ;D
- Added a test mode for leds in arduino setup, so you can enable it to check if leds are working outside of simhub.
- Fixed a bug in Shakeit FFB for PC1,
- Fixed an issue with sessions not reseted at session change and keeping session best delta timing
- Fixed: On new leds mapping, white .... was not white (that's mysterious isn't it ? :D)
- Fixed Nextion "condition to page binding" not maintaining current interpreter (JS/ncalc) at runtime

# 6.4.6
- Forza Motorsport support, no udp hacks, router routing, etc ... SimHub will configure everything to let it run on your computer. The support however is basic, Speed and RPM for dash, and Wheel Slip, Speed/Rpm/Road vibration effects for Shakeit, but it's better than nothing :D
- USDB480 Flip option.
- Smoother touch operations on USBD480
- New Ncalc function driverclassposition

# 6.4.5
- Nextion : After screen switching data changed before the screen switch were not refreshed and required to wait the next change (gear for instance)
- Nextion delay is now locked to 5ms minimum to prevent CPU over consumption
- Iracing : Finally fixed audi R8 LMP1 preventing simhub so see the game as connected (mostly happened in online races)
- New plugin for G533 battery monitoring.
- Plugin performance monitoring : Simhub will monitor time taken into plugins and write a report in logs on close.
6.4.5 reupload : Fix from the ncalc engine returning wrong result when using [prop]=number


# 6.4.4
- Removed "network" button when feature is disabled
- Basic controls for arduino are now directly accessible from arduino panel
- Replaced Simhub webserver with a more modern one which is more future proof
- Fixed dashstudio outlined text (and they are now compatible with WEB). Coulours will probably reset due to some changes on the outline rendering.
- Fixed a little JS error in dashs on web (should not change the behaviour)
- Updated most of the used libraries
- Enforced lap database to avoid file corruption
- Advanced controls for shakeit (motor version)
- Fixed motomonster shield, it has been tested successfully on 2x 120w worm gear motors
    - Moto monster direction can now be changed
- Fixed nextion disconnect when switching pages too fast
- Fixed installer creating a new firewall rule at each install (instead of replacing it)

# 6.4.3
- Missing widgets (deleted files) would prevent correct dash loading on web
- Overlay save was broken
- New option added to speedo to stop signal when under the minimum speed 
- Following IRacing update, engine map has been removed from telemetry and is now available in sessiondata

# 6.4.2
- Some spaces were missing in the arduino displays, making everything misaligned.

# 6.4.1
- Added GRally support (basic support for now, a request has been done to the dev team to enhance the provided game telemetry)
- AC : Added brake temps
- Arduino : 
    - support for speedos (due the the large variety of clusters which could host a speedo and the absolute miss of cheap aftermarket speedos no reference design can be provided, you will have to get the instructions for your own hardware)
    - Better view of recognized hardware in arduino
- DashStudio : 
    - Replaced the websocket library with a new library with better control over the low level TCP socket in order to reduce delay and "lags" introduced by network layer on web dashs.
    - New vertical progressbar
    - Better management of hidden components to save on CPU
    - Updated the integrated browser library to the latest version
    - Leaderboard now supports relative position on track ordering
    - Added default needle support for web engine (default needle when no picture is shown)
    - Opening on the secondary monitor should be less bulky
    - Avoid allocating resources when the USBD480 screen is enabled but not found yet
- NCALC /JS :
    - Updated the JS engine to the latest version (less CPU hangry)
    - New caching and simplification strategy over formulas, SimHub will "shortcut" the engine when possible
- Shake IT : 
    - Fixed formula 2 missing effects on IRacing
    - 4 channels effects now uses rear channel instead of side channel (for compatibility with 5.1 sound cards)
    - Raised brake and throttle detection threshold to avoid false positives on effects
    - Fixed GTR2 effects (still basic considering the data given by the game)
- Updated link to the discord

# 6.4.0
- ShakeIt
    - Added 4 channels spatialization to bassshakers
    - Added 4 corner effects to shake it
    - Improved wheel lock and wheel slide detection on pc2
    - Cleaner UI
    - Added BS reference settings for bigger games
- DashStudio   
    - New Bosch DDU8 inspired dash
    - Fixed a bug forcing too many refreshs in dashstudio
    - Added a new option to pitscreen type of screen in dashstudio 
    - Added vertical progress bar 
    - New option to keep last used dash on top of the list
    - Thumbnails generation will be deferred to editor closing for smoother saving during editing
    - New options to control refresh speed (and CPU/GPU load by the way)
    - New integrated messaging system
    - New messaging system for events : newlap / best lap ...
    - Fix for some gradients not rendering properly on web engine
    - Ability to paste picture directly from clipboard into the picture list
    - USBD480 won't waste resources when not plugged
    - Optimized dash loading on web engine
- RF2 Spectator mode
- Added fuel level emulation to dirt rally (experimental)
- Dirt rally current car model guessing (Will allow gap/best lap/AT best tracking)
- Fixed RRE leaderboard bug
- Fixed Iracing map not working
- Implemented flags data in RF2
- Fixed map records not reloading properly
- New lap statistics feature
- Reworked arduino settings to make the process more clear
- Added thrustmaster profiles storage and automatic loading
- Replaced lap records files with a small database, only one file per track/car is now kept for best lap delta
- Reduced hang when going through the cross line
- Fixed IOS 11 update preventing fullscreen 
- Fixed RBR turbo and engine temp values
- Reduced temperatures precision to 2 decimals
- Fixed PC2 oil pressure unit
- Fixed nextion bug when using touch screen
- Added new Iracing Session data
- Added moto monster shield compatibility to shake it (thanks @Kevin Setz for testing !)

# 6.3.9
- Fixed Bass shakers frequencies not saved
- Radar default scale is now using a valid value
- Fixed some typos in editor and sketchs
- Fixed arduino bridge for nextion where button sample was not working
- Added automatic cleaning of best lap records
- Tuned web automatic IP detection

# 6.3.8
- NEW GAME SUPPORT : Kart racing pro
- NEW BASS SHAKER PLUGIN 
- NEW Added temperature unit choice in the settings
- SHAKEIT :
    - Fixed idle effect
    - Added per game settings
    - Early development for bass shakers
    - Option added to remove the "anti-humming" code on DK motor shield to get extra power 
    - Option added to control the ShakeIt V2 board frequency
    - Ability to export and import effects profiles
- DASH STUDIO : 
   - NEW : New selection rectangle using "shift drag"
   - Reworked a little web dash touch controls in order to free the upper area for buttons (supported now on web engine too)
   - Reworked dash cycling actions for desktop mode
   - Fonts required for a dash are now saved into a "_SHFonts" dash subfolder
   - Reworked web Map downloading to reduce freeze on slow devices
   - Reworked web display logic to improve refresh speed stability
   - Fixed autostart dash still effective when the dash has been converted to an overlay
   - Added categories for dash organization
   - New option to keep layout editor minimized on layout load 
   - Redline flash overlay color and opacity can now be configured.
- NEXTION :
   - Enhanced support for arduino micro bridge with leds support and better button box sample
   - Rewrote nextion screen management for a smoother screen changing
- ALL GAMES : 
    - Added "last lap tyre wear" data
    - All games  using UDP can now forward UDP data to another app in a very few steps
- RBR : Enhanced track and car detection for mods
- IRACING 
    - Got rid of the pace car in the leader-board
    - Added CarSetup data
- RF2
    - Updated to the latest CC plugin version
- CODEMASTERS
    - Added separate entries for Dirt2 and DirtShowdown
- NCALC :
    - Added minimum function to ncalc
    - Fixed secondstotimespan removing millisonds

- Reworked data reading clock to get closer to 60FPS 
- Button to access car settings right from the the Leds layouts (to answer the most common question, "where can I change the blinking rpm trigger ?")
- Reworked a little control pick for small screens
- Reworked tab control style for better visibility
- Joystick plugin : Devices will now have a unique name, avoiding mappings mess when having multiple times the same hardware
- Replaced the tray menu with a simpler menu (exit/restore)
- Automatic detection of new plugins
- Faster SimHub exit and isolated plugin settings save
- Fixed some locking problems at exit or game change


# 6.3.7
- Fixed Iracing delta
- Sometimes on game change the usbd480 luminosity was remaining to 0.

# 6.3.6
- Updated to the latest version of the CrewChief RF2 plugin (v3.0.0.1 - https://github.com/TheIronWolfModding/rF2SharedMemoryMapPlugin)
- Finished lut reading for TV and ABS (in some conditions AC reports wrong TC value and it may not match the real ingame level, but it's an AC bug)
- Smoother live map for RF2 (thanks to @TheIronWolfModding for the infos)
- Lighter record files for rf2
- Reworked USBD480 to add more logs for easier troubleshooting
- Fixed USBD480 not correctly mapped when using the usbd480 settings panel
- Updated USBD480 to latest library version known
- Fixed memory usage when USBD480 is disabled after being connected
- Fixed a bug occurring when saving a dash while dash preview is running
- Heavy rework of the live gap computation for a much smoother result. Gap et Gapprogress won't be jumping around anymore

# 6.3.5
- Reworked LUT reading for TC and ABS level in AC
- Added level count for ABS and TC in AC
- Added progress bar in Dash messaging system
- Added redline flash on desktop dash engine
- Fixed DashStudio dial designer not refreshing when changing some settings

# 6.3.4

- Dirt Rally "restart session" action (will send the required key combination to restart the stage)
- updated RF2 plugin to the latest CC version
- Experimental redline flash overlay only working on WEB for this release, desktop engine support will come after.
- Added AC lut files decryption to get matching TC and ABS level with game (it was previously giving the physical rate, not the ingame preset level)
- option added in ShakeIt to mute the motors when using a replay
- ShakeIt on dash display now shows a rounded value

# 6.3.3
- Missing OMSI2 plugin
- Fixed shakeit RPM force always to 100%

# 6.3.2

- Some fine tuning on the web dash engine to reduce packet size at the strict minimum required (only the page shown instead of all the pages)
- IOS : it's now possible to add the dash list to the home screen, the dash won't open anymore in a new window (preventing to get fullscreen)
- Added an how-to in the dash list when IOS is detected but not started from the home screen  (preventing to get fullscreen)
- F12017 grid was incorrect when a player/opponent was disqualified
- The deprecated plugin for RBR was removed from the package (it looks like to was tickling some pernickety antiviruses at install)
- PC2 flags status were wrong since the switch to the PC2 api mode
- Dashs command buttons were not functional when the widget was in a group/layer
- Fixed a typo in ETS2 variables "GameRawData.Damage.WearEnigne"
- timespantoseconds function was broken in the js formula engine
- Added data for best lap opponent
- Shakeit : Fixed R3E wheel lock and road vibration (it's impossible to detect vibrators however)
- Shakeit : Implemented RBR vibration (wheel lock and road vibration)
- Shakeit : Reworked rf2 vibrations
- Iracing car model data was wrong when in race

# 6.3.1 Hotfix

- Simhub could hang when changing screen on web dash using input controls (wheel, button box etc ...)

# 6.3.0

Game readers :
- Some RF2 instability fixes
- More opponent data extracted
- Top speed tracking (MaxSpeed)
- Car settings par car and per games (redline/ shift levels for leds /Maxrpm ...)
- Plugins and settings are now capable of auto install/configure (based on steam library for plugins)
- fixed some instabilities with BeamNG/LFS readers
- F12017 car model is now giving the team name (instead of the era)
- RRRE tyre temps ordering fix.
- Fixed sectors datas for AC/PC1/PC2
- Early Support of OMSI 2
- Reworked relative timing computations for lighter CPU usage and more stable data

Dash studio : 
- New leaderboards components : Live Gap, LB Background, Current Opponent LAP
- Options for the leaderboards components to show car class leaderboards
- Options for the leaderboards components to show gap relative to player or to leader
- Leaderboard option for car class only LB
- New Toggle image component
- New Shift light component (pictures)
- Groups can now auto peat their content (works with leaderboard components too)
- Web loading data are now compressed
- Fix : Web gradients sometimes incorrects
- Updated all the default templates with the new features
- Export and import feature for dashs/overlays
- Reduced font rescan work by detecting fonts changes
- Dash/overlay lists will auto refresh when dropping/deleting/updating files into the dashtemplates folder
- New option to start overlays in 'Always on top' mode 
- New announce 'system' to show some system values when changed using controls

Dash Studio overlays : 
- Overlays are now separated from the legacy dash
- Overlay manager, manage and build overlay layouts
----- Please, please, please, give up with full screen overlays -----  

USBD480 :
- Separate controls for USBD480 
- New cycle control for USBD480
- New option to disable touchscreen reading (for non touch USBD480)

Nextion :
- some little data timing changes to reduce time with old data when changing pages
- Updated nextion editor to latest version
- Reverted a change making virtual pages totally independant to the original page

Arduino :
- Made a little more tolerant to late messages (and to reconnect trigger)
- Default settings now use the speed unit configured in the settings

Joystick plugin
- Fixed connected device list not refreshing

Web :
- New web api (Giving game data in JSON form) : http://127.0.0.1:8888/Api/GameData

Shakeit :
- Reduced Fanatec pedals polling/update work to reduce CPU usage

System Info :
- Trying to avoid CDRom wake up when polling for drives info

Plugins : 
- The SDK had small changes requiring a recompilation of the plugins


