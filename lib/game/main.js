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
    .defines(function () {


        var vm = {

        };

        vm.width = ko.observable(150);
        vm.height = ko.observable(150);
        vm.divisions = ko.observable(5);
        vm.minSubdivideAmt = ko.observable(5);
        vm.minParentWidth = ko.observable(11);
        vm.corners = ko.observable(false);
        vm.pathThicknessMin = ko.observable(1);
        vm.pathThicknessMax = ko.observable(3);
        vm.porportionTolerance = ko.observable(5);
        vm.randomRoomSizeRandomToFixedRatioRand = ko.observable(0.8);
        
        vm.randomRoomSizeRandomToFixedRatioFixed = ko.observable(0.2);

        vm.porportionTriesUntilBreakSafety = ko.observable(1000);
        vm.wallTile = ko.observable(50);
        vm.floorTile = ko.observable(389);
        vm.voidTile = ko.observable(392);



        var makeLevel= function (impact) {
            

            var cfg = {
                width: vm.width(),
                height: vm.height(),
                divisions: vm.divisions(),
                minSubdivideAmt: vm.minSubdivideAmt(),
                minParentWidth: vm.minParentWidth(),
                corners: vm.corners(),
                pathThickness: [vm.pathThicknessMin(), vm.pathThicknessMax()],
                porportionTolerance: vm.porportionTolerance(),
                randomRoomSizeRandomToFixedRatio: [vm.randomRoomSizeRandomToFixedRatioRand(), vm.randomRoomSizeRandomToFixedRatioFixed()],
                porportionTriesUntilBreakSafety: vm.porportionTriesUntilBreakSafety(),
                wallTile: vm.wallTile(),
                floorTile: vm.floorTile(),
                voidTile: vm.voidTile(),
            };


            var chamber = new ig.Chamber(cfg);

            var data = chamber.create(cfg);


            impact.backgroundMaps = [];
            var bg = new ig.BackgroundMap(32, data, 'media/terrain_0.png');
            bg.anims = {};
            bg.repeat = false;
            bg.distance = 1;
            bg.preRender = false;
            bg.name = "generatietilemap";

            impact.backgroundMaps.push(bg);
            


            $(document).ready(function () {
                var colorlist = {};
                colorlist["c" + cfg.wallTile] = "#cccccc";
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
                $('#minimap table').css({ 'width': vm.width() * 3 + 'px' });
            });


            $('#arrayoutput').text(data);
        };




        MyGame = ig.Game.extend({
            // Load a font
            font: new ig.Font('media/04b03.font.png'),

            init: function () {
                // Initialize your game here; bind keys etc.
                //Input
                ig.input.bind(ig.KEY.W, 'up');
                ig.input.bind(ig.KEY.S, 'down');
                ig.input.bind(ig.KEY.A, 'left');
                ig.input.bind(ig.KEY.D, 'right');                


                makeLevel(this);

                var pl = new EntityPlayer(0, 0, {});

                this.entities.push(pl);


                var game = this;


                $(document).ready(function() {

                    $('#makelevelbutton').on('click', function () {
                        makeLevel(game);
                    });

                });

            },

            update: function () {
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

            draw: function () {
                // Draw all entities and backgroundMaps
                this.parent();

                // Add your own drawing code here
            }
        });

        // Start the Game with 60fps, a resolution of 320x240, scaled
        // up by a factor of 2




        ig.main('#canvas', MyGame, 60, 640, 480, 1);


        ko.applyBindings(vm);
        





    });
