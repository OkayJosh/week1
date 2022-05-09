pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/transpose.circom";
include "../node_modules/circomlib/circuits/matElemMul.circom";

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here

    component transpose = transpose(3,3);
    component multiply = matElemMul(3,3);
    transpose.a <== A;
    multiply.a <== transpose.out;
    multiply.b <== B;


    out <== multiply.out;

}

component main {public [A, b]} = SystemOfEquations(3);