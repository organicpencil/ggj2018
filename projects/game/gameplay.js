var STATE_SLEEPING = 0; // Baby is quiet, time going fast
var STATE_PLAY_WAIT = 1; // Noisy child, waiting for melody to start
var STATE_PLAY = 2; // Noisy child, melody also playing
var STATE_RECORD_WAIT = 3; // Noisy child, waiting for player input
var STATE_RECORD = 4; // Radio cut off, player recording
var STATE_WIN = 5;
var STATE_LOSS = 6;

var TRANSMIT_HELD = false;

var BABYPLAYER = new BabyPlayer();
var MELODYPLAYER = new MelodyPlayer();

function Gameplay(time)
{
    this.first_song = true;
    this.state = STATE_SLEEPING;
    this.start_level = 1;
    this.current_level = 1;
    this.timer = time + 5.0;
    
    this.update = function(time, m_scenes, m_material, TRANSMITTER_LED, LED_MATERIAL)
    {
        BABYPLAYER.update(time);
        MELODYPLAYER.update(time);
        
        switch (this.state)
        {
            case STATE_SLEEPING:
                if (time > this.timer)
                {
                    this.state = STATE_PLAY_WAIT;
                    this.timer = time + 2.0;
                    this.current_level = this.start_level;
                    BABYPLAYER.play(this.start_level);
                    console.log("Switching to STATE_PLAY_WAIT");
                }
                break;
                
            case STATE_PLAY_WAIT:
                if (time > this.timer)
                {
                    this.state = STATE_PLAY;
                    MELODYPLAYER.play(time, this.current_level);
                    // TODO - Toggle melody visual feedback
                    console.log("Switching to STATE_PLAY");
                }
                break;
                
            case STATE_PLAY:
                if (MELODYPLAYER.finished == true)
                {
                    this.state = STATE_RECORD_WAIT;
                    // TODO - Toggle melody visual feedback
                    console.log("Switching to STATE_RECORD_WAIT");
                }
                break;
                
            case STATE_RECORD_WAIT:
                if (TRANSMIT_HELD)
                {
                    BABYPLAYER.stop();
                    
                    this.state = STATE_RECORD;
                    var ob = m_scenes.get_object_by_name(TRANSMITTER_LED);
                    m_material.set_emit_factor(ob, LED_MATERIAL, 1.0);
                    
		            NEXT_INTERVAL = null;
                    HASHING = true;
                    
                    console.log("Switching to STATE_RECORD");
                }
                break;
                
            case STATE_RECORD:
                if (!TRANSMIT_HELD)
                {
                    var ob = m_scenes.get_object_by_name(TRANSMITTER_LED);
                    m_material.set_emit_factor(ob, LED_MATERIAL, 0.0);
                    
                    NEW_HASH = generate_hash();
                    HASHING = false;
                    
                    if (NEW_HASH == OLD_HASH) // Success
                    {
                        this.current_level -= 1;
                        BABYPLAYER.play(this.current_level);
                        if (this.current_level == 0)
                        {
                            this.start_level += 1;
                            if (this.start_level == 5)
                            {
                                this.state = STATE_WIN;
                                console.log("Switching to STATE_WIN");
                            }
                            else
                            {
                                this.state = STATE_SLEEPING;
                                this.timer = time + 5.0 + this.start_level * 2.0;
                                console.log("Switching to STATE_SLEEPING");
                            }
                        }
                        else
                        {
                            this.state = STATE_PLAY_WAIT;
                            this.timer = time + 2.0;
                            console.log("Switching to STATE_PLAY_WAIT");
                        }
                    }
                    else // Failure
                    {
                        this.current_level += 1;
                        if (this.current_level == 5)
                        {
                            this.state = STATE_LOSE;
                            console.log("Switching to STATE_LOSE");
                        }
                        else
                        {
                            BABYPLAYER.play(this.current_level);
                        }
                    }
                }
                break;
        }
        
    };
}
