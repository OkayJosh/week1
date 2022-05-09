const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment
const fs1 = require("fs");
const solidityRegex1 = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex1 = /contract Verifier/

let content1 = fs1.readFileSync("./contracts/Multiplier3-groth16.sol", { encoding: 'utf-8' });
let bumped1 = content1.replace(solidityRegex1, 'pragma solidity ^0.8.0');
bumped1 = bumped1.replace(verifierRegex1, 'contract Multiplier3_groth16');

fs1.writeFileSync("./contracts/Multiplier3-groth16.sol", bumped1);

const fs2 = require("fs");
const solidityRegex2 = /pragma solidity [>=]\d+\.\d+\.\d+ [<]\d+\.\d+\.\d+/

const verifierRegex2 = /contract Verifier/

let content2 = fs2.readFileSync("./contracts/Multiplier3_plonk.sol", { encoding: 'utf-8' });
let bumped2 = content2.replace(solidityRegex2, 'pragma solidity 0.8.0');
bumped2 = bumped2.replace(verifierRegex2, 'contract PlonkVerifier');

fs2.writeFileSync("./contracts/Multiplier3_plonk.sol", bumped2);