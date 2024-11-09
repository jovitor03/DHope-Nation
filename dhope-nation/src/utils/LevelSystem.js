const getLevel = (xp) => {
  let currentXP = 0;
  let increment = 100;
  let level = 1;

  while (xp >= currentXP) {
    currentXP += increment;
    if (xp < currentXP) {
      return level;
    }
    level++;
    increment += 50;
  }

  return level;
};

const getMaxXPForLevel = (level) => {
  let currentXP = 0;
  let increment = 100;

  for (let i = 1; i <= level; i++) {
    currentXP += increment;
    increment += 50;
  }

  return currentXP;
};

const getXPForNextLevel = (xp) => {
  const currentLevel = getLevel(xp); // Obtém o nível atual
  const currentXP = getMaxXPForLevel(currentLevel); // XP necessário até o nível atual
  const nextLevelXP = getMaxXPForLevel(currentLevel + 1); // XP necessário até o próximo nível

  return nextLevelXP - currentXP; // Diferença entre os dois
};

export default { getLevel, getMaxXPForLevel, getXPForNextLevel };
