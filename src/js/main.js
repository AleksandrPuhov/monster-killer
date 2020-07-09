const monsterHealthText = document.getElementById('monster-health-text');
const playerHealthText = document.getElementById('player-health-text');
const monsterHealthMax = document.getElementById('monster-health-max');
const playerHealthMax = document.getElementById('player-health-max');
const monsterHealthBar = document.getElementById('monster-health-bar');
const playerHealthBar = document.getElementById('player-health-bar');
const bonusLifeEl = document.getElementById('bonus-life');

const attackBtn = document.getElementById('attack-btn');
const strongAttackBtn = document.getElementById('strong-attack-btn');
const healBtn = document.getElementById('heal-btn');

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

const LOG_EVENT_PLAYER = 'PLAYER';
const LOG_EVENT_MONSTER = 'MONSTER';
const LOG_EVENT_ATTACK = 'ATTACK';
const LOG_EVENT_HEAL = 'HEAL';
const LOG_EVENT_WON = 'WON';

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
    monsterHealthText.textContent = maxLife;
    playerHealthText.textContent = maxLife;
    monsterHealthMax.textContent = maxLife;
    playerHealthMax.textContent = maxLife;
};

adjustHealthBars(chosenPlayerLife);

const dealMonsterDamage = (damage) => {
    const dealtDamage = Math.round(Math.random() * damage);
    monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
    monsterHealthText.textContent = monsterHealthBar.value;
    return dealtDamage;
};

const dealPlayerDamage = (damage) => {
    const dealtDamage = Math.round(Math.random() * damage);
    playerHealthBar.value = +playerHealthBar.value - dealtDamage;
    playerHealthText.textContent = playerHealthBar.value;
    return dealtDamage;
};

const increasePlayerHealth = (healValue) => {
    playerHealthBar.value = +playerHealthBar.value + healValue;
    playerHealthText.textContent = playerHealthBar.value;
};

const resetGame = (value) => {
    playerHealthBar.value = value;
    monsterHealthBar.value = value;
    playerHealthText.textContent = playerHealthBar.value;
    monsterHealthText.textContent = monsterHealthBar.value;
};

const removeBonusLife = () => {
    bonusLifeEl.parentNode.removeChild(bonusLifeEl);
};

const setPlayerHealth = (health) => {
    playerHealthBar.value = health;
    playerHealthText.textContent = playerHealthBar.value;
};

const reset = () => {
    currentMonsterHealth = chosenPlayerLife;
    currentPlayerHealth = chosenPlayerLife;
    resetGame(chosenPlayerLife);
};

const addToTextLog = (
    numEvent,
    personEvent,
    event,
    targetEvent,
    damageEvent
) => {
    const numSpan = document.createElement('span');
    numSpan.className = 'logs-text-item__num';
    numSpan.textContent = numEvent;

    const personSpan = document.createElement('span');
    personSpan.className = 'logs-text-item__person';
    personSpan.textContent = personEvent;

    const actionSpan = document.createElement('span');
    actionSpan.className = 'logs-text-item__action';
    actionSpan.textContent = event;

    const targetSpan = document.createElement('span');
    targetSpan.className = 'logs-text-item__target';
    targetSpan.textContent = targetEvent;

    const damageSpan = document.createElement('span');
    damageSpan.className = 'logs-text-item__damage';
    damageSpan.textContent = damageEvent;

    const textLi = document.createElement('li');
    textLi.className = 'logs-text-item';
    textLi.appendChild(numSpan);
    textLi.appendChild(personSpan);
    textLi.appendChild(actionSpan);
    textLi.appendChild(targetSpan);
    textLi.appendChild(damageSpan);

    logText.prepend(textLi);
};

const writeToLog = (
    personEvent,
    event,
    targetEvent,
    damageEvent,
    playerHealth,
    monsterHealth
) => {
    let logEntry = {
        person: personEvent,
        event: event,
        target: targetEvent,
        damage: damageEvent,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
    };
    battleLog.push(logEntry);
    addToTextLog(
        battleLog.length,
        personEvent,
        event,
        targetEvent,
        damageEvent
    );
};

const endRound = () => {
    let end = false;

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = Math.round(chosenPlayerLife / 2);
        setPlayerHealth(currentPlayerHealth);
        alert('You would be dead but the bonus life saved you!');
    }
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!');
        writeToLog(
            LOG_EVENT_PLAYER,
            LOG_EVENT_WON,
            LOG_EVENT_MONSTER,
            0,
            currentMonsterHealth,
            currentPlayerHealth
        );
        end = true;
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        writeToLog(
            LOG_EVENT_MONSTER,
            LOG_EVENT_WON,
            LOG_EVENT_PLAYER,
            0,
            currentMonsterHealth,
            currentPlayerHealth
        );
        end = true;
    }
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
    return end;
};

const attackPlayer = () => {
    const damage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= damage;
    writeToLog(
        LOG_EVENT_MONSTER,
        LOG_EVENT_ATTACK,
        LOG_EVENT_PLAYER,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
};

const attackMonster = (mode) => {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(
        LOG_EVENT_PLAYER,
        LOG_EVENT_ATTACK,
        LOG_EVENT_MONSTER,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    const end = endRound();
    if (!end) {
        attackPlayer();
    }
};

const healPlayer = () => {
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
        LOG_EVENT_PLAYER,
        LOG_EVENT_HEAL,
        LOG_EVENT_PLAYER,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
};

attackBtn.addEventListener('click', () => attackMonster(MODE_ATTACK));
strongAttackBtn.addEventListener('click', () =>
    attackMonster(MODE_STRONG_ATTACK)
);
healBtn.addEventListener('click', healPlayer);
