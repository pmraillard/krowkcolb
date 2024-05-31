const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let cubes;
let cubeCount = 0;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('cube', 'assets/cube.png');
}

function create() {
    this.add.image(400, 300, 'background');

    cubes = this.physics.add.staticGroup();

    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, cubes);

    cursors = this.input.keyboard.createCursorKeys();

    this.input.on('pointerdown', function (pointer) {
        placeCube(pointer.x, pointer.y);
    }, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function placeCube(x, y) {
    if (cubeCount < 10) { // Limiter à 10 cubes pour éviter les abus
        const cube = cubes.create(x, y, 'cube');
        cube.body.updateFromGameObject();
        cubeCount++;
    }
}
