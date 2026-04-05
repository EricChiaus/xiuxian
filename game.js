class SimpleRPG {
    constructor() {
        this.player = {
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            pa: 10,  // Physical Attack
            ma: 8,   // Magic Attack
            pd: 5,   // Physical Defense
            md: 4,   // Magic Defense
            level: 1,
            exp: 0,
            expToNext: 100,
            coin: 0
        };

        this.currentEnemy = null;
        this.inBattle = false;
        this.lastSaveTime = Date.now();
        
        this.enemyTypes = [
            { name: "Goblin", baseHp: 50, basePa: 8, basePd: 3, expReward: 20, coinReward: 10 },
            { name: "Slime", baseHp: 40, basePa: 6, basePd: 2, expReward: 15, coinReward: 8 },
            { name: "Wolf", baseHp: 60, basePa: 12, basePd: 4, expReward: 25, coinReward: 12 },
            { name: "Orc", baseHp: 80, basePa: 15, basePd: 6, expReward: 35, coinReward: 18 },
            { name: "Skeleton", baseHp: 55, basePa: 10, basePd: 5, expReward: 22, coinReward: 11 }
        ];

        this.init();
    }

    init() {
        this.loadGame();
        this.calculateOfflineExp();
        this.updateUI();
        this.saveGame();
    }

    // Character stats system
    calculateStats() {
        // Base stats grow with level
        const levelMultiplier = 1 + (this.player.level - 1) * 0.15;
        
        this.player.maxHp = Math.floor(100 * levelMultiplier);
        this.player.maxMp = Math.floor(50 * levelMultiplier);
        this.player.pa = Math.floor(10 * levelMultiplier);
        this.player.ma = Math.floor(8 * levelMultiplier);
        this.player.pd = Math.floor(5 * levelMultiplier);
        this.player.md = Math.floor(4 * levelMultiplier);
        
        // Restore full HP/MP on level up
        if (this.player.hp > this.player.maxHp) {
            this.player.hp = this.player.maxHp;
        }
        if (this.player.mp > this.player.maxMp) {
            this.player.mp = this.player.maxMp;
        }
    }

    // Level up system
    levelUp() {
        const expNeeded = this.player.expToNext - this.player.exp;
        if (expNeeded > 0) {
            this.addBattleLog(`Need ${expNeeded} more EXP to level up!`, 'system');
            return;
        }

        this.player.level++;
        this.player.exp -= this.player.expToNext;
        this.player.expToNext = Math.floor(100 * Math.pow(1.2, this.player.level - 1));
        
        const oldHp = this.player.maxHp;
        const oldMp = this.player.maxMp;
        const oldPa = this.player.pa;
        const oldMa = this.player.ma;
        const oldPd = this.player.pd;
        const oldMd = this.player.md;
        
        this.calculateStats();
        
        this.addBattleLog(`Level Up! Now level ${this.player.level}!`, 'system');
        this.addBattleLog(`HP: ${oldHp} → ${this.player.maxHp}`, 'system');
        this.addBattleLog(`MP: ${oldMp} → ${this.player.maxMp}`, 'system');
        this.addBattleLog(`PA: ${oldPa} → ${this.player.pa}`, 'system');
        this.addBattleLog(`MA: ${oldMa} → ${this.player.ma}`, 'system');
        this.addBattleLog(`PD: ${oldPd} → ${this.player.pd}`, 'system');
        this.addBattleLog(`MD: ${oldMd} → ${this.player.md}`, 'system');
        
        // Check for boss battle availability
        if (this.player.level >= 99) {
            this.addBattleLog("You've reached level 99! The boss battle awaits!", 'system');
        }
        
        this.updateUI();
        this.saveGame();
    }

    // Enemy generation system
    generateEnemy() {
        const enemyType = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        const levelVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const enemyLevel = Math.max(1, this.player.level + levelVariation);
        const levelMultiplier = 1 + (enemyLevel - 1) * 0.1;
        
        this.currentEnemy = {
            name: enemyType.name,
            level: enemyLevel,
            hp: Math.floor(enemyType.baseHp * levelMultiplier),
            maxHp: Math.floor(enemyType.baseHp * levelMultiplier),
            pa: Math.floor(enemyType.basePa * levelMultiplier),
            pd: Math.floor(enemyType.basePd * levelMultiplier),
            ma: Math.floor(6 * levelMultiplier),
            md: Math.floor(3 * levelMultiplier),
            expReward: Math.floor(enemyType.expReward * levelMultiplier),
            coinReward: Math.floor(enemyType.coinReward * levelMultiplier),
            hasMagic: Math.random() > 0.5,
            hasHeal: Math.random() > 0.8
        };
    }

    // Battle system
    startBattle() {
        if (this.inBattle) return;
        
        this.generateEnemy();
        this.inBattle = true;
        
        document.getElementById('mainScreen').classList.add('hidden');
        document.getElementById('battleScreen').classList.remove('hidden');
        document.getElementById('enemyName').textContent = `${this.currentEnemy.name} (Lv.${this.currentEnemy.level})`;
        
        this.updateBattleUI();
        this.addBattleLog(`Battle started! ${this.currentEnemy.name} appears!`, 'enemy');
        this.saveGame();
    }

    playerAction(action) {
        if (!this.inBattle) return;
        
        let damage = 0;
        let mpCost = 0;
        
        switch(action) {
            case 'attack':
                damage = Math.max(1, this.player.pa - this.currentEnemy.pd + Math.floor(Math.random() * 5));
                this.currentEnemy.hp -= damage;
                this.addBattleLog(`You attack for ${damage} damage!`, 'player');
                break;
                
            case 'magic':
                if (this.player.mp < 10) {
                    this.addBattleLog("Not enough MP!", 'system');
                    return;
                }
                mpCost = 10;
                damage = Math.max(1, this.player.ma - this.currentEnemy.md + Math.floor(Math.random() * 8));
                this.currentEnemy.hp -= damage;
                this.player.mp -= mpCost;
                this.addBattleLog(`You cast magic for ${damage} damage! (-${mpCost} MP)`, 'player');
                break;
                
            case 'heal':
                if (this.player.mp < 15) {
                    this.addBattleLog("Not enough MP!", 'system');
                    return;
                }
                mpCost = 15;
                const healAmount = Math.floor(this.player.ma * 1.5 + Math.floor(Math.random() * 10));
                const actualHeal = Math.min(healAmount, this.player.maxHp - this.player.hp);
                this.player.hp += actualHeal;
                this.player.mp -= mpCost;
                this.addBattleLog(`You heal for ${actualHeal} HP! (-${mpCost} MP)`, 'player');
                break;
        }
        
        this.updateBattleUI();
        
        if (this.currentEnemy.hp <= 0) {
            this.victory();
            return;
        }
        
        // Enemy turn
        setTimeout(() => this.enemyAction(), 1000);
    }

    enemyAction() {
        if (!this.inBattle || this.currentEnemy.hp <= 0) return;
        
        const action = this.enemyChooseAction();
        let damage = 0;
        
        switch(action) {
            case 'attack':
                damage = Math.max(1, this.currentEnemy.pa - this.player.pd + Math.floor(Math.random() * 4));
                this.player.hp -= damage;
                this.addBattleLog(`${this.currentEnemy.name} attacks for ${damage} damage!`, 'enemy');
                break;
                
            case 'magic':
                if (this.currentEnemy.hasMagic) {
                    damage = Math.max(1, this.currentEnemy.ma - this.player.md + Math.floor(Math.random() * 6));
                    this.player.hp -= damage;
                    this.addBattleLog(`${this.currentEnemy.name} casts magic for ${damage} damage!`, 'enemy');
                } else {
                    // Fall back to attack
                    damage = Math.max(1, this.currentEnemy.pa - this.player.pd + Math.floor(Math.random() * 4));
                    this.player.hp -= damage;
                    this.addBattleLog(`${this.currentEnemy.name} attacks for ${damage} damage!`, 'enemy');
                }
                break;
                
            case 'heal':
                if (this.currentEnemy.hasHeal && this.currentEnemy.hp < this.currentEnemy.maxHp * 0.5) {
                    const healAmount = Math.floor(this.currentEnemy.ma * 1.2 + Math.floor(Math.random() * 8));
                    const actualHeal = Math.min(healAmount, this.currentEnemy.maxHp - this.currentEnemy.hp);
                    this.currentEnemy.hp += actualHeal;
                    this.addBattleLog(`${this.currentEnemy.name} heals for ${actualHeal} HP!`, 'enemy');
                } else {
                    // Fall back to attack
                    damage = Math.max(1, this.currentEnemy.pa - this.player.pd + Math.floor(Math.random() * 4));
                    this.player.hp -= damage;
                    this.addBattleLog(`${this.currentEnemy.name} attacks for ${damage} damage!`, 'enemy');
                }
                break;
        }
        
        this.updateBattleUI();
        
        if (this.player.hp <= 0) {
            this.defeat();
        }
    }

    enemyChooseAction() {
        const actions = ['attack'];
        if (this.currentEnemy.hasMagic) actions.push('magic');
        if (this.currentEnemy.hasHeal && this.currentEnemy.hp < this.currentEnemy.maxHp * 0.5) {
            actions.push('heal');
        }
        return actions[Math.floor(Math.random() * actions.length)];
    }

    victory() {
        this.inBattle = false;
        this.player.exp += this.currentEnemy.expReward;
        this.player.coin += this.currentEnemy.coinReward;
        
        this.addBattleLog(`Victory! You gained ${this.currentEnemy.expReward} EXP and ${this.currentEnemy.coinReward} coins!`, 'system');
        
        // Check for level up
        while (this.player.exp >= this.player.expToNext) {
            this.levelUp();
        }
        
        setTimeout(() => {
            document.getElementById('battleScreen').classList.add('hidden');
            document.getElementById('mainScreen').classList.remove('hidden');
            this.currentEnemy = null;
            this.updateUI();
            this.saveGame();
        }, 2000);
    }

    defeat() {
        this.inBattle = false;
        const expLoss = Math.floor(this.player.exp * 0.1);
        this.player.exp -= expLoss;
        
        // Check for level down
        while (this.player.exp < 0 && this.player.level > 1) {
            this.player.level--;
            this.player.exp += this.player.expToNext;
            this.player.expToNext = Math.floor(100 * Math.pow(1.2, this.player.level - 1));
            this.calculateStats();
        }
        
        if (this.player.exp < 0) this.player.exp = 0;
        
        this.addBattleLog(`Defeat! You lost ${expLoss} EXP!`, 'system');
        
        // Restore some HP for next battle
        this.player.hp = Math.floor(this.player.maxHp * 0.5);
        this.player.mp = Math.floor(this.player.maxMp * 0.5);
        
        setTimeout(() => {
            document.getElementById('battleScreen').classList.add('hidden');
            document.getElementById('mainScreen').classList.remove('hidden');
            this.currentEnemy = null;
            this.updateUI();
            this.saveGame();
        }, 2000);
    }

    // Offline EXP calculation
    calculateOfflineExp() {
        const currentTime = Date.now();
        const timeDiff = currentTime - this.lastSaveTime;
        const hoursAway = timeDiff / (1000 * 60 * 60);
        
        if (hoursAway >= 1) {
            const offlineExpRate = 5; // EXP per hour
            const offlineExp = Math.floor(hoursAway * offlineExpRate);
            
            if (offlineExp > 0) {
                this.player.exp += offlineExp;
                document.getElementById('offlineExpAmount').textContent = offlineExp;
                document.getElementById('offlineExp').style.display = 'block';
                
                // Check for level up from offline exp
                while (this.player.exp >= this.player.expToNext) {
                    this.levelUp();
                }
                
                setTimeout(() => {
                    document.getElementById('offlineExp').style.display = 'none';
                }, 5000);
            }
        }
    }

    // Save/Load system
    saveGame() {
        const gameData = {
            player: this.player,
            lastSaveTime: Date.now()
        };
        localStorage.setItem('rpgGameSave', JSON.stringify(gameData));
    }

    loadGame() {
        const savedData = localStorage.getItem('rpgGameSave');
        if (savedData) {
            try {
                const gameData = JSON.parse(savedData);
                this.player = gameData.player || this.player;
                this.lastSaveTime = gameData.lastSaveTime || Date.now();
                this.calculateStats();
            } catch (e) {
                console.error('Failed to load save data:', e);
            }
        }
    }

    resetGame() {
        if (confirm('Are you sure you want to reset your game? All progress will be lost!')) {
            localStorage.removeItem('rpgGameSave');
            location.reload();
        }
    }

    // UI Updates
    updateUI() {
        // Player stats
        document.getElementById('playerLevel').textContent = this.player.level;
        document.getElementById('playerCoins').textContent = this.player.coin;
        document.getElementById('playerPA').textContent = this.player.pa;
        document.getElementById('playerMA').textContent = this.player.ma;
        document.getElementById('playerPD').textContent = this.player.pd;
        document.getElementById('playerMD').textContent = this.player.md;
        
        // HP bar
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        document.getElementById('playerHpBar').style.width = hpPercent + '%';
        document.getElementById('playerHpText').textContent = `${this.player.hp}/${this.player.maxHp}`;
        
        // MP bar
        const mpPercent = (this.player.mp / this.player.maxMp) * 100;
        document.getElementById('playerMpBar').style.width = mpPercent + '%';
        document.getElementById('playerMpText').textContent = `${this.player.mp}/${this.player.maxMp}`;
        
        // EXP bar
        const expPercent = (this.player.exp / this.player.expToNext) * 100;
        document.getElementById('playerExpBar').style.width = expPercent + '%';
        document.getElementById('playerExpText').textContent = `${this.player.exp}/${this.player.expToNext}`;
        
        // Level up button
        const levelUpBtn = document.getElementById('levelUpBtn');
        if (this.player.exp >= this.player.expToNext) {
            levelUpBtn.style.display = 'block';
            levelUpBtn.style.animation = 'pulse 1s infinite';
        } else {
            levelUpBtn.style.animation = 'none';
        }
    }

    updateBattleUI() {
        if (!this.currentEnemy) return;
        
        // Enemy HP bar
        const enemyHpPercent = (this.currentEnemy.hp / this.currentEnemy.maxHp) * 100;
        document.getElementById('enemyHpBar').style.width = enemyHpPercent + '%';
        document.getElementById('enemyHpText').textContent = `${this.currentEnemy.hp}/${this.currentEnemy.maxHp}`;
        
        // Update player HP/MP bars in battle
        this.updateUI();
    }

    addBattleLog(message, type = 'system') {
        const log = document.getElementById('battleLog');
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = message;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
        
        // Keep log size manageable
        while (log.children.length > 50) {
            log.removeChild(log.firstChild);
        }
    }
}

// Initialize game
const game = new SimpleRPG();

// Auto-save every 30 seconds
setInterval(() => {
    game.saveGame();
}, 30000);

// Add pulse animation for level up button
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
