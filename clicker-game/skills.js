const SKILLS = [
    // --- TIER 1 (Common - コモン) ---
    { id: 'atk_1', name: '筋力トレーニング', tier: 1, type: 'stat', desc: '攻撃力 +1', effect: (s) => s.attack += 1 },
    { id: 'atk_2', name: '鋭い石', tier: 1, type: 'stat', desc: '攻撃力 +2', effect: (s) => s.attack += 2 },
    { id: 'hp_1', name: '健康的な朝食', tier: 1, type: 'stat', desc: '最大HP +10', effect: (s) => s.maxHp += 10 },
    { id: 'hp_2', name: '革の鎧', tier: 1, type: 'stat', desc: '最大HP +20', effect: (s) => s.maxHp += 20 },
    { id: 'crit_1', name: 'お守り', tier: 1, type: 'stat', desc: 'クリティカル率 +1%', effect: (s) => s.critRate += 1 },
    { id: 'gold_1', name: '貯金箱', tier: 1, type: 'stat', desc: 'ゴールド獲得量 +10%', effect: (s) => s.goldMult += 0.1 },
    { id: 'xp_1', name: '学習ノート', tier: 1, type: 'stat', desc: '経験値獲得量 +10%', effect: (s) => s.xpMult += 0.1 },
    { id: 'auto_1', name: '新米の傭兵', tier: 1, type: 'auto', desc: '1 ダメージ/秒 (物理)', effect: (s) => s.dps += 1 },
    { id: 'auto_fire_1', name: '小さな火種', tier: 1, type: 'auto', desc: '1 ダメージ/秒 (火)', effect: (s) => s.dps += 1 },
    { id: 'auto_poison_1', name: '毒の滴', tier: 1, type: 'auto', desc: '1 ダメージ/秒 (毒)', effect: (s) => s.dps += 1 },

    // --- TIER 2 (Uncommon - アンコモン) ---
    { id: 'atk_3', name: '鉄の剣', tier: 2, type: 'stat', desc: '攻撃力 +5', effect: (s) => s.attack += 5 },
    { id: 'atk_4', name: '戦士の魂', tier: 2, type: 'stat', desc: '攻撃力 +8', effect: (s) => s.attack += 7 },
    { id: 'hp_3', name: '鎖帷子', tier: 2, type: 'stat', desc: '最大HP +50', effect: (s) => s.maxHp += 50 },
    { id: 'crit_2', name: '鷹の目', tier: 2, type: 'stat', desc: 'クリティカル率 +3%', effect: (s) => s.critRate += 3 },
    { id: 'cdmg_1', name: 'ヘビーヒッター', tier: 2, type: 'stat', desc: 'クリティカル倍率 +20%', effect: (s) => s.critDmg += 0.2 },
    { id: 'gold_2', name: '商人の鞄', tier: 2, type: 'stat', desc: 'ゴールド獲得量 +25%', effect: (s) => s.goldMult += 0.25 },
    { id: 'xp_2', name: '学者のメガネ', tier: 2, type: 'stat', desc: '経験値獲得量 +25%', effect: (s) => s.xpMult += 0.25 },
    { id: 'auto_2', name: '従騎士', tier: 2, type: 'auto', desc: '5 ダメージ/秒 (物理)', effect: (s) => s.dps += 5 },
    { id: 'auto_ice_1', name: '氷の精霊', tier: 2, type: 'auto', desc: '5 ダメージ/秒 (氷)', effect: (s) => s.dps += 5 },
    { id: 'auto_thunder_1', name: '静電気', tier: 2, type: 'auto', desc: '5 ダメージ/秒 (雷)', effect: (s) => s.dps += 5 },

    // --- TIER 3 (Rare - レア) ---
    { id: 'atk_5', name: '鋼の大剣', tier: 3, type: 'stat', desc: '攻撃力 +15', effect: (s) => s.attack += 15 },
    { id: 'atk_pct_1', name: 'バーサーカー', tier: 3, type: 'stat', desc: '攻撃力 +10%', effect: (s) => s.attackMult += 0.1 },
    { id: 'hp_4', name: 'プレートアーマー', tier: 3, type: 'stat', desc: '最大HP +150', effect: (s) => s.maxHp += 150 },
    { id: 'crit_3', name: '暗殺者の手袋', tier: 3, type: 'stat', desc: 'クリティカル率 +5%', effect: (s) => s.critRate += 5 },
    { id: 'cdmg_2', name: 'サベージストライク', tier: 3, type: 'stat', desc: 'クリティカル倍率 +50%', effect: (s) => s.critDmg += 0.5 },
    { id: 'gold_3', name: '黄金の像', tier: 3, type: 'stat', desc: 'ゴールド獲得量 +50%', effect: (s) => s.goldMult += 0.5 },
    { id: 'xp_3', name: '古代の書物', tier: 3, type: 'stat', desc: '経験値獲得量 +50%', effect: (s) => s.xpMult += 0.5 },
    { id: 'auto_3', name: '近衛騎士', tier: 3, type: 'auto', desc: '20 ダメージ/秒 (物理)', effect: (s) => s.dps += 20 },
    { id: 'auto_fire_2', name: 'ファイアボール', tier: 3, type: 'auto', desc: '25 ダメージ/秒 (火)', effect: (s) => s.dps += 25 },
    { id: 'auto_poison_2', name: '猛毒の刃', tier: 3, type: 'auto', desc: '25 ダメージ/秒 (毒)', effect: (s) => s.dps += 25 },

    // --- TIER 4 (Epic - エピック) ---
    { id: 'atk_6', name: '悪魔の剣', tier: 4, type: 'stat', desc: '攻撃力 +50', effect: (s) => s.attack += 50 },
    { id: 'atk_pct_2', name: 'ドラゴンの力', tier: 4, type: 'stat', desc: '攻撃力 +25%', effect: (s) => s.attackMult += 0.25 },
    { id: 'hp_5', name: 'ドラゴンの鱗', tier: 4, type: 'stat', desc: '最大HP +500', effect: (s) => s.maxHp += 500 },
    { id: 'crit_4', name: '全てを見通す目', tier: 4, type: 'stat', desc: 'クリティカル率 +10%', effect: (s) => s.critRate += 10 },
    { id: 'cdmg_3', name: '致命的な一撃', tier: 4, type: 'stat', desc: 'クリティカル倍率 +100%', effect: (s) => s.critDmg += 1.0 },
    { id: 'auto_4', name: '剣聖', tier: 4, type: 'auto', desc: '100 ダメージ/秒 (物理)', effect: (s) => s.dps += 100 },
    { id: 'auto_ice_2', name: 'ブリザード', tier: 4, type: 'auto', desc: '120 ダメージ/秒 (氷)', effect: (s) => s.dps += 120 },
    { id: 'auto_thunder_2', name: 'サンダーボルト', tier: 4, type: 'auto', desc: '120 ダメージ/秒 (雷)', effect: (s) => s.dps += 120 },
    { id: 'unique_1', name: 'ダブルストライク', tier: 4, type: 'unique', desc: '10%の確率で2回攻撃', effect: (s) => s.doubleStrikeChance += 0.1 },
    { id: 'unique_2', name: '吸血', tier: 4, type: 'unique', desc: 'クリックごとにHP1回復', effect: (s) => s.lifesteal += 1 },

    // --- TIER 5 (Legendary - レジェンダリー) ---
    { id: 'atk_7', name: 'エクスカリバー', tier: 5, type: 'stat', desc: '攻撃力 +200', effect: (s) => s.attack += 200 },
    { id: 'atk_pct_3', name: '神の力', tier: 5, type: 'stat', desc: '攻撃力 +100%', effect: (s) => s.attackMult += 1.0 },
    { id: 'crit_5', name: '心眼', tier: 5, type: 'stat', desc: 'クリティカル率 +25%', effect: (s) => s.critRate += 25 },
    { id: 'auto_5', name: '勇者パーティ', tier: 5, type: 'auto', desc: '500 ダメージ/秒', effect: (s) => s.dps += 500 },
    { id: 'auto_fire_3', name: 'メテオ', tier: 5, type: 'auto', desc: '600 ダメージ/秒 (全体)', effect: (s) => s.dps += 600 },
    { id: 'unique_3', name: '処刑人', tier: 5, type: 'unique', desc: '敵HP30%以下でダメージ2倍', effect: (s) => s.executioner = true },
    { id: 'unique_4', name: 'マイダスの手', tier: 5, type: 'unique', desc: 'ゴールド獲得量 3倍', effect: (s) => s.goldMult += 2.0 },
    { id: 'unique_5', name: '無限の刃', tier: 5, type: 'unique', desc: 'クリティカル倍率 +300%', effect: (s) => s.critDmg += 3.0 },
    { id: 'unique_6', name: 'タイムワープ', tier: 5, type: 'unique', desc: '自動攻撃速度 2倍', effect: (s) => s.dpsMult += 1.0 },
    { id: 'unique_7', name: '女神の祝福', tier: 5, type: 'unique', desc: '全ステータス +20%', effect: (s) => { s.attackMult += 0.2; s.maxHpMult += 0.2; s.dpsMult += 0.2; } },

    // --- EXTRA (Fillers - おまけ) ---
    { id: 'fill_1', name: 'ヨガ', tier: 1, type: 'stat', desc: '最大HP +5', effect: (s) => s.maxHp += 5 },
    { id: 'fill_2', name: '木の棒', tier: 1, type: 'stat', desc: '攻撃力 +1', effect: (s) => s.attack += 1 },
    { id: 'fill_3', name: '光る石', tier: 1, type: 'stat', desc: 'ゴールド +5%', effect: (s) => s.goldMult += 0.05 },
    { id: 'fill_4', name: 'ガラスの破片', tier: 1, type: 'stat', desc: 'クリティカル率 +1%', effect: (s) => s.critRate += 1 },

    // --- TIER 6 (Ultimate - アルティメット) ---
    { id: 'atk_ult', name: '英雄の遺産', tier: 6, type: 'stat', desc: '攻撃力 +1000', effect: (s) => s.attack += 1000 },
    { id: 'atk_pct_ult', name: 'リミットブレイク', tier: 6, type: 'stat', desc: '攻撃力 +300%', effect: (s) => s.attackMult += 3.0 },
    { id: 'auto_ult', name: '古代兵器', tier: 6, type: 'auto', desc: '1,500 ダメージ/秒', effect: (s) => s.dps += 1500 },
    { id: 'unique_ult', name: '完全回避', tier: 6, type: 'unique', desc: 'クリティカル率 +30%', effect: (s) => s.critRate += 30 },

    // --- TIER 7 (Chaos - カオス) ---
    { id: 'atk_chaos', name: '混沌の種子', tier: 7, type: 'stat', desc: '攻撃力 +2500', effect: (s) => s.attack += 2500 },
    { id: 'atk_pct_chaos', name: 'エントロピー', tier: 7, type: 'stat', desc: '攻撃力 +400%', effect: (s) => s.attackMult += 4.0 },
    { id: 'auto_chaos', name: 'ヴォイドウォーカー', tier: 7, type: 'auto', desc: '3,000 ダメージ/秒', effect: (s) => s.dps += 3000 },
    { id: 'unique_chaos', name: 'ソウルイーター', tier: 7, type: 'unique', desc: 'クリックごとにHP2%回復', effect: (s) => s.lifesteal += 20 },

    // --- TIER 8 (Mythic - ミシック) --- [Shifted from 6]
    { id: 'atk_8', name: '魔王の心臓', tier: 8, type: 'stat', desc: '攻撃力 +5000', effect: (s) => s.attack += 5000 },
    { id: 'atk_pct_4', name: '世界を喰らう者', tier: 8, type: 'stat', desc: '攻撃力 +500%', effect: (s) => s.attackMult += 5.0 },
    { id: 'crit_6', name: '第三の目', tier: 8, type: 'stat', desc: 'クリティカル率 +50%', effect: (s) => s.critRate += 50 },
    { id: 'auto_6', name: '機械化軍団', tier: 8, type: 'auto', desc: '5000 ダメージ/秒', effect: (s) => s.dps += 5000 },
    { id: 'unique_8', name: 'ブラッドサースト', tier: 8, type: 'unique', desc: 'クリックごとにHP5%回復', effect: (s) => s.lifesteal += 50 },
    { id: 'unique_9', name: '次元斬', tier: 8, type: 'unique', desc: 'クリティカル倍率 +1000%', effect: (s) => s.critDmg += 10.0 },

    // --- TIER 9 (God - ゴッド) --- [Shifted from 7]
    { id: 'atk_9', name: '創世記', tier: 9, type: 'stat', desc: '攻撃力 +99999', effect: (s) => s.attack += 99999 },
    { id: 'atk_pct_5', name: '全知全能', tier: 9, type: 'stat', desc: '全ステータス +5000%', effect: (s) => { s.attackMult += 50.0; s.maxHpMult += 50.0; s.dpsMult += 50.0; s.goldMult += 50.0; s.xpMult += 50.0; } },
    { id: 'auto_7', name: '神の雷槌', tier: 9, type: 'auto', desc: '100,000 ダメージ/秒', effect: (s) => s.dps += 100000 },
    { id: 'unique_10', name: '運命操作', tier: 9, type: 'unique', desc: 'クリティカル率 100% 固定', effect: (s) => s.critRate = 100 },
    { id: 'unique_11', name: '無限の富', tier: 9, type: 'unique', desc: 'ゴールド獲得量 100倍', effect: (s) => s.goldMult += 100.0 },
    { id: 'unique_12', name: 'アカシックレコード', tier: 9, type: 'unique', desc: '経験値獲得量 100倍', effect: (s) => s.xpMult += 100.0 },
];
