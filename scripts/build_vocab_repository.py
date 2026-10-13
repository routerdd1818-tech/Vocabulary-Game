#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Builds the complete, lightweight graded vocabulary database for:
- Taiwan MOE/CEEC 7000 Words (Tiers 1-9, Level 1 to 6)
- TOEIC Core Business Vocabulary (Tiers 10-13)
- TOEFL Academic Vocabulary (Tier 14)
- GRE Master Vocabulary (Tier 15)

Outputs: js/vocab-repository.js
"""

import json
import base64
import re
import os

def main():
    print("Starting vocabulary repository compilation...")

    # 1. Load S2T Character Map
    char_map = {}
    with open('/tmp/s2t_table.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'): continue
            p = line.split('\t')
            if len(p) >= 2: char_map[p[0]] = p[1].split()[0]

    def to_traditional(text):
        return ''.join(char_map.get(ch, ch) for ch in text)

    def clean_pos(pos_str):
        if not pos_str: return 'n.'
        p = pos_str.strip().lower()
        if 'adv.' in p or p == 'adv' or 'ad.' in p or p == 'ad': return 'adv.'
        if 'adj.' in p or p == 'adj' or 'a.' in p or p == 'a': return 'adj.'
        if 'prep.' in p or p == 'prep': return 'prep.'
        if 'conj.' in p or p == 'conj': return 'conj.'
        if 'pron.' in p or p == 'pron': return 'pron.'
        if 'art.' in p or p == 'art': return 'art.'
        if 'vt.' in p or 'vi.' in p or 'v.' in p or p == 'v': return 'v.'
        if 'n.' in p or p == 'n': return 'n.'
        return 'n.'

    def clean_meaning(m_str):
        if not m_str: return ''
        m = re.sub(r'^[a-z\.\/\s]+\s*', '', m_str) # strip leading pos
        m = re.sub(r'[\r\n\t]+', ' ', m).strip()
        m = re.sub(r'\(.*?\)', '', m) # remove extra parens
        m = re.sub(r'\[.*?\]', '', m)
        m = re.sub(r'（.*?）', '', m)
        # Split into primary meanings
        parts = re.split(r'[；;，,\n]', m)
        valid = [p.strip() for p in parts if p.strip()]
        if not valid: return m.strip()[:16]
        res = '；'.join(valid[:2])
        return res.strip()[:18]

    # 2. Load tw_7000
    with open('/tmp/tw_blob.json') as f: d = json.load(f)
    tw_text = base64.b64decode(d['content']).decode('gbk', errors='ignore')
    tw_map = {}
    for line in tw_text.splitlines():
        line = line.strip().lstrip('*')
        if not line or line.startswith('大學') or len(line) <= 2: continue
        m = re.match(r'^([a-zA-Z\-\'\.\s]+?)\s+([a-z\.\/\s]+?)[\.\s]+(.*)$', line)
        if m:
            w = m.group(1).strip().lower()
            tw_map[w] = (clean_pos(m.group(2)), clean_meaning(m.group(3)))
        else:
            parts = line.split(None, 2)
            if len(parts) >= 2:
                tw_map[parts[0].strip().lower()] = ('n.', clean_meaning(parts[-1]))

    # 3. Load COCA
    coca_map = {}
    with open('/tmp/coca.txt', 'r', encoding='utf-8') as f:
        parts = f.read().split('————————————————')
        for p in parts:
            lines = [l.strip() for l in p.splitlines() if l.strip()]
            if not lines: continue
            w = lines[0].lower()
            def_line = ''
            pos_guess = 'n.'
            for l in lines[1:]:
                cleaned = re.sub(r'^[a-z]+\.\s*', '', l)
                if cleaned and not cleaned.startswith('('):
                    def_line = cleaned
                    pos_guess = clean_pos(l)
                    break
            if not def_line and len(lines) > 1: def_line = lines[1]
            coca_map[w] = (pos_guess, clean_meaning(to_traditional(def_line)))

    # Fallback translations for 7000
    fallback = {
        'a.m.': ('adv.', '上午；午前'), 'abbreviate': ('v.', '縮短；縮寫'), 'administrate': ('v.', '管理；支配'),
        'an': ('art.', '一個'), 'antonym': ('n.', '反義詞'), 'anytime': ('adv.', '在任何時候'),
        'arms': ('n.', '武器；軍火'), 'bin': ('n.', '箱子；容器'), 'brassiere': ('n.', '胸罩'),
        'café': ('n.', '咖啡館；小餐館'), 'celsius': ('n.', '攝氏溫度'), 'chopstick': ('n.', '筷子'),
        'colloquial': ('adj.', '口語的；白話的'), 'congresswoman': ('n.', '女性國會議員'), 'criterion': ('n.', '衡量標準'),
        'customs': ('n.', '海關；關稅'), 'destined': ('adj.', '注定的；預定的'), 'discouragement': ('n.', '氣餒；挫折'),
        'dumpling': ('n.', '水餃；餃子'), 'email': ('n.', '電子郵件'), 'fahrenheit': ('n.', '華氏溫度'),
        'fiancé': ('n.', '未婚夫'), 'fireproof': ('adj.', '防火的；耐火的'), 'firewoman': ('n.', '女消防員'),
        'firework': ('n.', '煙火'), 'fries': ('n.', '薯條'), 'guava': ('n.', '芭樂；番石榴'),
        'handicraft': ('n.', '手工藝品'), 'hippo': ('n.', '河馬'), 'hippopotamus': ('n.', '河馬'),
        'hyphen': ('n.', '連字號'), 'indigestion': ('n.', '消化不良'), 'inhabitant': ('n.', '居民；棲息者'),
        'insomnia': ('n.', '失眠'), 'intersection': ('n.', '十字路口；交集'), 'intimidate': ('v.', '威嚇；脅迫'),
        'janitor': ('n.', '守衛；工友'), 'jog': ('v.', '慢跑'), 'kitten': ('n.', '小貓'),
        'laundry': ('n.', '洗衣店；待洗衣物'), 'librarian': ('n.', '圖書館員'), 'likewise': ('adv.', '同樣地；照樣'),
        'lizard': ('n.', '蜥蜴'), 'lottery': ('n.', '彩券；樂透'), 'mall': ('n.', '購物中心'),
        'mango': ('n.', '芒果'), 'memo': ('n.', '備忘錄'), 'microwave': ('n.', '微波爐'),
        'miniature': ('adj.', '微型的；小型的'), 'motorcycle': ('n.', '摩托車'), 'nanny': ('n.', '保姆'),
        'napkin': ('n.', '餐巾紙'), 'notebook': ('n.', '筆記本'), 'oasis': ('n.', '綠洲'),
        'onion': ('n.', '洋蔥'), 'p.m.': ('adv.', '下午；午後'), 'panties': ('n.', '女用短內褲'),
        'pajamas': ('n.', '睡衣'), 'papaya': ('n.', '木瓜'), 'peacock': ('n.', '孔雀'),
        'penguin': ('n.', '企鵝'), 'pickup': ('n.', '皮卡車；接送'), 'pineapple': ('n.', '鳳梨'),
        'platform': ('n.', '月台；平台'), 'policewoman': ('n.', '女警察'), 'postbox': ('n.', '郵筒'),
        'preschool': ('n.', '幼兒園；學前班'), 'racket': ('n.', '球拍'), 'refreshment': ('n.', '茶點；提神物'),
        'salesperson': ('n.', '銷售員'), 'scooter': ('n.', '機車；滑板車'), 'seafood': ('n.', '海鮮'),
        'shorten': ('v.', '縮短'), 'sideboard': ('n.', '餐具櫃'), 'skateboard': ('n.', '滑板'),
        'smartphone': ('n.', '智慧型手機'), 'sneakers': ('n.', '運動鞋'), 'snowboard': ('n.', '單板滑雪板'),
        'snowman': ('n.', '雪人'), 'souvenir': ('n.', '紀念品'), 'soybean': ('n.', '大豆；黃豆'),
        'spaghetti': ('n.', '義大利麵'), 'strait': ('n.', '海峽'), 'supermarket': ('n.', '超級市場'),
        'sweatshirt': ('n.', '運動衫'), 'sunglasses': ('n.', '太陽眼鏡'), 'takeout': ('n.', '外帶餐點'),
        'tangerine': ('n.', '柑橘；橘子'), 'teammate': ('n.', '隊友'), 'toothpaste': ('n.', '牙膏'),
        'toothbrush': ('n.', '牙刷'), 'traffic': ('n.', '交通'), 'tsunami': ('n.', '海嘯'),
        'typhoon': ('n.', '颱風'), 'underpants': ('n.', '內褲'), 'underpass': ('n.', '地下道'),
        'underwear': ('n.', '內衣褲'), 'upgrade': ('v.', '升級；提升'), 'upload': ('v.', '上傳'),
        'vending': ('n.', '自動販賣'), 'videotape': ('n.', '錄影帶'), 'volleyball': ('n.', '排球'),
        'watermelon': ('n.', '西瓜'), 'website': ('n.', '網站'), 'wildfire': ('n.', '野火'),
        'windmill': ('n.', '風車'), 'worksheet': ('n.', '學習單；工作表'), 'workout': ('n.', '健身；鍛鍊'),
        'yawn': ('v.', '打哈欠'), 'yogurt': ('n.', '優格；酸奶'), 'zipper': ('n.', '拉鍊'),
        'isle': ('n.', '小島；島嶼'), 'kilogram': ('n.', '公斤'), 'kilometer': ('n.', '公里'),
        'koala': ('n.', '無尾熊'), 'ladybug': ('n.', '瓢蟲'), 'lollipop': ('n.', '棒棒糖'),
        'ma’am': ('n.', '女士；夫人'), 'mile': ('n.', '英哩'), 'mr.': ('n.', '先生'),
        'ms.': ('n.', '女士'), 'o.k.': ('adj.', '好；沒問題'), 'o’clock': ('adv.', '點鐘'),
        'obstinate': ('adj.', '頑固的；固執的'), 'ounce': ('n.', '盎司'), 'outwards': ('adv.', '向外地'),
        'petrol': ('n.', '汽油'), 'pickpocket': ('n.', '扒手'), 'postponement': ('n.', '延期；延遲'),
        'saleswoman': ('n.', '女店員'), 'seesaw': ('n.', '蹺蹺板'), 'shaver': ('n.', '刮鬍刀'),
        'sociable': ('adj.', '好交際的；友善的'), 'sorrowful': ('adj.', '悲傷的'),
        'sportswoman': ('n.', '女運動員'), 'stomachache': ('n.', '胃痛'), 'taxicab': ('n.', '計程車'),
        'teens': ('n.', '青少年時期'), 'toothache': ('n.', '牙痛'), 'tropic': ('n.', '熱帶地區'),
        'workbook': ('n.', '練習本；作業簿'), 'worst': ('adj.', '最壞的；最差的'), 'yourselves': ('pron.', '你們自己')
    }

    # 4. Load raw 7000 words
    with open('/tmp/raw_7000.json', 'r', encoding='utf-8') as f:
        raw_list = json.load(f)

    # Group 7000 words into Level 1..6
    levels = {1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
    for item in raw_list:
        w = item['Word'].strip()
        w_low = w.lower()
        lvl = int(item.get('Level', 1))
        # Authoritative POS from 7000 list
        pos_raw = item.get('PartsOfSpeech', ['n.'])[0]
        pos = clean_pos(pos_raw)
        
        # Meaning
        if w_low in tw_map and tw_map[w_low][1]:
            meaning = tw_map[w_low][1]
        elif w_low in fallback:
            pos = fallback[w_low][0]
            meaning = fallback[w_low][1]
        elif w_low in coca_map and coca_map[w_low][1]:
            meaning = coca_map[w_low][1]
        else:
            meaning = w_low

        levels[lvl].append((w, pos, meaning))

    print(f"7000 List parsed: Level 1={len(levels[1])}, Level 2={len(levels[2])}, Level 3={len(levels[3])}, Level 4={len(levels[4])}, Level 5={len(levels[5])}, Level 6={len(levels[6])}")

    # Map Levels to Tiers 1-9
    # Level 1 -> Tier 1 (front half), Tier 2 (back half)
    half1 = len(levels[1]) // 2
    tier1 = levels[1][:half1]
    tier2 = levels[1][half1:]

    # Level 2 -> Tier 3 (front half), Tier 4 (back half)
    half2 = len(levels[2]) // 2
    tier3 = levels[2][:half2]
    tier4 = levels[2][half2:]

    # Level 3 -> Tier 5 (front half), Tier 6 (back half)
    half3 = len(levels[3]) // 2
    tier5 = levels[3][:half3]
    tier6 = levels[3][half3:]

    # Level 4 -> Tier 7
    tier7 = levels[4]

    # Level 5 -> Tier 8
    tier8 = levels[5]

    # Level 6 -> Tier 9
    tier9 = levels[6]

    # 5. Load TOEIC (Tiers 10-13)
    toeic_raw = []
    with open('/tmp/toeic_zh_hant.csv', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or line.startswith('expression,'): continue
            parts = line.split(',')
            if len(parts) >= 3:
                w = parts[0].strip()
                m = clean_meaning(parts[2].strip())
                if w and m:
                    # lookup POS from coca or 7000
                    w_low = w.lower()
                    pos = 'n.'
                    if w_low in tw_map and tw_map[w_low][0]:
                        pos = tw_map[w_low][0]
                    elif w_low in coca_map and coca_map[w_low][0]:
                        pos = coca_map[w_low][0]
                    else:
                        if w.endswith('tion') or w.endswith('ment') or w.endswith('ence') or w.endswith('ance'): pos = 'n.'
                        elif w.endswith('ly'): pos = 'adv.'
                        elif w.endswith('ive') or w.endswith('able') or w.endswith('al') or w.endswith('ful'): pos = 'adj.'
                        elif w.endswith('ize') or w.endswith('ate'): pos = 'v.'
                    toeic_raw.append((w, pos, m))

    print(f"TOEIC words count: {len(toeic_raw)}")
    q = len(toeic_raw) // 4
    tier10 = toeic_raw[:q]
    tier11 = toeic_raw[q:q*2]
    tier12 = toeic_raw[q*2:q*3]
    tier13 = toeic_raw[q*3:]

    # 6. Load TOEFL (Tier 14)
    toefl_raw = []
    seen_toefl = set()
    with open('/tmp/toefl.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line: continue
            parts = re.split(r'\s{2,}', line)
            if len(parts) >= 3:
                w = parts[0].strip()
                if not re.match(r'^[a-zA-Z\-\']+$', w): continue
                w_low = w.lower()
                if w_low in seen_toefl: continue
                seen_toefl.add(w_low)
                pos = clean_pos(parts[2])
                m = clean_meaning(to_traditional(parts[-1]))
                toefl_raw.append((w, pos, m))

    print(f"TOEFL words count: {len(toefl_raw)}")
    tier14 = toefl_raw[:1500]

    # 7. Load GRE (Tier 15)
    gre_raw = []
    seen_gre = set()
    with open('/tmp/gre_redbook.csv', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line: continue
            parts = line.split(',', 1)
            if len(parts) == 2:
                w = parts[0].strip()
                if not re.match(r'^[a-zA-Z\-\']+$', w): continue
                w_low = w.lower()
                if w_low in seen_gre: continue
                seen_gre.add(w_low)
                m_part = parts[1].strip()
                pos = 'n.'
                pos_m = re.match(r'^([a-z\.\/]+)[\.\s]*(.*)$', m_part)
                if pos_m:
                    pos = clean_pos(pos_m.group(1))
                    m = clean_meaning(to_traditional(pos_m.group(2)))
                else:
                    m = clean_meaning(to_traditional(m_part))
                gre_raw.append((w, pos, m))

    print(f"GRE words count: {len(gre_raw)}")
    tier15 = gre_raw[:1500]

    repository = {
        1: tier1,
        2: tier2,
        3: tier3,
        4: tier4,
        5: tier5,
        6: tier6,
        7: tier7,
        8: tier8,
        9: tier9,
        10: tier10,
        11: tier11,
        12: tier12,
        13: tier13,
        14: tier14,
        15: tier15
    }

    total_words = sum(len(v) for v in repository.values())
    print(f"Total vocabulary items compiled into repository: {total_words}")

    # Generate js/vocab-repository.js
    output_path = 'js/vocab-repository.js'
    with open(output_path, 'w', encoding='utf-8') as out:
        out.write("/**\n")
        out.write(" * VOCABULARY REPOSITORY (Lightweight Graded 10,000+ Words Engine)\n")
        out.write(" * Scope:\n")
        out.write(" *  - Tier 1~9: Taiwan CEEC 7000 Words (Level 1 to 6)\n")
        out.write(" *  - Tier 10~13: TOEIC Core Business Vocabulary (550, 700, 860, 990)\n")
        out.write(" *  - Tier 14: TOEFL Academic High-Frequency Vocabulary\n")
        out.write(" *  - Tier 15: GRE Mythical Master Vocabulary\n")
        out.write(" * Entry format: [word, pos, meaning]\n")
        out.write(" */\n\n")
        out.write("window.VOCAB_REPOSITORY = {\n")
        for t in range(1, 16):
            items = repository[t]
            out.write(f'  "{t}": [\n')
            lines = []
            for item in items:
                w_escaped = item[0].replace('"', '\\"')
                p_escaped = item[1].replace('"', '\\"')
                m_escaped = item[2].replace('"', '\\"')
                lines.append(f'    ["{w_escaped}","{p_escaped}","{m_escaped}"]')
            out.write(',\n'.join(lines))
            out.write("\n  ]" + (",\n" if t < 15 else "\n"))
        out.write("};\n")

    print(f"Successfully generated {output_path} with size: {os.path.getsize(output_path)} bytes.")

if __name__ == '__main__':
    main()
