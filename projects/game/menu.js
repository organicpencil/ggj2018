/*
	Main Menu Script - Button Clicks
	Austin
*/

// Live GLOBAL Clock Objects
var BUTTON_PLAY = "Button-Play"; // Object name
var BUTTON_QUIT = "Button-Quit"; // Object name
//------------------------
var _BUTTON_PLAY = null; // Object ref
var _BUTTON_QUIT = null; // Object ref

function setClockObjects()
{
	_BUTTON_PLAY = m_scenes.get_object_by_name(BUTTON_PLAY);
	_BUTTON_QUIT = m_scenes.get_object_by_name(BUTTON_QUIT);
}

function playSelected(Object obj)
{
	//load new scene
	m_scenes.setActive("Game");
	GAMEPLAY = new Gameplay(m_time.get_timeline());
	m_main.append_loop_cb(update_whatever);
}

function quitSelected()
{
	//quit
	console.log("QUIT!!!!");
}

