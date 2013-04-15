ig
    .module(
        'game.main'
    )
    .requires(
        'impact.game',
        'plugins.screenshaker',
        'plugins.chamber.generate',
        'game.levels.generative',
        'impact.font'
    )
    .defines(function() {


        var _voidTile = 13;
        var _wallTile = 7;
        var _floorTile = 22;

        //var _map = levelgenerator.generateRandomLevel();


        var cfg = {
            width: 50,
            height: 50,
            divisions: 5,
            minSubdivideAmt: 5,
            minParentWidth: 11,
            corners: false,
            pathThickness: [1, 3],
            porportionTolerance: 5,
            randomRoomSizeRandomToFixedRatio: [0.8, 0.2],
            porportionTriesUntilBreakSafety: 1000,
            wallTile: _wallTile,
            floorTile: _floorTile,
            voidTile: _voidTile,
        };

        var levelMatrix = new ig.Chamber(cfg);

        console.log('LevelGenerative', LevelGenerative);


        console.log('levelMatrix', levelMatrix.create(cfg));


        MyGame = ig.Game.extend({
            // Load a font
            font: new ig.Font('media/04b03.font.png'),

            init: function() {
                // Initialize your game here; bind keys etc.
            },

            update: function() {
                // Update all entities and backgroundMaps
                this.parent();

                // Add your own, additional update code here
            },

            draw: function() {
                // Draw all entities and backgroundMaps
                this.parent();


                // Add your own drawing code here
                var x = ig.system.width / 2,
                    y = ig.system.height / 2;

                this.font.draw('It Works!', x, y, ig.Font.ALIGN.CENTER);
            }
        });


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
        ig.main('#canvas', MyGame, 60, 320, 240, 2);

    });
