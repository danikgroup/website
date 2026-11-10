// The phone screens Screen.astro can draw, with what each shows (the Device's accessible label).
// Products pick one with their `screen` field; the CMS select lists the same keys.
export const screenLabels = {
  rollcall: "نمونهٔ صفحهٔ حضور و غیاب در پنل: دانش‌آموزان یک کلاس با وضعیت حاضر، غایب و تأخیر",
  report: "نمونهٔ کارنامهٔ نوبت اول در پنل اولیا، با نمرهٔ هر درس و معدل",
  tuition: "نمونهٔ صفحهٔ شهریهٔ یک دوره با اقساط پرداخت‌شده و دکمهٔ پرداخت آنلاین",
  timetable: "نمونهٔ برنامهٔ هفتگی یک کلاس در پنل، پنج روز و چهار زنگ",
  notices: "نمونهٔ صفحهٔ اعلان‌ها در پنل: غیبت، کارنامه، قسط و آزمون",
};

export const SCREENS = Object.keys(screenLabels);

// A product phone's accessible label: the screenshot's alt text, else what its drawn screen shows.
export const phoneLabel = (data) => (data.screenshot && data.screenshotAlt) || screenLabels[data.screen];
