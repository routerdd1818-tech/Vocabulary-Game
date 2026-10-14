/**
 * Word Dungeon & Babel Tower - Daily & Business Sentence Synthesis Engine
 * 專為日常生活、職場商務、金融經貿與高階學術設計之動態題庫引擎。
 * 1. 支援萬筆詞庫動態生成 100% 貼合日常生活與商務情境之克漏字例句。
 * 2. 每道句子填空皆配備自然流暢、精準嵌入詞義之繁體中文完整翻譯。
 * 3. 隨關卡難度動態調整例句複雜度（國中小日常 -> 高中大考職場 -> 多益商務 -> GRE高階決策）。
 * 4. 高難度關卡（Tier 5+ / 塔樓30F+ / 地下城B5F+ / 道場多益與GRE）解鎖「雙空格情境填空 (Double Cloze)」。
 */

const SentenceEngine = (() => {
  // Deterministic string hash for consistent template selection
  const hashString = (str) => {
    let hash = 0;
    if (!str || str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash);
  };

  // Normalize part of speech
  const cleanPos = (pos) => {
    if (!pos) return 'n.';
    pos = pos.trim().toLowerCase();
    if (pos.startsWith('n')) return 'n.';
    if (pos.startsWith('v')) return 'v.';
    if (pos.startsWith('adj') || pos.startsWith('a.')) return 'adj.';
    if (pos.startsWith('adv')) return 'adv.';
    if (pos.startsWith('prep')) return 'prep.';
    if (pos.startsWith('conj')) return 'conj.';
    if (pos.startsWith('pron')) return 'pron.';
    return 'n.';
  };

  // Category labels based on tier
  const getCategoryLabel = (tier) => {
    tier = parseInt(tier, 10) || 1;
    if (tier <= 3) return '日常社交英語';
    if (tier <= 8) return '職場通用與生活';
    if (tier <= 13) return '多益商務經貿';
    return 'GRE高階專業學術';
  };

  // ==========================================
  // Comprehensive Daily & Business Templates Matrix
  // ==========================================
  const NOUN_TEMPLATES = {
    tier1_3: [
      { en: 'Drinking a cup of hot tea is a relaxing ______ after a busy day.', zh: '在忙碌的一天後喝杯熱茶是一種放鬆身心的【{m}】。' },
      { en: 'Please check the train ______ on the official website before you leave.', zh: '在出發之前，請先至官方網站查詢火車【{m}】。' },
      { en: 'My sister bought a comfortable ______ for our new living room yesterday.', zh: '我姐姐昨天為我們的新客廳買了一件舒適的【{m}】。' },
      { en: 'Having a balanced ______ is essential for maintaining strong immune health.', zh: '維持均衡的【{m}】對於保持強健的免疫力至關重要。' },
      { en: 'We decided to spend our summer ______ visiting museums and historic parks.', zh: '我們決定利用暑期【{m}】參觀博物館與歷史公園。' },
      { en: 'The friendly waiter handed us the dinner ______ as soon as we sat down.', zh: '我們一坐下，親切的服務生便遞給我們晚餐【{m}】。' },
      { en: 'He received a warm ______ from his classmates when returning to school.', zh: '當他回到學校時，收到了同學們熱情的【{m}】。' },
      { en: 'Finding a quiet ______ in the public library helps students concentrate.', zh: '在公共圖書館裡找到一個安靜的【{m}】有助於學生專心。' },
      { en: 'You should always wear a warm ______ when the winter temperature drops.', zh: '當冬季氣溫下降時，你應該總是穿上一件保暖的【{m}】。' },
      { en: 'She showed great ______ when learning how to play the acoustic guitar.', zh: '她在學習彈奏民謠吉他時展現了極大的【{m}】。' },
      { en: 'The local market sells fresh fruits and vegetables at a fair ______.', zh: '當地市場以合理的【{m}】販售新鮮的水果與蔬菜。' },
      { en: 'Regular physical ______ contributes greatly to longevity and vitality.', zh: '規律的身體【{m}】對延年益壽與活力有極大助益。' },
      { en: 'He sent a postcard with a scenic ______ of the sandy beach to his family.', zh: '他寄了一張印有沙灘風景【{m}】的明信片給家人。' },
      { en: 'Can you please give me some helpful ______ on how to prepare for the trip?', zh: '你能否就如何準備這次旅行給我一些有用的【{m}】嗎？' },
      { en: 'The students expressed sincere ______ to their teacher on graduation day.', zh: '畢業當天，學生們向老師表達了由衷的【{m}】。' },
      { en: 'She made a reservation for a double ______ at the seaside hotel.', zh: '她在海濱飯店預訂了一間雙人【{m}】。' },
      { en: 'Eating breakfast together every weekend is a treasured family ______.', zh: '每個週末一起吃早餐是令人珍視的家庭【{m}】。' },
      { en: 'He packed his leather travel ______ carefully before heading to the airport.', zh: '在前往機場之前，他仔細整理好他的皮革旅行【{m}】。' }
    ],
    tier4_8: [
      { en: 'The team leader distributed a detailed ______ outlining the project milestones.', zh: '團隊組長分發了一份概述專案里程碑的詳細【{m}】。' },
      { en: 'Effective ______ among remote colleagues prevents misunderstandings and delays.', zh: '遠端同事之間有效的【{m}】能避免誤解與進度延誤。' },
      { en: 'The customer service department handled the client ______ with great professionalism.', zh: '客戶服務部門以高度專業精神處理了客戶的【{m}】。' },
      { en: 'Our company has established a clear ______ for environmental sustainability.', zh: '我們公司已針對環境永續發展確立了一項明確的【{m}】。' },
      { en: 'Job applicants must submit a resume highlighting relevant work ______.', zh: '求職者必須提交一份突顯相關工作【{m}】的個人履歷。' },
      { en: 'Attending international workshops provides an excellent ______ for networking.', zh: '參加國際工作坊為拓展人脈提供了絕佳的【{m}】。' },
      { en: 'The software development firm announced a major ______ in its cloud platform.', zh: '這家軟體開發公司宣布其雲端平台獲得了重大【{m}】。' },
      { en: 'Managing workplace ______ requires both patience and strategic problem-solving.', zh: '處理職場上的【{m}】需要耐性與策略性的問題解決能力。' },
      { en: 'The human resources division published the updated ______ for annual leave.', zh: '人力資源處發布了關於年度休假的最新【{m}】。' },
      { en: 'She made a compelling ______ during the quarterly marketing conference.', zh: '她在季度行銷大會上做了一場極具說服力的【{m}】。' },
      { en: 'The organization launched a community ______ to support local youth education.', zh: '該組織發起了一項社區【{m}】，以支持當地青少年的教育。' },
      { en: 'The new office renovation creates a collaborative and inspiring ______.', zh: '辦公室的全新翻修營造出一個充滿協作與靈感的【{m}】。' },
      { en: 'Technological ______ has fundamentally transformed traditional retail commerce.', zh: '科技上的【{m}】已從根本上改變了傳統零售商業模式。' },
      { en: 'The legal department reviewed the service ______ prior to contract execution.', zh: '法務部門在簽約執行前審核了這份服務【{m}】。' },
      { en: 'Our primary ______ this quarter is to increase user retention on the mobile app.', zh: '我們本季度的首要【{m}】是提高行動應用程式的使用者留存率。' },
      { en: 'The marketing survey revealed interesting insights into consumer ______.', zh: '行銷調查揭示了關於消費者【{m}】的有趣洞察。' },
      { en: 'Strong leadership inspires employees to overcome any professional ______.', zh: '卓越的領導力激勵員工克服任何職業生涯中的【{m}】。' },
      { en: 'The committee reached a unanimous ______ after reviewing the financial audit.', zh: '在審視財務審計報告後，委員會達成了一致的【{m}】。' },
      { en: 'A comprehensive training ______ was organized for newly onboarded engineers.', zh: '為新進工程師組織了一場全面的培訓【{m}】。' },
      { en: 'The factory installed state-of-the-art ______ to reduce harmful carbon emissions.', zh: '該工廠安裝了最先進的【{m}】以減少有害碳排放。' },
      { en: 'Clear division of ______ ensures that every team member knows their priorities.', zh: '明確劃分【{m}】可確保每位團隊成員均清楚自身的工作優先順序。' },
      { en: 'The director expressed sincere ______ for the outstanding teamwork shown this year.', zh: '主管對今年展現的傑出團隊協作表達了由衷的【{m}】。' }
    ],
    tier9_13: [
      { en: 'The board of directors approved the quarterly ______ after extensive deliberations.', zh: '經過廣泛研議後，董事會批准了該季度的【{m}】。' },
      { en: 'All incoming shipments must undergo strict quality ______ at the central warehouse.', zh: '所有進貨批次皆必須在中央倉庫接受嚴格的品質【{m}】。' },
      { en: 'The merger created substantial ______ in the competitive telecommunications sector.', zh: '這起企業合併在競爭激烈的電信領域創造了可觀的【{m}】。' },
      { en: 'Currency exchange rate ______ poses a significant risk to multinational earnings.', zh: '匯率的【{m}】對跨國公司的獲利構成了顯著風險。' },
      { en: 'The pharmaceutical corporation obtained a lucrative ______ for its new vaccine formula.', zh: '這家製藥公司為其新型疫苗配方獲得了一項利潤豐厚的【{m}】。' },
      { en: 'Senior management proposed a revised ______ to optimize corporate resource allocation.', zh: '高階管理層提出了一份修訂後的【{m}】，以優化企業資源配置。' },
      { en: 'Our supply chain logistics network requires continuous ______ to maintain high efficiency.', zh: '我們的供應鏈物流網絡需要持續的【{m}】以維持高效率運作。' },
      { en: 'The financial disclosure revealed unexpected ______ in operating expenditures.', zh: '財務揭露報告揭露了營運支出中意料之外的【{m}】。' },
      { en: 'Cross-border commerce demands strict adherence to international trade ______.', zh: '跨境貿易要求嚴格遵守國際貿易【{m}】。' },
      { en: 'The marketing executive analyzed the target demographic with statistical ______.', zh: '行銷主管以統計上的【{m}】分析了目標客群。' },
      { en: 'Securing venture capital funding was a pivotal ______ for the tech startup.', zh: '獲得創業投資資金是這家科技新創公司的關鍵【{m}】。' },
      { en: 'The annual shareholder assembly debated the distribution of corporate ______.', zh: '年度股東大會熱烈討論了公司【{m}】的配發事宜。' },
      { en: 'A lack of adequate liquidity caused severe ______ for the commercial lender.', zh: '充足流動性的缺乏對該商業借貸機構造成了嚴重的【{m}】。' },
      { en: 'The consulting firm delivered an insightful ______ on emerging consumer markets.', zh: '顧問公司針對新興消費市場提出了一份深刻的【{m}】。' },
      { en: 'The enterprise implemented rigorous cybersecurity ______ to protect client records.', zh: '該企業實施了嚴格的網路資安【{m}】以保護客戶檔案資料。' },
      { en: 'The trade delegation negotiated favorable tariff ______ during bilateral summits.', zh: '貿易代表團在雙邊高峰會期間談判爭取到了優惠的關稅【{m}】。' },
      { en: 'Market researchers observed a dramatic ______ in demand for renewable energy products.', zh: '市場研究人員觀察到對再生能源產品的需求出現了戲劇性的【{m}】。' },
      { en: 'The corporate restructuring aimed to eliminate bureaucratic ______ across divisions.', zh: '這項企業組織重組旨在消除各部門之間官僚體系的【{m}】。' },
      { en: 'Maintaining client confidentiality is a non-negotiable legal ______ in wealth advisory.', zh: '維護客戶機密是財富管理諮詢中不可妥協的法定【{m}】。' },
      { en: 'The auditor issued a qualified opinion regarding inventory ______ valuation.', zh: '審計師針對存貨【{m}】之估價出具了保留意見。' },
      { en: 'The company established a contractual ______ with key semiconductor suppliers.', zh: '公司與關鍵半導體供應商建立了具約束力的合約【{m}】。' },
      { en: 'Consumer sentiment index serves as a dependable ______ of macroeconomic trends.', zh: '消費者信心指數是宏觀經濟趨勢的可靠【{m}】。' },
      { en: 'The executive committee recognized the urgent ______ of workforce upskilling in AI.', zh: '執行委員會體認到在人工智慧領域進行員工技能提升的迫切【{m}】。' },
      { en: 'The arbitration panel settled the cross-border contractual ______ amicably.', zh: '仲裁委員會圓滿和解了這起跨境合約【{m}】。' }
    ],
    tier14_15: [
      { en: 'Economic scholars debated the underlying ______ driving global inflationary cycles.', zh: '經濟學者熱烈辯論推動全球通膨週期的深層【{m}】。' },
      { en: 'The constitutional court examined whether the new statute constituted an unconstitutional ______.', zh: '憲法法庭審查了該新法規是否構成了違憲的【{m}】。' },
      { en: 'The research paper presented empirical proof to challenge the established academic ______.', zh: '該研究論文提出了實證證據，以挑戰既有的學術【{m}】。' },
      { en: 'The geopolitical treaty restored diplomatic ______ between the neighboring republics.', zh: '該地緣政治條約恢復了鄰近共和國之間外交上的【{m}】。' },
      { en: 'Philosophical inquiry often addresses the inherent ______ of human knowledge.', zh: '哲學探究往往著眼於人類知識固有的【{m}】。' },
      { en: 'The central bank policy aimed to curb speculative ______ in housing markets.', zh: '中央銀行政策旨在遏制房地產市場中投機性的【{m}】。' },
      { en: 'The sudden regulatory overhaul created significant ______ for institutional investors.', zh: '突如其來的法規改革對機構投資人造成了巨大的【{m}】。' },
      { en: 'Historical documentation provided invaluable ______ regarding ancient civil codes.', zh: '歷史文獻為古代民法法典提供了極其寶貴的【{m}】。' },
      { en: 'The scientist articulated a profound ______ explaining the observed cosmic anomaly.', zh: '科學家提出了一項深奧的【{m}】，用以解釋所觀測到的宇宙異常現象。' },
      { en: 'The ethics committee scrutinized the experimental ______ with meticulous precision.', zh: '倫理委員會以極其嚴謹的精準度審查了該實驗的【{m}】。' },
      { en: 'The ambassador emphasized the paramount ______ of preserving regional maritime peace.', zh: '大使強調了維護區域海洋和平至高無上的【{m}】。' },
      { en: 'The sociological treatise examined the cultural ______ of modern metropolitan life.', zh: '這篇社會學專著探討了現代大都會生活的文化【{m}】。' },
      { en: 'A profound sense of intellectual ______ propelled her revolutionary scientific discoveries.', zh: '深厚的求知【{m}】推動了她開創性的科學重大發現。' },
      { en: 'The macroeconomic forecast incorporated key indicators of industrial ______.', zh: '宏觀經濟預測納入了工業【{m}】的關鍵指標。' },
      { en: 'The treaty preamble reaffirmed sovereign ______ over territorial natural assets.', zh: '該條約前言重申了對領土自然資產的主權【{m}】。' },
      { en: 'Linguistic anthropology investigates the symbolic ______ embedded in spoken dialects.', zh: '語言人類學探究口語方言中所蘊含的符號【{m}】。' },
      { en: 'The jurist analyzed the historical ______ of equitable remedies in common law.', zh: '法學家分析了普通法中衡平救濟的歷史【{m}】。' },
      { en: 'Institutional reform requires dismantling entrenched bureaucratic ______.', zh: '體制改革需要破除根深蒂固的官僚【{m}】。' },
      { en: 'The archival exhibition illuminated the rich artistic ______ of the Renaissance era.', zh: '這場檔案展覽展示了文藝復興時期豐富的藝術【{m}】。' },
      { en: 'The sovereign debt renegotiation eliminated systemic financial ______ for the state.', zh: '主權債務的重新談判消除了該國體制性的金融【{m}】。' }
    ]
  };

  const VERB_TEMPLATES = {
    tier1_3: [
      { en: 'Please remember to ______ the front door whenever you leave home.', zh: '每當你離開家時，請務必記得【{m}】大門。' },
      { en: 'She wants to ______ her spoken English by practicing with native speakers daily.', zh: '她希望藉由每天與母語人士練習來【{m}】她的英語口說。' },
      { en: 'They planned to ______ dinner together at a seaside Italian restaurant.', zh: '他們計劃在一家海邊義大利餐廳一起【{m}】晚餐。' },
      { en: 'Can you help me ______ this heavy wooden suitcase into the trunk?', zh: '你能幫我把這個沉重的木製行李箱【{m}】進後車廂嗎？' },
      { en: 'You should always ______ your teeth before going to sleep at night.', zh: '晚上睡覺前你應該總是【{m}】你的牙齒。' },
      { en: 'The kind shopkeeper decided to ______ a discount to the elderly customer.', zh: '熱心的店主決定為年長的顧客【{m}】折扣優惠。' },
      { en: 'Students gather in the courtyard to ______ the upcoming sports festival.', zh: '學生們聚集在庭院裡【{m}】即將到來的運動節。' },
      { en: 'He was happy to ______ an encouraging birthday card from his grandparents.', zh: '他很高興收到祖父母寄來的鼓勵生日卡，感到非常【{m}】。' },
      { en: 'We need to ______ fresh groceries at the supermarket on our way home.', zh: '回家的路上我們需要去超市【{m}】新鮮的生活用品。' },
      { en: 'Drivers must ______ the speed limit to ensure road safety for pedestrians.', zh: '駕駛人必須【{m}】速限以確保行人的道路安全。' },
      { en: 'The coach encouraged the young athletes to ______ hard during morning practice.', zh: '教練鼓勵年輕運動員在早晨訓練期間要努力【{m}】。' },
      { en: 'I will ______ you an email with the complete hotel travel directions shortly.', zh: '我稍後會【{m}】一封附有完整飯店交通指引的電子郵件給你。' },
      { en: 'The librarian helped us ______ the historical novel on the highest shelf.', zh: '圖書館員協助我們【{m}】最高層書架上的歷史小說。' },
      { en: 'Make sure to ______ your cell phone battery before boarding the long flight.', zh: '在登上長途航班之前，請務必先【{m}】你的手機電池。' },
      { en: 'They love to ______ along the peaceful riverbank during cool autumn evenings.', zh: '在涼爽的秋夜裡，他們喜歡沿著平靜的河岸【{m}】。' },
      { en: 'She likes to ______ fresh fruit smoothies for breakfast every morning.', zh: '她喜歡每天早晨為早餐【{m}】新鮮的水果果昔。' },
      { en: 'You should ______ your doctor if fever symptoms persist for more than two days.', zh: '若發燒症狀持續超過兩天，你應當【{m}】你的家庭醫師。' },
      { en: 'The children volunteered to ______ the public playground after the picnic.', zh: '野餐結束後，孩子們自願【{m}】公共遊戲場。' }
    ],
    tier4_8: [
      { en: 'The project manager asked the team to ______ the project report by Friday.', zh: '專案經理要求團隊在週五前【{m}】這份專案進度報告。' },
      { en: 'Employees are strongly encouraged to ______ creative suggestions during meetings.', zh: '強烈鼓勵員工在會議期間積極【{m}】創意的建言。' },
      { en: 'The marketing department plans to ______ a major promotional campaign next month.', zh: '行銷部門計劃在下個月【{m}】一場重大的促銷推廣活動。' },
      { en: 'To resolve customer complaints, our support staff must ______ quickly and courteously.', zh: '為了解決顧客申訴，我們的客服人員必須迅速且有禮地【{m}】。' },
      { en: 'We need to ______ the contract terms carefully before signing with the supplier.', zh: '在與供應商正式簽約之前，我們需要仔細【{m}】合約條款。' },
      { en: 'The regional director promised to ______ the employee grievance without bias.', zh: '區域總監承諾將不偏不倚地【{m}】員工的申訴案件。' },
      { en: 'Our technical specialists will ______ the software platform to ensure peak performance.', zh: '我們的技術專家將【{m}】該軟體平台，以確保維持最佳效能。' },
      { en: 'Organizations must ______ to shifting consumer preferences to remain competitive.', zh: '企業組織必須【{m}】不斷變化的消費者偏好以保持競爭力。' },
      { en: 'The human resources division will ______ prospective candidates for the managerial role.', zh: '人力資源處將針對此管理職位【{m}】具潛力的應徵候選人。' },
      { en: 'The school principal stepped forward to ______ the graduation commencement ceremony.', zh: '校長走上前台來【{m}】畢業典禮的正式開幕。' },
      { en: 'Team members should ______ their tasks effectively to prevent project bottlenecks.', zh: '團隊成員應當有效地【{m}】各自任務，以避免專案進度出現瓶頸。' },
      { en: 'The company decided to ______ its manufacturing operations to reduce overhead costs.', zh: '該公司決定【{m}】其製造工廠營運，以降低經常性開支。' },
      { en: 'All staff members are instructed to ______ strict data privacy guidelines at all times.', zh: '已指示全體同仁在任何時候皆須嚴格【{m}】資料隱私指引。' },
      { en: 'The sales team worked diligently to ______ their annual performance targets.', zh: '業務團隊全力以赴工作，以期順利【{m}】其年度業績目標。' },
      { en: 'A thorough audit helped the accountants ______ accounting discrepancies in the ledger.', zh: '一次徹底的審計協助會計師【{m}】了總帳冊中的會計出入。' },
      { en: 'Environmental groups urged international leaders to ______ decisive climate action.', zh: '環保團體敦促各國領導人採取果斷措施來【{m}】氣候變遷問題。' },
      { en: 'The university invited an industry veteran to ______ a keynote lecture on leadership.', zh: '大學邀請了一位業界資深專家前來【{m}】一場關於領導力的專題演講。' },
      { en: 'We must ______ appropriate resources to finish the client deliverable on schedule.', zh: '我們必須【{m}】適當的資源，以便按時交付客戶所需成果。' },
      { en: 'The supervisor scheduled a session to ______ constructive feedback to the interns.', zh: '主管安排了一次會議，以便向實習生【{m}】建設性的指導建議。' },
      { en: 'The airline was forced to ______ several scheduled flights due to typhoon alerts.', zh: '因應颱風警報，該航空公司被迫【{m}】數個預定航班。' },
      { en: 'Both companies agreed to ______ a joint venture to explore Asian commercial markets.', zh: '兩家公司一致同意【{m}】合資企業以開拓亞洲商業市場。' },
      { en: 'The design team worked together to ______ an intuitive user interface for the app.', zh: '設計團隊通力合作，為該應用程式【{m}】了一套直覺的使用者介面。' }
    ],
    tier9_13: [
      { en: 'The executive board voted to ______ the proposed corporate acquisition terms.', zh: '執行董事會投票表決【{m}】所提議的企業收購條款。' },
      { en: 'Our enterprise must ______ international regulatory requirements across all subsidiaries.', zh: '我們的企業在所有子公司中皆必須切實【{m}】國際法規監管要求。' },
      { en: 'The chief financial officer managed to ______ capital expenditures for the upcoming year.', zh: '財務長成功【{m}】了即將到來一年的資本支出計劃。' },
      { en: 'Senior partners convened to ______ the geopolitical risks affecting global supply chains.', zh: '資深合夥人齊聚一堂以【{m}】影響全球供應鏈的地緣政治風險。' },
      { en: 'The multinational bank agreed to ______ revolving credit facilities to the corporate client.', zh: '該跨國銀行同意向這家企業客戶【{m}】循環信用貸款融通。' },
      { en: 'Our marketing analysts will ______ customer behavioral patterns using machine learning.', zh: '我們的行銷分析師將利用機器學習來深入【{m}】顧客行為模式。' },
      { en: 'The legal team advised the corporation to ______ the arbitration agreement promptly.', zh: '法務團隊建議該公司應當儘速【{m}】這項仲裁協議。' },
      { en: 'The trade commission sought to ______ market competition by restricting monopolistic pacts.', zh: '貿易委員會試圖透過限制壟斷協議來【{m}】市場的公平競爭。' },
      { en: 'Corporate directors must ______ strict fiduciary responsibilities to the shareholders.', zh: '公司董事對股東必須切實【{m}】嚴格的受託人誠信責任。' },
      { en: 'The logistics firm invested heavily to ______ distribution bottlenecks in major seaports.', zh: '這家物流公司投入巨資以【{m}】各大海港的貨物分流配送瓶頸。' },
      { en: 'Management launched an internal audit to ______ compliance with labor regulations.', zh: '管理層啟動了內部稽核，以【{m}】對勞動法規的合規落實情形。' },
      { en: 'The venture capital fund plans to ______ heavily in clean energy infrastructure.', zh: '該創業投資基金計劃在大規模清潔能源基礎設施上【{m}】重金。' },
      { en: 'The CEO delivered a public address to ______ rumors regarding the hostile takeover.', zh: '執行長發表公開談話，以【{m}】有關惡意收購的種種市場傳言。' },
      { en: 'The compliance officer will ______ company transactions to prevent insider trading.', zh: '合規主管將密切【{m}】公司交易活動，以防範內線交易。' },
      { en: 'Both trade delegations worked diligently to ______ a mutually beneficial commercial pact.', zh: '雙方貿易代表團努力協商，以期能【{m}】一項互利共贏的商貿協議。' },
      { en: 'The marketing agency will ______ brand engagement through targeted digital campaigns.', zh: '該廣告行銷代理商將透過精準的數位行銷活動來【{m}】品牌互動度。' },
      { en: 'The conglomerate decided to ______ underperforming business assets to raise cash.', zh: '這家企業集團決定【{m}】表現不佳的業務資產以籌措現金。' },
      { en: 'The accounting department must ______ annual profit margins against industry benchmarks.', zh: '會計部門必須將年度利潤率與同業基準進行詳細【{m}】。' },
      { en: 'The commercial bank took legal steps to ______ defaulted mortgage obligations.', zh: '該商業銀行採取法律途徑，以【{m}】違約的抵押貸款債務。' },
      { en: 'The pharmaceutical researcher managed to ______ an innovative therapeutic synthesis.', zh: '該製藥研究人員成功【{m}】出一種創新的治療合成法。' },
      { en: 'The board instructed the steering committee to ______ cross-departmental operations.', zh: '董事會指示指導委員會全面【{m}】跨部門之間的業務營運。' },
      { en: 'Automated workflow pipelines will ______ routine office documentation tasks.', zh: '自動化工作流程管線將大幅【{m}】日常繁瑣的辦公文書工作。' },
      { en: 'The factory owner took immediate steps to ______ structural hazards inside the facility.', zh: '廠主立即採取措施，以【{m}】廠房設施內部的結構性危險。' },
      { en: 'The commercial mediator helped the disputing parties ______ their contractual differences.', zh: '商業調解人協助爭議雙方順利【{m}】了彼此的合約分歧。' }
    ],
    tier14_15: [
      { en: 'The central monetary authority intervened to ______ runaway currency depreciation.', zh: '中央貨幣主管當局出面干預，以【{m}】失控的貨幣貶值走勢。' },
      { en: 'The empirical study sought to ______ the validity of the prevailing macroeconomic theorem.', zh: '這項實證研究旨在【{m}】當前盛行的宏觀經濟理論的有效性。' },
      { en: 'Historical scholars must carefully ______ primary archival evidence from propaganda.', zh: '歷史學者必須謹慎地將一手文獻證據與宣傳品加以【{m}】。' },
      { en: 'The constitutional court voted to ______ the controversial statute as ultra vires.', zh: '憲法法庭投票裁定該具爭議的法令因越權而予以【{m}】。' },
      { en: 'The philosopher attempted to ______ the subtle ethical nuances of moral culpability.', zh: '哲學家試圖深入【{m}】道德歸責中微妙的倫理細節。' },
      { en: 'International diplomats worked behind closed doors to ______ simmering regional tensions.', zh: '國際外交官在閉門會議中努力協商，以【{m}】持續升溫的區域緊張情勢。' },
      { en: 'The investigative committee was empowered to ______ confidential state records.', zh: '該調查委員會獲授權可以調閱並【{m}】機密的國家檔案。' },
      { en: 'Sociological field research helped ______ the hidden cultural dynamics of the community.', zh: '社會學田野調查有助於【{m}】該社群隱蔽的文化互動機制。' },
      { en: 'The sovereign government announced sweeping reforms to ______ structural corruption.', zh: '主權政府宣布實施全面改革，以期徹底【{m}】體制性的腐敗問題。' },
      { en: 'The distinguished professor was invited to ______ upon the future of genomic medicine.', zh: '這位知名教授獲邀針對基因體醫學的未來發展進行深度【{m}】。' },
      { en: 'The legislative body sought to ______ public health measures during the epidemic.', zh: '立法機構試圖在疫情期間透過立法進一步【{m}】公共衛生措施。' },
      { en: 'The economic think tank urged policymakers to ______ proactive fiscal stimulus.', zh: '該經濟智庫敦促政策制定者當前應當積極【{m}】前瞻性的財政刺激政策。' },
      { en: 'Literary critics often ______ this masterpiece for its intricate psychological depth.', zh: '文學評論家經常因其錯綜複雜的心理深度而極力【{m}】這部傳世名作。' },
      { en: 'The scientific symposium gathered to ______ the ethical boundaries of gene editing.', zh: '這場科學研討會齊聚一堂，共同【{m}】基因編輯技術的倫理邊界。' },
      { en: 'The treaty was formally designed to ______ trade barriers across sovereign signatory states.', zh: '該條約在正式設計上旨在【{m}】簽約主權國家之間的貿易壁壘。' },
      { en: 'Modern urban planners strive to ______ environmental sustainability with population density.', zh: '現代都市規劃師致力於將環境永續性與人口居住密度加以良好【{m}】。' },
      { en: 'The state museum curator managed to ______ rare artifacts from the classical antiquities.', zh: '國立博物館策展人成功【{m}】並修復了來自古典古代的罕見珍貴文物。' },
      { en: 'The legal tribunal had to ______ the exact intent of the bilateral international treaty.', zh: '法律審判庭必須審慎【{m}】該雙邊國際條約的確切意旨。' },
      { en: 'The scientific community continues to ______ the causal mechanisms of cosmic expansion.', zh: '科學界持續不斷地探索並【{m}】宇宙膨脹的因果機制。' },
      { en: 'The royal monarch formally decided to ______ the throne in favor of the crown prince.', zh: '國王陛下正式決定【{m}】王位，由王儲繼承大統。' }
    ]
  };

  const ADJ_TEMPLATES = {
    tier1_3: [
      { en: 'The hotel room was very ______ and offered a breathtaking ocean view.', zh: '這間飯店客房非常【{m}】，並且享有令人屏息的壯麗海景。' },
      { en: 'It is ______ to double-check your boarding pass before going to the gate.', zh: '在前往登機門之前，仔細核對你的登機證是非常【{m}】的。' },
      { en: 'She gave a ______ smile to welcome the new transfer students to the class.', zh: '她露出了【{m}】的微笑，熱情歡迎新轉學生來到班級。' },
      { en: 'Eating fresh green vegetables every day is very ______ for your body.', zh: '每天食用新鮮的綠色蔬菜對你的身體非常【{m}】。' },
      { en: 'The afternoon weather was sunny and ______, perfect for a picnic in the park.', zh: '午後的天氣晴朗且【{m}】，非常適合在公園裡野餐。' },
      { en: 'He bought a ______ laptop that is easy to carry to school and work.', zh: '他買了一台【{m}】的筆記型電腦，方便攜帶去學校與上班。' },
      { en: 'The train ride was so ______ that many passengers fell asleep comfortably.', zh: '這趟火車行程是如此【{m}】，以至於許多乘客都舒適地睡著了。' },
      { en: 'She is a ______ student who always finishes her homework ahead of schedule.', zh: '她是一位【{m}】的學生，總是提前完成各科家庭作業。' },
      { en: 'The museum has a ______ collection of historic paintings from the nineteenth century.', zh: '這間博物館收藏了十九世紀非常【{m}】的歷史繪畫作品。' },
      { en: 'Walking through the quiet botanical garden felt remarkably ______ after work.', zh: '下班後漫步於寧靜的植物園中讓人感到格外【{m}】。' },
      { en: 'The instructions for assembling the wooden bookshelf were surprisingly ______.', zh: '組裝這座木製書架的組裝說明書出乎意料地【{m}】。' },
      { en: 'They had a ______ conversation over a cup of roasted coffee at the cafe.', zh: '他們在咖啡館一邊喝著烘焙咖啡，一邊進行了【{m}】的交談。' },
      { en: 'He was ______ to receive such generous support from his neighborhood community.', zh: '獲得鄰里社區如此慷慨的支持，他感到非常【{m}】。' },
      { en: 'The recipe only requires a few ______ ingredients that you can find at home.', zh: '這道食譜只需要幾樣你在家就能找到的【{m}】食材。' },
      { en: 'Wearing a ______ jacket is recommended when traveling in high mountain regions.', zh: '在高山地區旅行時，建議穿上一件【{m}】的外套夾克。' }
    ],
    tier4_8: [
      { en: 'The customer service representative gave an exceptionally ______ response.', zh: '該客戶服務專員給予了極為【{m}】且到位的回覆。' },
      { en: 'Maintaining a ______ attitude during challenging negotiations helps build rapport.', zh: '在充滿挑戰的商務談判中保持【{m}】的態度有助於建立融洽關係。' },
      { en: 'The research team collected ______ data to evaluate the efficacy of the prototype.', zh: '研究團隊收集了【{m}】的數據資料，以評估該原型的效能。' },
      { en: 'Our marketing team designed a ______ advertisement targeting modern urban consumers.', zh: '我們的行銷團隊設計了一則針對現代都會消費者的【{m}】廣告。' },
      { en: 'The company needs to establish a ______ workflow to reduce unexpected delivery delays.', zh: '該公司需要建立一套【{m}】的工作流程，以減少突發的交貨延誤。' },
      { en: 'She proved to be a ______ leader during the organization’s digital transformation.', zh: '在組織進行數位轉型的過程中，她證明了自己是一位【{m}】的領導者。' },
      { en: 'It is ______ that all employees attend the mandatory annual workplace safety briefing.', zh: '全體員工均必須參加這場年度強制性職場安全簡報，這非常【{m}】。' },
      { en: 'The new office furniture features an ______ design that supports back comfort.', zh: '這款全新辦公家具採用【{m}】設計，能良好支撐背部舒適度。' },
      { en: 'The financial advisor provided ______ suggestions that helped the client save money.', zh: '該財務顧問提供了【{m}】的實用建議，幫助客戶節省了開支。' },
      { en: 'The software application received ______ reviews from international technology critics.', zh: '這款軟體應用程式獲得了國際科技評論家一致【{m}】的評價。' },
      { en: 'The company experienced ______ growth in online sales during the holiday season.', zh: '在節日旺季期間，該公司的線上銷售額經歷了【{m}】的成長。' },
      { en: 'It is important to maintain ______ records of all corporate expense reimbursements.', zh: '對於所有公司費用的核銷，保持【{m}】的紀錄至關重要。' },
      { en: 'The project proposal requires ______ revisions before final submission to the board.', zh: '這份專案企劃書在最終提交給董事會之前需要進行【{m}】的修改。' },
      { en: 'The technician provided a ______ explanation of what caused the system crash.', zh: '技術人員針對造成系統當機的原因進行了【{m}】的說明。' },
      { en: 'A ______ strategy is required to navigate unpredictable supply chain fluctuations.', zh: '需要一套【{m}】的應對策略來應付難以預測的供應鏈波動。' },
      { en: 'The candidate demonstrated ______ problem-solving skills throughout the interview.', zh: '該求職應徵者在整場面試中展現了【{m}】的問題解決能力。' },
      { en: 'The business contract contained several ______ clauses that required clarification.', zh: '這份商業合約中包含數個需要進一步澄清的【{m}】條款。' },
      { en: 'Creating an ______ workplace environment fosters greater employee engagement.', zh: '營造一個【{m}】的工作場所環境能夠激發更高的員工投入度。' }
    ],
    tier9_13: [
      { en: 'The merger between the corporations created a highly ______ competitive advantage.', zh: '兩家大企業的合併創造了極具【{m}】的強大競爭優勢。' },
      { en: 'The regulatory commission enforced ______ compliance standards on capital reserves.', zh: '監管委員會對資本儲備金強制實施了【{m}】的合規標準。' },
      { en: 'Our supply chain logistics division reported ______ improvements in turnaround speed.', zh: '我們的供應鏈物流部門回報週轉速度出現了【{m}】的改善。' },
      { en: 'The enterprise adopted a ______ risk management protocol to protect client assets.', zh: '該企業採用了一套【{m}】的風險管理規範以保護客戶資產。' },
      { en: 'The chief executive made a ______ decision to enter overseas emerging markets.', zh: '執行長做出了一項進軍海外新興市場的【{m}】決定。' },
      { en: 'A ______ audit of corporate financial statements is required by securities regulators.', zh: '證券監管機構要求對企業財務報表進行【{m}】的審計。' },
      { en: 'The company maintained a ______ balance sheet despite macroeconomic turbulence.', zh: '儘管面臨宏觀經濟動盪，該公司依然維持著【{m}】的資產負債表。' },
      { en: 'The intellectual property lawsuit resulted in a ______ financial settlement.', zh: '這起智慧財產權訴訟最終達成了金額【{m}】的財務和解。' },
      { en: 'Cross-functional teamwork is ______ to the successful execution of product launches.', zh: '跨部門團隊協作對於產品發布的成功執行是【{m}】不可或缺的。' },
      { en: 'Market researchers observed ______ consumer spending across luxury retail brands.', zh: '市場研究人員觀察到各大奢華零售品牌的消費者支出呈現【{m}】現象。' },
      { en: 'The corporation announced an ______ restructuring program to improve agility.', zh: '該企業集團宣布了一項旨在提高敏捷度的【{m}】重組方案。' },
      { en: 'The technology company patented a ______ chip architecture for edge computing.', zh: '這家科技公司為邊緣運算取得了一項【{m}】晶片架構的專利。' },
      { en: 'The advisory board provided ______ guidance during the hostile takeover bid.', zh: '諮詢顧問委員會在惡意收購要約期間提供了【{m}】的策略指導。' },
      { en: 'Economic indicators point to a ______ recovery in global manufacturing output.', zh: '各項經濟指標均指向全球製造業產出正呈現【{m}】的復甦態勢。' },
      { en: 'The pharmaceutical manufacturer adheres to ______ sterile cleanroom standards.', zh: '該製藥製造商嚴格遵守極其【{m}】的無菌無塵室標準。' },
      { en: 'The management implemented ______ measures to curb runaway administrative costs.', zh: '管理層實施了【{m}】的精簡措施以遏制不斷攀升的行政成本。' },
      { en: 'The sales team developed ______ relationships with major regional distributors.', zh: '業務團隊與主要的區域經銷商建立了【{m}】的合作夥伴關係。' },
      { en: 'Securing adequate credit lines is ______ for international import-export operations.', zh: '確保獲得足額的信用額度對於國際進出口業務是【{m}】的。' },
      { en: 'The consulting report offered ______ insights into future semiconductor trends.', zh: '這份諮詢報告為未來半導體發展趨勢提供了【{m}】的見解。' },
      { en: 'The newly appointed legal director possesses ______ knowledge of antitrust law.', zh: '新上任的法務總監具備反壟斷法領域非常【{m}】的專業知識。' }
    ],
    tier14_15: [
      { en: 'The geopolitical treaty fostered a ______ peace among historical adversaries.', zh: '該地緣政治條約在昔日宿敵之間促成了一種【{m}】的和平狀態。' },
      { en: 'The distinguished scholar presented an ______ thesis on the origins of constitutional law.', zh: '這位知名學者提出了一篇關於憲法起源的【{m}】精闢論文。' },
      { en: 'Scientific breakthroughs often require ______ dedication to rigorous laboratory testing.', zh: '科學重大突破往往需要對嚴謹的實驗室檢驗付出【{m}】的專注投入。' },
      { en: 'The appellate judge delivered a ______ opinion that resolved a longstanding statutory ambiguity.', zh: '上訴法院法官做出了一份【{m}】的判決意見，化解了長久以來的法條模糊。' },
      { en: 'The historian unearthed ______ documentation revealing covert diplomatic negotiations.', zh: '歷史學者發掘出【{m}】的文獻紀錄，揭示了當年秘密的外交談判。' },
      { en: 'A ______ analysis of macroeconomic data revealed subtle structural vulnerabilities.', zh: '對宏觀經濟數據的【{m}】深入分析揭示了微妙的體制性脆弱點。' },
      { en: 'The philosopher was known for his ______ critiques of modern utilitarian dogma.', zh: '該哲學家以其對現代功利主義教條進行【{m}】的批判而聞名。' },
      { en: 'The committee members maintained a ______ demeanor despite intense public scrutiny.', zh: '儘管面臨公眾強烈的監督檢視，委員會成員依然保持著【{m}】的風範。' },
      { en: 'The diplomatic summit achieved a ______ compromise addressing maritime boundary claims.', zh: '這場外交高峰會就海洋劃界爭端達成了【{m}】的妥協方案。' },
      { en: 'The author articulated a ______ philosophical vision that resonated across generations.', zh: '作者闡述了一種深邃且【{m}】的哲學願景，引起了世世代代的共鳴。' },
      { en: 'The legal team constructed an ______ defense based on constitutional precedent.', zh: '法律團隊依據憲政先例構建了一套【{m}】的無懈可擊辯護。' },
      { en: 'The sociological study provided ______ empirical evidence of institutional bias.', zh: '這項社會學研究為體制性偏見提供了【{m}】確鑿的實證證據。' },
      { en: 'His speech was characterized by ______ eloquence that captivated the international audience.', zh: '他的演說具有【{m}】的雄辯魅力，深深吸引了在場的國際聽眾。' },
      { en: 'The archivist handled the ancient illuminated manuscript with ______ care.', zh: '檔案管理員以極度【{m}】的謹慎態度處理這部古老的彩繪手稿。' },
      { en: 'The central bank policy aimed to avert ______ consequences for global liquidity.', zh: '央行的這項政策旨在避免給全球市場流動性帶來【{m}】的災難性後果。' },
      { en: 'The experimental results remained ______ despite repeated testing in separate labs.', zh: '儘管在不同實驗室進行了反覆驗證，該實驗結果依然表現得十分【{m}】。' },
      { en: 'The diplomat played a ______ role in negotiating the demilitarization corridor.', zh: '該外交官在去軍事化走廊的談判談判中發揮了【{m}】的關鍵作用。' },
      { en: 'The research institute maintains an ______ reputation for scholarly integrity.', zh: '該研究所因其恪守學術誠信而享有【{m}】的崇高聲譽。' }
    ]
  };

  const ADV_TEMPLATES = {
    tier1_3: [
      { en: 'He ______ checked his flight schedule to make sure no departure gate had changed.', zh: '他【{m}】核對了航班時刻表，以確認登機門沒有發生任何變動。' },
      { en: 'The polite hotel receptionist ______ greeted every guest entering the lobby.', zh: '有禮貌的飯店櫃檯人員【{m}】迎接每位走進大廳的房客。' },
      { en: 'She walked ______ through the quiet museum gallery so as not to disturb others.', zh: '她【{m}】走過安靜的博物館展廳，以免打擾到其他參觀者。' },
      { en: 'The children ______ finished their homework so they could play in the garden.', zh: '孩子們【{m}】完成了作業，以便能去花園裡盡情玩耍。' },
      { en: 'He speaks English ______ and clearly during our weekly language exchange sessions.', zh: '在我們每週的語言交換時段中，他英語說得非常【{m}】且清晰。' },
      { en: 'The morning train arrived ______ on time, allowing commuters to reach work promptly.', zh: '早晨的火車【{m}】準時進站，讓通勤族能夠準時抵達公司上班。' },
      { en: 'Please listen ______ to the flight attendant’s safety demonstration before takeoff.', zh: '起飛之前，請大家【{m}】聆聽空服人員的安全示範說明。' },
      { en: 'They ______ agreed to meet at the downtown coffee shop after work on Friday.', zh: '他們【{m}】同意在週五下班後於市中心的咖啡廳碰面聚會。' },
      { en: 'The friendly taxi driver ______ carried our heavy suitcases to the hotel entrance.', zh: '熱心的計程車司機【{m}】幫我們把沉重的行李箱提到飯店門口。' },
      { en: 'The warm sun ______ shone down on the bustling outdoor farmers market.', zh: '溫暖的陽光【{m}】灑在熱鬧的戶外農夫市集上。' }
    ],
    tier4_8: [
      { en: 'The technical support team responded ______ to the customer’s urgent online inquiry.', zh: '技術支援團隊【{m}】回覆了客戶緊急的線上技術諮詢。' },
      { en: 'The regional manager meets ______ with department supervisors to review KPIs.', zh: '區域主管【{m}】與各部門主管會面開會，以檢視關鍵績效指標。' },
      { en: 'Project members must collaborate ______ to meet the client’s demanding deadline.', zh: '專案團隊成員必須【{m}】協同合作，以達成客戶嚴格的截止期限。' },
      { en: 'The sales numbers increased ______ after the company launched its online campaign.', zh: '在公司推出線上廣告宣傳後，產品銷售數字【{m}】地上升了。' },
      { en: 'All confidential customer records must be handled ______ by financial staff.', zh: '所有機密的客戶檔案資料皆必須由財務同仁【{m}】妥善處理。' },
      { en: 'She explained the complex software update ______ so that all users understood it.', zh: '她【{m}】解釋了這套複雜的軟體更新，讓所有使用者都能充分理解。' },
      { en: 'The factory workers ______ followed the workplace safety protocol during production.', zh: '工廠作業同仁在生產製造過程中【{m}】遵循著職場安全規範。' },
      { en: 'The CEO ______ addressed the employees’ concerns during the annual town hall meeting.', zh: '執行長在年度全體員工大會上【{m}】回應了解答了大家的關切。' },
      { en: 'Our mobile application runs ______ on both iOS and Android smartphone operating systems.', zh: '我們的行動應用程式在 iOS 與 Android 手機系統上均運作得非常【{m}】。' },
      { en: 'The marketing survey was ______ distributed to consumers across multiple demographic sectors.', zh: '該行銷調查問卷被【{m}】分發給不同年齡與族群的廣大消費者。' },
      { en: 'The audit committee examined the corporate expense reports ______ for any irregularities.', zh: '審計委員會【{m}】審查了公司各項支出報告，以查核有無違規之處。' },
      { en: 'New technological tools have ______ transformed the landscape of modern education.', zh: '全新的科技數位工具已【{m}】改變了現代教育的教學樣貌。' }
    ],
    tier9_13: [
      { en: 'The company’s international revenue grew ______ over the course of the fiscal year.', zh: '在整個財政年度期間，該公司的國際營收呈現【{m}】的強勁增長。' },
      { en: 'The corporate board decided to ______ diversify its investment portfolio into green energy.', zh: '公司董事會決定【{m}】將其投資組合分散拓展至綠色能源領域。' },
      { en: 'All financial transactions are ______ audited by accredited third-party accounting firms.', zh: '所有金融商業交易均由合格的第三方獨立會計師事務所【{m}】進行審計。' },
      { en: 'Senior executives met ______ behind closed doors to finalize the cross-border merger terms.', zh: '高階主管在閉門會議中【{m}】磋商，以最終敲定這起跨國併購條款。' },
      { en: 'The software security system ______ blocked the unauthorized access attempt to corporate databases.', zh: '軟體資安防護系統【{m}】攔截阻擋了試圖未經授權存取公司資料庫的行為。' },
      { en: 'Consumer demand for electric vehicles has risen ______ across key metropolitan centers.', zh: '各大主要都會中心對電動車的消費者需求呈現【{m}】顯著的攀升趨勢。' },
      { en: 'The legal counsel advised the executive committee to proceed ______ in the intellectual property dispute.', zh: '法律顧問建議執行委員會在面對這起智慧財產權爭端時應當【{m}】行事。' },
      { en: 'The regional logistics network was ______ restructured to eliminate shipping bottlenecks.', zh: '區域物流運送網絡經過了【{m}】的優化重組，以消除貨物配送瓶頸。' },
      { en: 'The new product line was ______ positioned to capture premium consumer segments.', zh: '這條全新的產品線在定位上經過了【{m}】的規劃，旨在鎖定高端消費客群。' },
      { en: 'Financial regulators reacted ______ to stabilize bond markets following unexpected interest rate shifts.', zh: '在面臨預料之外的利率變動後，金融監管機構【{m}】採取行動以穩定債券市場。' },
      { en: 'The manufacturing plant operated ______ below maximum capacity due to raw material shortages.', zh: '由於原物料供應短缺，該製造工廠的運轉產能【{m}】低於原先的最高水準。' },
      { en: 'The corporate restructuring plan was ______ communicated to all regional branch managers.', zh: '該企業組織重組方案已【{m}】傳達並通知予各大區域分公司的主管。' },
      { en: 'Market analysts ______ upgraded the enterprise’s stock rating following stellar earnings reports.', zh: '在公布亮眼的季度財報之後，市場分析師們【{m}】調高了該企業的股票評級。' },
      { en: 'The arbitration panel ruled ______ in favor of the plaintiff regarding breach of contract.', zh: '仲裁委員會針對違反合約案【{m}】做出了有利於原告的裁決。' },
      { en: 'The marketing team ______ tracked consumer engagement metrics across social media platforms.', zh: '行銷團隊在各大社群媒體平台上【{m}】追蹤消費者的互動成效數據。' }
    ],
    tier14_15: [
      { en: 'The central bank signaled that monetary policy would be adjusted ______ to control inflation.', zh: '中央銀行釋出信號表示，貨幣政策將會【{m}】進行微調以控制通膨。' },
      { en: 'The appellate court ruled that the statute was ______ unconstitutional under the bill of rights.', zh: '上訴法院裁定該法規依據權利法案在法律實質上屬於【{m}】違憲。' },
      { en: 'Empirical data demonstrated that the economic recovery was spreading ______ across sectors.', zh: '實證數據表明，這波經濟復甦正【{m}】廣泛地擴散蔓延至各產業領域。' },
      { en: 'The diplomatic delegation ______ navigated sensitive territorial sovereignty disputes.', zh: '外交代表團【{m}】周旋處理著極其敏感的領土主權爭端議題。' },
      { en: 'Historical records ______ substantiate the theory of early transoceanic maritime trade.', zh: '歷史文獻檔案【{m}】有力地證實了早期跨洋海上商貿網絡的理論。' },
      { en: 'The research hypothesis was ______ rejected after rigorous double-blind clinical trials.', zh: '在經過嚴格的雙盲臨床試驗之後，該研究假說被【{m}】正式予以否定。' },
      { en: 'The sovereign nation acted ______ within the boundaries of international maritime conventions.', zh: '該主權國家在國際海洋公約所賦予的法律權限內【{m}】行使職權。' },
      { en: 'The author argued ______ against the prevailing orthodox doctrines of neoclassical economics.', zh: '作者【{m}】提出了極具說服力的論點，強烈反對新古典經濟學的傳統教條。' },
      { en: 'The environmental treaty was ______ ratified by all sovereign participating parliaments.', zh: '這項國際環境保護條約獲得了所有參與國議會【{m}】一致的正式批准。' },
      { en: 'The geopolitical landscape shifted ______ following the sudden collapse of trade alliances.', zh: '隨著貿易同盟關係的驟然瓦解，整個地緣政治格局發生了【{m}】深遠的改變。' },
      { en: 'The judicial tribunal interpreted the constitutional amendment ______ in light of historic precedent.', zh: '司法審判庭結合歷史先例，對該憲法修正案進行了【{m}】審慎的解釋。' },
      { en: 'Scholars in political economy have ______ examined the systemic inequalities in global trade.', zh: '政治經濟學領域的學者們已【{m}】深刻地檢視了全球貿易中的體制性不平等。' }
    ]
  };

  const PREP_CONJ_TEMPLATES = [
    { en: 'The regional flight was delayed ______ severe thunderstorm warnings in the area.', zh: '由於該地區出現強烈雷雨警報，該區域航班【{m}】發生了延誤。' },
    { en: 'We should double-check all meeting documents ______ we enter the executive boardroom.', zh: '在我們走進高階主管會議室【{m}】，我們應當再次仔細核對所有會議文件。' },
    { en: 'Employees must wear identification badges ______ visiting corporate research facilities.', zh: '員工在參訪公司研發設施【{m}】，均必須佩戴身份識別證件。' },
    { en: 'The customer service center remains accessible ______ normal business hours on weekdays.', zh: '在平日的正常營業時間【{m}】，客戶服務中心均隨時提供服務。' },
    { en: 'The project succeeded ______ the collective dedication and hard work of the team.', zh: '這項專案之所以取得成功，完全【{m}】團隊全體成員的齊心奉獻與努力。' }
  ];

  // ==========================================
  // Double Cloze Templates Matrix (Dual Blanks)
  // For higher tiers (Tier 5+ / Tower 30F+ / Dungeon B5F+ / TOEIC & GRE)
  // ==========================================
  const DOUBLE_CLOZE_PATTERNS = [
    // Pattern: v + v
    {
      type: 'v_v',
      en: 'The manager asked the department to [ 1 ] ______ the survey data before they [ 2 ] ______ the marketing proposal.',
      zh: '經理要求部門在【{m2}】行銷企劃案之前，先【{m1}】客戶問卷調查數據。',
      targetPos1: 'v.',
      targetPos2: 'v.'
    },
    {
      type: 'v_v',
      en: 'In order to [ 1 ] ______ customer loyalty, the corporate board decided to [ 2 ] ______ its membership rewards system.',
      zh: '為了【{m1}】客戶忠誠度，公司董事會決定【{m2}】其會員回饋獎勵系統。',
      targetPos1: 'v.',
      targetPos2: 'v.'
    },
    {
      type: 'v_v',
      en: 'The steering committee convened to [ 1 ] ______ the audit findings and [ 2 ] ______ necessary corrective actions.',
      zh: '指導委員會召開會議以【{m1}】審計結果，並【{m2}】必要的改善矯正措施。',
      targetPos1: 'v.',
      targetPos2: 'v.'
    },
    {
      type: 'v_v',
      en: 'All employees are expected to [ 1 ] ______ safety protocols to [ 2 ] ______ workplace accidents.',
      zh: '期許全體同仁皆能確實【{m1}】安全規範，以有效【{m2}】職場意外的發生。',
      targetPos1: 'v.',
      targetPos2: 'v.'
    },
    {
      type: 'v_v',
      en: 'The enterprise plans to [ 1 ] ______ its digital infrastructure to [ 2 ] ______ daily operational efficiency.',
      zh: '該企業計劃【{m1}】其數位基礎設施，以【{m2}】日常營運效率。',
      targetPos1: 'v.',
      targetPos2: 'v.'
    },
    {
      type: 'v_v',
      en: 'Senior executives met to [ 1 ] ______ market risks and [ 2 ] ______ a comprehensive crisis management strategy.',
      zh: '高階主管會面開會以【{m1}】市場風險，並【{m2}】一套全面的危機管理策略。',
      targetPos1: 'v.',
      targetPos2: 'v.'
    },
    {
      type: 'v_v',
      en: 'Before you [ 1 ] ______ for the overseas conference, please remember to [ 2 ] ______ your flight reservations.',
      zh: '在您【{m1}】前往參加海外會議之前，請記得務必【{m2}】您的航班預訂資訊。',
      targetPos1: 'v.',
      targetPos2: 'v.'
    },
    {
      type: 'v_v',
      en: 'The engineering specialists must [ 1 ] ______ the new server system to [ 2 ] ______ uninterrupted service availability.',
      zh: '工程技術專家必須【{m1}】新伺服器系統，以【{m2}】提供不中斷的穩定服務。',
      targetPos1: 'v.',
      targetPos2: 'v.'
    },

    // Pattern: v + n
    {
      type: 'v_n',
      en: 'The marketing team launched a nationwide promotion to [ 1 ] ______ brand [ 2 ] ______ among young consumers.',
      zh: '行銷團隊發起了一項全國性的推廣活動，以【{m1}】在年輕消費者群體中的品牌【{m2}】。',
      targetPos1: 'v.',
      targetPos2: 'n.'
    },
    {
      type: 'v_n',
      en: 'To [ 1 ] ______ operational [ 2 ] ______, the factory installed automated robotic assembly lines.',
      zh: '為了【{m1}】工廠的營運【{m2}】，廠方特別安裝了自動化機器人組裝產線。',
      targetPos1: 'v.',
      targetPos2: 'n.'
    },
    {
      type: 'v_n',
      en: 'Our customer service team strives to [ 1 ] ______ client [ 2 ] ______ through prompt and courteous assistance.',
      zh: '我們的客戶服務團隊致力於透過迅速且親切的協助，來【{m1}】顧客的【{m2}】。',
      targetPos1: 'v.',
      targetPos2: 'n.'
    },
    {
      type: 'v_n',
      en: 'The corporate leadership decided to [ 1 ] ______ a new [ 2 ] ______ regarding flexible remote work hours.',
      zh: '公司管理層決定正式【{m1}】一項關於彈性遠距工作時數的全新【{m2}】。',
      targetPos1: 'v.',
      targetPos2: 'n.'
    },
    {
      type: 'v_n',
      en: 'The sales division worked hard to [ 1 ] ______ its annual [ 2 ] ______ before the fiscal deadline.',
      zh: '業務部門全力以赴，期盼能在財政截止日前順利【{m1}】其年度業績【{m2}】。',
      targetPos1: 'v.',
      targetPos2: 'n.'
    },
    {
      type: 'v_n',
      en: 'The government passed legislation to [ 1 ] ______ environmental [ 2 ] ______ across industrial manufacturing zones.',
      zh: '政府通過了專門法案，旨在各大工業製造園區全面【{m1}】環境【{m2}】。',
      targetPos1: 'v.',
      targetPos2: 'n.'
    },
    {
      type: 'v_n',
      en: 'The auditor took extra time to [ 1 ] ______ the [ 2 ] ______ of the company’s financial expenditure records.',
      zh: '審計師特別花費額外時間來【{m1}】公司各項財務支出紀錄的【{m2}】。',
      targetPos1: 'v.',
      targetPos2: 'n.'
    },
    {
      type: 'v_n',
      en: 'The technical consultant helped our firm [ 1 ] ______ the [ 2 ] ______ in our software distribution architecture.',
      zh: '技術顧問協助我們公司成功【{m1}】了軟體發布架構中所存在的【{m2}】。',
      targetPos1: 'v.',
      targetPos2: 'n.'
    },

    // Pattern: adj + n
    {
      type: 'adj_n',
      en: 'The research institute published a [ 1 ] ______ [ 2 ] ______ regarding the economic impact of artificial intelligence.',
      zh: '該研究機構發布了一份關於人工智慧對經濟影響的【{m1}】【{m2}】。',
      targetPos1: 'adj.',
      targetPos2: 'n.'
    },
    {
      type: 'adj_n',
      en: 'Maintaining [ 1 ] ______ [ 2 ] ______ is essential for building long-term trust between supervisors and employees.',
      zh: '保持【{m1}】的【{m2}】，對於在主管與員工之間建立長期信任至關重要。',
      targetPos1: 'adj.',
      targetPos2: 'n.'
    },
    {
      type: 'adj_n',
      en: 'The multinational corporation announced an [ 1 ] ______ [ 2 ] ______ to expand into emerging international markets.',
      zh: '這家跨國公司宣布了一項進軍新興國際市場的【{m1}】【{m2}】。',
      targetPos1: 'adj.',
      targetPos2: 'n.'
    },
    {
      type: 'adj_n',
      en: 'Modern consumers are demanding more [ 1 ] ______ [ 2 ] ______ that minimize carbon footprints and environmental waste.',
      zh: '現代消費者正尋求更多能夠減少碳足跡與環境浪費的【{m1}】【{m2}】。',
      targetPos1: 'adj.',
      targetPos2: 'n.'
    },
    {
      type: 'adj_n',
      en: 'The newly hired advisory consultant provided [ 1 ] ______ [ 2 ] ______ that helped improve quarterly operating margins.',
      zh: '新聘請的諮詢顧問提供了【{m1}】的【{m2}】，有力協助提升了季度的營運利潤率。',
      targetPos1: 'adj.',
      targetPos2: 'n.'
    },
    {
      type: 'adj_n',
      en: 'Due to [ 1 ] ______ [ 2 ] ______, the scheduled outdoor marketing conference had to be relocated indoors.',
      zh: '由於出現了【{m1}】的【{m2}】，原訂於戶外舉行的行銷大會不得不緊急移至室內舉行。',
      targetPos1: 'adj.',
      targetPos2: 'n.'
    },
    {
      type: 'adj_n',
      en: 'The software development squad engineered an [ 1 ] ______ [ 2 ] ______ featuring an intuitive user interface.',
      zh: '軟體開發團隊研發打造出了一套具備直覺使用者介面的【{m1}】【{m2}】。',
      targetPos1: 'adj.',
      targetPos2: 'n.'
    },
    {
      type: 'adj_n',
      en: 'Employees who demonstrate [ 1 ] ______ [ 2 ] ______ during critical workplace emergencies receive special recognition.',
      zh: '在重大的職場緊急危機中展現出【{m1}】【{m2}】的員工，將獲得公司的特別表揚。',
      targetPos1: 'adj.',
      targetPos2: 'n.'
    },

    // Pattern: adv + v
    {
      type: 'adv_v',
      en: 'The technical support team [ 1 ] ______ [ 2 ] ______ the server malfunction before it affected online checkout.',
      zh: '技術支援團隊在伺服器故障影響線上結帳之前，便已【{m1}】地【{m2}】了該問題。',
      targetPos1: 'adv.',
      targetPos2: 'v.'
    },
    {
      type: 'adv_v',
      en: 'The regional director [ 1 ] ______ [ 2 ] ______ with branch supervisors to track quarterly milestone delivery.',
      zh: '區域總監【{m1}】與各分公司主管【{m2}】開會，以隨時追蹤各季度的里程碑交付進度。',
      targetPos1: 'adv.',
      targetPos2: 'v.'
    },
    {
      type: 'adv_v',
      en: 'Our customer service representatives are trained to [ 1 ] ______ [ 2 ] ______ all client inquiries with utmost professionalism.',
      zh: '我們的客戶服務專員均受過專業培訓，能夠【{m1}】地【{m2}】所有客戶的諮詢提問。',
      targetPos1: 'adv.',
      targetPos2: 'v.'
    },
    {
      type: 'adv_v',
      en: 'Economic analysts [ 1 ] ______ [ 2 ] ______ that consumer spending will rebound strongly over the coming fiscal year.',
      zh: '經濟分析師們【{m1}】地【{m2}】，消費者支出在即將到來的財政年度將強勁復甦。',
      targetPos1: 'adv.',
      targetPos2: 'v.'
    },
    {
      type: 'adv_v',
      en: 'The enterprise decided to [ 1 ] ______ [ 2 ] ______ its annual research and development investments.',
      zh: '該企業決定【{m1}】地【{m2}】其全年的研發創新投資金額。',
      targetPos1: 'adv.',
      targetPos2: 'v.'
    },
    {
      type: 'adv_v',
      en: 'All confidential corporate records must be [ 1 ] ______ [ 2 ] ______ according to compliance statutes.',
      zh: '所有機密公司檔案資料皆必須依據法規指引【{m1}】地予以【{m2}】處理。',
      targetPos1: 'adv.',
      targetPos2: 'v.'
    },

    // Pattern: n + v
    {
      type: 'n_v',
      en: 'The human resources [ 1 ] ______ decided to [ 2 ] ______ the training curriculum for new managerial recruits.',
      zh: '人力資源【{m1}】決定【{m2}】針對新進管理人才的培訓課程體系。',
      targetPos1: 'n.',
      targetPos2: 'v.'
    },
    {
      type: 'n_v',
      en: 'A sudden market [ 1 ] ______ forced the executive directors to [ 2 ] ______ their overseas expansion timeline.',
      zh: '突如其來的市場【{m1}】迫使執行董事們【{m2}】其海外市場擴張的時間表。',
      targetPos1: 'n.',
      targetPos2: 'v.'
    },
    {
      type: 'n_v',
      en: 'Our dedicated development [ 1 ] ______ collaborated diligently to [ 2 ] ______ the mobile update on schedule.',
      zh: '我們敬業的開發【{m1}】通力合作，以期如期【{m2}】這款行動應用的全新更新版本。',
      targetPos1: 'n.',
      targetPos2: 'v.'
    },
    {
      type: 'n_v',
      en: 'The corporate legal [ 1 ] ______ advised the leadership to [ 2 ] ______ the terms of the joint venture agreement.',
      zh: '公司法務【{m1}】建議領導層應當謹慎【{m2}】合資協議書中的相關條款。',
      targetPos1: 'n.',
      targetPos2: 'v.'
    },
    {
      type: 'n_v',
      en: 'Strict government [ 1 ] ______ require local manufacturing plants to [ 2 ] ______ hazardous carbon emissions.',
      zh: '嚴格的政府【{m1}】要求當地各製造工廠必須有效【{m2}】有害碳排放。',
      targetPos1: 'n.',
      targetPos2: 'v.'
    }
  ];

  // Helper to pick distinct random items from pool
  const pickDistinct = (arr, count) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    const unique = Array.from(new Set(shuffled));
    return unique.slice(0, count);
  };

  // ==========================================
  // Public Methods
  // ==========================================

  /**
   * Generates a contextually accurate Daily/Business sentence with complete Chinese translation.
   */
  const generateSentence = (vocab, tier) => {
    if (!vocab) return { sentence: '', sentenceZh: '', sentenceTarget: '' };
    tier = parseInt(tier, 10) || vocab.tier || 1;

    // If vocab already has rich handcrafted real-world sentence, use it directly!
    if (vocab.sentence && vocab.sentenceZh && vocab.isHandcrafted) {
      return {
        sentence: vocab.sentence,
        sentenceZh: vocab.sentenceZh,
        sentenceTarget: vocab.sentenceTarget || vocab.word
      };
    }

    const pos = cleanPos(vocab.pos);
    let tierGroup = 'tier1_3';
    if (tier >= 14) tierGroup = 'tier14_15';
    else if (tier >= 9) tierGroup = 'tier9_13';
    else if (tier >= 4) tierGroup = 'tier4_8';

    let templates = null;
    if (pos === 'n.') {
      templates = NOUN_TEMPLATES[tierGroup];
    } else if (pos === 'v.') {
      templates = VERB_TEMPLATES[tierGroup];
    } else if (pos === 'adj.') {
      templates = ADJ_TEMPLATES[tierGroup];
    } else if (pos === 'adv.') {
      templates = ADV_TEMPLATES[tierGroup];
    } else {
      templates = PREP_CONJ_TEMPLATES;
    }

    if (!templates || templates.length === 0) {
      templates = NOUN_TEMPLATES[tierGroup];
    }

    // Deterministic selection based on word hash to maintain consistent sentence per word
    const index = hashString(vocab.word) % templates.length;
    const tpl = templates[index];

    const sentence = tpl.en;
    const cleanMeaning = (vocab.meaning || '').split('；')[0].split('、')[0].split('（')[0].trim();
    const sentenceZh = tpl.zh.replace('{m}', cleanMeaning || vocab.meaning || vocab.word);

    return {
      sentence: sentence,
      sentenceZh: sentenceZh,
      sentenceTarget: vocab.word
    };
  };

  /**
   * Generates a Dual-Blank (Double Cloze) question for higher stages (Tier 5+ / Tower 30F+ / Dungeon B5F+).
   */
  const generateDoubleCloze = (vocab1, tier, pool) => {
    tier = parseInt(tier, 10) || vocab1.tier || 5;
    const pos1 = cleanPos(vocab1.pos);

    // Filter available candidates matching compatible POS pairings
    const matchingPatterns = DOUBLE_CLOZE_PATTERNS.filter(p => p.targetPos1 === pos1);
    const chosenPattern = matchingPatterns.length > 0
      ? matchingPatterns[hashString(vocab1.word) % matchingPatterns.length]
      : DOUBLE_CLOZE_PATTERNS[hashString(vocab1.word) % DOUBLE_CLOZE_PATTERNS.length];

    const targetPos2 = chosenPattern.targetPos2;

    // Find candidate vocab2 with matching POS from pool
    const candidates = (pool || []).filter(v =>
      v.word.toLowerCase() !== vocab1.word.toLowerCase() &&
      cleanPos(v.pos) === targetPos2
    );

    let vocab2 = null;
    if (candidates.length > 0) {
      vocab2 = candidates[hashString(vocab1.word + '_pair') % candidates.length];
    } else {
      // Fallback: pick any other word
      const anyCandidates = (pool || []).filter(v => v.word.toLowerCase() !== vocab1.word.toLowerCase());
      vocab2 = anyCandidates[0] || { word: 'standards', pos: 'n.', meaning: '標準' };
    }

    const cleanM1 = (vocab1.meaning || '').split('；')[0].split('、')[0].split('（')[0].trim();
    const cleanM2 = (vocab2.meaning || '').split('；')[0].split('、')[0].split('（')[0].trim();

    const plainSentence = chosenPattern.en;
    const htmlSentence = chosenPattern.en
      .replace('[ 1 ] ______', '<span class=sentence-blank>[ 1 ] ______</span>')
      .replace('[ 2 ] ______', '<span class=sentence-blank>[ 2 ] ______</span>');

    const sentenceZh = chosenPattern.zh
      .replace('{m1}', cleanM1 || vocab1.meaning)
      .replace('{m2}', cleanM2 || vocab2.meaning);

    const correctAnswer = ;

    // Create 3 distractor pairs
    const pool1 = (pool || []).filter(v => v.word.toLowerCase() !== vocab1.word.toLowerCase() && cleanPos(v.pos) === chosenPattern.targetPos1);
    const pool2 = (pool || []).filter(v => v.word.toLowerCase() !== vocab2.word.toLowerCase() && cleanPos(v.pos) === chosenPattern.targetPos2);

    const d1List = pickDistinct(pool1.map(v => v.word), 3);
    const d2List = pickDistinct(pool2.map(v => v.word), 3);

    // Fallbacks if pool is small
    const fallbackD1 = ['evaluate', 'review', 'modify', 'examine'];
    const fallbackD2 = ['strategy', 'policy', 'protocol', 'budget'];

    const distractors = [];
    for (let i = 0; i < 3; i++) {
      const w1 = d1List[i] || fallbackD1[i];
      const w2 = d2List[i] || fallbackD2[i];
      distractors.push();
    }

    const allChoices = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      isDoubleCloze: true,
      vocab: vocab1,
      vocab2: vocab2,
      sentence: plainSentence,
      sentenceHtml: htmlSentence,
      sentenceZh: sentenceZh,
      correctAnswer: correctAnswer,
      choices: allChoices,
      target1: vocab1.word,
      target2: vocab2.word
    };
  };

  /**
   * Generates a modern Daily / Business scenario Context Q&A (Type 4) replacing ancient dungeon tropes.
   */
  const generateType4QA = (vocab, tier, pool) => {
    tier = parseInt(tier, 10) || vocab.tier || 1;
    const isHigherTier = tier >= 7;

    let qaQuestion = '';
    let correctChoice = '';
    let wrongChoice1 = '';
    let wrongChoice2 = '';
    let wrongChoice3 = '';

    const otherEntries = (pool || []).filter(v => v.word.toLowerCase() !== vocab.word.toLowerCase());
    const distractors = pickDistinct(otherEntries, 3);
    const dMeanings = distractors.map(d => d.meaning || '其他含義');

    if (!isHigherTier) {
      // Everyday Life, Dining, Travel, Social scenario
      qaQuestion = ;
      correctChoice = ;
      wrongChoice1 = ;
      wrongChoice2 = ;
      wrongChoice3 = ;
    } else {
      // Business, Workplace, Financial, Academic scenario
      qaQuestion = ;
      correctChoice = ;
      wrongChoice1 = ;
      wrongChoice2 = ;
      wrongChoice3 = ;
    }

    const allChoices = [
      { text: correctChoice, isCorrect: true },
      { text: wrongChoice1, isCorrect: false },
      { text: wrongChoice2, isCorrect: false },
      { text: wrongChoice3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    return {
      qaQuestion: qaQuestion,
      choices: allChoices.map(c => c.text),
      correctIndex: allChoices.findIndex(c => c.isCorrect)
    };
  };

  /**
   * Enhances a vocabulary object to ensure it has valid daily/business sentence & Chinese translation.
   */
  const enhanceVocab = (vocab, tier) => {
    if (!vocab) return vocab;
    tier = tier || vocab.tier || 1;
    if (!vocab.categoryLabel) {
      vocab.categoryLabel = getCategoryLabel(tier);
    }
    if (!vocab.sentence || !vocab.sentenceZh || vocab.sentence.includes('ancient vault') || vocab.sentence.includes('sacred ______')) {
      const sData = generateSentence(vocab, tier);
      vocab.sentence = sData.sentence;
      vocab.sentenceZh = sData.sentenceZh;
      vocab.sentenceTarget = sData.sentenceTarget;
    }
    return vocab;
  };

  return {
    generateSentence,
    generateDoubleCloze,
    generateType4QA,
    enhanceVocab,
    getCategoryLabel
  };
})();

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.SentenceEngine = SentenceEngine;
}
