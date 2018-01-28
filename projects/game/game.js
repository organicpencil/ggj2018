"use strict"

// register the application module
b4w.register("game_main", function(exports, require) {

// import modules used by the app
var m_app       = require("app");
var m_cfg       = require("config");
var m_ctl       = require("controls");
var m_cont      = require("container");
var m_data      = require("data");
var m_main      = require("main");
var m_mouse     = require("mouse");
var m_material  = require("material");
var m_preloader = require("preloader");
var m_scenes    = require("scenes");
var m_time      = require("time");
var m_ver       = require("version");

var _disable_interaction = false;

// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("game");

// Custom global vars
var TRANSMITTER_LED = "TRANSMITTER_LED"; // Object name
var LED_MATERIAL = "Led"; // LED material name

var GAMEPLAY = null;

load_sound();

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: DEBUG,
        console_verbose: DEBUG,
        autoresize: true
    });
}

/**
 * callback executed when the app is initialized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load(APP_ASSETS_PATH + "game.json", load_cb, preloader_cb);
}

/**
 * update the app's preloader
 */
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

/**
 * callback executed when the scene data is loaded
 */
function load_cb(data_id, success) {
    if (!success) {
        console.log("b4w load failure");
        return;
    }
    
	//mouse code on load for selection------------------------------------------------------
	var cont = m_cont.get_container();
    cont.addEventListener("mousedown", main_canvas_down, false);
    m_mouse.enable_mouse_hover_outline();
	//--------------------------------------------------------------------------------------
	
    toggleLiveInput();

    // place your code here
    setup_controls();

}

function setup_controls()
{
    var key_transmit = m_ctl.create_keyboard_sensor(m_ctl.KEY_SPACE);
    var sensor_array = [key_transmit];
    
    function transmit_cb(obj, id, pulse)
    {
        if (pulse == 1)
        {
            switch (id)
            {
            case "TRANSMIT":
                TRANSMIT_HELD = true;
                break;
            }
            
        }
        else
        {
            switch (id)
            {
            case "TRANSMIT":
                TRANSMIT_HELD = false;
                break;
            }
        }
    };
    
    m_ctl.create_sensor_manifold(null, "TRANSMIT", m_ctl.CT_CONTINUOUS, sensor_array, null, transmit_cb);
    m_main.append_loop_cb(updatePitch_cb);
    
    GAMEPLAY = new Gameplay(m_time.get_timeline());
    m_main.append_loop_cb(update_whatever);
}

function update_whatever()
{
    var time = m_time.get_timeline();
    GAMEPLAY.update(time);
}

function updatePitch_cb() {
    if (!isPlaying && !HASHING)
    {
        return "";
    }
	var time = m_time.get_timeline()
	var cycles = new Array;
	analyser.getFloatTimeDomainData( buf );
	var ac = autoCorrelate( buf, audioContext.sampleRate );
	// TODO: Paint confidence meter on canvasElem here.

	
	 	//detectorElem.className = "confident";
	var pitch = pitchAVG;
	if (ac != -1)
	{
		if (100.0 < ac && ac < 2000.0)
		{
			pitch = ac;
			
			if(pitchCount < 30)
			{
				pitches[pitchCount] = pitch;
				pitchCount++;
			}
			else
			{
				pitchCount = 0;
			}
			calculateAvgPitch();
		}
	}
	
	// SET PITCH HERE
	CURRENT_PITCH = pitch;  //pitch data
	
	if (isPlaying && time > SOUND_DURATION)
	{
	    // Finished playing melody
	    //togglePlayback();
	    isPlaying = false;
	    HASHING = false;
	    OLD_HASH = generate_hash();
	    console.log(OLD_HASH);
	    //toggleLiveInput();
	    return "";
	}
	
	if (HASHING || isPlaying)  //if space bar held
	{
		if (NEXT_INTERVAL == null)
		{
			NEXT_INTERVAL = time + HASH_SAMPLE_OFFSET;
		}
		if (100.0 < pitchAVG && pitchAVG < 2000.0)
		{
			
			if (LOWEST_PITCH == null || pitchAVG < LOWEST_PITCH)
			{
				LOWEST_PITCH = pitchAVG;
			}
			
			if (HIGHEST_PITCH == null || pitchAVG > HIGHEST_PITCH)
			{
				HIGHEST_PITCH = pitchAVG;
			}
				
			if (time > NEXT_INTERVAL)
			{
				//console.log(time - NEXT_INTERVAL);
				console.log(pitchAVG);
				PITCHES.push(pitchAVG);
				NEXT_INTERVAL += HASH_SAMPLE_OFFSET;
			}
		}
	 	/*
	 	pitchElem.innerText = Math.round( pitch ) ;
	 	var note =  noteFromPitch( pitch );
		noteElem.innerHTML = noteStrings[note%12];
		var detune = centsOffFromPitch( pitch, note );
		if (detune == 0 ) {
			detuneElem.className = "";
			detuneAmount.innerHTML = "--";
		} else {
			if (detune < 0)
				detuneElem.className = "flat";
			else
				detuneElem.className = "sharp";
			detuneAmount.innerHTML = Math.abs( detune );
		}
		*/
	}

	//if (!window.requestAnimationFrame)
	//	window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	//rafID = window.requestAnimationFrame( updatePitch );
}

function main_canvas_down(e) {
   
    if (_disable_interaction)
        return;

    if (e.preventDefault)
        e.preventDefault();

    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);

    var obj = m_scenes.pick_object(x, y);
    
    if (obj)
	{
        if(obj == _BUTTON_PLAY)
		{
			playSelected();
		}
		/*else if(//object baby monitor clicked
		{
			
		}*/
		//quitSelected(obj);
		console.log(m_scenes.get_object_name(obj));
	}
}

});

// import the app module and start the app by calling the init method
b4w.require("game_main").init();
