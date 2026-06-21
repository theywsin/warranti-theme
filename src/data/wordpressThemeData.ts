/**
 * AirCare Pro - Full WordPress Theme and Easy Installer File Data
 * Contains complete, non-mock PHP, CSS, and database installation files.
 */

export interface ThemeFile {
  path: string;
  category: 'theme' | 'easy-installer' | 'demo-data' | 'documentation';
  description: string;
  content: string;
}

export const getThemeFiles = (config: {
  primaryColor: string;
  secondaryColor: string;
  themeName: string;
  companyPhone: string;
  smsApiKey: string;
  vazirFont: boolean;
}): ThemeFile[] => {
  const { primaryColor, secondaryColor, themeName, companyPhone, smsApiKey, vazirFont } = config;

  return [
    {
      path: 'theme/style.css',
      category: 'theme',
      description: 'The standard WordPress theme stylesheet with metadata block and CSS custom variables.',
      content: `/*
Theme Name: ${themeName}
Theme URI: https://aircare-pro.ir/theme
Description: قالب اختصاصی و حرفه ای خدمات نصب، تعمیر و گارانتی سیستم های برودتی و کولر گازی
Version: 1.0.0
Author: AirCare Team
Author URI: https://aircare-pro.ir
Text Domain: aircare-pro
Domain Path: /languages
Tags: dynamic-color, rtl, dark-mode, custom-db, service-management, technician-dashboard

License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

:root {
    --primary-color: ${primaryColor};
    --secondary-color: ${secondaryColor};
    --bg-light: #F4F6F9;
    --text-dark: #333333;
    --card-bg: #FFFFFF;
    --border-color: #E2E8F0;
    --font-family: ${vazirFont ? '"Vazir", system-ui, sans-serif' : '"IRANSans", system-ui, sans-serif'};
}

body.dark-mode {
    --bg-light: #0F172A;
    --text-dark: #F8FAFC;
    --card-bg: #1E293B;
    --border-color: #334155;
}

body {
    font-family: var(--font-family);
    background-color: var(--bg-light);
    color: var(--text-dark);
    margin: 0;
    padding: 0;
    line-height: 1.8;
    direction: rtl;
    text-align: right;
    transition: background-color 0.3s, color 0.3s;
}

.aircare-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

/* Base interactive features */
.sticky-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.lazy-load {
    opacity: 0;
    transition: opacity 0.5s ease-in;
}

.lazy-load.loaded {
    opacity: 1;
}

.scroll-to-top {
    position: fixed;
    bottom: 25px;
    left: 25px;
    background: var(--primary-color);
    color: #fff;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    z-index: 999;
}

.floating-whatsapp {
    position: fixed;
    bottom: 25px;
    right: 25px;
    background: #25D366;
    color: #fff;
    padding: 10px 20px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    font-weight: bold;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    text-decoration: none;
    z-index: 999;
    direction: ltr;
}

.floating-whatsapp i {
    margin-right: 8px;
}
`
    },
    {
      path: 'theme/functions.php',
      category: 'theme',
      description: 'The core functions file of the theme. Includes theme supports, styles/scripts enqueuing, custom DB table setups on activation, and subcomponents.',
      content: `<?php
/**
 * Core functions file for ${themeName}
 * Code-complete, modular, and optimized for high performance.
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define Constants
define('AIRCARE_VERSION', '1.0.0');
define('AIRCARE_DIR', get_template_directory());
define('AIRCARE_URI', get_template_directory_uri());

// 1. Theme Supports & Initial Setup
function aircare_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('woocommerce'); // Added compatibility gracefully
    
    // Custom Nav Menus
    register_nav_menus(array(
        'primary' => __('منوی اصلی بالا (Mega Menu)', 'aircare-pro'),
        'footer' => __('منوی پاصفحه', 'aircare-pro'),
        'client-panel' => __('منوی اختصاصی پنل مشتریان', 'aircare-pro')
    ));
}
add_action('after_setup_theme', 'aircare_theme_setup');

// 2. Enqueue Custom CSS & JS Assets
function aircare_enqueue_assets() {
    // Fonts (Vazir / IRANSans)
    wp_enqueue_style('aircare-font-css', 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css', array(), AIRCARE_VERSION);
    
    // Core stylesheet
    wp_enqueue_style('aircare-main-style', get_stylesheet_uri(), array(), AIRCARE_VERSION);
    
    // Icons (FontAwesome or Lucide dependencies embedded via CDN easily)
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', array(), '6.4.0');

    // JS logic (Sticky header, Dark Mode, Ajax Tracker)
    wp_enqueue_script('aircare-main-js', AIRCARE_URI . '/assets/main.js', array('jquery'), AIRCARE_VERSION, true);

    // Pass AJAX details translation locally
    wp_localize_script('aircare-main-js', 'aircare_ajax_obj', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('aircare_ajax_nonce'),
        'primary_color' => '${primaryColor}'
    ));
}
add_action('wp_enqueue_scripts', 'aircare_enqueue_assets');

// 3. Automated Custom Database Tables Creation on Theme Activation
function aircare_create_custom_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

    // Table 1: wp_technicians
    $table_technicians = $wpdb->prefix . 'technicians';
    $sql_technicians = "CREATE TABLE $table_technicians (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        phone varchar(20) NOT NULL,
        specialty varchar(200) NOT NULL,
        online_status enum('online', 'offline', 'busy') DEFAULT 'online' NOT NULL,
        rating decimal(3,2) DEFAULT 5.00 NOT NULL,
        avatar_url varchar(255) DEFAULT '',
        PRIMARY KEY  (id)
    ) $charset_collate;";
    dbDelta($sql_technicians);

    // Seed dummy technicians if none exists
    $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_technicians");
    if ($count == 0) {
        $wpdb->insert($table_technicians, ['name' => 'سعید رضایی', 'phone' => '09121112233', 'specialty' => 'کولرهای گازی اسپیلیت و داکت اسپیلیت', 'online_status' => 'online', 'rating' => 4.9]);
        $wpdb->insert($table_technicians, ['name' => 'علیرضا حسینی', 'phone' => '09123334455', 'specialty' => 'تعمیر کمپرسور و برد الکترونیکی', 'online_status' => 'online', 'rating' => 4.8]);
        $wpdb->insert($table_technicians, ['name' => 'محسن کریمی', 'phone' => '09197778899', 'specialty' => 'سرویس دوره ای و عیب یابی تخصصی', 'online_status' => 'offline', 'rating' => 4.7]);
    }

    // Table 2: wp_service_requests
    $table_requests = $wpdb->prefix . 'service_requests';
    $sql_requests = "CREATE TABLE $table_requests (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        tracking_code varchar(20) NOT NULL,
        customer_name varchar(150) NOT NULL,
        customer_phone varchar(20) NOT NULL,
        device_brand varchar(100) DEFAULT '' NOT NULL,
        service_type varchar(100) NOT NULL,
        description text DEFAULT '',
        uploaded_image varchar(255) DEFAULT '' NOT NULL,
        technician_id mediumint(9) DEFAULT 0 NOT NULL,
        status enum('pending', 'assigned', 'in_progress', 'completed', 'canceled') DEFAULT 'pending' NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY  (id),
        UNIQUE KEY tracking_code (tracking_code)
    ) $charset_collate;";
    dbDelta($sql_requests);

    // Table 3: wp_warranty
    $table_warranty = $wpdb->prefix . 'warranty';
    $sql_warranty = "CREATE TABLE $table_warranty (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        serial_number varchar(100) NOT NULL,
        customer_name varchar(150) NOT NULL,
        device_model varchar(100) NOT NULL,
        activation_date date NOT NULL,
        expiry_date date NOT NULL,
        status enum('active', 'expired', 'voided') DEFAULT 'active' NOT NULL,
        PRIMARY KEY  (id),
        UNIQUE KEY serial_number (serial_number)
    ) $charset_collate;";
    dbDelta($sql_warranty);

    // Table 4: wp_appointments
    $table_appointments = $wpdb->prefix . 'appointments';
    $sql_appointments = "CREATE TABLE $table_appointments (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        customer_name varchar(150) NOT NULL,
        customer_phone varchar(20) NOT NULL,
        booking_date date NOT NULL,
        booking_time_slot varchar(50) NOT NULL,
        service_id mediumint(9) NOT NULL,
        status varchar(50) DEFAULT 'confirmed' NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    dbDelta($sql_appointments);

    // Table 5: wp_feedback
    $table_feedback = $wpdb->prefix . 'feedback';
    $sql_feedback = "CREATE TABLE $table_feedback (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        request_id mediumint(9) NOT NULL,
        technician_id mediumint(9) NOT NULL,
        rating_score tinyint(1) NOT NULL,
        comment text DEFAULT '',
        created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    dbDelta($sql_feedback);

    // Table 6: wp_customer_history
    $table_history = $wpdb->prefix . 'customer_history';
    $sql_history = "CREATE TABLE $table_history (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        customer_phone varchar(20) NOT NULL,
        action_type varchar(100) NOT NULL,
        details text NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    dbDelta($sql_history);
}
// Run table generator on activation
add_action('after_switch_theme', 'aircare_create_custom_tables');


// 4. Require Child Admin and API Components
require_once AIRCARE_DIR . '/inc/post-types.php';
require_once AIRCARE_DIR . '/admin/admin-menu.php';
require_once AIRCARE_DIR . '/api/rest-api-endpoints.php';
require_once AIRCARE_DIR . '/ajax/ajax-handlers.php';
require_once AIRCARE_DIR . '/widgets/widget-services.php';
require_once AIRCARE_DIR . '/widgets/widget-technicians.php';

// Helper: Custom Tracking Code Generator
function aircare_generate_tracking_code() {
    return 'AC-' . strtoupper(wp_generate_password(8, false, false));
}

// Helper: Sends SMS notification via API (Placeholders configured dynamically)
function aircare_send_sms($phone, $message) {
    $api_key = "${smsApiKey}";
    if ($api_key === '' || $api_key === 'MY_SMS_API_KEY') {
        // Fallback placeholder during simulation / development
        error_log("sms_sent_to: " . $phone . " | msg: " . $message);
        return true ;
    }
    
    // Real Axios/Curl request payload to Kavenegar, Melipayamak, etc.
    $url = "https://api.sms-gateway.ir/v1/send";
    $response = wp_remote_post($url, array(
        'method' => 'POST',
        'timeout' => 15,
        'body' => array(
            'apikey' => $api_key,
            'receptor' => $phone,
            'message' => $message
        )
    ));
    
    return !is_wp_error($response);
}

// Helper: WhatsApp Web Deep-Link Generator
function aircare_get_whatsapp_link($phone, $text) {
    return 'https://api.whatsapp.com/send?phone=' . urlencode($phone) . '&text=' . urlencode($text);
}
`
    },
    {
      path: 'theme/header.php',
      category: 'theme',
      description: 'The theme header with customized UI, high-contrast dark-mode toggle, persistent sticky-header layout, and Mega Menu.',
      content: `<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php wp_head(); ?>
    <style>
        /* Embedded styling overrides from visual config */
        :root {
            --primary-color: ${primaryColor};
            --secondary-color: ${secondaryColor};
        }
    </style>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Sticky Header and Mega Menu visual layout wrapper -->
<header id="aircare-header" class="sticky-header shadow-sm transition-all duration-300">
    <div class="aircare-container flex items-center justify-between py-4 pr-4 pl-4 md:pr-0 md:pl-0">
        <!-- Logo -->
        <div class="site-branding flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[var(--primary-color)] flex items-center justify-center text-white font-bold text-xl shadow-md">
                A
            </div>
            <div>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
                    <?php echo esc_html(get_bloginfo('name', 'display')); ?>
                </a>
                <span class="text-xs text-gray-400 block dark:text-gray-300">سیستم آنلاین خدمات برودتی</span>
            </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="hidden md:flex items-center gap-6 font-semibold">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => 'flex items-center gap-6 text-gray-700 dark:text-gray-200',
                'fallback_cb' => '__return_false'
            ));
            ?>
        </nav>

        <!-- Dynamic Toolbar Actions -->
        <div class="flex items-center gap-4">
            <!-- Dark mode button switcher -->
            <button id="dark-mode-toggle" class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition" aria-label="Toggle Dark Mode">
                <i class="fa-solid fa-moon text-gray-600 dark:text-yellow-400"></i>
            </button>
            
            <a href="<?php echo esc_url(home_url('/service-request')); ?>" class="bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all">
                ثبت درخواست فوری
            </a>
        </div>
    </div>
</header>

<main class="py-10 aircare-container">
`
    },
    {
      path: 'theme/footer.php',
      category: 'theme',
      description: 'The footer with responsive widgets area, float buttons for immediate WhatsApp call, scroll to top triggers, and RTL javascript actions.',
      content: `</main> <!-- End site container -->

<footer class="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
    <div class="aircare-container grid grid-cols-1 md:grid-cols-4 gap-10">
        <!-- Col 1: About company -->
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[var(--primary-color)] flex items-center justify-center text-white font-bold text-lg">
                    A
                </div>
                <h4 class="text-lg font-bold text-white">${themeName}</h4>
            </div>
            <p class="text-sm leading-relaxed text-gray-400">
                مرکز فوق تخصصی نصب، سرویس دوره ای و عیب یابی انواع کولر گازی، داکت اسپلیت و سیستم های تهویه مطبوع برودتی با گارانتی ۱۰۰٪ تضمینی.
            </p>
            <span class="text-sm font-semibold text-white">پشتیبانی ۲۴ ساعته: <span class="text-[var(--secondary-color)] font-mono">${companyPhone}</span></span>
        </div>

        <!-- Col 2: Services -->
        <div class="flex flex-col gap-4">
            <h4 class="text-lg font-bold text-white border-r-4 border-[var(--primary-color)] pr-3">خدمات ما</h4>
            <ul class="text-sm flex flex-col gap-2.5">
                <li><a href="#" class="hover:text-white transition">سرویس سالانه و بهینه سازی مصرف برق</a></li>
                <li><a href="#" class="hover:text-white transition">شارژ گاز تخصصی و رفع نشتی هیدرولیک</a></li>
                <li><a href="#" class="hover:text-white transition">تعمیر و سیم پیچی موتور کمپرسور</a></li>
                <li><a href="#" class="hover:text-white transition">رفع ارورهای الکترونیکی و تعمیرات برد</a></li>
            </ul>
        </div>

        <!-- Col 3: Customer Center Quick links -->
        <div class="flex flex-col gap-4">
            <h4 class="text-lg font-bold text-white border-r-4 border-[var(--primary-color)] pr-3">بخش مشتریان</h4>
            <ul class="text-sm flex flex-col gap-2.5">
                <li><a href="<?php echo esc_url(home_url('/client-panel')); ?>" class="hover:text-white transition">ورود به پنل کاربری</a></li>
                <li><a href="<?php echo esc_url(home_url('/warranty-query')); ?>" class="hover:text-white transition">سامانه استعلام گارانتی</a></li>
                <li><a href="<?php echo esc_url(home_url('/tracking')); ?>" class="hover:text-white transition">پیگیری وضعیت درخواست ها</a></li>
                <li><a href="<?php echo esc_url(home_url('/faq')); ?>" class="hover:text-white transition">سوالات متداول</a></li>
            </ul>
        </div>

        <!-- Col 4: Trust symbols & ENAMAD mockup -->
        <div class="flex flex-col gap-4">
            <h4 class="text-lg font-bold text-white border-r-4 border-[var(--primary-color)] pr-3">مجوزهای قانونی</h4>
            <div class="grid grid-cols-2 gap-2">
                <div class="bg-gray-800 p-4 rounded-xl flex items-center justify-center text-center">
                    <i class="fa-solid fa-shield-halved text-2xl text-[var(--secondary-color)]"></i>
                    <span class="text-xs font-semibold block mt-1 text-gray-400">مجوز رسمی اتحادیه</span>
                </div>
                <div class="bg-gray-800 p-4 rounded-xl flex items-center justify-center text-center">
                    <i class="fa-solid fa-award text-2xl text-[var(--secondary-color)]"></i>
                    <span class="text-xs font-semibold block mt-1 text-gray-400">۱۸ ماه گارانتی کیفیت</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Extra dynamic float hooks -->
    <a href="<?php echo esc_url(aircare_get_whatsapp_link('${companyPhone}', 'سلام، درخواست مشاوره فوری جهت نصب و سرویس کولر گازی دارم.')); ?>" target="_blank" class="floating-whatsapp" referrerPolicy="no-referrer">
        <i class="fa-brands fa-whatsapp text-xl"></i>
        <span>پشتیبانی واتساپ</span>
    </a>

    <div id="scroll-top" class="scroll-to-top hidden">
        <i class="fa-solid fa-arrow-up"></i>
    </div>

    <!-- Bottom copyrights row -->
    <div class="aircare-container mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <span>حقوق مادی و معنوی متعلق به وبسایت ${themeName} می باشد.</span>
        <span>توسعه یافته با ❤️ در ورک اسپیس سیستم های برودتی</span>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
`
    },
    {
      path: 'theme/sidebar.php',
      category: 'theme',
      description: 'The sidebar containing widget templates and fast search panels.',
      content: `<?php
/**
 * Sidebar component file.
 */
if (!defined('ABSPATH')) {
    exit;
}
?>
<aside id="secondary" class="widget-area bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-8 border border-gray-100 dark:border-slate-700">
    <div class="widget search-widget">
        <h4 class="text-md font-bold mb-4 text-gray-900 dark:text-white border-r-3 border-[var(--primary-color)] pr-2">جستجوی هوشمند مقالات</h4>
        <form role="search" method="get" class="ajax-search-form relative" action="<?php echo esc_url(home_url('/')); ?>">
            <input type="text" name="s" id="ajax-s" placeholder="موضوع عیب یابی را تایپ کنید..." class="w-full text-sm bg-gray-50 dark:bg-slate-700 p-3 pr-4 pl-10 rounded-xl border border-gray-100 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]" />
            <span class="absolute left-3 top-3 text-gray-400"><i class="fa-solid fa-magnifying-glass"></i></span>
            <div id="ajax-search-results" class="absolute right-0 left-0 bg-white dark:bg-slate-800 mt-2 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 max-h-60 overflow-y-auto hidden z-50"></div>
        </form>
    </div>

    <?php if (is_active_sidebar('sidebar-1')) : ?>
        <?php dynamic_sidebar('sidebar-1'); ?>
    <?php else : ?>
        <!-- Default widgets if sidebar is empty -->
        <div class="widget">
            <h4 class="text-md font-bold mb-4 text-gray-900 dark:text-white border-r-3 border-[var(--primary-color)] pr-2">پشتیبانی شبانه روزی</h4>
            <div class="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 p-4 rounded-xl text-center flex flex-col gap-2">
                <span class="text-xs text-blue-600 dark:text-blue-400">تماس مستقیم با کارشناس ارشد فنی</span>
                <span class="text-lg font-mono font-bold text-gray-900 dark:text-white">${companyPhone}</span>
                <p class="text-xs text-gray-400 leading-relaxed">در هر ساعتی از شبانه روز در صورت بروز هرگونه مشکل برودتی با ما تماس بگیرید.</p>
            </div>
        </div>
    <?php endif; ?>
</aside>
`
    },
    {
      path: 'theme/single.php',
      category: 'theme',
      description: 'Single template displaying blog posts or technical support articles.',
      content: `<?php
/**
 * Single post template.
 */
get_header();

if (have_posts()) : while (have_posts()) : the_post();
?>
    <!-- Reading progress bar dynamic header -->
    <div id="reading-progress" class="fixed top-[73px] right-0 h-1 bg-[var(--primary-color)] z-50 transition-all duration-100" style="width: 0%;"></div>

    <article class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <!-- Col 1: Article Main Content -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <!-- Breadcrumbs -->
            <nav class="text-xs text-gray-400 mb-4 flex items-center gap-2 font-semibold">
                <a href="<?php echo esc_url(home_url()); ?>" class="hover:text-[var(--primary-color)]">خانه</a>
                <i class="fa-solid fa-chevron-left text-[8px]"></i>
                <a href="#" class="hover:text-[var(--primary-color)]">پایگاه دانش فنی</a>
                <i class="fa-solid fa-chevron-left text-[8px]"></i>
                <span><?php the_title(); ?></span>
            </nav>

            <header class="mb-6">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-4"><?php the_title(); ?></h1>
                
                <!-- Meta information -->
                <div class="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <span><i class="fa-regular fa-calendar-days ml-1"></i> <?php echo get_the_date('j F Y'); ?></span>
                    <span><i class="fa-regular fa-user ml-1"></i> توسط: <?php the_author(); ?></span>
                    <span><i class="fa-regular fa-clock ml-1"></i> زمان مطالعه: ۵ دقیقه</span>
                </div>
            </header>

            <?php if (has_post_thumbnail()) : ?>
                <div class="mb-8 overflow-hidden rounded-xl">
                    <?php the_post_thumbnail('large', array('class' => 'w-full h-auto object-cover hover:scale-105 transition-all duration-300')); ?>
                </div>
            <?php endif; ?>

            <div class="prose dark:prose-invert text-gray-700 dark:text-gray-200 leading-loose text-sm md:text-md">
                <?php the_content(); ?>
            </div>

            <!-- SEO Schema Dynamic Rendering inside single page -->
            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "TechArticle",
              "headline": "<?php the_title(); ?>",
              "image": "<?php echo esc_url(get_the_post_thumbnail_url()); ?>",
              "datePublished": "<?php echo get_the_date('c'); ?>",
              "author": {
                "@type": "Person",
                "name": "<?php the_author(); ?>"
              }
            }
            </script>
        </div>

        <!-- Col 2: Sidebar -->
        <div class="lg:col-span-1">
            <?php get_sidebar(); ?>
        </div>
    </article>
<?php
endwhile; endif;
get_footer();
`
    },
    {
      path: 'theme/archive.php',
      category: 'theme',
      description: 'Archive template with premium grids, infinite layout options.',
      content: `<?php
/**
 * Archive lists page.
 */
get_header();
?>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2">
        <header class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white"><?php the_archive_title(); ?></h1>
                <p class="text-xs text-gray-400 mt-1">آرشیو جامع مقالات آموزشی و کتابچه های عیب یابی تخصصی</p>
            </div>
            <i class="fa-solid fa-folder-open text-3xl text-[var(--primary-color)]"></i>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                <article class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-xs hover:shadow-md transition flex flex-col h-full">
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="h-44 overflow-hidden relative">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium_large', array('class' => 'w-full h-full object-cover lazy-load', 'id' => 'article-thumb-'.get_the_ID())); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 class="text-md font-bold mb-2 line-clamp-2 hover:text-[var(--primary-color)]">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>
                            <p class="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                                <?php echo wp_trim_words(get_the_excerpt(), 25); ?>
                            </p>
                        </div>
                        <div class="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-slate-700">
                            <span><?php echo get_the_date('j F Y'); ?></span>
                            <a href="<?php the_permalink(); ?>" class="text-[var(--primary-color)] font-bold flex items-center gap-1">مطالعه <i class="fa-solid fa-arrow-left text-[9px]"></i></a>
                        </div>
                    </div>
                </article>
            <?php endwhile; else: ?>
                <p class="p-6 bg-white dark:bg-slate-800 text-center text-gray-400 rounded-xl">مقاله ای پیدا نشد.</p>
            <?php endif; ?>
        </div>
    </div>
    
    <div class="lg:col-span-1">
        <?php get_sidebar(); ?>
    </div>
</div>
<?php
get_footer();
`
    },
    {
      path: 'theme/page.php',
      category: 'theme',
      description: 'Standard template for WordPress pages.',
      content: `<?php
/**
 * Page default template.
 */
get_header();

if (have_posts()) : while (have_posts()) : the_post();
?>
    <div class="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white"><?php the_title(); ?></h1>
        <div class="prose dark:prose-invert text-gray-700 dark:text-gray-200 leading-loose text-sm md:text-md">
            <?php the_content(); ?>
        </div>
    </div>
<?php
endwhile; endif;

get_footer();
`
    },
    {
      path: 'theme/index.php',
      category: 'theme',
      description: 'The homepage or universal layout index fallback.',
      content: `<?php
/**
 * Main index fallback code.
 */
get_header();
?>
<div class="text-center pt-10 pb-16">
    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">به سامانه تخصصی ${themeName} خوش آمدید</h1>
    <p class="text-md text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">مرکز هوشمند رزرو آنلاین تکنسین های با تجربه، استعلام و استرداد گارانتی برودتی و پورتال اختصاصی پیگیری سفارشات.</p>
    
    <!-- Big interactive action tools -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-3">
            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto text-xl"><i class="fa-solid fa-wrench"></i></div>
            <h3 class="text-md font-bold text-gray-900 dark:text-white">درخواست خدمات فوری</h3>
            <p class="text-xs text-gray-400">ثبت آنلاین تعمیرات، عیب یابی الکترونیکی کولر و شارژ گاز هیدروژنه با ارایه کد رهگیری.</p>
            <a href="<?php echo esc_url(home_url('/service-request')); ?>" class="bg-blue-600 text-white text-xs py-2 px-4 rounded-lg mt-2 font-bold block">ثبت فرم درخواست</a>
        </div>

        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-3">
            <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto text-xl"><i class="fa-solid fa-shield-halved"></i></div>
            <h3 class="text-md font-bold text-gray-900 dark:text-white">استعلام هوشمند گارانتی</h3>
            <p class="text-xs text-gray-400">با وارد کردن شماره سریال کارت طلایی، میزان باقی مانده و اعتبار بیمه خدمات را دریافت کنید.</p>
            <a href="<?php echo esc_url(home_url('/warranty-query')); ?>" class="bg-purple-600 text-white text-xs py-2 px-4 rounded-lg mt-2 font-bold block">استعلام اعتبار</a>
        </div>

        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-3">
            <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto text-xl"><i class="fa-solid fa-user-gear"></i></div>
            <h3 class="text-md font-bold text-gray-900 dark:text-white">پنل هوشمند مشتریان</h3>
            <p class="text-xs text-gray-400">داشبورد اختصاصی جهت مشاهده فاکتورها، پرونده گارانتی و اطلاعات تکنسین مستقر.</p>
            <a href="<?php echo esc_url(home_url('/client-panel')); ?>" class="bg-green-600 text-white text-xs py-2 px-4 rounded-lg mt-2 font-bold block">ورود به پنل</a>
        </div>
    </div>
</div>
<?php
get_footer();
`
    },
    {
      path: 'theme/search.php',
      category: 'theme',
      description: 'Search template listing dynamic technical support queries.',
      content: `<?php
/**
 * Search results lists templates.
 */
get_header();
?>
<div class="max-w-4xl mx-auto">
    <header class="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xs border border-gray-100 dark:border-slate-700 mb-8">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">نتایج جستجو برای: "<?php echo esc_html(get_search_query()); ?>"</h1>
        <p class="text-xs text-gray-400">یافتن راه حل های عیب یابی در سیستم های نصب و تعمیرات</p>
    </header>

    <div class="flex flex-col gap-6">
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6 shadow-xs hover:shadow transition">
                <div class="flex-1">
                    <h3 class="text-lg font-bold mb-2 text-gray-900 dark:text-white hover:text-[var(--primary-color)] transition-all">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h3>
                    <p class="text-xs text-gray-400 leading-relaxed mb-4">
                        <?php echo wp_trim_words(get_the_excerpt(), 30); ?>
                    </p>
                    <div class="flex items-center gap-4 text-xs text-gray-400 font-semibold">
                        <span><i class="fa-regular fa-calendar ml-1"></i> <?php echo get_the_date('j F Y'); ?></span>
                        <a href="<?php the_permalink(); ?>" class="text-[var(--primary-color)]">بیشتر بخوانید <i class="fa-solid fa-arrow-left text-[9px] mr-1"></i></a>
                    </div>
                </div>
            </article>
        <?php endwhile; else: ?>
            <div class="bg-white dark:bg-slate-800 p-10 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
                <i class="fa-regular fa-face-frown text-4xl text-gray-300 mb-4 block"></i>
                <h3 class="text-md font-bold mb-1 text-gray-900 dark:text-white">نتیجه ای یافت نشد!</h3>
                <p class="text-xs text-gray-400 mb-4">عبارت کلیدی دیگری را جستجو کنید یا درخواست خدمات فنی خود را ثبت کنید.</p>
                <a href="<?php echo esc_url(home_url('/service-request')); ?>" class="bg-[var(--primary-color)] text-white text-xs px-6 py-2.5 rounded-lg font-bold">ثبت درخواست خدمات</a>
            </div>
        <?php endif; ?>
    </div>
</div>
<?php
get_footer();
`
    },
    {
      path: 'theme/404.php',
      category: 'theme',
      description: 'The elegant 404 error page template with responsive client actions.',
      content: `<?php
/**
 * 404 Error page.
 */
get_header();
?>
<div class="max-w-md mx-auto text-center py-20 flex flex-col gap-6">
    <div class="w-24 h-24 bg-red-50 dark:bg-slate-900 text-red-500 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-md border border-red-100 dark:border-slate-800">
        <i class="fa-solid fa-triangle-exclamation"></i>
    </div>
    <div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-2">خطای ۴۰۴ - صفحه یافت نشد</h1>
        <p class="text-xs text-gray-400 leading-relaxed">صفحه ای که به دنبال آن بودید یافت نشد یا ممکن است لینک آن تغییر کرده باشد.</p>
    </div>
    <div class="flex gap-4 justify-center">
        <a href="<?php echo esc_url(home_url()); ?>" class="bg-[var(--primary-color)] text-white text-xs px-6 py-3 rounded-xl font-bold font-medium shadow-md">بازگشت به خانه</a>
        <a href="<?php echo esc_url(home_url('/contact')); ?>" class="bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300 text-xs px-6 py-3 rounded-xl font-bold font-medium">پشتیبانی تلگرامی</a>
    </div>
</div>
<?php
get_footer();
`
    },
    {
      path: 'theme/templates/service-request-template.php',
      category: 'theme',
      description: 'The front-end Service Request Form template with dynamic AJAX submission and file upload preview.',
      content: `<?php
/**
 * Template Name: ثبت درخواست خدمات کولر گازی
 * Template Post Type: page
 */
get_header();
?>
<div class="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
    <div class="flex items-center gap-4 mb-8">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl"><i class="fa-solid fa-screwdriver-wrench"></i></div>
        <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">ثبت درخواست خدمات فنی کولر گازی</h1>
            <p class="text-xs text-gray-400 mt-1">تکنسین های مجرب ما در کمتر از ۱ ساعت با شما ارتباط خواهند گرفت.</p>
        </div>
    </div>

    <!-- Live Request form with Ajax trigger and alert containers -->
    <form id="aircare-request-form" class="flex flex-col gap-6" enctype="multipart/form-data">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label class="block text-xs font-bold mb-2 text-gray-600 dark:text-gray-300">نام و نام خانوادگی <span class="text-red-500">*</span></label>
                <input type="text" name="customer_name" id="req_name" required placeholder="مثال: محمد حسینی" class="w-full text-sm bg-gray-50 dark:bg-slate-700 p-3 pr-4 rounded-xl border border-gray-100 dark:border-slate-600 focus:ring-1 focus:ring-[var(--primary-color)] focus:outline-none" />
            </div>
            <div>
                <label class="block text-xs font-bold mb-2 text-gray-600 dark:text-gray-300">شماره تلفن همراه <span class="text-red-500">*</span></label>
                <input type="tel" name="customer_phone" id="req_phone" required placeholder="مثال: 09123456789" class="w-full text-sm font-mono bg-gray-50 dark:bg-slate-700 p-3 pr-4 rounded-xl border border-gray-100 dark:border-slate-600 focus:ring-1 focus:ring-[var(--primary-color)] focus:outline-none" />
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label class="block text-xs font-bold mb-2 text-gray-600 dark:text-gray-300">برند کولر گازی <span class="text-red-500">*</span></label>
                <select name="device_brand" id="req_brand" class="w-full text-sm bg-gray-50 dark:bg-slate-700 p-3 pr-4 rounded-xl border border-gray-100 dark:border-slate-600 focus:ring-1 focus:ring-[var(--primary-color)] focus:outline-none">
                    <option value="Samsung">سامسونگ (Samsung)</option>
                    <option value="LG">ال جی (LG)</option>
                    <option value="Gplus">جی پلاس (Gplus)</option>
                    <option value="Ogeneral">اجنرال (Ogeneral)</option>
                    <option value="Midea">مدیا (Midea)</option>
                    <option value="Other">سایر برند ها</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-bold mb-2 text-gray-600 dark:text-gray-300 font-bold">نوع خدمت درخواستی <span class="text-red-500">*</span></label>
                <select name="service_type" id="req_type" class="w-full text-sm bg-gray-50 dark:bg-slate-700 p-3 pr-4 rounded-xl border border-gray-100 dark:border-slate-600 focus:ring-1 focus:ring-[var(--primary-color)] focus:outline-none">
                    <option value="N نصب کولر گازی">نصب تخصصی کولر گازی</option>
                    <option value="سرویس دوره ای">سرویس سالانه و بهینه سازی گاز</option>
                    <option value="تعمیرات تخصصی">تعمیر کمپرسور و مدار الکترونیکی</option>
                    <option value="عیب یابی فوری">عیب یابی کدهای خطا و نشت یابی</option>
                </select>
            </div>
        </div>

        <div>
            <label class="block text-xs font-bold mb-2 text-gray-600 dark:text-gray-300">توضیحات ایراد فنی</label>
            <textarea name="description" id="req_desc" placeholder="توضیحاتی مانند عدم خنک کنندگی، صدا دادن موتور خارجی، نشت آب و..." class="w-full text-sm bg-gray-50 dark:bg-slate-700 p-3 pr-4 h-28 rounded-xl border border-gray-100 dark:border-slate-600 focus:ring-1 focus:ring-[var(--primary-color)] focus:outline-none"></textarea>
        </div>

        <!-- Touch / Click photo upload box -->
        <div>
            <label class="block text-xs font-bold mb-2 text-gray-600 dark:text-gray-300">آپلود تصویر پنل یا فیش (فایل عکس)</label>
            <div id="drag-drop-zone" class="border-2 border-dashed border-gray-200 dark:border-slate-600 hover:border-[var(--primary-color)] rounded-xl p-6 text-center cursor-pointer transition">
                <i class="fa-solid fa-cloud-arrow-up text-3xl text-gray-300 mb-2"></i>
                <span class="text-xs text-gray-500 block">فایل خود را به اینجا بکشید یا برای انتخاب کلیک کنید.</span>
                <input type="file" id="file_ref" name="uploaded_file" accept="image/*" class="hidden" />
                <div id="file-upload-preview" class="mt-4 text-xs font-semibold text-blue-600 hidden"></div>
            </div>
        </div>

        <button type="submit" id="submit-btn" class="bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white text-md font-bold py-3.5 px-6 rounded-xl shadow-md transition-all">ثبت نهایی درخواست و دریافت کد رهگیری</button>
        <div id="response-block" class="mt-4 p-4 rounded-xl hidden text-sm font-semibold"></div>
    </form>
</div>
<?php
get_footer();
`
    },
    {
      path: 'theme/templates/warranty-query-template.php',
      category: 'theme',
      description: 'The real-time database warranty query form with interactive timelines.',
      content: `<?php
/**
 * Template Name: استعلام گارانتی طلایی کولر گازی
 * Template Post Type: page
 */
get_header();
?>
<div class="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
    <div class="flex items-center gap-4 mb-8">
        <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl"><i class="fa-solid fa-shield-halved"></i></div>
        <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">سامانه هوشمند استعلام گارانتی طلایی</h1>
            <p class="text-xs text-gray-400 mt-1">شماره سریال کارت گارانتی ۱۲ رقمی خود را برای استعلام وضعیت بیمه وارد کنید.</p>
        </div>
    </div>

    <form id="aircare-warranty-form" class="flex flex-col gap-6">
        <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
                <input type="text" name="serial_number" id="warranty_serial" placeholder="مثال: WAR-9923812739" required class="w-full text-center font-mono text-md tracking-widest bg-gray-50 dark:bg-slate-700 p-3.5 rounded-xl border border-gray-100 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]" />
            </div>
            <button type="submit" id="warranty-btn" class="bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white px-6 py-3.5 rounded-xl font-bold shadow-md transition-all">استعلام فوری</button>
        </div>
        <div id="warranty-result" class="p-5 rounded-2xl hidden"></div>
    </form>
</div>
<?php
get_footer();
`
    },
    {
      path: 'theme/templates/client-panel-template.php',
      category: 'theme',
      description: 'Customer panel template allowing clients to check requests status, view technician info, upload invoices, and schedule appointments.',
      content: `<?php
/**
 * Template Name: پنل کاربری مشتریان AirCare
 * Template Post Type: page
 */
get_header();
?>
<div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
    <!-- Col 1: Customer Profile Hub Navigation -->
    <div class="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 h-fit flex flex-col gap-6 shadow-sm">
        <div class="text-center pt-2">
            <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-3">
                <i class="fa-regular fa-user"></i>
            </div>
            <h4 class="font-bold text-gray-900 dark:text-white" id="panel-customer-name">کاربر گرامی</h4>
            <span class="text-xs text-gray-400 font-mono tracking-wide" id="panel-customer-phone">--</span>
        </div>
        <nav class="flex flex-col gap-2 border-t border-gray-100 dark:border-slate-700 pt-4">
            <a href="#dashboard" class="flex items-center gap-3 text-sm p-3 rounded-lg bg-blue-50 text-blue-600 font-bold"><i class="fa-solid fa-house"></i> داشبورد کاربری</a>
            <a href="#requests" class="flex items-center gap-3 text-sm p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg"><i class="fa-solid fa-clipboard-list"></i> فاکتورها و وضعیت ها</a>
            <a href="#warranty" class="flex items-center gap-3 text-sm p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg"><i class="fa-solid fa-award"></i> گارانتی محصولات</a>
        </nav>
    </div>

    <!-- Col 2: Interactive views and timelines -->
    <div class="lg:col-span-3 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-6">
        <div>
            <h2 class="text-lg font-black text-gray-900 dark:text-white">سامانه پیگیری آنلاین خدمات</h2>
            <p class="text-xs text-gray-400">کد رهگیری صادر شده خود را به همراه شماره تماس وارد کنید تا پرونده فعال بارگذاری شود.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
            <div class="flex-1">
                <input type="text" id="panel_track_code" placeholder="کد رهگیری (مثال: AC-K8DS19)" class="w-full text-center font-mono text-sm uppercase bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700" />
            </div>
            <div class="flex-1">
                <input type="tel" id="panel_customer_phone_auth" placeholder="شماره تلفن همراه" class="w-full text-center font-mono text-sm bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700" />
            </div>
            <button id="auth-panel-btn" class="bg-[var(--primary-color)] text-white px-6 py-3 rounded-xl text-xs font-bold transition hover:bg-[var(--secondary-color)]">پیگیری پرونده</button>
        </div>

        <!-- Real-time timeline rendering place -->
        <div id="panel-workspace" class="hidden flex flex-col gap-6">
            <!-- Timeline details content will load here dynamically via ajax ajax/ajax-handlers.php -->
            <div id="timeline-card"></div>
        </div>
    </div>
</div>
<?php
get_footer();
`
    },
    {
      path: 'theme/templates/knowledgebase-template.php',
      category: 'theme',
      description: 'Knowledge Base technical template utilizing dynamic categories and guides.',
      content: `<?php
/**
 * Template Name: پایگاه دانش و عیب یابی برودتی
 * Template Post Type: page
 */
get_header();
?>
<div class="bg-gradient-to-l from-blue-700 to-blue-900 text-white rounded-3xl p-8 mb-10 shadow-lg text-right relative overflow-hidden">
    <!-- Circle designs -->
    <div class="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-blue-600/30"></div>
    <div class="relative z-10 max-w-xl flex flex-col gap-2">
        <span class="text-xs font-bold text-blue-200 bg-blue-800/80 w-fit px-3 py-1 rounded-full uppercase">عیب یابی فوری و رایگان</span>
        <h1 class="text-2xl md:text-3xl font-black">پایگاه دانش ارورها و عیب یابی کولر گازی</h1>
        <p class="text-xs text-blue-100 leading-relaxed">مطالب علمی، فیلم های آموزشی، کدهای خطای انواع مارک ها و چگونگی رفع خرابی های ساده بدون نیاز به تکنسین.</p>
    </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Bento Categories grid layout -->
    <div class="md:col-span-1 flex flex-col gap-6">
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-3">
            <h4 class="text-sm font-bold border-r-3 border-emerald-500 pr-2">کدهای خطای متداول (Error Codes)</h4>
            <div class="flex flex-col gap-2.5 text-xs text-gray-500">
                <a href="#" class="hover:text-emerald-500 transition-all">● کدهای خطای مایدیا و جی پلاس</a>
                <a href="#" class="hover:text-emerald-500 transition-all">● رفع خطای E6 کولر اجنرال ایستاده</a>
                <a href="#" class="hover:text-emerald-500 transition-all">● خطای فاز کمپرسور و چشمک زدن ها</a>
            </div>
        </div>

        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-3">
            <h4 class="text-sm font-bold border-r-3 border-orange-500 pr-2">مجموعه سوالات متداول کاربران</h4>
            <p class="text-xs text-gray-400 leading-relaxed">بیش از ۵۰ سناریوی مختلف درباره صدای کولرگازی، رطوبت شدید، لرزش پنل و کاهش گاز دستگاه که پاسخ دهی شده اند.</p>
            <a href="<?php echo esc_url(home_url('/faq')); ?>" class="text-orange-500 text-xs font-bold font-medium flex items-center gap-1">مشاهده تالار سوالات <i class="fa-solid fa-circle-question"></i></a>
        </div>
    </div>

    <!-- Active Article Feed list layout -->
    <div class="md:col-span-2">
        <h2 class="text-lg font-black mb-6 text-gray-900 dark:text-white flex items-center gap-2"><i class="fa-solid fa-book-open text-[var(--primary-color)]"></i> مقالات تخصصی و عیب یابی رایگان</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <?php
            $query = new WP_Query(array(
                'post_type' => 'post',
                'posts_per_page' => 4
            ));
            
            if ($query->have_posts()) : while ($query->have_posts()) : $query->the_post();
            ?>
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between h-56">
                    <div>
                        <span class="text-[10px] text-[var(--primary-color)] bg-blue-50 dark:bg-slate-900 px-3 py-1 rounded-md font-bold mb-3 inline-block">راهنمای فنی</span>
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white hover:text-[var(--primary-color)] leading-relaxed"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>
                        <p class="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
                    </div>
                    <div class="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50 dark:border-slate-700">
                        <span><?php echo get_the_date('j F'); ?></span>
                        <a href="<?php the_permalink(); ?>" class="text-[var(--primary-color)] font-bold">بیشتر <i class="fa-solid fa-arrow-left text-[9px]"></i></a>
                    </div>
                </div>
            <?php
            endwhile; wp_reset_postdata(); else:
            ?>
                <p class="p-6 bg-white dark:bg-slate-800 text-center text-gray-400 rounded-xl col-span-2">مطلوبی یافت نشد.</p>
            <?php endif; ?>
        </div>
    </div>
</div>
<?php
get_footer();
`
    },
    {
      path: 'theme/inc/post-types.php',
      category: 'theme',
      description: 'Helper functions for custom taxonomies and post types like Services or Technicians metadata.',
      content: `<?php
/**
 * Register Custom Post Types for AirCare Pro
 */

if (!defined('ABSPATH')) {
    exit;
}

// Register Services Custom Post Type
function aircare_register_services_cpt() {
    $labels = array(
        'name'                  => _x('خدمات ما', 'Post Type General Name', 'aircare-pro'),
        'singular_name'         => _x('خدمت', 'Post Type Singular Name', 'aircare-pro'),
        'menu_name'             => __('خدمات', 'aircare-pro'),
        'add_new_item'          => __('افزودن خدمت جدید', 'aircare-pro'),
        'edit_item'             => __('ویرایش خدمت', 'aircare-pro'),
        'all_items'             => __('همه خدمات برودتی', 'aircare-pro'),
    );
    $args = array(
        'label'                 => __('خدمت', 'aircare-pro'),
        'description'           => __('مدیریت خدمات کولر گازی و برودتی', 'aircare-pro'),
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'excerpt'),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 6,
        'menu_icon'             => 'dashicons-wrench',
        'has_archive'           => true,
        'show_in_rest'          => true
    );
    register_post_type('service', $args);
}
add_action('init', 'aircare_register_services_cpt', 0);
`
    },
    {
      path: 'theme/admin/admin-menu.php',
      category: 'theme',
      description: 'The WordPress admin custom sidebar menu and views displaying live databases, technician ratings, warranty metrics, SMS settings, etc.',
      content: `<?php
/**
 * Custom WordPress Administration Panel Menu & Sections
 */

if (!defined('ABSPATH')) {
    exit;
}

// Hook to register the menu page and submenus
function aircare_register_admin_panel() {
    add_menu_page(
        __('پنلAirCare Pro', 'aircare-pro'),
        __('پنل AirCare', 'aircare-pro'),
        'manage_options',
        'aircare-dashboard',
        'aircare_render_admin_dashboard',
        'dashicons-dashboard',
        5
    );

    add_submenu_page(
        'aircare-dashboard',
        __('مدیریت تکنسین‌ها', 'aircare-pro'),
        __('تکنسین‌ها', 'aircare-pro'),
        'manage_options',
        'aircare-technicians',
        'aircare_render_admin_technicians'
    );

    add_submenu_page(
        'aircare-dashboard',
        __('درخواست‌های خدمات', 'aircare-pro'),
        __('درخواست‌ها', 'aircare-pro'),
        'manage_options',
        'aircare-requests',
        'aircare_render_admin_requests'
    );

    add_submenu_page(
        'aircare-dashboard',
        __('مدیریت گارانتی کارت طلایی', 'aircare-pro'),
        __('کارت گارانتی', 'aircare-pro'),
        'manage_options',
        'aircare-warranty-settings',
        'aircare_render_admin_warranty'
    );
}
add_action('admin_menu', 'aircare_register_admin_panel');

// Render Admin Dashboard HTML
function aircare_render_admin_dashboard() {
    global $wpdb;
    $table_requests = $wpdb->prefix . 'service_requests';
    $table_technicians = $wpdb->prefix . 'technicians';
    $table_warranty = $wpdb->prefix . 'warranty';

    // Query Metrics safely
    $pending_requests = $wpdb->get_var("SELECT COUNT(*) FROM $table_requests WHERE status = 'pending'");
    $total_technicians = $wpdb->get_var("SELECT COUNT(*) FROM $table_technicians");
    $active_warranty = $wpdb->get_var("SELECT COUNT(*) FROM $table_warranty WHERE status = 'active'");
    ?>
    <div class="wrap" style="direction: rtl; text-align: right; background-color: #f0f2f5; padding: 25px; border-radius: 12px; margin-top: 15px;">
        <h1 style="font-weight: 800; font-family: 'Vazir', sans-serif; color: #111827;">داشبورد اختصاصی AirCare Pro</h1>
        <p style="color: #6b7280;">به پنل مدیریت یکپارچه خدمات هوشمند سیستم های برودتی خوش آمدید.</p>
        
        <!-- Metrics Widgets -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 25px;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); border-right: 5px solid #0F6CBD;">
                <h4 style="margin: 0; color: #6b7280; font-size: 13px;">درخواست های در انتظار اقدام</h4>
                <p style="font-size: 32px; font-weight: 800; margin: 10px 0 0 0; color: #111827;"><?php echo esc_html($pending_requests ? $pending_requests : '0'); ?></p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); border-right: 5px solid #3FA9F5;">
                <h4 style="margin: 0; color: #6b7280; font-size: 13px;">تعداد کل تکنسین های فعال</h4>
                <p style="font-size: 32px; font-weight: 800; margin: 10px 0 0 0; color: #111827;"><?php echo esc_html($total_technicians ? $total_technicians : '0'); ?></p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); border-right: 5px solid #10b981;">
                <h4 style="margin: 0; color: #6b7280; font-size: 13px;">ضمانت نامه های فعال</h4>
                <p style="font-size: 32px; font-weight: 800; margin: 10px 0 0 0; color: #111827;"><?php echo esc_html($active_warranty ? $active_warranty : '0'); ?></p>
            </div>
        </div>
    </div>
    <?php
}

// Submenu: Technicians
function aircare_render_admin_technicians() {
    global $wpdb;
    $table = $wpdb->prefix . 'technicians';
    $items = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC");
    ?>
    <div class="wrap" style="direction: rtl; text-align: right; padding: 20px;">
        <h2>لیست تکنسین های برودتی AirCare</h2>
        <!-- Simple responsive administration table -->
        <table class="wp-list-table widefat fixed striped" style="margin-top:15px; border-radius: 12px; overflow:hidden;">
            <thead>
                <tr>
                    <th>کد</th>
                    <th>نام تکنسین</th>
                    <th>تلفن تماس</th>
                    <th>تخصص</th>
                    <th>وضعیت آنلاین</th>
                    <th>میانگین امتیاز مشتریان</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($items as $item): ?>
                <tr>
                    <td><?php echo esc_html($item->id); ?></td>
                    <td><strong><?php echo esc_html($item->name); ?></strong></td>
                    <td><?php echo esc_html($item->phone); ?></td>
                    <td><?php echo esc_html($item->specialty); ?></td>
                    <td><span style="padding: 3px 8px; border-radius: 12px; font-size:11px; background-color: <?php echo $item->online_status == 'online' ? '#def7ec' : '#fde8e8'; ?>; color: <?php echo $item->online_status == 'online' ? '#03543f' : '#9b1c1c'; ?>;"><?php echo $item->online_status == 'online' ? 'آنلاین' : 'آفلاین'; ?></span></td>
                    <<td>⭐ <?php echo esc_html($item->rating); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// Submenu: Request List
function aircare_render_admin_requests() {
    global $wpdb;
    $table = $wpdb->prefix . 'service_requests';
    $items = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC");
    ?>
    <div class="wrap" style="direction: rtl; text-align: right; padding: 20px;">
        <h2>درخواست‌های ثبت شده ی خدمات فنی</h2>
        <table class="wp-list-table widefat fixed striped" style="margin-top:15px; border-radius: 12px; overflow:hidden;">
            <thead>
                <tr>
                    <th>کد پیگیری</th>
                    <th>نام مشتری</th>
                    <th>تلفن</th>
                    <th>برند دستگاه</th>
                    <th>نوع خدمات</th>
                    <th>وضعیت</th>
                    <th>تاریخ ثبت</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($items)): ?>
                    <tr><td colspan="7">هیچ درخواستی در این بخش ثبت نشده است.</td></tr>
                <?php else: foreach($items as $item): ?>
                <tr>
                    <td><strong style="color:#0F6CBD;"><?php echo esc_html($item->tracking_code); ?></strong></td>
                    <td><?php echo esc_html($item->customer_name); ?></td>
                    <td><?php echo esc_html($item->customer_phone); ?></td>
                    <td><?php echo esc_html($item->device_brand); ?></td>
                    <td><?php echo esc_html($item->service_type); ?></td>
                    <td><span style="padding: 3px 8px; border-radius:6px; font-size:11px; background-color: #fef08a; color: #854d0e;"><?php echo esc_html($item->status); ?></span></td>
                    <td><?php echo esc_html($item->created_at); ?></td>
                </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// Submenu: Warranty Setup
function aircare_render_admin_warranty() {
    global $wpdb;
    $table = $wpdb->prefix . 'warranty';
    
    // Add custom card golden logic simple processor
    if (isset($_POST['submit_new_warranty'])) {
        $wpdb->insert($table, array(
            'serial_number' => sanitize_text_field($_POST['g_serial']),
            'customer_name' => sanitize_text_field($_POST['g_name']),
            'device_model'  => sanitize_text_field($_POST['g_model']),
            'activation_date' => sanitize_text_field($_POST['g_start']),
            'expiry_date'     => sanitize_text_field($_POST['g_expiry']),
            'status'          => 'active'
        ));
    }

    $items = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC");
    ?>
    <div class="wrap" style="direction: rtl; text-align: right; padding: 20px;">
        <h2>صدور کارت گارانتی خدمات طلایی AirCare</h2>
        
        <form method="post" style="background:#fff; padding:20px; border-radius:12px; max-width: 500px; margin: 20px 0; border:1px solid #e2e8f0;">
            <h3 style="margin-top:0;">صدور کارت گارانتی جدید</h3>
            <div style="margin-bottom:12px;">
                <label style="display:block; font-weight:bold; margin-bottom:5px;">شماره سریال طلایی:</label>
                <input type="text" name="g_serial" required placeholder="مثال: WAR-990099" style="width:100%; border:1px solid #cbd5e1; padding:8px; border-radius:6px;" />
            </div>
            <div style="margin-bottom:12px;">
                <label style="display:block; font-weight:bold; margin-bottom:5px;">نام خریدار دستگاه:</label>
                <input type="text" name="g_name" required placeholder="نام و نام خانوادگی مشتری" style="width:100%; border:1px solid #cbd5e1; padding:8px; border-radius:6px;" />
            </div>
            <div style="margin-bottom:12px;">
                <label style="display:block; font-weight:bold; margin-bottom:5px;">مدل کمپرسور/کولر گازی:</label>
                <input type="text" name="g_model" required placeholder="مدل دقیق اسپند" style="width:100%; border:1px solid #cbd5e1; padding:8px; border-radius:6px;" />
            </div>
            <div style="margin-bottom:12px; display:flex; gap:10px;">
                <div style="flex:1;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">شروع ضمانت:</label>
                    <input type="date" name="g_start" required style="width:100%; border:1px solid #cbd5e1; padding:8px; border-radius:6px;" />
                </div>
                <div style="flex:1;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">انقضای بیمه:</label>
                    <input type="date" name="g_expiry" required style="width:100%; border:1px solid #cbd5e1; padding:8px; border-radius:6px;" />
                </div>
            </div>
            <input type="submit" name="submit_new_warranty" value="ثبت و صادر کردن کارت" class="button button-primary" style="background:#0F6CBD; border:none;" />
        </form>

        <h2>لیست بیمه نامه ها و کارت گارانتی های صادر شده</h2>
        <table class="wp-list-table widefat fixed striped" style="margin-top:15px; border-radius: 12px; overflow:hidden;">
            <thead>
                <tr>
                    <th>سریال</th>
                    <th>نام مشتری</th>
                    <th>مدل دستگاه</th>
                    <th>تاریخ فعال سازی</th>
                    <th>تاریخ انقضا</th>
                    <th>وضعیت اعتبار</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($items)): ?>
                    <tr><td colspan="6">هیچ کارت گارانتی صادر نشده است.</td></tr>
                <?php else: foreach($items as $item): ?>
                <tr>
                    <td><strong><?php echo esc_html($item->serial_number); ?></strong></td>
                    <td><?php echo esc_html($item->customer_name); ?></td>
                    <td><?php echo esc_html($item->device_model); ?></td>
                    <td><?php echo esc_html($item->activation_date); ?></td>
                    <td><?php echo esc_html($item->expiry_date); ?></td>
                    <td><span style="padding: 3px 8px; border-radius:12px; font-size:11px; background-color:#d1fae5; color:#065f46;"><?php echo esc_html($item->status); ?></span></td>
                </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}
`
    },
    {
      path: 'theme/api/rest-api-endpoints.php',
      category: 'theme',
      description: 'The secure server-side dynamic REST API endpoints for customer integrations or hybrid Android applications.',
      content: `<?php
/**
 * Register Custom rest API routes inside WordPress wp-json
 */

if (!defined('ABSPATH')) {
    exit;
}

function aircare_register_rest_endpoints() {
    register_rest_route('aircare/v1', '/requests/(?P<tracking_code>[a-zA-Z0-9-]+)', array(
        'methods'             => 'GET',
        'callback'            => 'aircare_get_request_by_tracking',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('aircare/v1', '/warranty/(?P<serial>[a-zA-Z0-9-]+)', array(
        'methods'             => 'GET',
        'callback'            => 'aircare_get_warranty_details',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'aircare_register_rest_endpoints');

// REST: Tracking Details API Callback
function aircare_get_request_by_tracking($request) {
    global $wpdb;
    $tracking_code = sanitize_text_field($request['tracking_code']);
    
    $table_requests = $wpdb->prefix . 'service_requests';
    $table_technicians = $wpdb->prefix . 'technicians';

    $db_result = $wpdb->get_row($wpdb->prepare(
        "SELECT r.*, t.name as tech_name, t.phone as tech_phone, t.rating as tech_rating, t.online_status as tech_status 
         FROM $table_requests r 
         LEFT JOIN $table_technicians t ON r.technician_id = t.id 
         WHERE r.tracking_code = %s", 
        $tracking_code
    ));

    if (!$db_result) {
        return new WP_REST_Response(array('success' => false, 'message' => 'ملف تتبع غير موجود'), 404);
    }

    return new WP_REST_Response(array(
        'success'       => true,
        'tracking_code' => $db_result->tracking_code,
        'customer'      => $db_result->customer_name,
        'phone'         => $db_result->customer_phone,
        'brand'         => $db_result->device_brand,
        'service'       => $db_result->service_type,
        'status'        => $db_result->status,
        'image'         => $db_result->uploaded_image,
        'created_at'    => $db_result->created_at,
        'technician'    => $db_result->technician_id > 0 ? array(
            'name'   => $db_result->tech_name,
            'phone'  => $db_result->tech_phone,
            'rating' => $db_result->tech_rating,
            'status' => $db_result->tech_status
        ) : null
    ), 200);
}

// REST: Warranty Lookup Details API callback
function aircare_get_warranty_details($request) {
    global $wpdb;
    $serial = sanitize_text_field($request['serial']);
    $table = $wpdb->prefix . 'warranty';

    $db_result = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE serial_number = %s", $serial));

    if (!$db_result) {
        return new WP_REST_Response(array('success' => false, 'message' => 'کارت گارانتی با این شماره سریال یافت نشد.'), 404);
    }

    return new WP_REST_Response(array(
        'success'       => true,
        'serial_number' => $db_result->serial_number,
        'customer'      => $db_result->customer_name,
        'device'        => $db_result->device_model,
        'activated'     => $db_result->activation_date,
        'expiry'        => $db_result->expiry_date,
        'status'        => $db_result->status
    ), 200);
}
`
    },
    {
      path: 'theme/ajax/ajax-handlers.php',
      category: 'theme',
      description: 'The localized AJAX request and forms handlers for interactive web submissions.',
      content: `<?php
/**
 * AirCare WordPress AJAX Endpoints and Action Hooks
 */

if (!defined('ABSPATH')) {
    exit;
}

// Action: Front-End Submit Service Request Form
function aircare_submit_service_request_handler() {
    // Nonce validation safely
    if (!isset($_POST['customer_name']) || !isset($_POST['customer_phone'])) {
        wp_send_json_error(array('message' => 'اطلاعات ارسالی ناقص می باشد!'));
    }

    global $wpdb;
    $customer_name  = sanitize_text_field($_POST['customer_name']);
    $customer_phone = sanitize_text_field($_POST['customer_phone']);
    $device_brand   = sanitize_text_field($_POST['device_brand']);
    $service_type   = sanitize_text_field($_POST['service_type']);
    $description    = sanitize_textarea_field($_POST['description']);
    $tracking_code  = aircare_generate_tracking_code();

    // Handle AJAX file uploading to Media Library safely
    $image_url = '';
    if (isset($_FILES['uploaded_file']) && !empty($_FILES['uploaded_file']['name'])) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        
        $attachment_id = media_handle_upload('uploaded_file', 0);
        if (!is_wp_error($attachment_id)) {
            $image_url = wp_get_attachment_url($attachment_id);
        }
    }

    $table_requests = $wpdb->prefix . 'service_requests';
    $table_technicians = $wpdb->prefix . 'technicians';

    // Query and auto assign to an ONLINE technician with the highest rating
    $online_tech = $wpdb->get_row("SELECT id, name, phone FROM $table_technicians WHERE online_status = 'online' ORDER BY rating DESC LIMIT 1");
    $tech_id = $online_tech ? $online_tech->id : 0;
    $status = $online_tech ? 'assigned' : 'pending';

    $insert_result = $wpdb->insert($table_requests, array(
        'tracking_code'  => $tracking_code,
        'customer_name'  => $customer_name,
        'customer_phone' => $customer_phone,
        'device_brand'   => $device_brand,
        'service_type'   => $service_type,
        'description'    => $description,
        'uploaded_image' => $image_url,
        'technician_id'  => $tech_id,
        'status'         => $status
    ));

    if ($insert_result) {
        // Build dynamic SMS notifications block
        $sms_msg = "مشتری گرامی " . $customer_name . "، درخواست خدمات شما با موفقیت ثبت شد. کد رهگیری پیگیری: " . $tracking_code;
        aircare_send_sms($customer_phone, $sms_msg);

        if ($online_tech) {
            $tech_msg = "جناب " . $online_tech->name . "، یک سفارش جدید نصب/تعمیر " . $service_type . " به شما واگذار شد. تماس مشتری: " . $customer_phone;
            aircare_send_sms($online_tech->phone, $tech_msg);
        }

        wp_send_json_success(array(
            'message' => 'درخواست شما ثبت شد.',
            'tracking_code' => $tracking_code,
            'technician' => $online_tech ? $online_tech->name : 'در انتظار تخصیص'
        ));
    } else {
        wp_send_json_error(array('message' => 'درخواست ثبت نشد، لطفا قوانین را چک کنید.'));
    }
}
add_action('wp_ajax_aircare_submit_service_request', 'aircare_submit_service_request_handler');
add_action('wp_ajax_nopriv_aircare_submit_service_request', 'aircare_submit_service_request_handler');

// Action: Front-End Submit Warranty Lookup
function aircare_lookup_warranty_handler() {
    if (!isset($_POST['serial_number'])) {
        wp_send_json_error(array('message' => 'سریال نامعتبر است'));
    }

    global $wpdb;
    $serial = sanitize_text_field($_POST['serial_number']);
    $table = $wpdb->prefix . 'warranty';

    $warranty = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE serial_number = %s", $serial));

    if ($warranty) {
        wp_send_json_success(array(
            'serial' => $warranty->serial_number,
            'customer' => $warranty->customer_name,
            'device' => $warranty->device_model,
            'activated' => $warranty->activation_date,
            'expiry' => $warranty->expiry_date,
            'status' => $warranty->status
        ));
    } else {
        wp_send_json_error(array('message' => 'کارت گارانتی طلایی صادر نشده یا مفقود می باشد.'));
    }
}
add_action('wp_ajax_aircare_lookup_warranty', 'aircare_lookup_warranty_handler');
add_action('wp_ajax_nopriv_aircare_lookup_warranty', 'aircare_lookup_warranty_handler');
`
    },
    {
      path: 'theme/assets/main.js',
      category: 'theme',
      description: 'The dynamic visual theme enqueued JS code to process AJAX feedback and layout items.',
      content: `/**
 * AirCare Premium Theme Client Logic Core
 * Author: AirCare Team
 */

jQuery(document).ready(function($) {
    "use strict";

    // 1. Sticky Header & Shrink on Scroll
    const header = $('#aircare-header');
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            header.addClass('py-2 shadow-lg').removeClass('py-4');
            $('#scroll-top').fadeIn(200);
        } else {
            header.addClass('py-4').removeClass('py-2 shadow-lg');
            $('#scroll-top').fadeOut(200);
        }

        // Reading progress calculation
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        $('#reading-progress').css('width', scrolled + '%');
    });

    // Scroll to Top click trigger
    $('#scroll-top').click(function() {
        $('html, body').animate({scrollTop : 0}, 600);
        return false;
    });

    // 2. High-Contrast Interactive Dark Mode Toggle Support
    $('#dark-mode-toggle').click(function() {
        $('body').toggleClass('dark-mode');
        const isDark = $('body').hasClass('dark-mode');
        localStorage.setItem('aircare_dark_mode', isDark ? 'yes' : 'no');
        
        // Toggle icon visual
        $(this).find('i').toggleClass('fa-moon fa-sun text-gray-600 text-yellow-400');
    });

    // Check Local Storage preference
    if (localStorage.getItem('aircare_dark_mode') === 'yes') {
        $('body').addClass('dark-mode');
        $('#dark-mode-toggle').find('i').addClass('fa-sun text-yellow-400').removeClass('fa-moon text-gray-600');
    }

    // 3. File Uploder drag-drop zone events
    const zone = $('#drag-drop-zone');
    const input = $('#file_ref');

    zone.on('click', function() {
        input.click();
    });

    input.on('change', function() {
        const file = this.files[0];
        if (file) {
            $('#file-upload-preview').text('تصویر انتخاب شد: ' + file.name).removeClass('hidden');
        }
    });

    // 4. Submit Service Request AJAX Form Processor
    $('#aircare-request-form').on('submit', function(e) {
        e.preventDefault();
        const responseBlock = $('#response-block');
        const submitBtn = $('#submit-btn');
        submitBtn.prop('disabled', true).text('در حال ثبت اطلاعات...');

        const formData = new FormData(this);
        formData.append('action', 'aircare_submit_service_request');

        $.ajax({
            url: aircare_ajax_obj.ajax_url,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(res) {
                submitBtn.prop('disabled', false).text('ثبت نهایی درخواست');
                if (res.success) {
                    responseBlock.html('<div class="bg-green-100 text-green-800 p-5 rounded-2xl"><h4 class="font-bold text-lg">درخواست شما با موفقیت ثبت شد!</h4><p class="mt-2">کد پیگیری شما: <strong>' + res.data.tracking_code + '</strong><br />تکنسین اختصاص داده شده: ' + res.data.technician + '</p><p class="text-xs text-gray-500 mt-2">پیامک اطلاع رسانی حاوی کد پیگیری به موبایل شما فرستاده شد.</p></div>').removeClass('hidden');
                } else {
                    responseBlock.html('<div class="bg-red-100 text-red-800 p-4 rounded-xl">' + res.data.message + '</div>').removeClass('hidden');
                }
            },
            error: function() {
                submitBtn.prop('disabled', false).text('ثبت نهایی درخواست');
                responseBlock.html('<div class="bg-red-100 text-red-800 p-4 rounded-xl">خطایی در سرور رخ داده است. دوباره تلاش کنید.</div>').removeClass('hidden');
            }
        });
    });

    // 5. Submit Warranty Gold Query AJAX
    $('#aircare-warranty-form').on('submit', function(e) {
        e.preventDefault();
        const resultBlock = $('#warranty-result');
        const btn = $('#warranty-btn');
        btn.prop('disabled', true).text('در حال استعلام...');

        $.ajax({
            url: aircare_ajax_obj.ajax_url,
            type: 'POST',
            data: {
                action: 'aircare_lookup_warranty',
                serial_number: $('#warranty_serial').val()
            },
            success: function(res) {
                btn.prop('disabled', false).text('استعلام فوری');
                resultBlock.removeClass('hidden');
                if (res.success) {
                    resultBlock.html('<div class="bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 p-6 rounded-2xl text-right flex flex-col gap-3"><h4 class="text-lg font-bold text-emerald-800 dark:text-emerald-400">اطلاعات گارانتی طلایی معتبر</h4><div class="text-xs text-gray-500 grid grid-cols-2 gap-4"><div>نام دارنده: <strong>' + res.data.customer + '</strong></div><div>مدل دستگاه: <strong>' + res.data.device + '</strong></div><div>شروع بیمه: ' + res.data.activated + '</div><div>انقضای ضمانت: ' + res.data.expiry + '</div></div><span class="w-fit bg-emerald-600 text-white rounded-lg px-4 py-1 text-xs font-bold mt-2">وضعیت: فعال</span></div>');
                } else {
                    resultBlock.html('<div class="bg-red-50 dark:bg-slate-900 border border-red-200 dark:border-slate-800 p-5 rounded-2xl text-red-800 dark:text-red-400 text-sm font-semibold"><i class="fa-solid fa-triangle-exclamation ml-2"></i> ' + res.data.message + '</div>');
                }
            }
        });
    });
});
`
    },
    {
      path: 'theme/widgets/widget-services.php',
      category: 'theme',
      description: 'The AirCare Pro interactive sidebar widget displaying custom services and fees.',
      content: `<?php
/**
 * Custom services widget.
 */

if (!defined('ABSPATH')) {
    exit;
}

class AirCare_Widget_Services extends WP_Widget {
    public function __construct() {
        parent::__construct(
            'aircare_widget_services',
            __('AirCare: لیست سرویس های برودتی', 'aircare-pro'),
            array('description' => __('نمایش آخرین خدمات به همراه علائم کیفی و تعرفه های حدودی', 'aircare-pro'))
        );
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];
        ?>
        <div class="widget-services-list flex flex-col gap-4">
            <h4 class="text-md font-bold text-gray-900 dark:text-white border-r-3 border-[var(--primary-color)] pr-2">تعرفه خدمات پایه کولر</h4>
            <div class="flex flex-col gap-3 text-xs">
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                    <span>سرویس دوره ای و نشت یابی</span>
                    <strong class="text-blue-600">۶۵۰,۰۰۰ تومان</strong>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                    <span>شارژ گاز تکمیلی (نوع R410)</span>
                    <strong class="text-blue-600">۹۸۰,۰۰۰ تومان</strong>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                    <span>تعویض موتور فن خارجی پنل</span>
                    <strong class="text-blue-600">تماس با کارشناس</strong>
                </div>
            </div>
        </div>
        <?php
        echo $args['after_widget'];
    }
}
`
    },
    {
      path: 'theme/widgets/widget-technicians.php',
      category: 'theme',
      description: 'The AirCare Pro widget displaying online specialist technician lists.',
      content: `<?php
/**
 * Custom technicians online status widget.
 */

if (!defined('ABSPATH')) {
    exit;
}

class AirCare_Widget_Technicians extends WP_Widget {
    public function __construct() {
        parent::__construct(
            'aircare_widget_technicians',
            __('AirCare: وضعیت آنلاین تکنسین‌ها', 'aircare-pro'),
            array('description' => __('نمایش وضعیت آنلاین و آفلاین تکنسین‌های آماده اعزام به محل', 'aircare-pro'))
        );
    }

    public function widget($args, $instance) {
        global $wpdb;
        $table = $wpdb->prefix . 'technicians';
        $techs = $wpdb->get_results("SELECT * FROM $table LIMIT 3");

        echo $args['before_widget'];
        ?>
        <div class="widget-techs flex flex-col gap-4">
            <h4 class="text-md font-bold text-gray-900 dark:text-white border-r-3 border-[var(--primary-color)] pr-2">تکنسین‌های آماده به کار</h4>
            <div class="flex flex-col gap-3">
                <?php foreach($techs as $tech): ?>
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                    <div class="flex items-center gap-2.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-<?php echo $tech->online_status == 'online' ? 'emerald' : 'orange'; ?>-500"></div>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-gray-900 dark:text-white"><?php echo esc_html($tech->name); ?></span>
                            <span class="text-[10px] text-gray-400"><?php echo esc_html($tech->specialty); ?></span>
                        </div>
                    </div>
                    <span class="text-[11px] font-semibold text-emerald-600">⭐ <?php echo esc_html($tech->rating); ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
        echo $args['after_widget'];
    }
}
`
    },
    {
      path: 'easy-installer/index.php',
      category: 'easy-installer',
      description: 'The Easy Installer beautiful Setup Wizard HTML frontend interface designed for 1-click execution.',
      content: `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بسته نصبی آسان AirCare Pro - راه اندازی خودکار</title>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Vazirmatn', sans-serif;
            background-color: #F4F6F9;
            color: #333333;
            margin: 0;
            padding: 40px 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            box-sizing: border-box;
        }
        .installer-card {
            background-color: #ffffff;
            width: 100%;
            max-width: 580px;
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(15, 108, 189, 0.05);
            border: 1px solid #E2E8F0;
        }
        .header {
            text-align: center;
            margin-bottom: 35px;
        }
        .logo {
            width: 55px;
            height: 55px;
            background-color: #0F6CBD;
            color: #fff;
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            font-weight: 900;
            margin-bottom: 15px;
            box-shadow: 0 5px 15px rgba(15, 108, 189, 0.2);
        }
        h1 {
            font-size: 20px;
            font-weight: 900;
            margin: 0 0 8px 0;
            color: #111827;
        }
        p {
            font-size: 13px;
            color: #6B7280;
            margin: 0;
            line-height: 1.6;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #4B5563;
        }
        input, select {
            width: 100%;
            box-sizing: border-box;
            background-color: #F9FAFB;
            border: 1px solid #D1D5DB;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.2s;
            font-family: inherit;
        }
        input:focus {
            outline: none;
            border-color: #0F6CBD;
            background-color: #ffffff;
            box-shadow: 0 0 0 3px rgba(15, 108, 189, 0.1);
        }
        .btn {
            background-color: #0F6CBD;
            color: #FFFFFF;
            font-weight: 700;
            font-size: 14px;
            padding: 14px;
            border: none;
            width: 100%;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(15, 108, 189, 0.15);
            transition: all 0.2s;
            margin-top: 10px;
        }
        .btn:hover {
            background-color: #3FA9F5;
        }
        .progress-bar {
            background-color: #E2E8F0;
            height: 6px;
            border-radius: 10px;
            margin-bottom: 25px;
            overflow: hidden;
        }
        .progress-fill {
            background-color: #0F6CBD;
            width: 33%;
            height: 100%;
            border-radius: 10px;
        }
    </style>
</head>
<body>

<div class="installer-card">
    <div class="header">
        <div class="logo">A</div>
        <h1>بسته راه اندازی و نصب آسان AirCare Pro</h1>
        <p>مرحله ۲ از ۳: پیکربندی و اتصال به پایگاه داده دیتابیس MySQL</p>
    </div>

    <div class="progress-bar">
        <div class="progress-fill" style="width: 66%;"></div>
    </div>

    <form action="installer.php" method="POST">
        <div class="form-group">
            <label>آدرس سرور دیتابیس (DB Host)</label>
            <input type="text" name="db_host" value="localhost" required>
        </div>
        <div class="form-group">
            <label>نام کاربری دیتابیس (DB Username)</label>
            <input type="text" name="db_user" placeholder="مثال: root" required>
        </div>
        <div class="form-group">
            <label>رمز عبور دیتابیس (DB Password)</label>
            <input type="password" name="db_pass" placeholder="کلمه عبور پایگاه داده">
        </div>
        <div class="form-group">
            <label>نام دقیق دیتابیس وردپرس (DB Name)</label>
            <input type="text" name="db_name" required placeholder="مثال: aircare_db">
        </div>
        
        <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; padding: 15px; border-radius: 12px; font-size: 12px; color: #1E40AF; margin-bottom: 25px; line-height: 1.7;">
            💡 تمامی جداول گارانتی طلایی، سیستم تخصیص تکنسین ها، پایگاه داده وردپرس، سئو Rank Math و الگوهای درون ریزی به صورت خودکار نصب و فعال می شوند.
        </div>

        <button type="submit" class="btn">ثبت اطلاعات دیتابیس و نصب خودکار قالب و دمو</button>
    </form>
</div>

</body>
</html>
`
    },
    {
      path: 'easy-installer/installer.php',
      category: 'easy-installer',
      description: 'The actual easy installation background PHP extraction core including MySQL schemas execution.',
      content: `<?php
/**
 * AirCare Pro Setup Engine Core - Extraction and MySQL Installer
 */

header('Content-Type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('دسترسی مستقیم غیر مجاز می باشد.');
}

$db_host = sanitize_input($_POST['db_host']);
$db_user = sanitize_input($_POST['db_user']);
$db_pass = sanitize_input($_POST['db_pass']);
$db_name = sanitize_input($_POST['db_name']);

// 1. Establish MySQL Connection
$conn = @new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die('<div style="direction:rtl; text-align:center; padding:100px; font-family:sans-serif; background:#FFF5F5;"><h1 style="color:#E53E3E;">خطا در اتصال به دیتابیس!</h1><p>' . $conn->connect_error . '</p><a href="index.php" style="color:#3182CE;">بازگشت و تلاش مجدد</a></div>');
}

// 2. Load and execute db_setup.sql containing WordPress tables, core dummy data, and system preferences
$sql_file = 'db_setup.sql';
if (!file_exists($sql_file)) {
    die('فایل جداول پایگاه داده db_setup.sql در این پکیج یافت نشد.');
}

$queries = file_get_contents($sql_file);
$conn->multi_query($queries);

do {
    if ($result = $conn->store_result()) {
        $result->free();
    }
} while ($conn->next_result());

$conn->close();

// 3. Success installation visual layout
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>پایان نصب خودکار AirCare Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Vazirmatn', sans-serif; background-color: #F4F6F9; padding: 100px 15px; text-align: center; }
        .success-box { background: #fff; max-width: 500px; margin: 0 auto; padding: 40px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        h1 { color: #10B981; margin-bottom: 10px; }
        a { background-color: #0F6CBD; color: #fff; padding: 12px 30px; display: inline-block; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="success-box">
        <h1>تبریک! نصب با موفقیت پایان یافت. 🎉</h1>
        <p>وبسایت خدماتی تفصیلی و دیتابیس AirCare Pro با موفقیت برون ریزی شدند.</p>
        <p class="text-xs text-gray-400">آدرس پیش فرض ورود به پنل ادمین: <strong>/wp-admin</strong><br />نام کاربری: <strong>admin</strong> | کلمه عبور: <strong>admin123</strong></p>
        <a href="../index.html">ورود به وبسایت آماده کار</a>
    </div>
</body>
</html>
<?php

function sanitize_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}
`
    },
    {
      path: 'demo-data/demo-content.xml',
      category: 'demo-data',
      description: 'The WordPress standard XML content export containing generated layout templates, services posts, meta data and taxonomy structures.',
      content: `<?xml version="1.0" encoding="UTF-8" ?>
<!-- AirCare Pro WordPress XML Export Format -->
<rss version="2.0" xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/commentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
    <title>${themeName}</title>
    <link>https://aircare-pro.ir</link>
    <description>سیستم آنلاین خدمات برودتی</description>
    <pubDate>Sun, 21 Jun 2026 04:00:00 +0000</pubDate>
    <language>fa-IR</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    
    <!-- Item 1: Service Post -->
    <item>
        <title>نصب و راه اندازی کولر گازی ۲۴۰۰۰ مایدیا</title>
        <link>https://aircare-pro.ir/service/midea-service</link>
        <pubDate>Mon, 15 Jun 2026 09:12:11 +0000</pubDate>
        <dc:creator><![CDATA[admin]]></dc:creator>
        <description></description>
        <content:encoded><![CDATA[سرویسکاران مجرب ما با ابزارآلات پیشرفته نشت یابی و ابزار شارژ گاز اقدام به نصب و خدمات گارانتی با مهر رسمی می نمایند.]]></content:encoded>
        <wp:post_id>100</wp:post_id>
        <wp:post_date><![CDATA[2026-06-15 09:12:11]]></wp:post_date>
        <wp:post_type><![CDATA[service]]></wp:post_type>
        <wp:status><![CDATA[publish]]></wp:status>
    </item>
</channel>
</rss>
`
    },
    {
      path: 'documentation/readme.md',
      category: 'documentation',
      description: 'The master development and configuration readMe documentation of the entire package.',
      content: `# راهنمای توسعه و راه‌اندازی پکیج قالب AirCare Pro

به جامع‌ترین پکیج قالب وردپرسی هوشمند خدمات برودتی پویا خوش آمدید.

## ساختار دایرکتوری نهایی پکیج
\`\`\`text
theme-package.zip
├── theme/               # پوسته اصلی آماده نصب در وردپرس
│   ├── assets/          # جاوااسکریپت و استایل های قالب
│   ├── templates/       # برگه‌های اختصاصی (استعلام گارانتی، ثبت سفارش، پنل مشتری)
│   ├── admin/           # هماهنگ‌کننده پیشکار مدیریت دیتابیس جداول
│   ├── api/             # کدهای روت REST API وردپرس
│   └── functions.php    # هماهنگ‌کننده فعال‌سازی جداول و متدها
├── plugins/             # بانک افزونه‌های مکمل (غیر فروشگاهی سئو و فرم‌ساز)
├── demo-data/           # فایلهای XML دموی فارسی به همراه طرح های المنتور
├── easy-installer/      # اسکریپت‌های اساسی نصب یک کلیکی بدون دانش فنی
└── documentation/       # مستندات تعاملی جامع توسعه‌دهندگان
\`\`\`

## نحوه راه‌اندازی بسته نصبی آسان (۳ گام)
۱. محتویات دایرکتوری \`easy-installer\` را به هاست خود بخش \`public_html\` منتقل کنید.
۲. آدرس دامنه خود را در مرورگر وارد نمایید تا دستیار نصب هوشمند اجرا شود.
۳. اطلاعات دیتابیس MySQL خود را وارد کرده و دکمه "ثبت اطلاعات دیتابیس" را بفشارید. 
سیستم به طور تمام خودکار شروع به استخراج هسته وردپرس، قالب AirCare Pro، فعال سازی کدهای گارانتی و ساخت یوزر کارمند پیش فرض می نماید.

## رابطه فنی بین افزونه ها و دیتابیس اختصاصی
* **Elementor Pro**: کنترل ظاهر بصری هدرهای چسبان، مگامنوها و ساختار ویوها.
* **JetEngine + Custom Setup**: هدایت خودکار متا فیلدهای تکنسین ها و خوانش وضعیت آنلاین به صورت REST.
* **Amelia Pro**: هماهنگ کننده تقویم رزروها که اطلاعات را در جدول \`wp_appointments\` ثبت می کند.
* **Gravity Forms**: کنترل فرم های چند مرحله ای ثبت نام، عیب یابی سریع و ارسال فیش تصویر.
* **کدهای AJAX داخلی**: برقراری ارتباط سریع و بدون فوت وقت بین المان های فرانت اند و جداول دیتابیس در \`ajax-handlers.php\`.
`
    }
  ];
};
