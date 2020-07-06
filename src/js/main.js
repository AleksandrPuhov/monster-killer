const monsterHealthBar = document.getElementById('monster-health');
const playerHealthBar = document.getElementById('player-health');
const bonusLifeEl = document.getElementById('bonus-life');

const attackBtn = document.getElementById('attack-btn');
const strongAttackBtn = document.getElementById('strong-attack-btn');
const healBtn = document.getElementById('heal-btn');
const logBtn = document.getElementById('log-btn');

const logText = document.getElementById('logs-text');

const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt('Maximum life for you and the monster.', '100');

let chosenPlayerLife = parseInt(enteredValue);

let battleLog = [];

if (isNaN(chosenPlayerLife) || chosenPlayerLife <= 0) {
    chosenPlayerLife = 100;
}

let currentMonsterHealth = chosenPlayerLife;
let currentPlayerHealth = chosenPlayerLife;
let hasBonusLife = true;

const adjustHealthBars = (maxLife) => {
    monsterHealthBar.max = maxLife;
    monsterHealthBar.value = maxLife;
    playerHealthBar.max = maxLife;
    playerHealthBar.value = maxLife;
};

adjustHealthBars(chosenPlayerLife);

const dealMonsterDamage = (damage) => {
    const dealtDamage = Math.round(Math.random() * damage);
    monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
    return dealtDamage;
};

const dealPlayerDamage = (damage) => {
    const dealtDamage = Math.round(Math.random() * damage);
    playerHealthBar.value = +playerHealthBar.value - dealtDamage;
    return dealtDamage;
};

const increasePlayerHealth = (healValue) => {
    playerHealthBar.value = +playerHealthBar.value + healValue;
};

const resetGame = (value) => {
    playerHealthBar.value = value;
    monsterHealthBar.value = value;
};

const removeBonusLife = () => {
    bonusLifeEl.parentNode.removeChild(bonusLifeEl);
};

const setPlayerHealth = (health) => {
    playerHealthBar.value = health;
};

const targetAttack = (ev) => {
    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            return 'MONSTER';
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            return 'MONSTER';
        case LOG_EVENT_MONSTER_ATTACK:
            return 'PLAYER';
        case LOG_EVENT_PLAYER_HEAL:
            return 'PLAYER';
        case LOG_EVENT_GAME_OVER:
            return null;
        default:
            return null;
    }
};

const writeToLog = (ev, val, monsterHealth, playerHealth) => {
    let logEntry = {
        event: ev,
        value: val,
        target: targetAttack(ev),
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
    };
    battleLog.push(logEntry);
};

const reset = () => {
    currentMonsterHealth = chosenPlayerLife;
    currentPlayerHealth = chosenPlayerLife;
    resetGame(chosenPlayerLife);
};

const endRound = () => {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You would be dead but the bonus life saved you!');
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        );
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
};

const attackMonster = (mode) => {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent =
        mode === MODE_ATTACK
            ? LOG_EVENT_PLAYER_ATTACK
            : LOG_EVENT_PLAYER_STRONG_ATTACK;

    const damage = dealMonsterDamage(maxDamage);

    currentMonsterHealth -= damage;

    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

    endRound();
};

const attackHandler = () => {
    attackMonster(MODE_ATTACK);
};

const strongAttackHandler = () => {
    attackMonster(MODE_STRONG_ATTACK);
};

const healPlayerHandler = () => {
    let healValue;
    if (currentPlayerHealth >= chosenPlayerLife - HEAL_VALUE) {
        alert("You can't heal to more than your max initial health.");
        healValue = chosenPlayerLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
};

const printLogHandler = () => {
    let text;

    if (battleLog.length === 0) {
        logText.appendChild(document.createTextNode('No action'));
    } else {
        for (const ev of battleLog) {
            text = document.createElement('p');
            text.textContent = `${ev.event} to ${ev.target} ${ev.value}`;
            logText.appendChild(text);
        }
    }

    //    appendChild(document.createTextNode(`${ev.event} to ${ev.target} ${ev.value}`));

    //logText.textContent = text;
    console.log(battleLog);
};

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
