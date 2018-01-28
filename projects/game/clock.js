/*
	Austin's basic clock
*/

//_TRANSMITTER_LED = m_scenes.get_object_by_name(TRANSMITTER_LED); -gets objects for modification

var second = 0;
var minute = 0;
var hour = 0;
var clockPeriod = false; //am for false, pm for true

// Live GLOBAL Clock Objects
var HOUR_10 = "HOUR10"; // Object name
var HOUR_1 = "HOUR1"; // Object name
var MINUTE_10 = "MINUTE10"; // Object name
var MINUTE_1 = "MINUTE1"; // Object name
var AM_PM = "A_P"; // Object name
//------------------------
var _HOUR_10 = null; // Object ref
var _HOUR_1 = null; // Object ref
var _MINUTE_10 = null; // Object ref
var _MINUTE_1 = null; // Object ref
var _AM_PM = null; // Object ref

function setClockObjects()
{
	_HOUR_10 = m_scenes.get_object_by_name(HOUR_10);
	_HOUR_1 = m_scenes.get_object_by_name(HOUR_1);
	_MINUTE_10 = m_scenes.get_object_by_name(MINUTE_10);
	_MINUTE_1 = m_scenes.get_object_by_name(MINUTE_1);
	_AM_PM = m_scenes.get_object_by_name(AM_PM);
}

function runClock()
{
	second++;
	if(second > 59)
	{
		changeMinute();
		second = 0;
	}
}

function changeMinute()
{
	minute++;
	if(minute > 59)
	{
		changeHour();
		minute = 0;
		_MINUTE_1.fillText("0");
		_MINUTE_10.fillText("0");
		return;
	}
	
	if(minute > 9)
	{
		_MINUTE_1.fillText(minute[0]);
		_MINUTE_10.fillText("0");
	}
	else
	{
		_MINUTE_1.fillText(minute[1]);
		_MINUTE_10.fillText(minute[0]);
	}
	return;
}

function changeHour()
{
	var period = false;
	
	hour++;
	if(hour > 11)
	{
		if(amPM())
		{
			hour = 12;
			_HOUR_1.fillText(hour[1]);
			_HOUR_10.fillText(hour[0]);
		}
		else
		{
			hour = 0;
			_HOUR_1.fillText("0");
			_HOUR_10.fillText("0");
		}
		return;
	}
	
	if(minute > 9)
	{
		_HOUR_1.fillText(hour[0]);
		_HOUR_10.fillText("0");
	}
	else
	{
		_HOUR_1.fillText(hour[1]);
		_HOUR_10.fillText(hour[0]);
	}
	return;
}

function amPM()
{
	clockPeriod != clockPeriod;
	if(clockPeriod){ _AM_PM.fillText("P");}
	else{ _AM_PM.fillText("A");}	
	return clockPeriod;
}