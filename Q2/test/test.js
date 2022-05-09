const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");

const { groth16, plonk} = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        console.log('1x2 =',publicSignals[0]);

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // get the int into editedPublicSignals
        const editedProof = unstringifyBigInts(proof);
        // get the int into editedProof
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        // pass the editedProof and editedPublicSignals into groth16 exportSolidityCallData
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        // replace split and map in one statement
        const a = [argv[0], argv[1]];
        // create a new list, 2
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        // create a new list 4
        const c = [argv[6], argv[7]];
        // create a new list, 2
        const Input = argv.slice(8);
        // get item from the 8th index
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3_groth16");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3-groth16/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3-groth16/circuit_final.zkey");

        console.log('1x2x3 =',publicSignals[0]);

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // get the int into editedPublicSignals
        const editedProof = unstringifyBigInts(proof);
        // get the int into editedProof
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        // pass the editedProof and editedPublicSignals into groth16 exportSolidityCallData

        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        // replace split and map in one statement
        const a = [argv[0], argv[1]];
        // create a new list, 2
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        // create a new list 4
        const c = [argv[6], argv[7]];
        // create a new list, 2
        const Input = argv.slice(8);
        // get item from the 8th index
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await plonk.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3_plonk/circuit_final.zkey");

        console.log('1x2x3 =',publicSignals[0]);
        // console.log('proof here', proof);
        // console.log('publicSignals here', publicSignals);

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // get the int into editedPublicSignals
        const editedProof = unstringifyBigInts(proof);
        // get the int into editedProof
        const calldata  = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);
        // pass the editedProof and editedPublicSignals into plonk exportSolidityCallData

        const argv = calldata.replace(/["[\]\s]/g, "").split(',');
        const a = argv[0]
        const b = [unstringifyBigInts(argv[1])]

        expect(await verifier.verifyProof(a, b)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let hex = '0x1765e773b88019feef2370f568095563f32b43c973ec1ad9f5928ae603943ff1';
        let Input = [4];
        expect(await verifier.verifyProof(hex, Input)).to.be.false;
    });
});