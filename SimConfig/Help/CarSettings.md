# Car Settings

## Limitations

Car settings only works when the current car model is provided by the game, if no car model is given by the game the default settings will be only accessible

## Default engine settings

This section defines the defaults for the current game, these settings are stored per game.

- Red line : Value in percent of the max RPM to trigger the redline
- Minimum displayed RPM : Value in percent of the max RPM to start to show the current RPM
- Shift light 1 : Value in percent of the max rpm to trigger the first series of shift light
- Shift light 2 : Value in percent of the max rpm to trigger the second series of shift light

## Engine settings override

This section allows you to refine the basic engine characteristics per car. SimHub will show the car after the first use if the car model can be detected.
To override the data simply check the data data you want to override and set a new value.

## Proper usage of the settings

### Arduino Leds (RGB and TM1638)

Settings will be automatically applied when using the default "rpm" data source

### Nextion, dash studio and other NCALC/JS based displays

To properly use the settings please use the following properties :

#### `DataCorePlugin.GameData.NewData.CarSettings_CurrentDisplayedRPMPercent` 
Current RPM in percent (with `Minimum displayed RPM` and `Maximum RPM` taken into account)

#### `DataCorePlugin.GameData.NewData.CarSettings_RedLineRPM` 
Redline expressed in RPM

#### `DataCorePlugin.GameData.NewData.CarSettings_RedLineDisplayedPercent` 
Redline expressed in percent (with `Minimum displayed RPM` and `Maximum RPM` taken into account).
This value can be safely compared to `CarSettings_CurrentDisplayedRPMPercent`

#### `DataCorePlugin.GameData.NewData.CarSettings_MaxRPM` 
Max RPM of the car using the settings

#### `DataCorePlugin.GameData.NewData.CarSettings_MaxFUEL` 
Max Fuel of the car using the settings

#### `DataCorePlugin.GameData.NewData.CarSettings_MinimumShownRPM`
Minimum RPM Shown following the settings (expressed in RPM)

#### `DataCorePlugin.GameData.NewData.CarSettings_RPMRedLineReached`
The value will be 1 when the redline have been reached otherwise 0;

#### `DataCorePlugin.GameData.NewData.CarSettings_RPMShiftLight1`
The value will be 0 when the shift light 1 is off, then progressively raise to 1 until shift light 2 is reached;

#### `DataCorePlugin.GameData.NewData.CarSettings_RPMShiftLight2`
The value will be 0 when the shift light 2 is off, then progressively raise to 1 until the redline is reached;


