import { useState } from 'react';
import { generateEnemy } from '../utils/enemies';
import { generateEquipment } from '../utils/equipment';
import { Character, Enemy } from '../types/game';

export interface SkyTowerRewards {
  expGained: number;
  coinsGained: number;
  expLost: number;
  equipment?: any;
}

export function useSkyTower(initialPlayer: Character) {
  const [skyTowerFloor, setSkyTowerFloor] = useState(() => {
    const stored = localStorage.getItem('skyTowerFloor');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [showSkyTowerModal, setShowSkyTowerModal] = useState(false);
  const [skyTowerEnemies, setSkyTowerEnemies] = useState<Enemy[]>([]);
  // Types for equipment
  const equipmentTypes: Character['inventory'][number]['type'][] = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace', 'accessory'];
  const [skyTowerBattleResult, setSkyTowerBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [skyTowerRewards, setSkyTowerRewards] = useState<SkyTowerRewards | null>(null);
  const [skyTowerPlayer, setSkyTowerPlayer] = useState<Character>(initialPlayer);
  const [skyTowerLog, setSkyTowerLog] = useState<any[]>([]);
  const [skyTowerTurn, setSkyTowerTurn] = useState(true);

  // Open Sky Tower modal and start battle
  const openSkyTowerModal = () => {
    const floor = skyTowerFloor + 1;
    const enemies = [
      generateEnemy(floor, 'elite1', true),
      generateEnemy(floor, 'elite2', true),
      generateEnemy(floor, 'elite3', true)
    ];
    setSkyTowerEnemies(enemies);
    setSkyTowerBattleResult(null);
    setSkyTowerRewards(null);
    setSkyTowerPlayer(initialPlayer);
    setSkyTowerLog([]);
    setSkyTowerTurn(true);
    setShowSkyTowerModal(true);
  };

  // Handle Sky Tower battle actions
  const handleSkyTowerAction = (action: string) => {
    if (!skyTowerTurn || skyTowerBattleResult) return;
    const targetIdx = skyTowerEnemies.findIndex(e => e.hp > 0);
    if (targetIdx === -1) return;
    const target = skyTowerEnemies[targetIdx];
    let newEnemies = [...skyTowerEnemies];
    let log = [...skyTowerLog];
    let player = { ...skyTowerPlayer };
    let dmg = 0;
    if (action === 'attack') {
      dmg = Math.max(10, player.pa - target.pd);
      newEnemies[targetIdx] = { ...target, hp: Math.max(0, target.hp - dmg) };
      log.push({ message: `你对${target.name}造成了${dmg}点伤害`, type: 'player', timestamp: Date.now() });
    } else if (action === 'magic' && player.mp >= 10) {
      dmg = Math.max(15, player.ma - target.md + 10);
      player.mp -= 10;
      newEnemies[targetIdx] = { ...target, hp: Math.max(0, target.hp - dmg) };
      log.push({ message: `你用法术对${target.name}造成了${dmg}点伤害`, type: 'player', timestamp: Date.now() });
    } else if (action === 'heal' && player.mp >= 15) {
      const heal = 25;
      player.hp = Math.min(player.maxHp, player.hp + heal);
      player.mp -= 15;
      log.push({ message: `你恢复了${heal}点HP`, type: 'player', timestamp: Date.now() });
    } else {
      log.push({ message: '法力不足，无法行动', type: 'system', timestamp: Date.now() });
      setSkyTowerLog(log);
      return;
    }
    setSkyTowerEnemies(newEnemies);
    setSkyTowerPlayer(player);
    setSkyTowerLog(log);
    // Check victory
    if (newEnemies.every(e => e.hp <= 0)) {
      const totalExp = 200 + 50 * (skyTowerFloor + 1);
      const totalCoins = 300 + 80 * (skyTowerFloor + 1);
      const eqType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
      const epicOrLegendary = Math.random() < 0.8 ? 'epic' : 'legendary';
      const equipment = generateEquipment(`skyTower_${Date.now()}`, eqType, Math.min(5, skyTowerFloor + 1), epicOrLegendary);
      const updatedPlayer = {
        ...player,
        exp: player.exp + totalExp,
        coin: player.coin + totalCoins,
        inventory: [...player.inventory, equipment],
        hp: player.maxHp,
        mp: player.maxMp
      };
      setSkyTowerPlayer(updatedPlayer);
      setSkyTowerBattleResult('victory');
      setSkyTowerRewards({ expGained: totalExp, coinsGained: totalCoins, expLost: 0, equipment });
      localStorage.setItem('skyTowerFloor', String(skyTowerFloor + 1));
      setSkyTowerFloor(f => f + 1);
      return;
    }
    // Enemy turn
    setSkyTowerTurn(false);
    setTimeout(() => {
      let enemyLog = [...log];
      let p = { ...player };
      let enemies = [...newEnemies];
      enemies.forEach((enemy) => {
        if (enemy.hp > 0) {
          const dmg = Math.max(8, enemy.pa - p.pd);
          p.hp = Math.max(0, p.hp - dmg);
          enemyLog.push({ message: `${enemy.name}攻击你造成${dmg}点伤害`, type: 'enemy', timestamp: Date.now() });
        }
      });
      setSkyTowerPlayer(p);
      setSkyTowerLog(enemyLog);
      setSkyTowerTurn(true);
      if (p.hp <= 0) {
        setSkyTowerBattleResult('defeat');
        setSkyTowerRewards({ expGained: 0, coinsGained: 0, expLost: Math.floor(player.exp * 0.1) });
      }
    }, 800);
  };

  // Handle Sky Tower modal close
  const closeSkyTowerModal = () => {
    setShowSkyTowerModal(false);
    setSkyTowerEnemies([]);
    setSkyTowerBattleResult(null);
    setSkyTowerRewards(null);
    setSkyTowerPlayer(initialPlayer);
    setSkyTowerLog([]);
    setSkyTowerTurn(true);
  };

  return {
    skyTowerFloor,
    showSkyTowerModal,
    skyTowerEnemies,
    skyTowerBattleResult,
    skyTowerRewards,
    skyTowerPlayer,
    skyTowerLog,
    skyTowerTurn,
    openSkyTowerModal,
    handleSkyTowerAction,
    closeSkyTowerModal,
    setSkyTowerPlayer
  };
}
