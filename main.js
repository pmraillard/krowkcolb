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

// Example NFT data
const nftData = [
    { imageUrl: 'assets/block.png' }, // Replace with actual NFT URLs
    { imageUrl: 'assets/block.png' }, // Replace with actual NFT URLs
];

// Array to keep track of used NFTs
let availableNfts = [...nftData];

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });

    // Load NFT images dynamically
    nftData.forEach((nft, index) => {
        this.load.image(`nft${index}`, nft.imageUrl);
    });
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
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function placeBlock() {
    if (availableNfts.length === 0) {
        console.log('No more NFTs available to place as blocks');
        return;
    }

    const x = Phaser.Math.Snap.To(player.x, GRID_SIZE);
    const y = Phaser.Math.Snap.To(player.y - player.height, GRID_SIZE);
    const nft = availableNfts.shift(); // Remove the first available NFT
    const nftIndex = nftData.indexOf(nft);
    const block = blocks.create(x, y, `nft${nftIndex}`);
    block.setCollideWorldBounds(true);
}
