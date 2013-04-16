ig
    .module('game.entities.player')
    .requires('impact.entity')
    .defines(function () {

        EntityPlayer = ig.Entity.extend({
            
            size: {
                x: 30,
                y: 30
            },
            offset: {
                x: -1,
                y:0
            },
            collides: ig.Entity.COLLIDES.FIXED,
            animSheet: new ig.AnimationSheet('media/player.png', 30, 30),
            init: function (x, y, settings) {

                var walkspeed = 0.2;

                this.addAnim('idle', 0.3, [3]);
                
                this.addAnim('stand_up', 1, [0]);
                this.addAnim('walk_up', walkspeed, [1, 2]);
                
                this.addAnim('stand_down', 1, [3]);
                this.addAnim('walk_down', walkspeed, [4, 5]);
                
                this.addAnim('stand_left', 1, [6]);
                this.addAnim('walk_left', walkspeed, [6]);
                
                this.addAnim('stand_right', 1, [6]);
                this.addAnim('walk_right', walkspeed, [6]);

                this.currentAnim = this.anims.idle;
                this.parent(x, y, settings);
            },
            
            update: function () {

                if (ig.input.pressed('up')) {
                    this.vel.y = -100;
                    this.offset.x = -1;
                    this.currentAnim = this.anims.walk_up.rewind();
                }

                else if (ig.input.pressed('down')) {
                    this.vel.y = 100;
                    this.offset.x = -1;
                    this.currentAnim = this.anims.walk_down.rewind();
                    
                } else if (ig.input.pressed('left')) {
                    this.vel.x = -100;
                    this.offset.x = -1;
                    this.currentAnim = this.anims.walk_left.rewind();
                    
                } else if (ig.input.pressed('right')) {
                    this.vel.x = 100;
                    this.offset.x = 3;
                    this.currentAnim = this.anims.walk_right.rewind();
                    this.currentAnim.flip.x = true;

                } else if (ig.input.pressed('inventoryLeft')) {

                } else if (ig.input.pressed('inventoryRight')) {

                } else if (ig.input.pressed('use')) {

                } else {
                   
                }

                if (ig.input.released('up')) {
                    this.vel.y = 0;
                    this.vel.x = 0;
                    this.currentAnim = this.anims.stand_up;
                    this.offset.x = -1;
                }

                else if (ig.input.released('down')) {
                    this.vel.y = 0;
                    this.vel.x = 0;
                    this.currentAnim = this.anims.stand_down;
                    this.offset.x = -1;

                } else if (ig.input.released('left')) {
                    this.vel.y = 0;
                    this.vel.x = 0;
                    this.currentAnim = this.anims.stand_left;
                    this.offset.x = -1;

                } else if (ig.input.released('right')) {
                    this.vel.y = 0;
                    this.vel.x = 0;
                    this.offset.x = 3;
                    this.currentAnim = this.anims.stand_right;
                    this.currentAnim.flip.x = true;
                    

                } else if (ig.input.released('inventoryLeft')) {

                } else if (ig.input.released('inventoryRight')) {

                } else if (ig.input.released('use')) {

                } 




                this.parent();
            }
        });


    });