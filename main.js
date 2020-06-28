/*
Copyright (c) 2020 takisai
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/
'use strict';

// dgebi :: String -> Maybe Element
const dgebi = id => document.getElementById(id);

// send :: () -> ()
const send = () => {
    const form = document.input; // form :: Object
    // numBegin :: Maybe NaturalNumber;  numEnd :: Maybe NaturalNumber
    const numBegin = parseInt(form.number_begin.value, 10);
    const numEnd = parseInt(form.number_end.value, 10);
    // baseBegin :: Maybe NaturalNumber;  baseEnd :: Maybe NaturalNumber
    const baseBegin = parseInt(form.base_begin.value, 10);
    const baseEnd = parseInt(form.base_end.value, 10);

    // inputLocate :: [String]
    const inputLocate = [
        'number_begin',
        'number_end',
        'base_begin',
        'base_end'
    ];
    if(inputLocate.some(x => dgebi(x).className === 'background-color_pink')) {
        alert('不正な入力です');
        return;
    }

    // insert :: (NaturalNumber, [Object]) -> ()
    const insert = (num, object) => {
        if(object.length === 0) return;
        const element = document.createElement('li'); // element :: Element
        // formatted :: [String]
        const formatted = object.map(x => {
            const joined = x.item.map(t => `&lt;${t}&gt;`).join('');
            return `<li>= ${joined}<sub>${x.base}</sub></li>`;
        });
        element.innerHTML = `${num}<ul>${formatted.join('')}</ul>`;
        dgebi('result').appendChild(element);
    };

    // getDigs :: (NaturalNumber, NaturalNumber) => [NaturalNumber]
    const getDigs = (n, base) => {
        let t = n; // t :: NaturalNumber
        const ret = []; // ret :: [NaturalNumber]
        while(t > 0) {
            ret.unshift(t % base);
            t = Math.floor(t / base);
        }
        return ret;
    };

    // check :: NaturalNumber -> ()
    const check = n => {
        const ret = []; // ret :: [Object]
        let i = isNaN(baseBegin) ? 2 : baseBegin; // i :: NaturalNumber
        // searchEnd :: NaturalNumber
        const searchEnd = isNaN(baseEnd) ? n : baseEnd;
        for(; i * i * i <= n && i <= searchEnd; ++i) {
            if(n % (i - 1) > 0) continue;
            const digs = getDigs(n, i); // digs :: [NaturalNumber]
            const sortDigs = [].concat(digs); // sortDigs :: [NaturalNumber]
            sortDigs.sort((x, y) => x - y);
            let min = 0, max = 0; // min :: NaturalNumber;  max :: NaturalNumber
            for(let j = 0; j < sortDigs.length; ++j) {
                min = i * min + sortDigs[j];
                max = i * max + sortDigs[sortDigs.length - j - 1];
            }
            if(max - min === n) {
                ret.push({base: i, item: digs});
            }
        }
        for(; i * i <= n && i <= searchEnd; ++i) {
            if(n % (i - 1) > 0 || i % 2 > 0) continue;
            if(n === ((i / 2) - 1) * i * i + (i - 1) * i + i / 2) {
                ret.push({base: i, item: getDigs(n, i)});
            }
        }
        for(; i <= n && i <= searchEnd; ++i) {
            if(n % (i - 1) > 0 || i % 3 !== 2) continue;
            if(n === ((i - 2) / 3) * i + (2 * i - 1) / 3) {
                ret.push({base: i, item: getDigs(n, i)});
            }
        }
        insert(n, ret);
    };

    dgebi('result').innerHTML = '';
    // console.assert(!isNaN(numBegin) || !isNaN(numEnd));
    for(let i = numBegin; i <= numEnd; i++) { // i :: NaturalNumber
        check(i);
    }
    if(dgebi('result').innerHTML === '') {
        dgebi('result').innerHTML = '見つかりませんでした';
    }
};

// formCheck :: Bool -> Object -> ()
const formCheck = mode => event => {
    const value = document.input[event.target.name].value; // value :: String
    const regex = mode ? /^\d*$/ : /^\d+$/; // regex :: RegExp
    if(regex.test(value)) {
        dgebi(event.target.id).className = 'background-color_white';
    } else {
        dgebi(event.target.id).className = 'background-color_pink';
    }
}

dgebi('number_begin').addEventListener('input', formCheck(false));
dgebi('number_end').addEventListener('input', formCheck(false));
dgebi('base_begin').addEventListener('input', formCheck(true));
dgebi('base_end').addEventListener('input', formCheck(true));
