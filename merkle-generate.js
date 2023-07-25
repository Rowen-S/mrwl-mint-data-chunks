const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs');

// mrwl-nint-data-chunks
const targetDirectory = __dirname + '/chunks/';

const leaves =
    [
        "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
        "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
        "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
        "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
        "0xD06Cf34428958C1457DA0D97042bbB11aAB99999",
    ]

// const hashedLeaves = leaves.map(keccak256).sort(Buffer.compare);

const tree = new MerkleTree(leaves, keccak256, { hashLeaves: true, sortPairs: true })


const hexLeaves = tree.getHexLeaves()

console.log("Root:", tree.getHexRoot());
console.log('-----------------------');

// console.log('Leaves:', hexLeaves);
// console.log('Layers:', tree.getHexLayers());
// console.log("Flat Layers", tree.getHexLayersFlat());
// console.log("Tree", tree.toString());


// for (let i = 0; i < hexLeaves.length; i++) {
//     const leaf = hexLeaves[i];
//     const proof = tree.getHexProof(leaf)
//     console.log('proof:', JSON.stringify(proof, null, 2))
// }


const proofs = {};

for (let i = 0; i < leaves.length; i++) {
    const address = leaves[i].toLocaleLowerCase();
    const leaf = hexLeaves[i];
    const proof = tree.getHexProof(leaf);

    // console.log('Address:', address);
    // console.log('Proof:', JSON.stringify(proof, null, 2));
    // console.log('-----------------------');

    proofs[address] = { proof };

    fs.writeFile(targetDirectory + address, JSON.stringify({ proof }, null, 2), (err) => {
        if (err) {
            console.error(`Error creating ${address}: ${err}`);
        } else {
            console.log(`${address} created successfully.`);
        }
    });
}

fs.writeFileSync(targetDirectory + 'proofs.json', JSON.stringify(proofs, null, 2));
console.log('Proofs have been written to proofs.json file.');


// const root = tree.getRoot()
// const leaf = keccak256('0xD06Cf34428958C1457DA0D97042bbB11aAB99999')

// const proof = tree.getProof(leaf)

// console.log(tree.verify(proof, leaf, root))

// const WhiteBList = require('../proofs.json')

// let arr = Object.entries(WhiteBList)

// console.log(WhiteBList, new Map(arr));