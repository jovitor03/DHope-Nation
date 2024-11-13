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
  const currentLevel = getLevel(xp);
  const currentXP = getMaxXPForLevel(currentLevel);
  const nextLevelXP = getMaxXPForLevel(currentLevel + 1);

  return nextLevelXP - currentXP;
};

const LevelSystem = { getLevel, getMaxXPForLevel, getXPForNextLevel };

export default LevelSystem;
