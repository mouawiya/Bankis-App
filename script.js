'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // empty the container

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUSD = 1.1;
const tatalDepositsUDS = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUSD)
  .reduce((accu, mov) => accu + mov, 0);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  // the "?" is for optional chaining, it means that the .pin === Num.... can only be activated if the currentAccount exist
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and a welcome message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // the fild loses its focus

    // update the interface
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  if (amount > 0 && receiverAcc && amount <= currentAccount.balance && receiverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // update the interface
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);

    // update the interface
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const inputNameClose = inputCloseUsername.value;
  const inputPinClose = inputClosePin.value;

  if (currentAccount.username === inputNameClose && currentAccount.pin === Number(inputPinClose)) {
    // Find the index of the user
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// LECTURE

//////////////////////////////////////////////////////////////////////////////////

// Simple array methods

/*
// Slice
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// Splice
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// Reverse
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// Concat
const letters = arr.concat(arr2);
console.log(letters);
//another method
// console.log([...arr, ...arr2]);

// Join
console.log(letters.join(' - '));
*/

//////////////////////////////////////////////////////////////////////////////////

// at() method

/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));
*/

//////////////////////////////////////////////////////////////////////////////////

// looping arrays with "forEach"

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`In movement ${i + 1} you deposited ${movement}`);
  } else {
    console.log(`In movement ${i + 1} you withdrew ${Math.abs(movement)}`);
  }
}

console.log('-------- FOREACH --------');

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`In movement ${i + 1} you deposited ${mov}`);
  } else {
    console.log(`In movement ${i + 1} you withdrew ${Math.abs(mov)}`);
  }
});
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...
*/

//////////////////////////////////////////////////////////////////////////////////

// "forEach" looping for Maps and Sets

/*
// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, set) {
  console.log(`${value}: ${value}`);
});
*/

//////////////////////////////////////////////////////////////////////////////////

// Challenge 1:

/*
const dogsJulia1 = [3, 5, 2, 12, 7];
const dogsKate1 = [4, 1, 15, 8, 3];

const dogsJulia2 = [9, 16, 6, 8, 3];
const dogsKate2 = [10, 5, 6, 1, 4];

const checkDogs = function (arr1, arr2) {
  const dogsJuliaCorrected = arr1.slice(1, 3);
  const dogsJuliaKate = dogsJuliaCorrected.concat(arr2);
  console.log(dogsJuliaKate);
  // Jonas's method
  // const dogsJuliaCorrected = arr1.slice();
  // dogsJuliaCorrected.splice(0, 1);
  // dogsJuliaCorrected.splice(-2);

  dogsJuliaKate.forEach(function (age, dog) {
    if (age >= 3) {
      console.log(`Dog number ${dog + 1} is an adult, and is ${age} years old`);
    } else {
      console.log(`Dog number ${dog + 1} is still a puppu 🐶`);
    }
  });
};
console.log('-------------FIRST DATA SET-------------');
checkDogs(dogsJulia1, dogsKate1);
console.log('-------------SECOND DATA SET-------------');
checkDogs(dogsJulia2, dogsKate2);
*/

//////////////////////////////////////////////////////////////////////////////////

// MAP
/*
const eurToUSD = 1.1;

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const movementsUSD = movements.map(function (mov) {
  return mov * eurToUSD;
});
// Arrow functions
const movementsUSDMapArr = movements.map(mov => mov * eurToUSD);

console.log(movements);
console.log(movementsUSD);

const movementsUDSfor = [];
for (const move of movements) movementsUDSfor.push(move * eurToUSD);
console.log(movementsUDSfor);

const movementsDescriptions = movements.map((mov, i, arr) => {
  `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.ads(mov)}`;
});

console.log(movementsDescriptions);
*/

//////////////////////////////////////////////////////////////////////////////////

// Filter

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositfor = [];
for (const mov of movements) if (mov > 0) depositfor.push(mov);
console.log(depositfor);

const withdrawalsArr = movements.filter(mov => mov < 0);
console.log(withdrawalsArr);
*/

//////////////////////////////////////////////////////////////////////////////////

// Reduce

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

const balanceArr = movements.reduce((acc, cur) => acc + cur, 0);

const balance = movements.reduce(function (acc, mov, i) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + mov;
}, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}

console.log(balance2);

// Maximum value
const maxArr = movements.reduce((acc, cur) => {
  if (acc > cur) return acc;
  else return cur;
}, movements[0]);
console.log(maxArr);
*/

//////////////////////////////////////////////////////////////////////////////////

// Challenge 2:

/*
const calcAverageHumanAge = function (ages) {
  const dogHumanAge = ages.map(age => (age <= 2 ? age * 2 : age * 4 + 16));
  console.log(dogHumanAge);

  const dogs18 = dogHumanAge.filter(age => age >= 18);
  console.log(dogs18);

  const avgHumnAge = dogs18.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  //2 3. (2+3)/2 = 2.5 === 2/2+2/3 = 2.5
  // const avgHumnAge = dogs18.reduce((acc, age) => acc + age / dogs18.length, 0);
  console.log(avgHumnAge);
};
console.log('DATA1');
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log('DATA2');
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
*/

//////////////////////////////////////////////////////////////////////////////////

// Challenge 3:

/*
const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? age * 2 : age * 4 + 16))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

console.log('DATA1');
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log('DATA2');
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/

//////////////////////////////////////////////////////////////////////////////////

// The find method:

/*
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

//////////////////////////////////////////////////////////////////////////////////

// The some and every methods:

/*
// SOME method
// Equality
console.log(movements.includes(-130));

// Condition
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// EVERY method
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

//////////////////////////////////////////////////////////////////////////////////

// The flat and flatMap methods:

/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[1, [2, 3]], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// flat
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// flatmap
const overalBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);
*/

//////////////////////////////////////////////////////////////////////////////////

// Sorting arrays:

/*
// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

// Numbers
console.log(movements);
// console.log(movements.sort()); // does not work

// return < 0 , A before B (Keep order)
// return > 0 , B before A (Switch order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

//////////////////////////////////////////////////////////////////////////////////

// More ways of creating and filling arrays:

/*
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// empty arrays + fill method
const x = new Array(7);
console.log(x); // [empty x 7]
// console.log(x.map(() => 5)); //[empty x 7]

// x.fill(1);
// console.log(x); // [1,1,1,1,1,1,1]

x.fill(1, 3, 5); // the 3 and 5 are the begining and end of the fill of the array (with case 5 not taking into considiration)
console.log(x); // [empty x 3, 1, 1, empty x 2]

arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const randomDiceRolls = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 100));
console.log(randomDiceRolls);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', '')));
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});
*/

//////////////////////////////////////////////////////////////////////////////////

// Array methods practice

/*
// 1. the total summ of deposits (movements > 0)
// my method
const bankDepositSum = accounts.flatMap(mov => mov.movements).reduce((acc, mov) => (mov > 0 ? acc + mov : acc), 0);
console.log(bankDepositSum);

// his method
// const bankDepositSum = accounts.flatMap(mov => mov.movements).filter(mov => mov>0).reduce((acc, mov) => acc + mov,0);

// 2. the total number of deposits >= 1000
// first method
// const numDeposits1000 = accounts.flatMap(mov => mov.movements).filter(mov => mov >= 1000).length;

// second method
const numDeposits1000 = accounts.flatMap(mov => mov.movements).reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

// prefixed ++ operator
// let a = 10;
// console.log(++a);
// console.log(a);

// 3. create an object which contains the sums of the deposits and withdrawals
const { deposits, withdrawals } = accounts
  .flatMap(mov => mov.movements)
  .reduce(
    (sums, cur) => {
      // cur >= 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      // we can write the previous line in a cleaner way like this:
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(`deposits: ${deposits}, withdrawals: ${withdrawals}`);

// 4. convert any string in a titlecase (it means that all the words in a sentance are capitalized except for some of them.)
// example: this is a nice title --> This Is a Nice Title

const convertTitleCAse = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];
  const titlecase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titlecase); // we called the capitalize function in case we have a title that starts with an exception and it won't be uppercased, so we need to make it uppercase
};

console.log(convertTitleCAse('this is a nice title'));
console.log(convertTitleCAse('this is a LONG title but not too long'));
console.log(convertTitleCAse('and here is another title with an EXAMPLE'));
*/

//////////////////////////////////////////////////////////////////////////////////

// challenge 4:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(function (dog) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);

// 2.
// Jona's method
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(`Sarah's dog is eating too ${dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'}`);
// My method
const SarahDog = dogs.map(dog => (dog.owners.includes('Sarah') ? [dog.curFood, dog.recommendedFood] : 0)).find(weight => weight !== 0);
console.log(`Sarah's dog is eating too ${SarahDog[0] > SarahDog[1] ? 'much' : 'little'}`);

// 3.

// Jona's method
const ownersEatTooMuch2 = dogs.filter(dog => dog.curFood > dog.recommendedFood).flatMap(dog => dog.owners);
console.log(ownersEatTooMuch2);
const ownersEatTooLittle2 = dogs.filter(dog => dog.curFood < dog.recommendedFood).flatMap(dog => dog.owners);
console.log(ownersEatTooLittle2);

// My method
const ownersEatTooMuch = dogs.flatMap(dog => (dog.curFood > dog.recommendedFood ? dog.owners : []));
console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs.flatMap(dog => (dog.curFood < dog.recommendedFood ? dog.owners : []));
console.log(ownersEatTooLittle);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6.
const eatingOkay = dog => dog.curFood > dog.recommendedFood * 0.9 && dog.curFood < dog.recommendedFood * 1.1;
console.log(dogs.some(eatingOkay));

// 7.
console.log(dogs.filter(eatingOkay));

// 8.
// sort it by recommended food portion in an ascending order [1,2,3]
const dogsSorted = dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);
