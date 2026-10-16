let cargoHold = [
    'oxygen tanks',
    'space suits',
    'parrot',
    'instruction manual',
    'meal packs',
    'slinky',
    'security blanket'
];

//thay slinky bằng space tether
cargoHold[5] = 'space tether';
console.log(cargoHold);

//xóa phần tử cuối bằng pop
let removedLast = cargoHold.pop();
console.log(removedLast);
console.log(cargoHold);

//xóa phần tử đầu bằng shift
let removedFirst = cargoHold.shift();
console.log(removedFirst);
console.log(cargoHold);

// 1138 vào đầu 20 meters cuối
cargoHold.unshift(1138);
cargoHold.push('20 meters');
console.log(cargoHold);

console.log(`Cargo hold: ${cargoHold}`);
console.log(`Length: ${cargoHold.length}`);