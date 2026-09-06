"use strict";

/* ============================================================
   🇹🇳 ماء قريب
   خريطة تونس - 24 ولاية
   Supabase + Reports + Dashboard + Report Modal
   ============================================================ */


/* ============================================================
   1. SUPABASE
   ============================================================ */

const SUPABASE_URL =
    "https://zsoiybdiqutxvczedith.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_jrKEZXaDkQ_QjrL_QiMZog_xwG6muia";


let supabaseClient = null;


/* ============================================================
   2. عناصر HTML
   ============================================================ */

let governorate = null;
let delegation = null;
let selectedLocation = null;
let areasGrid = null;
let reportsList = null;

let themeToggle = null;
let themeIcon = null;
let themeText = null;

let reportModal = null;
let reportBtn = null;
let reportHeaderBtn = null;
let closeModal = null;

let nextBtn = null;
let backBtn = null;

let reportPlace = null;
let priceInput = null;
let priceWarning = null;
let minimumPrice = null;
let confirmationData = null;

let availabilityText = null;
let availabilityScore = null;
let statusDot = null;
let progressBar = null;

let availableReports = null;
let limitedReports = null;
let emptyReports = null;
let lastUpdate = null;


/* ============================================================
   3. الثوابت
   ============================================================ */

const REPORTS_KEY =
    "maa_qarib_reports";

const THEME_KEY =
    "maa_qarib_theme";

const MAP_URL =
    "https://raw.githubusercontent.com/premisedata/topojson/main/24_governorates.geojson";

const REPORTS_TABLE =
    "reports";


/* ============================================================
   4. الولايات الـ24
   ============================================================ */

const GOVERNORATES = [
    "تونس",
    "أريانة",
    "بن عروس",
    "منوبة",

    "نابل",
    "زغوان",
    "بنزرت",

    "باجة",
    "جندوبة",
    "الكاف",
    "سليانة",

    "سوسة",
    "المنستير",
    "المهدية",

    "صفاقس",

    "القيروان",
    "القصرين",
    "سيدي بوزيد",

    "قابس",
    "مدنين",
    "تطاوين",

    "قفصة",
    "توزر",
    "قبلي"
];


/* ============================================================
   5. المعتمديات
   ============================================================ */

const Tunisia = {

    "تونس": [
        "تونس المدينة",
        "باب البحر",
        "باب سويقة",
        "العمران",
        "العمران الأعلى",
        "التحرير",
        "الزهور",
        "الحرائرية",
        "قرطاج",
        "المرسى",
        "سيدي بوسعيد"
    ],

    "أريانة": [
        "أريانة المدينة",
        "أريانة العليا",
        "المنيهلة",
        "حي التضامن",
        "سكرة",
        "رواد",
        "قلعة الأندلس",
        "سيدي ثابت"
    ],

    "بن عروس": [
        "بن عروس",
        "بومهل البساتين",
        "المدينة الجديدة",
        "المروج",
        "حمام الأنف",
        "حمام الشط",
        "المحمدية",
        "مرناق",
        "رادس"
    ],

    "منوبة": [
        "منوبة",
        "البطان",
        "برج العامري",
        "الجديدة",
        "دوار هيشر",
        "المرناقية",
        "وادي الليل"
    ],

    "نابل": [
        "نابل",
        "بني خلاد",
        "بني خيار",
        "بوعرقوب",
        "دار شعبان الفهري",
        "الحمامات",
        "قربة",
        "قليبية",
        "منزل بوزلفة",
        "منزل تميم",
        "سليمان",
        "تاكلسة"
    ],

    "زغوان": [
        "زغوان",
        "الفحص",
        "الناظور",
        "صواف",
        "بئر مشارقة",
        "الزريبة"
    ],

    "بنزرت": [
        "بنزرت الشمالية",
        "بنزرت الجنوبية",
        "أوتيك",
        "جومين",
        "غار الملح",
        "غزالة",
        "ماطر",
        "منزل بورقيبة",
        "منزل جميل",
        "رأس الجبل",
        "سجنان",
        "تينجة",
        "العالية"
    ],

    "باجة": [
        "باجة الشمالية",
        "باجة الجنوبية",
        "عمدون",
        "قبلاط",
        "مجاز الباب",
        "نفزة",
        "تبرسق",
        "تستور",
        "تيبار"
    ],

    "جندوبة": [
        "جندوبة",
        "جندوبة الشمالية",
        "بوسالم",
        "بلطة بوعوان",
        "فرنانة",
        "غار الدماء",
        "وادي مليز",
        "طبرقة",
        "عين دراهم"
    ],

    "الكاف": [
        "الكاف الشرقية",
        "الكاف الغربية",
        "الدهماني",
        "السرس",
        "القلعة الخصبة",
        "القصور",
        "نبر",
        "تاجروين",
        "الجريصة",
        "قلعة سنان"
    ],

    "سليانة": [
        "سليانة الشمالية",
        "سليانة الجنوبية",
        "بوعرادة",
        "العروسة",
        "قعفور",
        "كسرى",
        "مكثر",
        "الروحية",
        "سيدي بورويس"
    ],

    "سوسة": [
        "سوسة المدينة",
        "سوسة جوهرة",
        "سوسة الرياض",
        "سوسة سيدي عبد الحميد",
        "أكودة",
        "بوفيشة",
        "النفيضة",
        "القلعة الكبرى",
        "القلعة الصغرى",
        "حمام سوسة",
        "هرقلة",
        "سيدي بوعلي",
        "سيدي الهاني",
        "مساكن"
    ],

    "المنستير": [
        "المنستير",
        "بنبلة",
        "بني حسان",
        "جمال",
        "زرمدين",
        "قصر هلال",
        "قصيبة المديوني",
        "المكنين",
        "الساحلين",
        "صيادة لمطة بوحجر",
        "طبلبة",
        "الوردانين"
    ],

    "المهدية": [
        "المهدية",
        "بومرداس",
        "الشابة",
        "شربان",
        "الجم",
        "قصور الساف",
        "ملولش",
        "سيدي علوان"
    ],

    "صفاقس": [
        "صفاقس المدينة",
        "صفاقس الغربية",
        "صفاقس الجنوبية",
        "صفاقس الشمالية",
        "العين",
        "عقارب",
        "جبنيانة",
        "الحنشة",
        "قرقنة",
        "المحرس",
        "منزل شاكر",
        "ساقية الدائر",
        "ساقية الزيت"
    ],

    "القيروان": [
        "القيروان الشمالية",
        "القيروان الجنوبية",
        "عين جلولة",
        "بوحجلة",
        "الشراردة",
        "حفوز",
        "حاجب العيون",
        "نصر الله",
        "السبيخة",
        "الوسلاتية",
        "الشبيكة"
    ],

    "القصرين": [
        "القصرين الشمالية",
        "القصرين الجنوبية",
        "العيون",
        "حاسي الفريد",
        "جدليان",
        "فوسانة",
        "فريانة",
        "ماجل بلعباس",
        "سبيطلة",
        "سبيبة",
        "تالة"
    ],

    "سيدي بوزيد": [
        "سيدي بوزيد الغربية",
        "سيدي بوزيد الشرقية",
        "بئر الحفي",
        "جلمة",
        "الرقاب",
        "السبالة",
        "سيدي علي بن عون",
        "سوق الجديد",
        "المكناسي",
        "المزونة",
        "منزل بوزيان"
    ],

    "قابس": [
        "قابس المدينة",
        "قابس الغربية",
        "قابس الجنوبية",
        "الحامة",
        "مارث",
        "مطماطة",
        "مطماطة الجديدة",
        "منزل الحبيب",
        "المطوية",
        "وذرف"
    ],

    "مدنين": [
        "مدنين الشمالية",
        "مدنين الجنوبية",
        "بن قردان",
        "بني خداش",
        "جرجيس",
        "جربة أجيم",
        "جربة حومة السوق",
        "جربة ميدون",
        "سيدي مخلوف"
    ],

    "تطاوين": [
        "تطاوين الشمالية",
        "تطاوين الجنوبية",
        "بئر الأحمر",
        "الذهيبة",
        "غمراسن",
        "رمادة",
        "الصمار"
    ],

    "قفصة": [
        "قفصة الشمالية",
        "قفصة الجنوبية",
        "بلخير",
        "القطار",
        "القصر",
        "المظيلة",
        "الرديف",
        "السند",
        "سيدي عيش",
        "أم العرائس",
        "زانوش"
    ],

    "توزر": [
        "توزر",
        "دقاش",
        "حامة الجريد",
        "نفطة",
        "تمغزة"
    ],

    "قبلي": [
        "قبلي الشمالية",
        "قبلي الجنوبية",
        "الفوار",
        "دوز الشمالية",
        "دوز الجنوبية",
        "سوق الأحد"
    ]
};


/* ============================================================
   6. ألوان حالات الماء
   ============================================================ */

const STATUS = {

    available: {
        icon: "🟢",
        text: "متوفر",
        color: "#22c55e",
        className: "green"
    },

    limited: {
        icon: "🟠",
        text: "ناقص",
        color: "#f59e0b",
        className: "orange"
    },

    empty: {
        icon: "🔴",
        text: "مفقود",
        color: "#ef4444",
        className: "red"
    },

    unknown: {
        icon: "⚪",
        text: "لا توجد معلومات",
        color: "#cfcfcf",
        className: "gray"
    }
};


/* ============================================================
   7. حالة التطبيق
   ============================================================ */

let currentStep = 1;

let reportsCache = [];

let reportsLoaded = false;

let reportSending = false;

let mapData = null;

let mapSvg = null;

let mapProjection = null;

let reportData = {
    availability: "",
    governorate: "",
    delegation: "",
    place: "",
    size: "",
    price: ""
};


/* ============================================================
   8. أسماء GeoJSON
   ============================================================ */

const NAME_MAP = {

    "Tunis": "تونس",
    "Tunis Governorate": "تونس",

    "Ariana": "أريانة",
    "Ariana Governorate": "أريانة",

    "Ben Arous": "بن عروس",
    "Ben Arous Governorate": "بن عروس",

    "Manouba": "منوبة",
    "Manouba Governorate": "منوبة",

    "Nabeul": "نابل",
    "Nabeul Governorate": "نابل",

    "Zaghouan": "زغوان",
    "Zaghouan Governorate": "زغوان",

    "Bizerte": "بنزرت",
    "Bizerte Governorate": "بنزرت",

    "Beja": "باجة",
    "Béja": "باجة",
    "Beja Governorate": "باجة",

    "Jendouba": "جندوبة",
    "Jendouba Governorate": "جندوبة",

    "Kef": "الكاف",
    "Le Kef": "الكاف",
    "Kef Governorate": "الكاف",
    "Le Kef Governorate": "الكاف",

    "Siliana": "سليانة",
    "Siliana Governorate": "سليانة",

    "Sousse": "سوسة",
    "Sousse Governorate": "سوسة",

    "Monastir": "المنستير",
    "Monastir Governorate": "المنستير",

    "Mahdia": "المهدية",
    "Mahdia Governorate": "المهدية",

    "Sfax": "صفاقس",
    "Sfax Governorate": "صفاقس",

    "Kairouan": "القيروان",
    "Kairouan Governorate": "القيروان",

    "Kasserine": "القصرين",
    "Kasserine Governorate": "القصرين",

    "Sidi Bouzid": "سيدي بوزيد",

    "Gabes": "قابس",
    "Gabès": "قابس",

    "Medenine": "مدنين",

    "Tataouine": "تطاوين",

    "Gafsa": "قفصة",

    "Tozeur": "توزر",

    "Kebili": "قبلي",
    "Kébili": "قبلي"
};


/* ============================================================
   9. تنظيف أسماء الولايات
   ============================================================ */

function normalizeText(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .normalize("NFKC")
        .replace(
            /[\u064B-\u065F\u0670\u06D6-\u06ED]/g,
            ""
        )
        .replace(/\u0640/g, "")
        .replace(
            /[\u200B-\u200F\u202A-\u202E\uFEFF]/g,
            ""
        )
        .replace(/[إأآا]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .trim()
        .toLowerCase();
}


const normalizedNames = {};

GOVERNORATES.forEach(
    function (name) {

        normalizedNames[
            normalizeText(name)
        ] = name;

    }
);


Object.keys(NAME_MAP).forEach(
    function (name) {

        normalizedNames[
            normalizeText(name)
        ] = NAME_MAP[name];

    }
);


/* ============================================================
   10. استخراج اسم الولاية من GeoJSON
   ============================================================ */

function getGovernorateName(properties) {

    if (!properties) {
        return "";
    }

    const candidates = [

        properties.NAME_AR,
        properties.name_ar,
        properties.gouv_ar,
        properties.gov_ar,

        properties.NAME_EN,
        properties.name_en,

        properties.gouvernorat,
        properties.Gouvernorat,

        properties.name,
        properties.Name,

        properties.nom,
        properties.NOM,

        properties.GOVERNORATE,
        properties.governorate,

        properties.gouv_fr,
        properties.NAME_FR,
        properties.name_fr

    ];


    for (
        const candidate of candidates
    ) {

        if (!candidate) {
            continue;
        }


        const normalized =
            normalizeText(candidate);


        if (
            normalizedNames[normalized]
        ) {

            return normalizedNames[
                normalized
            ];
        }
    }


    return "";
}


/* ============================================================
   11. حالة Supabase
   ============================================================ */

function normalizeStatus(value) {

    const v =
        normalizeText(value);


    if (
        [
            "available",
            "present",
            "ok",
            "green",
            "موجود",
            "متوفر"
        ].includes(v)
    ) {
        return "available";
    }


    if (
        [
            "limited",
            "limit",
            "orange",
            "ناقص",
            "نقص",
            "محدود",
            "محدودة"
        ].includes(v)
    ) {
        return "limited";
    }


    if (
        [
            "empty",
            "offline",
            "outage",
            "red",
            "مفقود",
            "مقطوع",
            "قطع",
            "ما لقيتش"
        ].includes(v)
    ) {
        return "empty";
    }


    return "unknown";
}


function getStatus(status) {

    return (
        STATUS[
            normalizeStatus(status)
        ] ||
        STATUS.unknown
    );
}


/* ============================================================
   12. حماية HTML
   ============================================================ */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ============================================================
   13. الوقت
   ============================================================ */

function formatTime(dateString) {

    if (!dateString) {
        return "منذ لحظات";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "منذ لحظات";
    }


    const seconds =
        Math.max(
            0,
            Math.floor(
                (
                    Date.now() -
                    date.getTime()
                ) / 1000
            )
        );


    if (seconds < 60) {
        return "منذ لحظات";
    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return (
            "منذ " +
            minutes +
            " دقيقة"
        );
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return (
            "منذ " +
            hours +
            " ساعة"
        );
    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days === 1) {
        return "أمس";
    }


    return (
        "منذ " +
        days +
        " أيام"
    );
}


/* ============================================================
   14. Normalize Report
   ============================================================ */

function normalizeReport(report) {

    return {

        id:
            report.id,

        governorate:
            report.governorate ||
            "",

        delegation:
            report.delegation ||
            "",

        place:
            report.place ||
            "",

        availability:
            normalizeStatus(
                report.availability
            ),

        size:
            report.size ||
            "",

        price:
            (
                report.price === null ||
                report.price === undefined
            )
                ? ""
                : report.price,

        createdAt:
            report.created_at ||
            report.createdAt ||
            new Date().toISOString()

    };
}


/* ============================================================
   15. LocalStorage
   ============================================================ */

function getLocalReports() {

    try {

        const saved =
            localStorage.getItem(
                REPORTS_KEY
            );


        if (!saved) {
            return [];
        }


        const parsed =
            JSON.parse(saved);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.warn(
            "LocalStorage error:",
            error
        );

        return [];
    }
}


function saveLocalReports() {

    try {

        localStorage.setItem(
            REPORTS_KEY,
            JSON.stringify(
                reportsCache.slice(0, 300)
            )
        );

    } catch (error) {

        console.warn(
            "LocalStorage save error:",
            error
        );
    }
}


function getReports() {

    return reportsCache.length
        ? reportsCache
        : getLocalReports();
}


/* ============================================================
   16. Supabase Init
   ============================================================ */

function initSupabase() {

    try {

        if (
            !window.supabase
        ) {

            console.error(
                "Supabase library not found."
            );

            return false;
        }


        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );


        console.log(
            "✅ Supabase connected"
        );


        return true;

    } catch (error) {

        console.error(
            "Supabase init error:",
            error
        );

        return false;
    }
}


/* ============================================================
   17. تحميل Reports
   ============================================================ */

async function loadReportsFromSupabase() {

    if (!supabaseClient) {
        return;
    }


    try {

        const result =
            await supabaseClient
                .from(
                    REPORTS_TABLE
                )
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(500);


        if (result.error) {
            throw result.error;
        }


        reportsCache =
            (result.data || [])
                .map(
                    normalizeReport
                );


        reportsLoaded = true;


        saveLocalReports();


        renderEverything();


        console.log(
            "✅ Reports loaded:",
            reportsCache.length
        );

    } catch (error) {

        console.error(
            "Supabase load error:",
            error
        );


        /*
         * إذا Supabase موش متاحة،
         * نستعمل cache فقط.
         */

        if (!reportsLoaded) {

            reportsCache =
                getLocalReports()
                    .map(
                        normalizeReport
                    );
        }


        reportsLoaded = true;


        renderEverything();
    }
}


/* ============================================================
   18. آخر Report لولاية
   ============================================================ */

function getLatestGovernorateReport(
    gov
) {

    const reports =
        getReports()
            .filter(
                function (report) {

                    return (
                        report.governorate ===
                        gov
                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                    );

                }
            );


    return reports[0] || null;
}


/* ============================================================
   19. حالة الولاية في الخريطة
   ============================================================ */

function getGovernorateStatus(
    gov
) {

    const latest =
        getLatestGovernorateReport(
            gov
        );


    if (!latest) {
        return "unknown";
    }


    return normalizeStatus(
        latest.availability
    );
}


/* ============================================================
   20. تحميل الولايات في Select
   ============================================================ */

function loadGovernorates() {

    if (!governorate) {
        return;
    }


    governorate.innerHTML =
        "";


    const firstOption =
        document.createElement(
            "option"
        );


    firstOption.value = "";

    firstOption.textContent =
        "اختار الولاية";


    governorate.appendChild(
        firstOption
    );


    GOVERNORATES.forEach(
        function (name) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                name;


            option.textContent =
                name;


            governorate.appendChild(
                option
            );

        }
    );
}


/* ============================================================
   21. تحميل المعتمديات
   ============================================================ */

function loadDelegations(
    gov
) {

    if (!delegation) {
        return;
    }


    delegation.innerHTML =
        "";


    const firstOption =
        document.createElement(
            "option"
        );


    firstOption.value = "";

    firstOption.textContent =
        "اختار المعتمدية";


    delegation.appendChild(
        firstOption
    );


    delegation.disabled =
        !gov;


    if (
        !gov ||
        !Tunisia[gov]
    ) {
        return;
    }


    Tunisia[gov].forEach(
        function (name) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                name;


            option.textContent =
                name;


            delegation.appendChild(
                option
            );

        }
    );
}


/* ============================================================
   22. أحداث الولاية
   ============================================================ */

function setupLocationEvents() {

    if (governorate) {

        governorate.addEventListener(
            "change",
            function () {

                const gov =
                    governorate.value;


                loadDelegations(
                    gov
                );


                if (selectedLocation) {

                    selectedLocation.textContent =
                        gov ||
                        "اختار موقعك";
                }


                reportData.governorate =
                    gov;


                reportData.delegation =
                    "";


                renderEverything();
            }
        );
    }


    if (delegation) {

        delegation.addEventListener(
            "change",
            function () {

                const gov =
                    governorate
                        ? governorate.value
                        : "";


                const del =
                    delegation.value;


                reportData.governorate =
                    gov;


                reportData.delegation =
                    del;


                if (selectedLocation) {

                    selectedLocation.textContent =
                        gov && del
                            ? gov +
                              " — " +
                              del
                            : gov ||
                              "اختار موقعك";
                }


                renderEverything();
            }
        );
    }
}


/* ============================================================
   23. Dashboard Reset
   ============================================================ */

function resetDashboard() {

    availabilityText =
        document.getElementById(
            "availabilityText"
        );

    availabilityScore =
        document.getElementById(
            "availabilityScore"
        );

    statusDot =
        document.getElementById(
            "statusDot"
        );

    progressBar =
        document.getElementById(
            "progressBar"
        );

    availableReports =
        document.getElementById(
            "availableReports"
        );

    limitedReports =
        document.getElementById(
            "limitedReports"
        );

    emptyReports =
        document.getElementById(
            "emptyReports"
        );

    lastUpdate =
        document.getElementById(
            "lastUpdate"
        );


    if (availabilityText) {

        availabilityText.textContent =
            "لا توجد معلومات";
    }


    if (availabilityScore) {

        availabilityScore.textContent =
            "--";
    }


    if (statusDot) {

        statusDot.style.background =
            STATUS.unknown.color;
    }


    if (progressBar) {

        progressBar.style.width =
            "0%";
    }


    if (availableReports) {

        availableReports.textContent =
            "0";
    }


    if (limitedReports) {

        limitedReports.textContent =
            "0";
    }


    if (emptyReports) {

        emptyReports.textContent =
            "0";
    }


    if (lastUpdate) {

        lastUpdate.textContent =
            "--";
    }


    if (areasGrid) {
        areasGrid.innerHTML = "";
    }


    if (reportsList) {

        reportsList.innerHTML =
            `
            <div class="empty-reports">
                اختار الولاية والمعتمدية باش تظهر البلاغات.
            </div>
            `;
    }
}


/* ============================================================
   24. Dashboard
   ============================================================ */

function renderDashboard(
    gov,
    del
) {

    if (!gov || !del) {

        resetDashboard();

        return;
    }


    const reports =
        getReports()
            .filter(
                function (report) {

                    return (
                        report.governorate === gov &&
                        report.delegation === del
                    );
                }
            )
            .sort(
                function (a, b) {

                    return (
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                    );

                }
            );


    const available =
        reports.filter(
            r =>
                r.availability ===
                "available"
        ).length;


    const limited =
        reports.filter(
            r =>
                r.availability ===
                "limited"
        ).length;


    const empty =
        reports.filter(
            r =>
                r.availability ===
                "empty"
        ).length;


    const total =
        reports.length;


    const availableEl =
        document.getElementById(
            "availableReports"
        );


    const limitedEl =
        document.getElementById(
            "limitedReports"
        );


    const emptyEl =
        document.getElementById(
            "emptyReports"
        );


    if (availableEl) {
        availableEl.textContent =
            available;
    }


    if (limitedEl) {
        limitedEl.textContent =
            limited;
    }


    if (emptyEl) {
        emptyEl.textContent =
            empty;
    }


    const text =
        document.getElementById(
            "availabilityText"
        );


    const score =
        document.getElementById(
            "availabilityScore"
        );


    const dot =
        document.getElementById(
            "statusDot"
        );


    const progress =
        document.getElementById(
            "progressBar"
        );


    const last =
        document.getElementById(
            "lastUpdate"
        );


    if (!total) {

        if (text) {
            text.textContent =
                "لا توجد معلومات";
        }


        if (score) {
            score.textContent =
                "--";
        }


        if (dot) {
            dot.style.background =
                STATUS.unknown.color;
        }


        if (progress) {
            progress.style.width =
                "0%";
        }


        if (last) {
            last.textContent =
                "--";
        }


        return;
    }


    /*
     * حساب نسبة توفر تقريبية
     */

    const availabilityScore =
        Math.round(
            (
                available +
                limited * 0.5
            ) /
            total *
            100
        );


    let status =
        "empty";


    if (
        availabilityScore >= 70
    ) {

        status =
            "available";

    } else if (
        availabilityScore >= 35
    ) {

        status =
            "limited";
    }


    const info =
        getStatus(
            status
        );


    if (text) {
        text.textContent =
            info.text;
    }


    if (score) {
        score.textContent =
            availabilityScore +
            "%";
    }


    if (dot) {
        dot.style.background =
            info.color;
    }


    if (progress) {
        progress.style.width =
            availabilityScore +
            "%";
    }


    if (
        last &&
        reports[0]
    ) {

        last.textContent =
            "آخر تحديث " +
            formatTime(
                reports[0].createdAt
            );
    }
}


/* ============================================================
   25. المناطق القريبة
   ============================================================ */

function renderNearbyAreas(
    gov,
    selected
) {

    if (!areasGrid) {
        return;
    }


    if (!gov) {

        areasGrid.innerHTML = "";

        return;
    }


    const areas =
        (
            Tunisia[gov] ||
            []
        )
            .filter(
                area =>
                    area !== selected
            )
            .slice(
                0,
                6
            );


    areasGrid.innerHTML = "";


    areas.forEach(
        function (
            area,
            index
        ) {

            const reports =
                getReports()
                    .filter(
                        function (report) {

                            return (
                                report.governorate ===
                                    gov &&
                                report.delegation ===
                                    area
                            );

                        }
                    )
                    .sort(
                        function (a, b) {

                            return (
                                new Date(
                                    b.createdAt
                                ) -
                                new Date(
                                    a.createdAt
                                )
                            );

                        }
                    );


            const latest =
                reports[0];


            const status =
                latest
                    ? normalizeStatus(
                        latest.availability
                    )
                    : "unknown";


            const info =
                getStatus(
                    status
                );


            let price =
                "غير مذكور";


            if (
                latest &&
                latest.price !== "" &&
                latest.price !== null &&
                latest.price !== undefined
            ) {

                const number =
                    Number(
                        latest.price
                    );


                if (
                    Number.isFinite(
                        number
                    )
                ) {

                    price =
                        number.toFixed(3) +
                        " د.ت";
                }
            }


            const place =
                latest &&
                latest.place
                    ? latest.place
                    : "ما فماش معلومات";


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "area-card";


            card.innerHTML =
                `
                <div class="area-header">

                    <div>
                        <h3>
                            ${escapeHTML(area)}
                        </h3>
                    </div>

                    <span class="distance">
                        ${index + 1} كم تقريباً
                    </span>

                </div>


                <div class="area-status ${info.className}">

                    <span>
                        ${info.icon}
                    </span>

                    ${escapeHTML(info.text)}

                </div>


                <div class="area-price">

                    <span>
                        السعر
                    </span>

                    <strong>
                        ${escapeHTML(price)}
                    </strong>

                </div>


                <div class="area-meta">

                    📍
                    ${escapeHTML(place)}

                </div>
                `;


            areasGrid.appendChild(
                card
            );

        }
    );
}


/* ============================================================
   26. البلاغات
   ============================================================ */

function renderReports(
    gov,
    del
) {

    if (!reportsList) {
        return;
    }


    if (!gov || !del) {

        reportsList.innerHTML =
            `
            <div class="empty-reports">
                اختار الولاية والمعتمدية باش تظهر البلاغات.
            </div>
            `;

        return;
    }


    const reports =
        getReports()
            .filter(
                function (report) {

                    return (
                        report.governorate === gov &&
                        report.delegation === del
                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                    );

                }
            );


    if (!reports.length) {

        reportsList.innerHTML =
            `
            <div class="empty-reports">

                <span>
                    📍
                </span>

                <strong>
                    ما فماش بلاغات في المعتمدية توا
                </strong>

                <small>
                    كن أول شخص يبلّغ على الوضع.
                </small>

            </div>
            `;

        return;
    }


    reportsList.innerHTML =
        reports
            .slice(
                0,
                20
            )
            .map(
                function (report) {

                    const info =
                        getStatus(
                            report.availability
                        );


                    let price =
                        "غير مذكور";


                    if (
                        report.price !== "" &&
                        report.price !== null &&
                        report.price !== undefined
                    ) {

                        const number =
                            Number(
                                report.price
                            );


                        if (
                            Number.isFinite(
                                number
                            )
                        ) {

                            price =
                                number.toFixed(3) +
                                " د.ت";
                        }
                    }


                    return `
                    <article
                        class="report-item"
                    >

                        <div
                            class="report-item-main"
                        >

                            <div
                                class="report-item-title"
                            >

                                <strong>
                                    ${info.icon}
                                    ${escapeHTML(info.text)}
                                </strong>

                                <span>
                                    📍
                                    ${escapeHTML(
                                        report.place ||
                                        "بلاصة غير محددة"
                                    )}
                                </span>

                            </div>


                            <div
                                class="report-item-details"
                            >

                                ${
                                    report.size
                                        ? `
                                            <span>
                                                🧴
                                                ${escapeHTML(
                                                    report.size
                                                )}
                                                L
                                            </span>
                                          `
                                        : ""
                                }


                                ${
                                    report.availability !==
                                        "empty"
                                        ? `
                                            <span>
                                                💰
                                                ${escapeHTML(price)}
                                            </span>
                                          `
                                        : ""
                                }


                                <span>
                                    🕒
                                    ${formatTime(
                                        report.createdAt
                                    )}
                                </span>

                            </div>

                        </div>

                    </article>
                    `;
                }
            )
            .join("");
}


/* ============================================================
   27. تحديث كل شيء
   ============================================================ */

function renderEverything() {

    const gov =
        governorate
            ? governorate.value
            : "";


    const del =
        delegation
            ? delegation.value
            : "";


    if (
        gov &&
        del
    ) {

        renderDashboard(
            gov,
            del
        );


        renderNearbyAreas(
            gov,
            del
        );


        renderReports(
            gov,
            del
        );

    } else {

        resetDashboard();
    }


    drawMap();
}


/* ============================================================
   28. MODAL
   ============================================================ */

function openModal() {

    if (!reportModal) {
        return;
    }


    resetReport();


    reportModal.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );
}


function closeReportModal() {

    if (!reportModal) {
        return;
    }


    reportModal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );
}


/* ============================================================
   29. اختيار حالة الماء
   ============================================================ */

function setupAvailabilityButtons() {

    document
        .querySelectorAll(
            ".choice"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        document
                            .querySelectorAll(
                                ".choice"
                            )
                            .forEach(
                                function (btn) {

                                    btn.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        this.classList.add(
                            "selected"
                        );


                        reportData.availability =
                            this.dataset
                                .availability;


                        if (
                            reportData.availability ===
                            "empty"
                        ) {

                            reportData.size =
                                "";

                            reportData.price =
                                "";


                            if (priceInput) {
                                priceInput.value =
                                    "";
                            }


                            if (priceWarning) {
                                priceWarning.textContent =
                                    "";
                            }
                        }

                    }
                );
            }
        );
}


/* ============================================================
   30. حجم القارورة
   ============================================================ */

function setupBottleButtons() {

    document
        .querySelectorAll(
            ".bottle-choice"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        document
                            .querySelectorAll(
                                ".bottle-choice"
                            )
                            .forEach(
                                function (btn) {

                                    btn.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        this.classList.add(
                            "selected"
                        );


                        reportData.size =
                            this.dataset.size;

                    }
                );
            }
        );
}


/* ============================================================
   31. السعر
   ============================================================ */

function setupPrice() {

    if (!priceInput) {
        return;
    }


    priceInput.addEventListener(
        "input",
        function () {

            if (
                this.value === ""
            ) {

                reportData.price =
                    "";

                if (priceWarning) {
                    priceWarning.textContent =
                        "";
                }

                return;
            }


            const value =
                Number(
                    this.value
                );


            if (
                !Number.isFinite(value) ||
                value < 0
            ) {

                if (priceWarning) {

                    priceWarning.textContent =
                        "دخل سعر صحيح.";
                }

                return;
            }


            reportData.price =
                value;


            if (priceWarning) {
                priceWarning.textContent =
                    "";
            }
        }
    );
}


/* ============================================================
   32. فتح الأزرار
   ============================================================ */

function setupModalButtons() {

    if (reportBtn) {

        reportBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openModal();

            }
        );
    }


    if (reportHeaderBtn) {

        reportHeaderBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openModal();

            }
        );
    }


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeReportModal
        );
    }


    if (reportModal) {

        const overlay =
            reportModal.querySelector(
                ".modal-overlay"
            );


        if (overlay) {

            overlay.addEventListener(
                "click",
                closeReportModal
            );
        }
    }
}


/* ============================================================
   33. Reset Report
   ============================================================ */

function resetReport() {

    reportData = {

        availability: "",

        governorate:
            governorate
                ? governorate.value
                : "",

        delegation:
            delegation
                ? delegation.value
                : "",

        place: "",

        size: "",

        price: ""
    };


    document
        .querySelectorAll(
            ".choice"
        )
        .forEach(
            function (button) {

                button.classList.remove(
                    "selected"
                );

            }
        );


    document
        .querySelectorAll(
            ".bottle-choice"
        )
        .forEach(
            function (button) {

                button.classList.remove(
                    "selected"
                );

            }
        );


    if (reportPlace) {
        reportPlace.value = "";
    }


    if (priceInput) {
        priceInput.value = "";
    }


    if (priceWarning) {
        priceWarning.textContent = "";
    }


    if (minimumPrice) {
        minimumPrice.textContent =
            "-- د.ت";
    }


    showStep(1);
}


/* ============================================================
   34. خطوات البلاغ
   ============================================================ */

function showStep(
    step
) {

    document
        .querySelectorAll(
            ".report-step"
        )
        .forEach(
            function (element) {

                element.classList.remove(
                    "active"
                );

            }
        );


    const target =
        document.getElementById(
            "step" + step
        );


    if (target) {

        target.classList.add(
            "active"
        );
    }


    currentStep =
        step;


    if (backBtn) {

        backBtn.style.visibility =
            step === 1
                ? "hidden"
                : "visible";
    }


    if (nextBtn) {

        nextBtn.textContent =
            step === 4
                ? "إرسال البلاغ"
                : "التالي";
    }
}


/* ============================================================
   35. التحقق
   ============================================================ */

function validateStep() {

    if (
        currentStep === 1
    ) {

        if (
            !reportData.availability
        ) {

            alert(
                "اختار حالة الماء أولاً."
            );

            return false;
        }


        if (
            !governorate ||
            !governorate.value
        ) {

            alert(
                "اختار الولاية."
            );

            return false;
        }


        if (
            !delegation ||
            !delegation.value
        ) {

            alert(
                "اختار المعتمدية."
            );

            return false;
        }


        const place =
            reportPlace
                ? reportPlace.value.trim()
                : "";


        if (!place) {

            alert(
                "اكتب النهج ولا البلاصة وين لقيت الماء."
            );


            if (reportPlace) {
                reportPlace.focus();
            }


            return false;
        }


        reportData.governorate =
            governorate.value;


        reportData.delegation =
            delegation.value;


        reportData.place =
            place;
    }


    if (
        currentStep === 2 &&
        reportData.availability !==
            "empty" &&
        !reportData.size
    ) {

        alert(
            "اختار حجم القارورة."
        );

        return false;
    }


    if (
        currentStep === 3 &&
        reportData.availability !==
            "empty"
    ) {

        if (
            !priceInput ||
            priceInput.value === ""
        ) {

            alert(
                "دخل السعر."
            );


            if (priceInput) {
                priceInput.focus();
            }


            return false;
        }


        const price =
            Number(
                priceInput.value
            );


        if (
            !Number.isFinite(price) ||
            price < 0
        ) {

            alert(
                "دخل سعر صحيح."
            );

            return false;
        }


        reportData.price =
            price;
    }


    return true;
}


/* ============================================================
   36. التأكيد
   ============================================================ */

function prepareConfirmation() {

    if (!confirmationData) {
        return;
    }


    const info =
        getStatus(
            reportData.availability
        );


    let html =
        `
        <div class="confirmation-row">

            <span>
                الولاية
            </span>

            <strong>
                ${escapeHTML(
                    reportData.governorate
                )}
            </strong>

        </div>


        <div class="confirmation-row">

            <span>
                المعتمدية
            </span>

            <strong>
                ${escapeHTML(
                    reportData.delegation
                )}
            </strong>

        </div>


        <div class="confirmation-row">

            <span>
                النهج / البلاصة
            </span>

            <strong>
                ${escapeHTML(
                    reportData.place
                )}
            </strong>

        </div>


        <div class="confirmation-row">

            <span>
                الحالة
            </span>

            <strong>
                ${info.icon}
                ${escapeHTML(
                    info.text
                )}
            </strong>

        </div>
        `;


    if (
        reportData.availability !==
        "empty"
    ) {

        html +=
            `
            <div class="confirmation-row">

                <span>
                    حجم القارورة
                </span>

                <strong>
                    ${escapeHTML(
                        reportData.size
                    )} L
                </strong>

            </div>


            <div class="confirmation-row">

                <span>
                    السعر
                </span>

                <strong>
                    ${Number(
                        reportData.price
                    ).toFixed(3)} د.ت
                </strong>

            </div>
            `;
    }


    confirmationData.innerHTML =
        html;
}


/* ============================================================
   37. زر التالي
   ============================================================ */

function setupNextButton() {

    if (!nextBtn) {
        return;
    }


    nextBtn.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            if (reportSending) {
                return;
            }


            if (
                !validateStep()
            ) {
                return;
            }


            /*
             * إذا الماء مفقود:
             * نمشيو للتأكيد مباشرة.
             */

            if (
                currentStep === 1 &&
                reportData.availability ===
                    "empty"
            ) {

                prepareConfirmation();

                showStep(4);

                return;
            }


            if (
                currentStep < 4
            ) {

                if (
                    currentStep === 3
                ) {

                    prepareConfirmation();
                }


                showStep(
                    currentStep + 1
                );

            } else {

                await submitReport();
            }

        }
    );
}


/* ============================================================
   38. زر الرجوع
   ============================================================ */

function setupBackButton() {

    if (!backBtn) {
        return;
    }


    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (
                currentStep <= 1
            ) {
                return;
            }


            if (
                currentStep === 4 &&
                reportData.availability ===
                    "empty"
            ) {

                showStep(1);

                return;
            }


            showStep(
                currentStep - 1
            );
        }
    );
}


/* ============================================================
   39. إرسال البلاغ إلى Supabase
   ============================================================ */

async function submitReport() {

    if (reportSending) {
        return;
    }


    if (!supabaseClient) {

        alert(
            "Supabase موش مربوط."
        );

        return;
    }


    reportSending =
        true;


    if (nextBtn) {

        nextBtn.disabled =
            true;

        nextBtn.textContent =
            "جاري الإرسال...";
    }


    try {

        let price =
            null;


        if (
            reportData.availability !==
                "empty" &&
            reportData.price !== "" &&
            reportData.price !== null &&
            reportData.price !== undefined
        ) {

            const number =
                Number(
                    reportData.price
                );


            if (
                Number.isFinite(
                    number
                )
            ) {

                price =
                    number;
            }
        }


        const newReport = {

            governorate:
                reportData.governorate,

            delegation:
                reportData.delegation,

            place:
                reportData.place,

            availability:
                reportData.availability,

            size:
                reportData.availability ===
                    "empty"
                    ? null
                    : (
                        reportData.size ||
                        null
                    ),

            price:
                reportData.availability ===
                    "empty"
                    ? null
                    : price,

            created_at:
                new Date().toISOString()
        };


        const result =
            await supabaseClient
                .from(
                    REPORTS_TABLE
                )
                .insert(
                    newReport
                )
                .select()
                .single();


        if (result.error) {
            throw result.error;
        }


        /*
         * نضيف البلاغ مباشرة للـcache
         */

        if (result.data) {

            reportsCache.unshift(
                normalizeReport(
                    result.data
                )
            );

            reportsCache =
                reportsCache.slice(
                    0,
                    500
                );
        }


        reportsLoaded =
            true;


        saveLocalReports();


        /*
         * اللون يتحدث مباشرة
         */

        drawMap();


        renderEverything();


        closeReportModal();


        alert(
            "يعطيك الصحة 💧\nتم تسجيل البلاغ بنجاح!"
        );


        if (selectedLocation) {

            selectedLocation.textContent =
                reportData.governorate +
                " — " +
                reportData.delegation;
        }


        resetReport();


    } catch (error) {

        console.error(
            "❌ Supabase submit error:",
            error
        );


        alert(
            "ما نجّمش نسجّل البلاغ توا.\nتأكد من الإنترنت وإعدادات Supabase وحاول مرة أخرى."
        );


    } finally {

        reportSending =
            false;


        if (nextBtn) {

            nextBtn.disabled =
                false;

            nextBtn.textContent =
                currentStep === 4
                    ? "إرسال البلاغ"
                    : "التالي";
        }
    }
}


/* ============================================================
   40. حساب نقاط الخريطة
   ============================================================ */

function collectPoints(
    geometry,
    output = []
) {

    if (!geometry) {
        return output;
    }


    function walk(
        value
    ) {

        if (
            !Array.isArray(
                value
            )
        ) {
            return;
        }


        if (
            value.length >= 2 &&
            typeof value[0] === "number" &&
            typeof value[1] === "number"
        ) {

            output.push(
                value
            );

            return;
        }


        value.forEach(
            walk
        );
    }


    walk(
        geometry.coordinates
    );


    return output;
}


/* ============================================================
   41. Bounding Box
   ============================================================ */

function getBounds(
    features
) {

    const points = [];


    features.forEach(
        function (feature) {

            collectPoints(
                feature.geometry,
                points
            );

        }
    );


    if (!points.length) {
        return null;
    }


    const xs =
        points.map(
            p => p[0]
        );


    const ys =
        points.map(
            p => p[1]
        );


    return {

        minX:
            Math.min(...xs),

        maxX:
            Math.max(...xs),

        minY:
            Math.min(...ys),

        maxY:
            Math.max(...ys)
    };
}


/* ============================================================
   42. Projection صحيحة
   ============================================================ */

function createProjection(
    bounds
) {

    const WIDTH =
        500;

    const HEIGHT =
        700;

    const PADDING =
        24;


    const midLat =
        (
            bounds.minY +
            bounds.maxY
        ) / 2;


    const correction =
        Math.cos(
            midLat *
            Math.PI /
            180
        );


    const geoWidth =
        (
            bounds.maxX -
            bounds.minX
        ) *
        correction;


    const geoHeight =
        bounds.maxY -
        bounds.minY;


    const availableWidth =
        WIDTH -
        PADDING * 2;


    const availableHeight =
        HEIGHT -
        PADDING * 2;


    const scale =
        Math.min(
            availableWidth /
                geoWidth,

            availableHeight /
                geoHeight
        );


    const finalWidth =
        geoWidth *
        scale;


    const finalHeight =
        geoHeight *
        scale;


    const offsetX =
        (
            WIDTH -
            finalWidth
        ) / 2;


    const offsetY =
        (
            HEIGHT -
            finalHeight
        ) / 2;


    return function (
        lon,
        lat
    ) {

        return {

            x:
                offsetX +
                (
                    lon -
                    bounds.minX
                ) *
                correction *
                scale,

            y:
                offsetY +
                (
                    bounds.maxY -
                    lat
                ) *
                scale
        };
    };
}


/* ============================================================
   43. Ring → SVG Path
   ============================================================ */

function ringToPath(
    ring,
    project
) {

    if (
        !ring ||
        !ring.length
    ) {
        return "";
    }


    return (
        ring
            .map(
                function (
                    point,
                    index
                ) {

                    const p =
                        project(
                            point[0],
                            point[1]
                        );


                    return (
                        index === 0
                            ? "M "
                            : "L "
                    ) +
                    p.x.toFixed(2) +
                    " " +
                    p.y.toFixed(2);

                }
            )
            .join(" ") +
        " Z"
    );
}


/* ============================================================
   44. Geometry → SVG Path
   ============================================================ */

function geometryToPath(
    geometry,
    project
) {

    if (!geometry) {
        return "";
    }


    if (
        geometry.type ===
        "Polygon"
    ) {

        return geometry.coordinates
            .map(
                ring =>
                    ringToPath(
                        ring,
                        project
                    )
            )
            .join(" ");
    }


    if (
        geometry.type ===
        "MultiPolygon"
    ) {

        return geometry.coordinates
            .map(
                polygon =>
                    polygon
                        .map(
                            ring =>
                                ringToPath(
                                    ring,
                                    project
                                )
                        )
                        .join(" ")
            )
            .join(" ");
    }


    return "";
}


/* ============================================================
   45. Centroid حقيقي تقريبي
   ============================================================ */

function getFeatureCenter(
    feature
) {

    const points =
        collectPoints(
            feature.geometry,
            []
        );


    if (!points.length) {
        return null;
    }


    let sumX = 0;

    let sumY = 0;


    points.forEach(
        function (point) {

            sumX +=
                point[0];

            sumY +=
                point[1];

        }
    );


    return {

        lon:
            sumX /
            points.length,

        lat:
            sumY /
            points.length
    };
}


/* ============================================================
   46. إضافة CSS للخريطة من JS
   بدون لمس style.css
   ============================================================ */

function injectMapStyles() {

    if (
        document.getElementById(
            "maa-qarib-map-styles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "maa-qarib-map-styles";


    style.textContent =
        `
        .tunisia-map {
            width: 100%;
            min-height: 420px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .tunisia-map svg {
            width: 100%;
            max-width: 620px;
            height: auto;
            display: block;
            overflow: visible;
        }

        .governorate-shape {
            cursor: pointer;
            stroke: #ffffff;
            stroke-width: 1.6;
            stroke-linejoin: round;
            vector-effect: non-scaling-stroke;
            transition:
                fill .25s ease,
                opacity .2s ease,
                filter .2s ease;
        }

        .governorate-shape:hover {
            opacity: .82;
            filter: brightness(.94);
        }

        .governorate-label {
            fill: #ffffff;
            font-family:
                Tahoma,
                Arial,
                sans-serif;
            font-weight: 800;
            paint-order: stroke fill;
            stroke: rgba(0,0,0,.48);
            stroke-width: 2.8;
            stroke-linejoin: round;
            pointer-events: none;
            user-select: none;
        }

        .governorate-label.small {
            font-size: 8px;
        }

        .governorate-label.normal {
            font-size: 10px;
        }

        .governorate-label.medium {
            font-size: 9px;
        }

        .map-status-tooltip {
            position: fixed;
            z-index: 999999;
            display: none;
            pointer-events: none;
            padding: 8px 12px;
            border-radius: 10px;
            background: rgba(20,25,35,.96);
            color: #ffffff;
            font-family:
                Tahoma,
                Arial,
                sans-serif;
            font-size: 13px;
            font-weight: 700;
            direction: rtl;
            box-shadow:
                0 8px 25px rgba(0,0,0,.20);
        }
        `;


    document.head.appendChild(
        style
    );
}


/* ============================================================
   47. Tooltip
   ============================================================ */

let mapTooltip = null;


function createMapTooltip() {

    if (mapTooltip) {
        return;
    }


    mapTooltip =
        document.createElement(
            "div"
        );


    mapTooltip.className =
        "map-status-tooltip";


    document.body.appendChild(
        mapTooltip
    );
}


function showMapTooltip(
    event,
    gov
) {

    createMapTooltip();


    const status =
        getGovernorateStatus(
            gov
        );


    const info =
        getStatus(
            status
        );


    mapTooltip.innerHTML =
        `
        <strong>
            ${escapeHTML(gov)}
        </strong>
        <br>
        ${info.icon}
        ${escapeHTML(info.text)}
        `;


    mapTooltip.style.display =
        "block";


    moveMapTooltip(
        event
    );
}


function moveMapTooltip(
    event
) {

    if (!mapTooltip) {
        return;
    }


    mapTooltip.style.left =
        (
            event.clientX +
            12
        ) +
        "px";


    mapTooltip.style.top =
        (
            event.clientY +
            12
        ) +
        "px";
}


function hideMapTooltip() {

    if (mapTooltip) {

        mapTooltip.style.display =
            "none";
    }
}


/* ============================================================
   48. رسم الخريطة
   ============================================================ */

function drawMap() {

    const container =
        document.querySelector(
            ".tunisia-map"
        );


    if (
        !container ||
        !mapData ||
        !Array.isArray(
            mapData.features
        )
    ) {
        return;
    }


    const features =
        mapData.features
            .filter(
                function (feature) {

                    const gov =
                        getGovernorateName(
                            feature.properties
                        );


                    return (
                        GOVERNORATES.includes(
                            gov
                        )
                    );

                }
            );


    /*
     * مهم:
     *
     * كل ولاية Feature مستقلة.
     *
     * نمنع التكرار.
     */

    const uniqueFeatures =
        [];

    const seen =
        new Set();


    features.forEach(
        function (feature) {

            const gov =
                getGovernorateName(
                    feature.properties
                );


            if (
                seen.has(gov)
            ) {
                return;
            }


            seen.add(gov);


            feature.properties =
                feature.properties ||
                {};


            feature.properties
                .arabicName =
                    gov;


            uniqueFeatures.push(
                feature
            );
        }
    );


    /*
     * لازم يكونو 24
     */

    console.log(
        "🇹🇳 عدد الولايات في الخريطة:",
        uniqueFeatures.length
    );


    if (
        uniqueFeatures.length !== 24
    ) {

        console.warn(
            "⚠️ GeoJSON لم يرجع 24 ولاية."
        );
    }


    const bounds =
        getBounds(
            uniqueFeatures
        );


    if (!bounds) {
        return;
    }


    const project =
        createProjection(
            bounds
        );


    mapProjection =
        project;


    const NS =
        "http://www.w3.org/2000/svg";


    const svg =
        document.createElementNS(
            NS,
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        "0 0 500 700"
    );


    svg.setAttribute(
        "role",
        "img"
    );


    svg.setAttribute(
        "aria-label",
        "خريطة تونس حسب توفر الماء"
    );


    svg.setAttribute(
        "xmlns",
        NS
    );


    /*
     * خلفية شفافة
     */

    const group =
        document.createElementNS(
            NS,
            "g"
        );


    const labels =
        document.createElementNS(
            NS,
            "g"
        );


    /*
     * ========================================================
     * رسم الولايات
     * ========================================================
     */

    uniqueFeatures.forEach(
        function (feature) {

            const gov =
                feature.properties
                    .arabicName;


            const status =
                getGovernorateStatus(
                    gov
                );


            const info =
                getStatus(
                    status
                );


            const path =
                document.createElementNS(
                    NS,
                    "path"
                );


            path.setAttribute(
                "d",
                geometryToPath(
                    feature.geometry,
                    project
                )
            );


            path.setAttribute(
                "class",
                "governorate-shape"
            );


            path.dataset
                .governorate =
                gov;


            /*
             * اللون حسب المعلومات
             */

            path.style.fill =
                info.color;


            path.setAttribute(
                "fill",
                info.color
            );


            path.setAttribute(
                "stroke",
                "#ffffff"
            );


            path.setAttribute(
                "stroke-width",
                "1.6"
            );


            path.setAttribute(
                "title",
                gov +
                " — " +
                info.text
            );


            /*
             * Click
             */

            path.addEventListener(
                "click",
                function () {

                    selectGovernorate(
                        gov
                    );

                }
            );


            /*
             * Hover
             */

            path.addEventListener(
                "mouseenter",
                function (event) {

                    this.style.opacity =
                        ".82";


                    showMapTooltip(
                        event,
                        gov
                    );

                }
            );


            path.addEventListener(
                "mousemove",
                function (event) {

                    moveMapTooltip(
                        event
                    );

                }
            );


            path.addEventListener(
                "mouseleave",
                function () {

                    this.style.opacity =
                        "1";


                    hideMapTooltip();

                }
            );


            group.appendChild(
                path
            );
        }
    );


    /*
     * ========================================================
     * أسماء الولايات
     * ========================================================
     *
     * نستعمل مركز الـFeature الحقيقي.
     * يعني ما عادش نحط:
     *
     * "المهدية" في بلاصة أخرى
     * "تطاوين" في 3 بلايص
     *
     * كل اسم يتحط مرة واحدة داخل الـFeature متاعو.
     * ========================================================
     */

    uniqueFeatures.forEach(
        function (feature) {

            const gov =
                feature.properties
                    .arabicName;


            const center =
                getFeatureCenter(
                    feature
                );


            if (!center) {
                return;
            }


            const p =
                project(
                    center.lon,
                    center.lat
                );


            const text =
                document.createElementNS(
                    NS,
                    "text"
                );


            text.setAttribute(
                "x",
                p.x
            );


            text.setAttribute(
                "y",
                p.y
            );


            text.setAttribute(
                "text-anchor",
                "middle"
            );


            text.setAttribute(
                "dominant-baseline",
                "middle"
            );


            text.setAttribute(
                "direction",
                "rtl"
            );


            text.setAttribute(
                "unicode-bidi",
                "plaintext"
            );


            text.setAttribute(
                "class",
                "governorate-label"
            );


            /*
             * الولايات الصغيرة
             * font أصغر.
             */

            if (
                [
                    "تونس",
                    "أريانة",
                    "بن عروس",
                    "منوبة",
                    "المنستير",
                    "المهدية"
                ].includes(gov)
            ) {

                text.classList.add(
                    "small"
                );

            } else if (
                [
                    "صفاقس",
                    "القيروان",
                    "القصرين",
                    "سيدي بوزيد",
                    "جندوبة"
                ].includes(gov)
            ) {

                text.classList.add(
                    "medium"
                );

            } else {

                text.classList.add(
                    "normal"
                );
            }


            text.textContent =
                gov;


            labels.appendChild(
                text
            );
        }
    );


    svg.appendChild(
        group
    );


    svg.appendChild(
        labels
    );


    /*
     * نستبدل الخريطة القديمة
     * بالخريطة الجديدة الكاملة.
     */

    container.innerHTML =
        "";


    container.appendChild(
        svg
    );


    mapSvg =
        svg;
}


/* ============================================================
   49. تحميل GeoJSON
   ============================================================ */

async function loadMap() {

    const container =
        document.querySelector(
            ".tunisia-map"
        );


    if (!container) {

        console.error(
            "❌ .tunisia-map غير موجودة في HTML"
        );

        return;
    }


    /*
     * Loading
     */

    container.innerHTML =
        `
        <div
            style="
                min-height:420px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-family:Tahoma,Arial,sans-serif;
                direction:rtl;
                color:#64748b;
            "
        >
            جاري تحميل خريطة تونس...
        </div>
        `;


    try {

        const response =
            await fetch(
                MAP_URL,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Map HTTP error: " +
                response.status
            );
        }


        const json =
            await response.json();


        if (
            !json ||
            json.type !==
                "FeatureCollection"
        ) {

            throw new Error(
                "GeoJSON غير صحيح"
            );
        }


        mapData =
            json;


        drawMap();


        console.log(
            "✅ خريطة تونس جاهزة"
        );


    } catch (error) {

        console.error(
            "❌ خطأ تحميل الخريطة:",
            error
        );


        /*
         * إذا صار خطأ، نعرض رسالة
         * بدل الخريطة الناقصة القديمة.
         */

        container.innerHTML =
            `
            <div
                style="
                    min-height:420px;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:center;
                    text-align:center;
                    direction:rtl;
                    font-family:Tahoma,Arial,sans-serif;
                    color:#64748b;
                    padding:25px;
                "
            >

                <div
                    style="
                        font-size:38px;
                        margin-bottom:10px;
                    "
                >
                    🗺️
                </div>

                <strong>
                    تعذّر تحميل الخريطة
                </strong>

                <small>
                    تأكد من اتصال الإنترنت ثم أعد تحميل الصفحة.
                </small>

            </div>
            `;
    }
}


/* ============================================================
   50. اختيار ولاية من الخريطة
   ============================================================ */

function selectGovernorate(
    gov
) {

    if (
        !GOVERNORATES.includes(
            gov
        )
    ) {
        return;
    }


    if (!governorate) {
        return;
    }


    const option =
        Array.from(
            governorate.options
        ).find(
            function (item) {

                return (
                    item.value ===
                    gov
                );

            }
        );


    if (!option) {
        return;
    }


    governorate.value =
        gov;


    governorate.dispatchEvent(
        new Event(
            "change",
            {
                bubbles: true
            }
        )
    );


    /*
     * نخليها محفوظة
     */

    try {

        localStorage.setItem(
            "maa_qarib_selected_governorate",
            gov
        );

    } catch (_) {}


    /*
     * Scroll للـdashboard
     */

    const dashboard =
        document.getElementById(
            "dashboard"
        );


    if (dashboard) {

        setTimeout(
            function () {

                dashboard.scrollIntoView(
                    {
                        behavior: "smooth",
                        block: "start"
                    }
                );

            },
            100
        );
    }
}


/* ============================================================
   51. Theme
   ============================================================ */

function setTheme(
    theme
) {

    if (
        theme !== "dark" &&
        theme !== "light"
    ) {

        theme =
            "light";
    }


    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );


    try {

        localStorage.setItem(
            THEME_KEY,
            theme
        );

    } catch (_) {}


    if (themeIcon) {

        themeIcon.textContent =
            theme === "dark"
                ? "☀️"
                : "🌙";
    }


    if (themeText) {

        themeText.textContent =
            theme === "dark"
                ? "الوضع الفاتح"
                : "الوضع الداكن";
    }
}


function initTheme() {

    let saved = null;


    try {

        saved =
            localStorage.getItem(
                THEME_KEY
            );

    } catch (_) {}


    if (
        saved === "dark" ||
        saved === "light"
    ) {

        setTheme(
            saved
        );

        return;
    }


    const prefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    setTheme(
        prefersDark
            ? "dark"
            : "light"
    );
}


function setupTheme() {

    if (!themeToggle) {
        return;
    }


    themeToggle.addEventListener(
        "click",
        function () {

            const current =
                document.documentElement
                    .getAttribute(
                        "data-theme"
                    );


            setTheme(
                current === "dark"
                    ? "light"
                    : "dark"
            );
        }
    );
}


/* ============================================================
   52. Supabase Realtime
   ============================================================ */

function setupRealtime() {

    if (!supabaseClient) {
        return;
    }


    try {

        supabaseClient
            .channel(
                "maa-qarib-reports"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: REPORTS_TABLE
                },
                function () {

                    /*
                     * نعاودو نجيبو آخر البيانات.
                     * هذا يضمن اللي اللون يعتمد
                     * على آخر report فعلي.
                     */

                    loadReportsFromSupabase();

                }
            )
            .subscribe(
                function (status) {

                    console.log(
                        "Supabase Realtime:",
                        status
                    );

                }
            );

    } catch (error) {

        console.warn(
            "Realtime error:",
            error
        );
    }
}


/* ============================================================
   53. تحديث تلقائي
   ============================================================ */

function setupAutoRefresh() {

    setInterval(
        function () {

            if (
                document.visibilityState ===
                "visible"
            ) {

                loadReportsFromSupabase();

            }

        },
        15000
    );


    window.addEventListener(
        "focus",
        function () {

            loadReportsFromSupabase();

        }
    );


    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "visible"
            ) {

                loadReportsFromSupabase();

            }

        }
    );
}


/* ============================================================
   54. ربط عناصر HTML
   ============================================================ */

function cacheDOM() {

    governorate =
        document.getElementById(
            "governorate"
        );


    delegation =
        document.getElementById(
            "delegation"
        );


    selectedLocation =
        document.getElementById(
            "selectedLocation"
        );


    areasGrid =
        document.getElementById(
            "areasGrid"
        );


    reportsList =
        document.getElementById(
            "reportsList"
        );


    themeToggle =
        document.getElementById(
            "themeToggle"
        );


    themeIcon =
        document.getElementById(
            "themeIcon"
        );


    themeText =
        document.getElementById(
            "themeText"
        );


    reportModal =
        document.getElementById(
            "reportModal"
        );


    reportBtn =
        document.getElementById(
            "reportBtn"
        );


    reportHeaderBtn =
        document.getElementById(
            "reportHeaderBtn"
        );


    closeModal =
        document.getElementById(
            "closeModal"
        );


    nextBtn =
        document.getElementById(
            "nextBtn"
        );


    backBtn =
        document.getElementById(
            "backBtn"
        );


    reportPlace =
        document.getElementById(
            "reportPlace"
        );


    priceInput =
        document.getElementById(
            "price"
        );


    priceWarning =
        document.getElementById(
            "priceWarning"
        );


    minimumPrice =
        document.getElementById(
            "minimumPrice"
        );


    confirmationData =
        document.getElementById(
            "confirmationData"
        );
}


/* ============================================================
   55. حفظ الولاية المختارة
   ============================================================ */

function restoreSelectedGovernorate() {

    if (!governorate) {
        return;
    }


    let saved = "";


    try {

        saved =
            localStorage.getItem(
                "maa_qarib_selected_governorate"
            ) || "";

    } catch (_) {}


    if (
        GOVERNORATES.includes(
            saved
        )
    ) {

        governorate.value =
            saved;


        loadDelegations(
            saved
        );
    }
}


/* ============================================================
   56. تشغيل التطبيق
   ============================================================ */

async function initApp() {

    console.log(
        "🇹🇳 ماء قريب - START"
    );


    cacheDOM();


    injectMapStyles();


    initTheme();


    loadGovernorates();


    if (delegation) {

        delegation.disabled =
            true;
    }


    resetDashboard();


    showStep(1);


    setupTheme();


    setupLocationEvents();


    setupModalButtons();


    setupAvailabilityButtons();


    setupBottleButtons();


    setupPrice();


    setupNextButton();


    setupBackButton();


    /*
     * Supabase
     */

    const connected =
        initSupabase();


    /*
     * الخريطة
     *
     * تتحمل بشكل مستقل
     */

    await loadMap();


    /*
     * Reports
     */

    if (connected) {

        await loadReportsFromSupabase();

        setupRealtime();

    } else {

        reportsCache =
            getLocalReports()
                .map(
                    normalizeReport
                );

        reportsLoaded =
            true;

        renderEverything();
    }


    /*
     * Refresh
     */

    setupAutoRefresh();


    /*
     * Restore location
     */

    restoreSelectedGovernorate();


    console.log(
        "✅ ماء قريب - READY"
    );
}




if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initApp
    );

} else {

    initApp();
}



window.MaaQarib = {

    governorates:
        GOVERNORATES,

    selectGovernorate:
        selectGovernorate,

    submitReport:
        submitReport,

    reloadReports:
        loadReportsFromSupabase,

    redrawMap:
        drawMap

};
