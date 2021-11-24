using Newtonsoft.Json;
using SimHub.Plugins.DataPlugins.RGBDriver;
using SimHub.Plugins.DataPlugins.RGBDriver.Settings;
using SimHub.Plugins.DataPlugins.RGBDriverCommon;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Controls;

namespace User.LedEditorEffect
{
    /// <summary>
    /// Class respresentating an effect, the entire class is serialiazed/deserialized using json.
    /// Class are "discovered" based on LedsContainerBase inheritance and ContainerMetadata attribute.
    /// </summary>
    [SimHub.Plugins.DataPlugins.RGBDriver.LedsContainers.Attributes.ContainerMetadata(80, "MyCustomLedEffect", "A custom led animation example", "Effects", tm1638Compatible: false)]
    public class MyCustomLedEffect : SimHub.Plugins.DataPlugins.RGBDriver.LedsContainers.Base.LedsContainerBase
    {
        /// <summary>
        /// Set default effect settings here, this is called after adding a new effect, this won't be called after deserialization.
        /// </summary>
        public override void LoadDefaultSettings()
        {
        }

        public Color BlinkColor { get; set; } = Color.Red;

        public int BlinkDelay { get; set; } = 200;

        /// <summary>
        /// Example of property not serialized in settings.
        /// </summary>
        [JsonIgnore]
        public int SamplePropertyNotSerialized { get; set; } = 10;

        /// <summary>
        /// Builds the led result
        /// </summary>
        /// <param name="data">Game data (controlled by the test data editor)</param>
        /// <param name="result">Result provided by the engine</param>
        /// <param name="includedFrom">Specifies the list of profiles from which this effect is included from (useless most of the time)</param>
        /// <returns></returns>
        public override LedResult SetResultBase(LedsGameData data, LedResult result, List<Profile> includedFrom)
        {
            // !!!!!
            // As much as possible please use "LedsGameData data" which are under control of the test data panel.
            // !!!!!

            // Acessing current game data object
            //PluginManager pluginManager = PluginManager.GetInstance();
            //var lastGameData = pluginManager.LastData;

            // You can access also any plugin property here :
            //PluginManager pluginManager = PluginManager.GetInstance();
            //var lastGameData = pluginManager.GetPropertyValue("PersistantTrackerPlugin.SessionBestLastLapDelta");

            // You can find another plugin instance here
            // MyCustomPlugin pluginManager = PluginManager.GetInstance().GetPlugin<MyCustomPlugin>();

            var refTime = DateTime.Now;

            // Make the result 20 leds long : all leds are transparent by default.
            // Make sure to keep the length consistant so the editor keeps the leds space
            result.Clear(20);

            // Create the result
            if (refTime.TimeOfDay.TotalMilliseconds % BlinkDelay * 2 > BlinkDelay)
            {
                for (int i = 0; i < 20; i++)
                {
                    result[i] = BlinkColor;
                }
            }
            return result;
        }

        /// <summary>
        /// User control for settings editing.
        /// </summary>
        public override UserControl MainLedsEditor
        {
            get
            {
                return new MyCustomLedEffectEditControl { DataContext = this };
            }
        }

        /// <summary>
        /// Returns a status indicating if the whole effect is currently active.
        /// </summary>
        /// <param name="data">Game data.</param>
        /// <returns></returns>
        protected override bool IsActive(LedsGameData data)
        {
            return true;
        }

        /// <summary>
        /// Not used when MainLedsEditor is used
        /// </summary>
        /// <returns>null</returns>
        protected override UserControl GetEditControl()
        {
            return null;
        }
    }
}