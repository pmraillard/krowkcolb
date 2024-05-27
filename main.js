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

const GRID_SIZE = 32;
let player;
let blocks;
let cursors;
let availableNfts = [];

// Example NFT data (replace with actual NFT URLs)
const nftData = [
    { imageUrl: 'assets/images/block.png' },
    { imageUrl: 'assets/images/block.png' },
];

async function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.spritesheet('player', 'assets/images/player.png', { frameWidth: 32, frameHeight: 48 });

    // Load and resize NFT images dynamically
    nftData.forEach((nft, index) => {
        this.load.image(`nft${index}`, nft.imageUrl);
    });

    this.load.once('complete', () => {
        nftData.forEach((nft, index) => {
            let tempSprite = this.add.sprite(0, 0, `nft${index}`).setVisible(false);
            tempSprite.setDisplaySize(GRID_SIZE, GRID_SIZE);
            let texture = tempSprite.texture;
            let canvasTexture = this.textures.createCanvas(`resizedNft${index}`, GRID_SIZE, GRID_SIZE);
            canvasTexture.draw(0, 0, texture.getSourceImage(), texture.getFrameSource());

            tempSprite.destroy();
        });
    });

    availableNfts = [...nftData];
    this.load.start();
}

function create() {
    this.add.image(400, 300, 'background');

    blocks = this.physics.add.staticGroup();

    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown-SPACE', placeBlock, this);

    this.physics.add.collider(player, blocks);
    this.physics.add.collider(blocks, blocks); // Allow blocks to collide with each other
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play
