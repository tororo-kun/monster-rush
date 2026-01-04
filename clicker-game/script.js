// Game State
const state = {
    // Player Stats
    level: 1,
    currentXp: 0,
    nextLevelXp: 10,
    gold: 0,

    // Combat Stats (Base)
    stats: {
        attack: 1,
        attackMult: 1.0, // multiplier
        maxHp: 20,
        maxHpMult: 1.0,
        currentHp: 20,
        critRate: 5, // %
        critDmg: 1.5, // multiplier
        dps: 0,
        dpsMult: 1.0,
        goldMult: 1.0,
        xpMult: 1.0,
        doubleStrikeChance: 0, // 0.0 to 1.0
        lifesteal: 0,
        executioner: false
    },

    // Monster
    monster: {
        hp: 20,
        maxHp: 20,
        level: 1,
        name: 'スライム'
    },

    // System
    lastTick: Date.now(),
    maxUnlockedTier: 1, // Start only with Tier 1 (Common)
    rerollCount: 3 // Free rerolls per level
};

// Elements
const el = {
    monster: document.getElementById('monster-img'),
    monsterContainer: document.querySelector('.monster-container'),
    monsterVisual: document.querySelector('.monster-visual'),
    arena: document.getElementById('arena'),
    hpFill: document.getElementById('hp-bar-fill'),
    xpFill: document.getElementById('xp-bar-fill'),
    xpText: document.getElementById('xp-text'),
    lvl: document.getElementById('player-level'),
    gold: document.getElementById('player-gold'),
    dps: document.getElementById('player-dps'),
    atk: document.getElementById('player-attack'),
    crit: document.getElementById('player-crit'),
    modal: document.getElementById('skill-modal'),
    cardContainer: document.getElementById('skill-cards-container'),
    monsterName: document.getElementById('monster-name'),
    shopBtn: document.getElementById('shop-btn'),
    shopModal: document.getElementById('shop-modal'),
    shopItems: document.getElementById('shop-items-container'),
    closeShopBtn: document.getElementById('close-shop-btn'),
    rerollBtn: document.getElementById('reroll-btn'),
    rerollCountText: document.getElementById('reroll-count'),
    adOverlay: document.getElementById('ad-overlay'),
    adTimer: document.getElementById('ad-timer'),
    muteBtn: document.getElementById('mute-btn')
};

// --- Game Loop ---
function gameLoop() {
    const now = Date.now();
    const dt = (now - state.lastTick) / 1000;
    state.lastTick = now;

    // Auto Attack (DPS)
    if (state.stats.dps > 0) {
        const dpsDamage = (state.stats.dps * state.stats.dpsMult) * dt;
        applyDamage(dpsDamage, false);
    }

    requestAnimationFrame(gameLoop);
}

// --- Combat Logic ---
function applyDamage(amount, isClick) {
    // Calculate actual damage
    let finalDmg = amount;
    let isCrit = false;

    if (isClick) {
        // Critical Hit Check
        if (Math.random() * 100 < state.stats.critRate) {
            finalDmg *= state.stats.critDmg;
            isCrit = true;
        }

        // Executioner Check
        if (state.stats.executioner && (state.monster.hp / state.monster.maxHp) < 0.3) {
            finalDmg *= 2;
            isCrit = true; // Visual effect
        }

        // Double Strike Check
        if (Math.random() < state.stats.doubleStrikeChance) {
            // Handled by calling applyDamage twice recursively or just doubling logic here.
            // For simplicity, just x2 here and show "DOUBLE!"
            finalDmg *= 2;
            createFloatingText(el.monsterVisual, "DOUBLE!", "#ffff00");
        }

        // Lifesteal (Visual only as we dont track player HP in this simple version, but logic exists)
        // state.stats.currentHp = Math.min(state.stats.currentHp + state.stats.lifesteal, state.stats.maxHp);
    }

    state.monster.hp -= finalDmg;

    // Visuals
    if (isClick && amount > 0) {
        el.monsterVisual.classList.remove('shake');
        void el.monsterVisual.offsetWidth; // Trigger reflow
        el.monsterVisual.classList.add('shake');
        createFloatingText(el.monsterVisual, Math.floor(finalDmg), isCrit ? 'damage-crit' : 'damage-text');
    }

    // Death Check
    if (state.monster.hp <= 0) {
        killMonster();
    }

    updateUI();
}

function onClickMonster() {
    audio.startBGM(); // Ensure BGM starts on interaction
    audio.playHit();

    let dmg = state.stats.attack * state.stats.attackMult;
    applyDamage(dmg, true);
}

function killMonster() {
    audio.playKill();

    // Reward
    const goldDrop = Math.floor(state.monster.maxHp / 2 * state.stats.goldMult);
    const xpDrop = Math.floor(10 * Math.pow(1.1, state.monster.level - 1) * state.stats.xpMult);

    state.gold += goldDrop;
    gainXp(xpDrop);

    // Spawn New Monster
    state.monster.level++;

    // Scale Monster
    const scale = Math.pow(1.15, state.monster.level - 1);
    state.monster.maxHp = Math.floor(20 * scale);
    state.monster.hp = state.monster.maxHp;

    // Names & Images
    const monsters = [
        { name: 'スライム', img: 'monster_slime_dark_final.png' },
        { name: 'ゴブリン', img: 'monster_goblin_final.png' },
        { name: 'スケルトン', img: 'monster_skeleton_final.png' },
        // Fallback/Repeats for higher levels for now
        { name: 'オーク', img: 'monster_goblin_final.png' },
        { name: 'ゴースト', img: 'monster_skeleton_final.png' },
        { name: 'ドラゴン', img: 'monster_slime_dark_final.png' } // Temporary fallback
    ];

    const m = monsters[(state.monster.level - 1) % monsters.length];

    state.monster.name = `Lv${state.monster.level} ${m.name}`;
    el.monsterName.innerText = state.monster.name;
    el.monster.src = m.img;

    // Visual change (Hue rotate for variety)
    const hue = (state.monster.level * 30) % 360;
    el.monster.style.filter = `drop-shadow(0 0 10px rgba(0,0,0,0.5)) hue-rotate(${hue}deg)`;
}

function createFloatingText(target, text, styleClass) {
    const div = document.createElement('div');
    div.innerText = text;
    div.className = styleClass;
    if (styleClass === 'damage-text' || styleClass === 'damage-crit') {
        div.classList.add(styleClass);
    } else {
        div.className = 'damage-text'; // default
        div.style.fontSize = '24px';
        div.style.color = styleClass; // Allow hex color pass-through
    }

    // Randomize position slightly
    const rect = target.getBoundingClientRect();
    const offsetX = (Math.random() - 0.5) * 50;
    const offsetY = (Math.random() - 0.5) * 50;

    div.style.left = (rect.width / 2 + offsetX) + 'px';
    div.style.top = (rect.height / 2 + offsetY) + 'px';

    target.parentElement.appendChild(div);

    setTimeout(() => div.remove(), 800);
}

// --- Progression Logic ---
function gainXp(amount) {
    state.currentXp += amount;
    if (state.currentXp >= state.nextLevelXp) {
        levelUp();
    }
    updateUI();
}

function levelUp() {
    audio.playLevelUp();

    state.currentXp -= state.nextLevelXp;
    state.level++;
    state.nextLevelXp = Math.floor(state.nextLevelXp * 1.5);

    state.rerollCount = 3; // Reset free rerolls
    showSkillSelection();
}

// --- Skill Logic ---
function showSkillSelection() {
    el.modal.classList.remove('hidden');
    el.cardContainer.innerHTML = '';

    // Update Reroll UI
    if (state.rerollCount > 0) {
        el.rerollBtn.innerText = `スキルを再抽選 (残り: ${state.rerollCount})`;
        el.rerollBtn.classList.remove('ad-mode');
    } else {
        el.rerollBtn.innerText = `スキルを再抽選 (広告を見る)`;
        el.rerollBtn.classList.add('ad-mode');
    }
    el.rerollBtn.onclick = onRerollClick;

    // Pick 3 Random Skills
    const choices = [];
    for (let i = 0; i < 3; i++) {
        choices.push(getRandomSkill());
    }

    choices.forEach(skill => {
        const card = document.createElement('div');
        let rarityClass = 'common';
        if (skill.tier === 3) rarityClass = 'rare';
        if (skill.tier === 4) rarityClass = 'epic';
        if (skill.tier === 5) rarityClass = 'legendary';
        if (skill.tier === 6) rarityClass = 'ultimate';
        if (skill.tier === 7) rarityClass = 'chaos';
        if (skill.tier === 8) rarityClass = 'mythic';
        if (skill.tier === 9) rarityClass = 'god';

        card.className = `skill-card ${rarityClass}`;
        card.innerHTML = `
            <div class="skill-name">${skill.name}</div>
            <div class="skill-desc">${skill.desc}</div>
            <div class="skill-rarity">${rarityClass.toUpperCase()}</div>
        `;

        card.onclick = () => selectSkill(skill);
        el.cardContainer.appendChild(card);
    });
}

function onRerollClick() {
    if (state.rerollCount > 0) {
        // Free Reroll
        state.rerollCount--;
        showSkillSelection();
    } else {
        // Ad Reroll
        playAd(() => {
            showSkillSelection();
        });
    }
}

function playAd(callback) {
    el.adOverlay.classList.remove('hidden');
    let timeLeft = 3; // 3 seconds ad
    el.adTimer.innerText = timeLeft;

    const timer = setInterval(() => {
        timeLeft--;
        el.adTimer.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            el.adOverlay.classList.add('hidden');
            callback();
        }
    }, 1000);
}

function getRandomSkill() {
    // Weighted Rarity Logic adjusted by Max Unlocked Tier
    const rand = Math.random();
    let targetTier = 1;

    // Logic: Try to get higher tiers based on unlock status
    // Base chances
    if (state.maxUnlockedTier >= 5) {
        // Deep probability tree for high tiers
        if (state.maxUnlockedTier >= 9 && rand < 0.01) targetTier = 9; // 1% God
        else if (state.maxUnlockedTier >= 8 && rand < 0.03) targetTier = 8; // 3% Mythic
        else if (state.maxUnlockedTier >= 7 && rand < 0.08) targetTier = 7; // 8% Chaos
        else if (state.maxUnlockedTier >= 6 && rand < 0.15) targetTier = 6; // 15% Ultimate

        // Fallbacks for Legend and below
        else if (rand < 0.25) targetTier = 5; // 10-25% Legend
        else if (rand < 0.50) targetTier = 4; // Epic
        else if (rand < 0.75) targetTier = 3; // Rare
        else if (rand < 0.90) targetTier = 2; // Uncommon
        else targetTier = 1;

        // Ensure we don't pick a tier higher than unlocked if random rolled high but logic slipped (safety)
        if (targetTier > state.maxUnlockedTier) targetTier = state.maxUnlockedTier;
    } else if (state.maxUnlockedTier >= 4) {
        if (rand < 0.10) targetTier = 4;
        else if (rand < 0.35) targetTier = 3;
        else if (rand < 0.70) targetTier = 2;
    } else if (state.maxUnlockedTier >= 3) {
        if (rand < 0.15) targetTier = 3;
        else if (rand < 0.50) targetTier = 2;
    } else if (state.maxUnlockedTier >= 2) {
        if (rand < 0.30) targetTier = 2;
    }

    // Filter skills by tier
    let pool = SKILLS.filter(s => s.tier === targetTier);
    if (pool.length === 0) pool = SKILLS.filter(s => s.tier === 1); // Fallback

    // Bias for Attack skills (User Request)
    // Try to find skills that increase attack power
    const atkPool = pool.filter(s => s.id.includes('atk') || s.desc.includes('攻撃力') || s.desc.includes('ダメージ') || s.id.includes('dmg'));

    // 50% chance to force an attack skill if available
    if (atkPool.length > 0 && Math.random() < 0.5) {
        return atkPool[Math.floor(Math.random() * atkPool.length)];
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

function selectSkill(skill) {
    // Apply Effect
    skill.effect(state.stats);

    // Close Modal
    el.modal.classList.add('hidden');

    // Show confirmation text
    createFloatingText(el.monsterVisual, "スキル習得!", "#ffffff");
    updateUI();

    // Check for double level up
    if (state.currentXp >= state.nextLevelXp) {
        setTimeout(levelUp, 500);
    }
}

// --- Shop Logic ---
const SHOP_ITEMS = [
    { name: 'アンコモン解放', cost: 100, tier: 2, desc: 'アンコモン(緑)スキルが出現するようになる', type: 'tier' },
    { name: 'レア解放', cost: 1000, tier: 3, desc: 'レア(青)スキルが出現するようになる', type: 'tier' },
    { name: 'エピック解放', cost: 10000, tier: 4, desc: 'エピック(紫)スキルが出現するようになる', type: 'tier' },
    { name: 'レジェンダリー解放', cost: 50000, tier: 5, desc: 'レジェンダリー(金)スキルが出現するようになる', type: 'tier' },
    { name: 'アルティメット解放', cost: 150000, tier: 6, desc: 'アルティメット(銀)スキルが出現するようになる', type: 'tier' },
    { name: 'カオス解放', cost: 500000, tier: 7, desc: 'カオス(闇)スキルが出現するようになる', type: 'tier' },
    { name: 'ミシック解放', cost: 2000000, tier: 8, desc: 'ミシック(赤)スキルが出現するようになる', type: 'tier' },
    { name: 'ゴッド解放', cost: 100000000, tier: 9, desc: 'ゴッド(虹)スキルが出現するようになる', type: 'tier' },

    // The Game Crasher
    {
        name: 'デバッグモード(神)',
        cost: 999999999,
        type: 'effect',
        desc: '天変地異を引き起こす禁断の力 (攻撃力100万倍)',
        effect: () => {
            state.stats.attackMult *= 1000000;
            state.stats.dpsMult *= 1000000;
            state.stats.goldMult *= 1000000;
            alert('力が...溢れてくる...！！（ゲームバランスが崩壊しました）');
        }
    }
];

function openShop() {
    el.shopModal.classList.remove('hidden');
    renderShop();
}

function closeShop() {
    el.shopModal.classList.add('hidden');
}

function renderShop() {
    el.shopItems.innerHTML = '';

    SHOP_ITEMS.forEach(item => {
        // Check if already bought (for tiers)
        if (item.type === 'tier' && state.maxUnlockedTier >= item.tier) return;

        // Show all future upgrades so player knows what's coming (removed sequential check)
        // if (item.type === 'tier' && item.tier > state.maxUnlockedTier + 1) return;

        const card = document.createElement('div');
        card.className = 'shop-item';

        let costDisplay = item.cost.toLocaleString();

        card.innerHTML = `
            <div class="shop-name">${item.name}</div>
            <div class="shop-desc">${item.desc}</div>
            <div class="shop-cost">🪙 ${costDisplay}</div>
        `;
        card.onclick = () => buyShopItem(item);
        el.shopItems.appendChild(card);
    });
    if (el.shopItems.innerHTML === '') {
        el.shopItems.innerHTML = '<div style="color:white; padding:20px;">全て解放済みです！最強です！</div>';
    }
}

function buyShopItem(item) {
    if (state.gold >= item.cost) {
        state.gold -= item.cost;

        if (item.type === 'tier') {
            state.maxUnlockedTier = item.tier;
            alert(`${item.name} を購入しました！レベルアップが楽しみですね！`);
        } else if (item.type === 'effect') {
            item.effect();
        }

        renderShop();
        updateUI();
    } else {
        alert('ゴールドが足りません！');
    }
}

// --- UI Logic ---
function updateUI() {
    el.hpFill.style.width = (state.monster.hp / state.monster.maxHp * 100) + '%';
    el.xpFill.style.width = (state.currentXp / state.nextLevelXp * 100) + '%';
    el.xpText.innerText = `${Math.floor(state.currentXp)} / ${state.nextLevelXp}`;

    el.lvl.innerText = state.level;
    el.gold.innerText = state.gold;

    const dpsVal = (state.stats.dps * state.stats.dpsMult).toFixed(1);
    el.dps.innerText = dpsVal;

    const atkVal = (state.stats.attack * state.stats.attackMult).toFixed(1);
    el.atk.innerText = atkVal;

    el.crit.innerText = state.stats.critRate;

    el.shopBtn.innerText = `ショップ (所持金: ${state.gold})`;
}

// --- Persistence & Ranking ---
function saveGame() {
    const saveData = {
        state: state,
        timestamp: Date.now()
    };
    localStorage.setItem('monsterRushSave', JSON.stringify(saveData));

    // Update Ranking (High Score)
    updateRanking(state.level);

    createFloatingText(el.monsterVisual, "Data Saved!", "#00ff00");
}

function loadGame() {
    const json = localStorage.getItem('monsterRushSave');
    if (json) {
        try {
            const data = JSON.parse(json);
            // Merge loaded state into current state to ensure new fields exists
            // But for simple objects, we can just assign, careful with nested objects
            // Actually, deeply merging is safer, but let's do a shallow merge of top keys
            // and stats object specifically.

            // NOTE: We don't overwrite 'monster' entirely to avoid weird states, 
            // but level and name should be synced.

            Object.assign(state, data.state);

            // Re-apply stat multipliers if needed? 
            // No, the numbers are saved. But skills?
            // Wait! Skills are code logic. We don't save "which skills" are active because 
            // in this simple version, skills just modify numbers permanently.
            // So saving 'state.stats' is enough!

            updateUI();
            alert("セーブデータをロードしました！");
        } catch (e) {
            console.error("Save Load Error", e);
            alert("セーブデータの読み込みに失敗しました。");
        }
    }
}

function updateRanking(currentLevel) {
    let rankings = JSON.parse(localStorage.getItem('monsterRushRanking') || '[]');

    // Add current run if it's not already tracked or update if better?
    // Usually ranking tracks "Top 5 Runs".
    // We'll just push the current level and sort.
    // To avoid minimal spam, maybe only save if it's a "Finished" run? 
    // But this is endless. Let's just track "Personal Best".

    // actually, let's keep it simple: List of "Records"
    // We check if we already have an entry for "Current Run"? No session ID.
    // Let's just keep 'Highest Level Ever' and maybe 'Today's Best'.

    // Simple approach: Just a list of scores. We filter/sort unique?
    // Let's just add the current level to the list if it's high.
    // But we don't want to add entry for level 2, then 3, then 4...
    // We only save "Final Score" usually. 
    // Since we don't 'die', let's just show "Current Level" vs "All Time Best".

    // Let's store ONLY the MAX level ever reached.
    let maxLevel = localStorage.getItem('monsterRushMaxLevel') || 0;
    if (currentLevel > maxLevel) {
        localStorage.setItem('monsterRushMaxLevel', currentLevel);
    }
}

function showRanking() {
    el.rankingModal.classList.remove('hidden');
    const maxLevel = localStorage.getItem('monsterRushMaxLevel') || 0;
    const currentRun = state.level;

    // Mock World Ranking Calculation
    // Level 100 = Top 1%. Level 1 = Bottom 50%.
    // Formula: (1 - (1 / (Level/10 + 1))) * 100 percentile?
    // Let's make up titles.

    let rankTitle = "迷える子羊";
    if (maxLevel >= 10) rankTitle = "駆け出し冒険者";
    if (maxLevel >= 30) rankTitle = "熟練の戦士";
    if (maxLevel >= 50) rankTitle = "英雄";
    if (maxLevel >= 100) rankTitle = "伝説の勇者";
    if (maxLevel >= 200) rankTitle = "神殺し";
    if (maxLevel >= 500) rankTitle = "ゲームマスター";

    el.rankingList.innerHTML = `
        <div class="ranking-item gold">
            <span>👑 自己ベスト</span>
            <span>Lv. ${maxLevel}</span>
        </div>
        <div class="ranking-item">
            <span>⚔️ 現在の冒険</span>
            <span>Lv. ${currentRun}</span>
        </div>
        <hr style="border:1px solid #333; margin:10px 0;">
        <div style="text-align:center; color:#888; font-size:12px;">現在の世界ランク(推定)</div>
        <div style="text-align:center; color:#fff; font-size:24px; margin-top:5px; text-shadow:0 0 10px cyan;">
            ${rankTitle}
        </div>
    `;
}

// Init
el.monsterVisual.addEventListener('mousedown', onClickMonster);
el.shopBtn.onclick = openShop;
el.closeShopBtn.onclick = closeShop;
el.rankingBtn = document.getElementById('ranking-btn'); // Add to el
el.rankingModal = document.getElementById('ranking-modal'); // Add to el
el.rankingList = document.getElementById('ranking-list'); // Add to el
el.closeRankingBtn = document.getElementById('close-ranking-btn'); // Add to el
el.saveBtn = document.getElementById('save-btn'); // Add to el

el.rankingBtn.onclick = showRanking;
el.closeRankingBtn.onclick = () => el.rankingModal.classList.add('hidden');
el.saveBtn.onclick = saveGame;

// Auto Save every 60s
setInterval(saveGame, 60000);

// Try Load on Startup
if (localStorage.getItem('monsterRushSave')) {
    // Optional: Ask user? Nah, auto-load is friendly for web apps usually,
    // Or maybe just let them start fresh and load manually?
    // Let's Auto-load for seamless experience.
    loadGame();
}

// Keyboard Input
document.addEventListener('keydown', (e) => {
    // Don't attack if modals are open
    if (!el.modal.classList.contains('hidden') || !el.shopModal.classList.contains('hidden')) {
        return;
    }

    if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        onClickMonster();
        // Add a visual 'active' state to monster if desired, or just relies on the existing click visual
        el.monsterVisual.classList.add('active');
        setTimeout(() => el.monsterVisual.classList.remove('active'), 50);
    }
});

gameLoop();
updateUI();
