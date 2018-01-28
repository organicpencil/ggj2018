function BabyPlayer()
{
    this.play = function(level) // Levels 0 - 4 (nothing, low, medium, high, extreme)
    {
    };
    
    this.stop = function()
    {
    };
    
    this.update = function(time)
    {
    };
}

function MelodyPlayer()
{
    this.playing = false;
    this.finished = false;
    this.timer = 0.0;
    
    this.play = function(time, level) // Levels 0 - 4 (nothing, low, medium, high, extreme)
    {
        togglePlayback();
        this.timer = time + SOUND_DURATION;
        this.playing = true;
    };
    
    this.update = function(time)
    {
        if (this.playing && time > this.timer)
        {
            this.finished = true;
        }
    };
}
