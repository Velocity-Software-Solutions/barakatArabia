// Bilingual site content for Barakat Arabia. Every entry is { en, ar } or a list of such objects.

const TAGS = {
  mep: { en: 'MEP Works', ar: 'الأعمال الكهروميكانيكية' },
  hvac: { en: 'HVAC Systems', ar: 'أنظمة التكييف والتهوية' },
  plumbing: { en: 'Plumbing & Drainage', ar: 'الأعمال الصحية والصرف' },
  fire: { en: 'Firefighting Systems', ar: 'أنظمة مكافحة الحريق' },
  alarm: { en: 'Fire Alarm Systems', ar: 'أنظمة إنذار الحريق' },
  bms: { en: 'BMS', ar: 'أنظمة إدارة المباني (BMS)' },
  light: { en: 'Light Current', ar: 'التيار الخفيف' },
  power: { en: 'Electrical Power', ar: 'القوى الكهربائية' },
  pm: { en: 'Project Management', ar: 'إدارة المشاريع' },
  electro: { en: 'Electromechanical Systems', ar: 'الأنظمة الكهروميكانيكية' },
};

const PLACES = {
  riyadh: { en: 'Riyadh, Saudi Arabia', ar: 'الرياض، المملكة العربية السعودية', country: 'sa' },
  newcairo: { en: 'New Cairo, Egypt', ar: 'القاهرة الجديدة، مصر', country: 'eg' },
  cairo: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر', country: 'eg' },
  alex: { en: 'Alexandria, Egypt', ar: 'الإسكندرية، مصر', country: 'eg' },
  fifth: { en: '5th Settlement, New Cairo, Egypt', ar: 'التجمع الخامس، القاهرة الجديدة، مصر', country: 'eg' },
  badr: { en: 'Badr City, Egypt', ar: 'مدينة بدر، مصر', country: 'eg' },
  october: { en: '6th of October City, Egypt', ar: 'مدينة السادس من أكتوبر، مصر', country: 'eg' },
  nairobi: { en: 'Nairobi, Kenya', ar: 'نيروبي، كينيا', country: 'ke' },
};

const SECTORS = {
  commercial: { en: 'commercial', ar: 'التجارية' },
  hospitality: { en: 'hospitality', ar: 'الفندقية' },
  residential: { en: 'residential', ar: 'السكنية' },
  healthcare: { en: 'healthcare', ar: 'الصحية' },
  industrial: { en: 'industrial', ar: 'الصناعية' },
  pharma: { en: 'pharmaceutical', ar: 'الدوائية' },
  infrastructure: { en: 'infrastructure', ar: 'البنية التحتية' },
};

const usd = n => ({ en: `$${n.toLocaleString('en-US')} USD`, ar: `${n.toLocaleString('en-US')} دولار أمريكي` });

// src: folder index of the downloaded project photos (el/imgs/pXX-N.jpg); photos: which N to publish (logos excluded)
const PROJECTS = [
  {
    slug: 'misk-city-mobility-hub', src: 10, photos: [0], place: 'riyadh', sector: 'infrastructure', status: 'progress', year: 2024,
    title: { en: 'Misk City Mobility Hub', ar: 'مركز التنقل بمدينة مسك' },
    tags: ['mep'], client: { en: 'MBS City (Misk City)', ar: 'مدينة محمد بن سلمان غير الربحية' },
    overview: { en: 'Execution of MEP works for the Misk City Mobility Hub project in Prince Mohammed bin Salman Nonprofit City, Riyadh.', ar: 'تنفيذ أعمال الأنظمة الكهروميكانيكية (MEP) لمشروع مركز التنقل في مدينة الأمير محمد بن سلمان غير الربحية (مدينة مسك) بالرياض.' },
  },
  {
    slug: 'dental-center-king-saud-medical-city', src: 0, photos: [0, 2, 1, 3, 4], place: 'riyadh', sector: 'healthcare', status: 'done', year: 2026,
    title: { en: 'Dental Center – King Saud Medical City', ar: 'مركز طب الأسنان – مدينة الملك سعود الطبية' },
    tags: ['hvac'],
    overview: { en: 'HVAC works for the Dental Center at King Saud Medical City, providing efficient air conditioning and ventilation systems to ensure a safe and comfortable indoor environment.', ar: 'تنفيذ أعمال التكييف والتهوية (HVAC) لمركز طب الأسنان بمدينة الملك سعود الطبية، بما يضمن بيئة داخلية آمنة ومريحة وجودة هواء مناسبة.' },
  },
  {
    slug: 'hilton-garden-inn-new-cairo', src: 2, photos: [0], place: 'newcairo', sector: 'hospitality', status: 'progress', year: 2024,
    title: { en: 'Hilton Garden Inn', ar: 'فندق هيلتون جاردن إن' },
    tags: ['mep'], client: { en: 'Hilton', ar: 'هيلتون' },
    overview: { en: 'Comprehensive MEP works for the Hilton Garden Inn hotel in New Cairo.', ar: 'تنفيذ أعمال كهروميكانيكية شاملة لمشروع فندق هيلتون جاردن إن في القاهرة الجديدة.' },
  },
  {
    slug: 'wilma-towers-nairobi', src: 9, photos: [0, 1, 2], place: 'nairobi', sector: 'residential', status: 'progress', year: 2024,
    title: { en: 'Wilma Towers', ar: 'أبراج ويلما' },
    tags: ['mep'], client: { en: 'Wilma Towers', ar: 'أبراج ويلما' },
    overview: { en: 'Complete MEP works for the Wilma residential towers project in Nairobi.', ar: 'تنفيذ أعمال الأنظمة الكهروميكانيكية الكاملة لمشروع أبراج ويلما السكنية في نيروبي.' },
  },
  {
    slug: 'grand-premiere-towers-nairobi', src: 11, photos: [0, 1], place: 'nairobi', sector: 'residential', status: 'progress', year: 2024,
    title: { en: 'Grand Premiere Towers', ar: 'أبراج جراند بريمير' },
    tags: ['mep'],
    overview: { en: 'Execution of MEP works for the Grand Premiere residential towers in Nairobi.', ar: 'تنفيذ أعمال الأنظمة الكهروميكانيكية لأبراج جراند بريمير السكنية في نيروبي.' },
    features: { en: 'Solar water heaters, rooftop lounge deck, rooftop barbecue, fitted gym, video intercom, multiple balconies, high-speed lifts, 24-hour security, backup generator, borehole and electric fence.', ar: 'سخانات مياه شمسية، وصالة استراحة ومنطقة شواء على السطح، وصالة رياضية مجهزة، وإنتركم مرئي، وشرفات متعددة، ومصاعد عالية السرعة، وأمن على مدار الساعة، ومولد احتياطي، وبئر مياه، وسياج كهربائي.' },
  },
  {
    slug: 'epc-vcm-alexandria', src: 1, photos: [0, 1, 2, 3], place: 'alex', sector: 'industrial', status: 'done', year: 2022, value: usd(5000000),
    title: { en: 'EPC – VCM Plant', ar: 'مصنع VCM – شركة البتروكيماويات المصرية' },
    tags: ['mep'], client: { en: 'Egyptian Petrochemicals Co. (EPC)', ar: 'شركة البتروكيماويات المصرية' },
    overview: { en: 'MEP works execution for the VCM plant of the Egyptian Petrochemicals Company in Alexandria.', ar: 'تنفيذ أعمال الأنظمة الكهروميكانيكية لمصنع VCM التابع لشركة البتروكيماويات المصرية بالإسكندرية.' },
  },
  {
    slug: 'jabco-admin-building-cairo', src: 14, photos: [0, 1, 2, 3, 4], place: 'cairo', sector: 'commercial', status: 'done', year: 2021, value: usd(4000000),
    title: { en: 'JABCO Admin Building', ar: 'مبنى جابكو الإداري' },
    tags: ['mep'],
    overview: { en: 'MEP works for the JABCO administrative building in Cairo.', ar: 'أعمال الأنظمة الكهروميكانيكية لمبنى جابكو الإداري بالقاهرة.' },
  },
  {
    slug: 'cairo-capital-center', src: 3, photos: [0, 1, 2, 3, 4], place: 'newcairo', sector: 'commercial', status: 'done', year: 2021, value: usd(1500000),
    title: { en: 'Cairo Capital Center', ar: 'كايرو كابيتال سنتر' },
    tags: ['hvac', 'plumbing', 'fire', 'pm'],
    overview: { en: 'HVAC, firefighting and project management services for Cairo Capital Center in New Cairo.', ar: 'تنفيذ أعمال التكييف والتهوية ومكافحة الحريق وخدمات إدارة المشروع لمبنى كايرو كابيتال سنتر في القاهرة الجديدة.' },
  },
  {
    slug: 'tiba-pharma-cairo', src: 13, photos: [0, 1, 2, 3, 4], place: 'cairo', sector: 'pharma', status: 'done', year: 2014, value: usd(1500000),
    title: { en: 'Tiba Pharma', ar: 'طيبة فارما' },
    tags: ['hvac', 'bms', 'fire'],
    overview: { en: 'Implementation of HVAC, BMS and firefighting systems for Tiba Pharma in Cairo.', ar: 'تنفيذ أنظمة التكييف والتهوية ونظام إدارة المباني (BMS) وأنظمة مكافحة الحريق لشركة طيبة فارما بالقاهرة.' },
  },
  {
    slug: 'ge-admin-building-mivida', src: 12, photos: [0, 1, 2, 3, 4], place: 'newcairo', sector: 'commercial', status: 'done', year: 2016, value: usd(1500000),
    title: { en: 'GE Admin Building – Mivida', ar: 'مبنى جنرال إلكتريك الإداري – ميفيدا' },
    tags: ['hvac', 'plumbing', 'fire'],
    overview: { en: 'HVAC, plumbing and firefighting works for the GE administrative building at Mivida, New Cairo.', ar: 'أعمال التكييف والتهوية والأعمال الصحية ومكافحة الحريق لمبنى جنرال إلكتريك الإداري في ميفيدا بالقاهرة الجديدة.' },
  },
  {
    slug: 'badr-pharma-cairo', src: 8, photos: [0, 1, 2, 3, 4], place: 'cairo', sector: 'pharma', status: 'done', year: 2014, value: usd(1600000),
    title: { en: 'Badr Pharma', ar: 'بدر فارما' },
    tags: ['power', 'light', 'hvac', 'fire'],
    overview: { en: 'Power, light current, HVAC and firefighting systems for Badr Pharma in Cairo.', ar: 'تنفيذ أعمال القوى الكهربائية والتيار الخفيف والتكييف وأنظمة مكافحة الحريق لشركة بدر فارما بالقاهرة.' },
  },
  {
    slug: 'nile-66-admin-building', src: 4, photos: [0, 1, 2, 3, 4], place: 'newcairo', sector: 'commercial', status: 'done', year: 2014, value: usd(1000000),
    title: { en: 'Nile-66 Admin Building', ar: 'مبنى نايل-66 الإداري' },
    tags: ['hvac', 'bms'],
    overview: { en: 'HVAC and BMS systems installation for the Nile-66 administrative building in New Cairo.', ar: 'تركيب أنظمة التكييف والتهوية ونظام إدارة المباني (BMS) لمبنى نايل-66 الإداري بالقاهرة الجديدة.' },
  },
  {
    slug: 'epc-chairman-building-alexandria', src: 6, photos: [0, 1, 2], place: 'alex', sector: 'commercial', status: 'done', year: 2021, value: usd(400000),
    title: { en: 'EPC – Chairman Building', ar: 'مبنى رئيس مجلس الإدارة – EPC' },
    tags: ['hvac', 'fire', 'alarm'], client: { en: 'Egyptian Petrochemicals Co. (EPC)', ar: 'شركة البتروكيماويات المصرية' },
    overview: { en: 'HVAC, firefighting and fire alarm systems for the EPC Chairman Building in Alexandria.', ar: 'أنظمة التكييف ومكافحة الحريق وإنذار الحريق لمبنى رئيس مجلس الإدارة بشركة البتروكيماويات المصرية بالإسكندرية.' },
  },
  {
    slug: 'elsewedy-office-building', src: 5, photos: [0, 1, 2, 3, 4], place: 'fifth', sector: 'commercial', status: 'done', year: 2009, value: usd(1300000),
    title: { en: 'Elsewedy Office Building', ar: 'مبنى مكاتب السويدي' },
    tags: ['hvac', 'bms'], client: { en: 'Elsewedy Electric', ar: 'السويدي إليكتريك' },
    overview: { en: 'HVAC and BMS system installation for the Elsewedy Electric office building in the 5th Settlement, New Cairo.', ar: 'تركيب أنظمة التكييف ونظام إدارة المباني (BMS) لمبنى مكاتب السويدي إليكتريك في التجمع الخامس.' },
  },
  {
    slug: 'town-way-mall-badr-city', src: 7, photos: [0, 1, 2, 3, 4], place: 'badr', sector: 'commercial', status: 'done', year: 2022, value: usd(450000),
    title: { en: 'Town Way Mall', ar: 'تاون واي مول' },
    tags: ['electro'],
    overview: { en: 'Electromechanical systems implementation for Town Way Mall in Badr City.', ar: 'تنفيذ الأنظمة الكهروميكانيكية لمشروع تاون واي مول بمدينة بدر.' },
  },
  {
    slug: 'procter-gamble-6th-of-october', src: 15, photos: [0, 1, 2, 3, 4], place: 'october', sector: 'industrial', status: 'done', year: 2006, value: usd(350000),
    title: { en: 'Procter & Gamble – October Plant', ar: 'بروكتر آند جامبل – مصنع أكتوبر' },
    tags: ['hvac'], client: { en: 'P&G', ar: 'بروكتر آند جامبل' },
    overview: { en: 'HVAC system installation for the Procter & Gamble plant in 6th of October City.', ar: 'تركيب نظام التكييف والتهوية لمصنع بروكتر آند جامبل في مدينة السادس من أكتوبر.' },
  },
];

const STATUS = { done: { en: 'Completed', ar: 'مكتمل' }, progress: { en: 'In progress', ar: 'قيد التنفيذ' } };
const COUNTRIES = { sa: { en: 'Saudi Arabia', ar: 'السعودية' }, eg: { en: 'Egypt', ar: 'مصر' }, ke: { en: 'Kenya', ar: 'كينيا' } };

const STATS = [
  { n: 20, plus: true, label: { en: 'Years of experience', ar: 'عاماً من الخبرة' } },
  { n: 500, plus: true, label: { en: 'Projects completed', ar: 'مشروع مكتمل' } },
  { n: 150, plus: true, label: { en: 'Engineers & specialists', ar: 'مهندس وفني متخصص' } },
  { n: 3, plus: false, label: { en: 'Countries of delivery', ar: 'دول نفذنا فيها مشاريعنا' } },
];

const SERVICES = [
  { t: { en: 'Procurement & Equipment Selection', ar: 'المشتريات واختيار المعدات' }, d: { en: 'Value review and development, value engineering, equipment selection, material submittals, procurement and inspection.', ar: 'مراجعة القيمة وتطويرها، وهندسة القيمة، واختيار المعدات، واعتماد المواد، والمشتريات والفحص.' } },
  { t: { en: 'Technical Design & Drawings', ar: 'التصميم الفني والمخططات' }, d: { en: 'Engineering calculations; shop drawings, sections and details; schematic and combined services drawings (CSD); as-built record drawings and manuals.', ar: 'الحسابات الهندسية، والمخططات التنفيذية والقطاعات والتفاصيل، والمخططات التخطيطية ومخططات تنسيق الخدمات (CSD)، ومخططات ما تم تنفيذه والأدلة.' } },
  { t: { en: 'Execution & Project Management', ar: 'التنفيذ وإدارة المشاريع' }, d: { en: 'Method statements, installation and project management, testing and commissioning, operation and maintenance.', ar: 'خطط وأساليب التنفيذ، والتركيب وإدارة المشاريع، والاختبارات والتشغيل التجريبي، والتشغيل والصيانة.' } },
  { t: { en: 'Value Engineering', ar: 'هندسة القيمة' }, d: { en: 'Optimized design solutions, cost control and budget planning, lifecycle cost analysis, constructability and design assessment.', ar: 'تحسين حلول التصميم، وضبط التكاليف وتخطيط الميزانيات، وتحليل تكلفة دورة الحياة، وتقييم قابلية التنفيذ والتصميم.' } },
  { t: { en: 'Mechanical & Electrical Infrastructure', ar: 'البنية التحتية الميكانيكية والكهربائية' }, d: { en: 'Comprehensive infrastructure mechanical and electrical services — engineering, calculations, shop drawings, schematics and as-built records.', ar: 'خدمات متكاملة للبنية التحتية الميكانيكية والكهربائية — هندسة وحسابات ومخططات تنفيذية وتخطيطية وسجلات ما تم تنفيذه.' } },
  { t: { en: 'Facility Management & Maintenance', ar: 'إدارة المرافق والصيانة' }, d: { en: 'Supply, installation and maintenance of electromechanical systems, with facility management and ongoing operation and maintenance support.', ar: 'توريد الأنظمة الكهروميكانيكية وتركيبها وصيانتها، مع إدارة المرافق وتوفير الدعم المستمر للتشغيل والصيانة.' } },
];

const SCOPE = [
  { t: { en: 'HVAC & Ventilation', ar: 'التكييف والتهوية' }, d: { en: 'Central air conditioning, VRF and ventilation systems.', ar: 'التكييف المركزي وأنظمة VRF وأنظمة التهوية.' } },
  { t: { en: 'Fire Protection', ar: 'الحماية من الحريق' }, d: { en: 'Automatic sprinkler networks, fire pumps and FM-200 suppression systems.', ar: 'شبكات الرشاشات التلقائية ومضخات الحريق وأنظمة الإطفاء FM-200.' } },
  { t: { en: 'Plumbing & Drainage', ar: 'الأعمال الصحية والصرف' }, d: { en: 'Water supply networks, sanitary drainage and advanced leak protection.', ar: 'شبكات تغذية المياه والصرف الصحي والحماية المتقدمة من التسربات.' } },
  { t: { en: 'Electrical Power & Lighting', ar: 'القوى الكهربائية والإنارة' }, d: { en: 'Distribution panels, lighting, power systems and low-voltage networks.', ar: 'لوحات التوزيع والإنارة وأنظمة القوى وشبكات الجهد المنخفض.' } },
  { t: { en: 'BMS & Automation', ar: 'إدارة المباني والأتمتة' }, d: { en: 'Smart, energy-efficient building management, automation and IoT integration.', ar: 'أنظمة ذكية موفرة للطاقة لإدارة المباني والأتمتة وتكامل إنترنت الأشياء.' } },
  { t: { en: 'Security & CCTV', ar: 'الأمن والمراقبة' }, d: { en: 'CCTV surveillance, access control and smart security alarm systems.', ar: 'المراقبة بالكاميرات والتحكم في الدخول وأنظمة الإنذار الأمني الذكية.' } },
  { t: { en: 'Fire Alarm', ar: 'إنذار الحريق' }, d: { en: 'Fire detection and alarm systems for early warning and safe evacuation.', ar: 'أنظمة كشف وإنذار الحريق للتنبيه المبكر والإخلاء الآمن.' } },
  { t: { en: 'Communications', ar: 'الاتصالات' }, d: { en: 'Communication and light-current systems.', ar: 'أنظمة الاتصالات والتيار الخفيف.' } },
  { t: { en: 'Solar Energy', ar: 'الطاقة الشمسية' }, d: { en: 'Solar energy solutions for cleaner, more efficient power.', ar: 'حلول الطاقة الشمسية لطاقة أنظف وأكثر كفاءة.' } },
  { t: { en: 'Smart Metering', ar: 'العدادات الذكية' }, d: { en: 'Smart power and water metering systems.', ar: 'أنظمة القياس الذكي للكهرباء والمياه.' } },
  { t: { en: 'Power Storage & Backup', ar: 'تخزين الطاقة والطاقة الاحتياطية' }, d: { en: 'UPS, battery systems, generators, automatic transfer switches (ATS) and synchronization panels.', ar: 'وحدات UPS، وأنظمة البطاريات والمولدات، ومفاتيح التحويل التلقائي (ATS)، ولوحات المزامنة.' } },
  { t: { en: 'MEP Facility Management', ar: 'إدارة مرافق الأنظمة الكهروميكانيكية' }, d: { en: 'Operation and maintenance of mechanical, electrical and plumbing systems.', ar: 'تشغيل وصيانة الأنظمة الميكانيكية والكهربائية والصحية.' } },
];

const WHY = [
  { en: 'Extensive experience in mega and complex engineering projects', ar: 'خبرة واسعة في تنفيذ المشاريع الهندسية الكبرى والمعقدة' },
  { en: 'Highly qualified, certified engineering and technical team', ar: 'فريق هندسي وفني مؤهل ومعتمد' },
  { en: 'State-of-the-art technologies and equipment', ar: 'استخدام أحدث التقنيات والمعدات' },
  { en: 'Complete adherence to international quality and safety standards', ar: 'التزام كامل بمعايير الجودة والسلامة الدولية' },
  { en: 'Dedicated post-execution support and dependable maintenance', ar: 'دعم ما بعد التنفيذ وصيانة موثوقة' },
];

const HUBS = [
  { t: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' }, d: { en: 'Riyadh • Jeddah', ar: 'الرياض • جدة' } },
  { t: { en: 'Egypt', ar: 'مصر' }, d: { en: 'Cairo', ar: 'القاهرة' } },
  { t: { en: 'GCC & Regional', ar: 'الخليج والمنطقة' }, d: { en: 'Expansion hubs', ar: 'مراكز التوسع' } },
];

const SECTOR_CARDS = [
  { t: { en: 'Commercial', ar: 'التجاري' }, d: { en: 'Corporate towers, showrooms and shopping malls planned for comfort and everyday operation.', ar: 'الأبراج الإدارية والمعارض والمراكز التجارية المصممة للراحة وسهولة التشغيل اليومي.' } },
  { t: { en: 'Hospitality', ar: 'الضيافة' }, d: { en: 'Guest-focused environments where comfort, discretion and continuity matter.', ar: 'بيئات تركز على تجربة الضيف، حيث تهم الراحة والخصوصية واستمرارية التشغيل.' } },
  { t: { en: 'Healthcare', ar: 'الرعاية الصحية' }, d: { en: 'Careful coordination for sensitive spaces with demanding technical requirements.', ar: 'تنسيق دقيق للمساحات الحساسة ذات المتطلبات الفنية العالية.' } },
  { t: { en: 'Residential', ar: 'السكني' }, d: { en: 'Residential compounds, towers and luxury villas with reliable, comfortable building services.', ar: 'المجمعات السكنية والأبراج والفلل الفاخرة بخدمات مبانٍ موثوقة ومريحة.' } },
  { t: { en: 'Industrial', ar: 'الصناعي' }, d: { en: 'Factories, warehouses and industrial facilities built around production and resilience.', ar: 'المصانع والمستودعات والمنشآت الصناعية المصممة لاستمرارية الإنتاج والتشغيل.' } },
  { t: { en: 'Infrastructure', ar: 'البنية التحتية' }, d: { en: 'Coordinated networks and utilities that support long-term performance at scale.', ar: 'شبكات ومرافق متكاملة تدعم الأداء المستدام على نطاق واسع.' } },
];

const ORG = [
  { icon: 'briefcase', t: { en: 'Leadership & Business Support', ar: 'القيادة ودعم الأعمال' }, d: { en: 'Chairman and General Manager; finance with senior accountant and accountant; purchasing; IT, HR and administration including HR Manager / PRO, HR Assistant, IT in-charge and office staff.', ar: 'رئيس مجلس الإدارة والمدير العام؛ والإدارة المالية بمحاسب أول ومحاسب؛ وإدارة المشتريات؛ وتقنية المعلومات والموارد البشرية والشؤون الإدارية، وتشمل مدير الموارد البشرية ومسؤول العلاقات الحكومية ومساعد الموارد البشرية ومسؤول تقنية المعلومات وموظفي المكتب.' } },
  { icon: 'cpu', t: { en: 'MEP Engineering & Coordination', ar: 'هندسة وتنسيق الأعمال الكهروميكانيكية' }, d: { en: 'MEP department, Project Manager, Senior Project Engineer, Project Engineer, Site MEP Coordinator, Mechanical and Electrical Engineers, supported by drafting teams.', ar: 'قسم الأعمال الكهروميكانيكية، ومدير المشروع، ومهندس المشروع الأول، ومهندس المشروع، ومنسق الأعمال بالموقع، والمهندسون الميكانيكيون والكهربائيون، بدعم من فرق الرسم الهندسي.' } },
  { icon: 'hardhat', t: { en: 'Site Delivery Teams', ar: 'فرق التنفيذ بالموقع' }, d: { en: 'Plumbing, HVAC and electrical supervisors and foremen; plumbers and pipe fitters, duct workers, electricians and their helpers.', ar: 'مشرفو ومراقبو الأعمال الصحية والتكييف والكهرباء؛ وفنيو السباكة وتركيب الأنابيب ومجاري الهواء والكهرباء ومساعدوهم.' } },
  { icon: 'drop', t: { en: 'Fire Water Tank Department', ar: 'قسم خزانات مياه الحريق' }, d: { en: 'A dedicated fire water tank department with supervisor, draftsman, fitters and helpers.', ar: 'قسم متخصص لخزانات مياه الحريق يضم مشرفاً ورساماً هندسياً وفنيي تركيب ومساعدين.' } },
];

const REFERENCES = [
  { t: { en: 'Commercial projects', ar: 'المشاريع التجارية' }, items: [
    ['El-Sewedy HQ – New Cairo', 'المقر الرئيسي للسويدي – القاهرة الجديدة'], ['Elsewedy Cables – El-Ain El-Sokhna', 'السويدي للكابلات – العين السخنة'], ['Elsewedy Transformer – 10th of Ramadan', 'السويدي للمحولات – العاشر من رمضان'], ['Tiba Pharma Admin Building', 'مبنى طيبة فارما الإداري'], ['Badr Pharma Admin Building', 'مبنى بدر فارما الإداري'], ['New Giza Admin Building – Zamalek', 'مبنى نيو جيزة الإداري – الزمالك'], ['Nile-9G Admin Building', 'مبنى نايل-9G الإداري'], ['Nile-12G Admin Building', 'مبنى نايل-12G الإداري'], ['Nile-14G Admin Building', 'مبنى نايل-14G الإداري'], ['Nile-66 Admin Building – New Cairo', 'مبنى نايل-66 الإداري – القاهرة الجديدة'], ['Nile-75 Admin Building – New Cairo', 'مبنى نايل-75 الإداري – القاهرة الجديدة'], ['Nile-76 Admin Building – New Cairo', 'مبنى نايل-76 الإداري – القاهرة الجديدة'], ['Japco-1 Admin Building', 'مبنى جابكو-1 الإداري'], ['Japco-2 Admin Building', 'مبنى جابكو-2 الإداري'], ['Chairman Building', 'مبنى رئيس مجلس الإدارة'], ['Mega Mall – New Cairo', 'ميجا مول – القاهرة الجديدة'], ['Hyundai Regional Office – New Cairo', 'المكتب الإقليمي لهيونداي – القاهرة الجديدة'], ['GE Regional Office – New Cairo', 'المكتب الإقليمي لجنرال إلكتريك – القاهرة الجديدة'], ['Chrysler Egypt', 'كرايسلر مصر'], ['NileSat – 6th of October', 'نايل سات – السادس من أكتوبر']] },
  { t: { en: 'Pharmaceutical industries & hospitals', ar: 'الصناعات الدوائية والمستشفيات' }, items: [
    ['Badr Pharma Factory', 'مصنع بدر فارما'], ['Tiba Pharma Factory', 'مصنع طيبة فارما'], ['Dar El-Teb Hospital', 'مستشفى دار الطب'], ['VACSERA – Dokki', 'فاكسيرا – الدقي'], ['El-Nakhil Hospital', 'مستشفى النخيل'], ['10th of Ramadan Hospital', 'مستشفى العاشر من رمضان'], ['Utopia Pharma', 'يوتوبيا فارما'], ['Pi-Park Pharmaceutical Warehouse', 'مستودع باي بارك للأدوية'], ['Pertussis and Diphtheria Vaccine Factory #1', 'مصنع لقاحات السعال الديكي والدفتيريا رقم 1'], ['Pertussis and Diphtheria Vaccine Factory #2', 'مصنع لقاحات السعال الديكي والدفتيريا رقم 2']] },
  { t: { en: 'Industrial projects', ar: 'المشاريع الصناعية' }, items: [
    ['Procter & Gamble Egypt – 6th of October', 'بروكتر آند جامبل مصر – السادس من أكتوبر'], ['Flex for Electric Products', 'فليكس للمنتجات الكهربائية'], ['Al Temsah Steel Factory', 'مصنع التمساح للصلب'], ['General Motors – 6th of October City', 'جنرال موتورز – مدينة السادس من أكتوبر'], ['Elsewedy Transformer – 10th of Ramadan', 'السويدي للمحولات – العاشر من رمضان'], ['Elsewedy Cables – El-Ain El-Sokhna', 'السويدي للكابلات – العين السخنة'], ['El-Katammya Bakery', 'مخبز القطامية'], ['VCM', 'VCM'], ['KVC Station', 'محطة KVC']] },
  { t: { en: 'Hotels & resorts', ar: 'الفنادق والمنتجعات' }, items: [
    ['Ras Al Helal Resort – Libya', 'منتجع رأس الهلال – ليبيا'], ['Casino Sheraton Hotel', 'فندق كازينو شيراتون'], ['Savoy – Sharm El Sheikh', 'سافوي – شرم الشيخ'], ['Marriott – Sharm El Sheikh', 'ماريوت – شرم الشيخ'], ['Ghazala Garden – Sharm El Sheikh', 'غزالة جاردن – شرم الشيخ'], ['Merit Village – Hurghada', 'قرية ميريت – الغردقة'], ['La Rosa Village – Hurghada', 'قرية لا روزا – الغردقة'], ['Fantasia Hotel – Sharm El Sheikh', 'فندق فانتازيا – شرم الشيخ'], ['Gardenia Village – Hurghada', 'قرية جاردينيا – الغردقة'], ['Cilia Village – Hurghada', 'قرية سيليا – الغردقة'], ['La Gouna Beach – El Sokhna', 'لاجونا بيتش – السخنة'], ['Soma Bay Mall', 'سوما باي مول'], ['Hilton Garden Inn – New Cairo', 'هيلتون جاردن إن – القاهرة الجديدة'], ['Sindbad Mall', 'سندباد مول'], ['Pyramisa', 'بيراميزا']] },
  { t: { en: 'Technical design', ar: 'التصميم الفني' }, items: [
    ['Soma Bay', 'سوما باي'], ['Cairo Capital Center', 'كايرو كابيتال سنتر'], ['Petromaint', 'بترومنت'], ['Nile Museum', 'متحف النيل'], ['Irrigation Building', 'مبنى الري']] },
  { t: { en: 'Residential projects', ar: 'المشاريع السكنية' }, items: [
    ['Mr. Baher Ghabbour Palace – Mirage City', 'قصر السيد باهر غبور – ميراج سيتي'], ['Mr. Baher Ghabbour Palace – New Cairo', 'قصر السيد باهر غبور – القاهرة الجديدة'], ['Mr. Ahmed AbdEl-Rahman Villa – 5th Settlement', 'فيلا السيد أحمد عبد الرحمن – التجمع الخامس'], ['Mr. Ahmed AbdEl-Rahman Villa – New Cairo', 'فيلا السيد أحمد عبد الرحمن – القاهرة الجديدة'], ['Mr. Mostafa El-Shaikh Villa – El-Obour', 'فيلا السيد مصطفى الشيخ – العبور'], ['Dr. Hussien El-Shafai Villa – 1st Settlement', 'فيلا الدكتور حسين الشافعي – التجمع الأول'], ['Dr. Hussien El-Shafei Villa – New Cairo', 'فيلا الدكتور حسين الشافعي – القاهرة الجديدة'], ['Wilma Residential Towers – Nairobi', 'أبراج ويلما السكنية – نيروبي'], ['Grand Premier Residential Towers – Nairobi', 'أبراج جراند بريمير السكنية – نيروبي']] },
  { t: { en: 'Banks', ar: 'البنوك' }, items: [
    ['National Bank of Egypt – Menouf', 'البنك الأهلي المصري – منوف'], ['National Bank of Egypt – Zefta', 'البنك الأهلي المصري – زفتى'], ['National Bank of Egypt – Tokh', 'البنك الأهلي المصري – طوخ'], ['National Bank of Egypt – Suez', 'البنك الأهلي المصري – السويس'], ['CIB – Tanta', 'البنك التجاري الدولي – طنطا'], ['Al-Watani Bank – Sharm El Sheikh', 'البنك الوطني – شرم الشيخ'], ['Bloom Bank – Sharm El Sheikh', 'بنك بلوم – شرم الشيخ'], ['Suez Canal Bank – Giza', 'بنك قناة السويس – الجيزة']] },
  { t: { en: 'Consultant references', ar: 'مراجع الاستشاريين' }, items: [
    ['Shaker Consultancy Group (SCG)', 'مجموعة شاكر الاستشارية (SCG)'], ['Sabbour', 'صبور'], ['Crown Home', 'كراون هوم'], ['Concord', 'كونكورد'], ['Al-Baron Sabry El-Iraky', 'البارون صبري العراقي'], ['Bakry Consulting Engineers (Hassan Bakry)', 'بكري للاستشارات الهندسية (حسن بكري)'], ['Eng. Khaled Fateen', 'المهندس خالد فطين'], ['(MED) Abd El-Hamid Bakry', 'عبد الحميد بكري (MED)'], ['Dar Al-Me’mar', 'دار المعمار'], ['Al-Bonian', 'البنيان'], ['Delta Egypt', 'دلتا مصر'], ['Segma', 'سيجما'], ['EMDEG (Magdi Kamei)', 'EMDEG (مجدي كامي)'], ['Mahfouz Consultants', 'محفوظ للاستشارات'], ['EMG', 'EMG'], ['BHC', 'BHC'], ['Pro Map', 'برو ماب']] },
  { t: { en: 'Other facilities', ar: 'منشآت أخرى' }, items: [
    ['Olympic Swimming Pool – 6th of October Club', 'حمام السباحة الأولمبي – نادي السادس من أكتوبر'], ['Egyptian Diplomatic Club – Talat Harb, Downtown', 'النادي الدبلوماسي المصري – طلعت حرب، وسط البلد'], ['Cook Door Restaurant – 6th of October, Tanta and Al-Rehab', 'مطعم كوك دور – السادس من أكتوبر وطنطا والرحاب'], ['Carpaccio Café – Maadi', 'كافيه كارباتشيو – المعادي'], ['Renault Showroom – 6th of October', 'معرض رينو – السادس من أكتوبر'], ['Renault Showroom – Sheikh Zayed', 'معرض رينو – الشيخ زايد'], ['Soudi Market – 10 branches', 'سعودي ماركت – 10 فروع'], ['German School – Mivida', 'المدرسة الألمانية – ميفيدا'], ['Al-Shahidin Mosque – Quesna', 'مسجد الشهيدين – قويسنا'], ['Suez Security Directorate – Police Officers Club', 'مديرية أمن السويس – نادي ضباط الشرطة'], ['PVC Lab', 'معمل PVC'], ['MBS Charity City – D8, Riyadh, KSA', 'مدينة محمد بن سلمان غير الربحية – D8، الرياض، السعودية']] },
];

const GALLERY = [
  { cls: 'w2 h2', alt: { en: 'Residential tower at dusk', ar: 'برج سكني عند الغسق' } },
  { cls: '', alt: { en: 'Aerial view of a high-rise residential tower', ar: 'منظر جوي لبرج سكني مرتفع' } },
  { cls: 'h2', alt: { en: 'Ceiling-mounted automatic fire suppression unit', ar: 'وحدة إطفاء حريق تلقائية مثبتة في السقف' } },
  { cls: '', alt: { en: 'Glass-façade administrative building', ar: 'مبنى إداري بواجهة زجاجية' } },
  { cls: '', alt: { en: 'Electrical control panel with indicator lights', ar: 'لوحة تحكم كهربائية بمؤشرات تشغيل' } },
  { cls: 'w2', alt: { en: 'Standby diesel generator and control module', ar: 'مولد ديزل احتياطي ووحدة التحكم' } },
  { cls: '', alt: { en: 'Firefighting pump room valves and pipework', ar: 'صمامات وأنابيب غرفة مضخات الحريق' } },
  { cls: 'h2', alt: { en: 'Air handling units and insulated ductwork', ar: 'وحدات مناولة الهواء ومجاري هواء معزولة' } },
  { cls: 'w2', alt: { en: 'Pharmaceutical facility exterior', ar: 'واجهة منشأة دوائية' } },
  { cls: '', alt: { en: 'Pump set with insulated piping', ar: 'مجموعة مضخات بأنابيب معزولة' } },
  { cls: '', alt: { en: 'Rooftop air handling units', ar: 'وحدات مناولة هواء على السطح' } },
  { cls: 'w2', alt: { en: 'Low-voltage electrical switchgear room', ar: 'غرفة لوحات توزيع كهربائية منخفضة الجهد' } },
];

const QUALITY = ['ISO', 'SMACNA', 'IEC', 'ASTM', 'ASME', 'NFPA', 'ASHRAE', 'SASO'];

const PARTNERS = [
  [
    ['gardenia-plaza', 'Gardenia Plaza Hotel and Resort', 'فندق ومنتجع جاردينيا بلازا'], ['sponsor-01', 'MBS City', 'مدينة محمد بن سلمان غير الربحية', true], ['sponsor-02', 'Hilton Garden Inn', 'هيلتون جاردن إن', true], ['sponsor-03', 'Wilma Towers', 'أبراج ويلما'], ['sponsor-04', 'Al Ahly Bank', 'البنك الأهلي'], ['sponsor-05', 'Etisalat', 'اتصالات'], ['sponsor-06', 'Elsewedy Electric', 'السويدي إليكتريك'], ['sponsor-07', 'Seoudi', 'سعودي ماركت'], ['sponsor-08', 'Hyundai', 'هيونداي'], ['sponsor-09', 'P&G', 'بروكتر آند جامبل'],
  ],
  [
    ['sponsor-10', 'VAAL', 'VAAL'], ['sponsor-11', 'U.S. Embassy', 'السفارة الأمريكية'], ['sponsor-12', 'Hilton', 'هيلتون'], ['sponsor-13', 'Mivida', 'ميفيدا'], ['sponsor-14', 'Savoy Group', 'مجموعة سافوي'], ['sponsor-15', 'EPC Petro', 'إي بي سي بترو'], ['sponsor-16', 'Emaar', 'إعمار'], ['sponsor-17', 'Nile Engineering', 'نايل للهندسة', true], ['sponsor-18', 'APM Petromaint', 'إيه بي إم بترومنت'], ['sponsor-19', 'ADWAA', 'أضواء'],
  ],
];

module.exports = { TAGS, PLACES, SECTORS, PROJECTS, STATUS, COUNTRIES, STATS, SERVICES, SCOPE, WHY, HUBS, SECTOR_CARDS, ORG, REFERENCES, GALLERY, QUALITY, PARTNERS };
