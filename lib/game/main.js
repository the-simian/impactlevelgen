ig
    .module(
        'game.main'
    )
    .requires(
        'impact.game',
        'plugins.screenshaker',
        'plugins.chamber.generate',
        'game.levels.generative',
        'game.entities.player',
        'impact.font'
    )
    .defines(function() {








        var cfg = {
            width: 150,
            height: 150,
            divisions: 5,
            minSubdivideAmt: 5,
            minParentWidth: 11,
            corners: false,
            pathThickness: [1, 3],
            porportionTolerance: 5,
            randomRoomSizeRandomToFixedRatio: [0.8, 0.2],
            porportionTriesUntilBreakSafety: 1000,
            wallTile: 50,
            floorTile: 389,
            voidTile: 392,
        };




        var chamber = new ig.Chamber(cfg);

        var data = chamber.create(cfg);


        this.backgroundMaps = [];
        var bg = new ig.BackgroundMap(32, data, 'media/terrain_0.png');
        bg.anims = {};
        bg.repeat = false;
        bg.distance = 1;
        bg.preRender = false;
        bg.name = "generatietilemap";



        console.log( bg);
        

        MyGame = ig.Game.extend({
            // Load a font
            font: new ig.Font('media/04b03.font.png'),

            init: function() {
                // Initialize your game here; bind keys etc.
                //Input
                ig.input.bind(ig.KEY.W, 'up');
                ig.input.bind(ig.KEY.S, 'down');
                ig.input.bind(ig.KEY.A, 'left');
                ig.input.bind(ig.KEY.D, 'right');


                this.backgroundMaps.push(bg);
                

                var pl = new EntityPlayer(0,0, {});

                this.entities.push(pl);






            },

            update: function() {
                // Update all entities and backgroundMaps
                this.parent();

                // Add your own, additional update code here
                //make screen follow player
                var player = this.getEntitiesByType(EntityPlayer)[0];
                if (player) {
                    this.screen.x = player.pos.x - ig.system.width / 2;
                    this.screen.y = player.pos.y - ig.system.height / 2;
                }
            },

            draw: function() {
                // Draw all entities and backgroundMaps
                this.parent();

                // Add your own drawing code here
            }
        });
        
        // Start the Game with 60fps, a resolution of 320x240, scaled
        // up by a factor of 2


        $(document).ready(function () {
            var colorlist = {};
            colorlist["c" + cfg.wallTile] = "#00ffFF";
            colorlist["c" + cfg.floorTile] = "#FF0000";
            colorlist["c" + cfg.voidTile] = "#000000";

            var datalength = data.length;
            var table = "<table>";
            for (var i = 0; i < datalength; i++) {
                table += "<tr>";
                var tdLength = data[i].length;
                for (var j = 0; j < tdLength; j++) {
                    var val = data[i][j];
                    var color;
                    if (typeof val == 'number') {
                        color = colorlist['c' + val];
                    } else {
                        color = val;
                    }
                    table += "<td style='background-color:" + color + "'></td>";
                }
                table += "</tr>";
            }
            table += "</table>";
            $('#minimap').html(table);
        });


        $('#arrayoutput').text(data);


        ig.main('#canvas', MyGame, 60, 640, 480, 1);
    });
