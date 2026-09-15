<?php
/**
 * Barakat Arabia — contact form mailer.
 *
 * Receives the "Request a proposal" form from index.html / index-ar.html
 * (fields: name, email, phone, service, message) and emails it to the
 * company inbox.
 *
 * - AJAX requests (fetch) get a short plain-text reply + HTTP status code,
 *   which the page script shows in the form's status line.
 * - Normal form posts (JavaScript disabled) get a small branded HTML page.
 */

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
$recipient   = getenv('BARAKAT_CONTACT_EMAIL') ?: 'info@barakatarabia.com';
$fromAddress = 'no-reply@barakatarabia.com';   // must be on the site's own domain
$fromName    = 'Barakat Arabia Website';
$rateLimit   = 5;                              // max submissions per IP ...
$rateWindow  = 600;                            // ... per this many seconds

// Cloudflare Turnstile — paste the SECRET key between the quotes.
// (The SITE key goes in index.html and index-ar.html.) Leave empty to switch the check off.
$turnstileSecret = '';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function field($key, $max)
{
    $value = isset($_POST[$key]) && is_string($_POST[$key]) ? trim($_POST[$key]) : '';
    $value = strip_tags($value);
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return substr($value, 0, $max);
}

function single_line($value)
{
    return trim(preg_replace('/[\r\n\t]+/', ' ', $value));
}

function encode_header($value)
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/** Ask Cloudflare whether a Turnstile token is valid. Returns true, false, or null if unreachable. */
function turnstile_ok($secret, $token, $ip)
{
    if ($token === '' || strlen($token) > 2048) {
        return false;
    }
    $post = http_build_query(array('secret' => $secret, 'response' => $token, 'remoteip' => $ip));
    $url  = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, array(
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $post,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
        ));
        $raw = curl_exec($ch);
    } else {
        $raw = @file_get_contents($url, false, stream_context_create(array('http' => array(
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $post,
            'timeout' => 10,
        ))));
    }

    $result = is_string($raw) ? json_decode($raw, true) : null;
    if (!is_array($result)) {
        return null;
    }
    return !empty($result['success']);
}

function is_ajax()
{
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH'])) {
        return true;
    }
    $accept = isset($_SERVER['HTTP_ACCEPT']) ? $_SERVER['HTTP_ACCEPT'] : '';
    return strpos($accept, 'text/html') === false;
}

function is_arabic()
{
    if (isset($_POST['lang']) && $_POST['lang'] === 'ar') {
        return true;
    }
    $ref = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
    return (bool) preg_match('/-ar(\.html)?([?#]|$)/', parse_url($ref, PHP_URL_PATH) ?: '');
}

function respond($code, $key)
{
    $ar = is_arabic();
    $messages = array(
        'sent'     => array(
            'en' => 'Thank you — your request has been sent. We’ll be in touch shortly.',
            'ar' => 'شكراً لك — تم إرسال طلبك بنجاح، وسنتواصل معك قريباً.',
        ),
        'invalid'  => array(
            'en' => 'Please complete the form with your name, a valid email and your project brief, then try again.',
            'ar' => 'يرجى إكمال النموذج بالاسم وبريد إلكتروني صحيح وملخص المشروع، ثم المحاولة مرة أخرى.',
        ),
        'method'   => array(
            'en' => 'Please use the contact form to send your request.',
            'ar' => 'يرجى استخدام نموذج التواصل لإرسال طلبك.',
        ),
        'captcha'  => array(
            'en' => 'Please complete the security check and try again.',
            'ar' => 'يرجى إكمال التحقق الأمني ثم المحاولة مرة أخرى.',
        ),
        'too_many' => array(
            'en' => 'Too many requests. Please wait a few minutes and try again.',
            'ar' => 'طلبات كثيرة. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.',
        ),
        'failed'   => array(
            'en' => 'Sorry, the message could not be sent. Please email info@barakatarabia.com or call +966 54 412 6721.',
            'ar' => 'عذراً، تعذّر إرسال الرسالة. يرجى مراسلتنا على info@barakatarabia.com أو الاتصال على ‎+966 54 412 6721.',
        ),
    );
    $text = $messages[$key][$ar ? 'ar' : 'en'];

    http_response_code($code);
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');

    if (is_ajax()) {
        header('Content-Type: text/plain; charset=UTF-8');
        echo $text;
        exit;
    }

    $ok    = $code >= 200 && $code < 300;
    $home  = $ar ? '../index-ar.html#contact' : '../index.html#contact';
    $title = $ok ? ($ar ? 'تم إرسال طلبك' : 'Request sent') : ($ar ? 'تعذّر الإرسال' : 'Something went wrong');
    $back  = $ar ? 'العودة إلى الموقع' : 'Back to the website';
    $esc   = function ($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); };

    header('Content-Type: text/html; charset=UTF-8');
    ?>
<!doctype html>
<html lang="<?= $ar ? 'ar' : 'en' ?>" dir="<?= $ar ? 'rtl' : 'ltr' ?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= $esc($title) ?> | <?= $ar ? 'البركات العربية' : 'Barakat Arabia' ?></title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px 16px;background:#0a0b0d;color:#eeebe6;
    font:16px/1.6 system-ui,-apple-system,"Segoe UI",Tahoma,Arial,sans-serif}
  .card{width:100%;max-width:520px;background:#161920;border:1px solid #1d2129;border-radius:16px;padding:40px 32px;text-align:center}
  .card img{width:180px;height:auto;margin-bottom:28px}
  .mark{width:56px;height:56px;margin:0 auto 18px;border-radius:50%;display:grid;place-items:center;font-size:28px;
    background:<?= $ok ? 'rgba(46,196,120,.15)' : 'rgba(230,80,80,.15)' ?>;color:<?= $ok ? '#2ec478' : '#e65050' ?>}
  h1{margin:0 0 10px;font-size:1.5rem}
  p{margin:0 0 28px;color:#9b9ea6}
  a.btn{display:inline-block;padding:12px 24px;border-radius:999px;background:#d3202c;color:#fff;font-weight:600;text-decoration:none}
  a.btn:hover{filter:brightness(1.08)}
</style>
</head>
<body>
  <main class="card">
    <img src="v2/img/logo-light-320.webp" width="320" height="106" alt="<?= $ar ? 'البركات العربية' : 'Barakat Arabia' ?>">
    <div class="mark" aria-hidden="true"><?= $ok ? '&#10003;' : '!' ?></div>
    <h1><?= $esc($title) ?></h1>
    <p><?= $esc($text) ?></p>
    <a class="btn" href="<?= $esc($home) ?>"><?= $esc($back) ?></a>
  </main>
</body>
</html>
<?php
    exit;
}

// ---------------------------------------------------------------------------
// Request handling
// ---------------------------------------------------------------------------
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'method');
}

// Honeypot: if a hidden "website" / "_gotcha" field is ever added and filled in,
// it's a bot — pretend success without sending anything.
if (field('_gotcha', 200) !== '' || field('website', 200) !== '') {
    respond(200, 'sent');
}

$name    = single_line(field('name', 120));
$email   = single_line(field('email', 190));
$phone   = single_line(field('phone', 40));
$service = single_line(field('service', 120));
$message = field('message', 5000);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, 'invalid');
}
if ($phone !== '' && !preg_match('/^[0-9+()\-.\s\x{0660}-\x{0669}]{5,40}$/u', $phone)) {
    respond(400, 'invalid');
}

$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';

// Cloudflare Turnstile check (skipped while $turnstileSecret is empty).
if ($turnstileSecret !== '') {
    $human = turnstile_ok($turnstileSecret, field('cf-turnstile-response', 2048), $ip);
    if ($human === null) {
        error_log('Barakat mailer: could not reach Turnstile siteverify');
        respond(503, 'failed');
    }
    if (!$human) {
        respond(403, 'captcha');
    }
}

// Simple per-IP rate limit (stored in the system temp directory).
$rateFile = rtrim(sys_get_temp_dir(), '/\\') . '/barakat-mailer-' . md5($ip);
$now      = time();
$hits     = array();
if (is_readable($rateFile)) {
    $hits = array_filter(
        array_map('intval', explode(',', (string) @file_get_contents($rateFile))),
        function ($t) use ($now, $rateWindow) { return $t > $now - $rateWindow; }
    );
}
if (count($hits) >= $rateLimit) {
    respond(429, 'too_many');
}
$hits[] = $now;
@file_put_contents($rateFile, implode(',', $hits), LOCK_EX);

// Build the email.
$subject = 'New proposal request from ' . $name . ($service !== '' ? ' — ' . $service : '');
$page    = isset($_SERVER['HTTP_REFERER']) ? single_line($_SERVER['HTTP_REFERER']) : '';

$body  = "New request from the barakatarabia.com contact form\n";
$body .= str_repeat('-', 50) . "\n\n";
$body .= "Name:    $name\n";
$body .= "Email:   $email\n";
$body .= 'Phone:   ' . ($phone !== '' ? $phone : '—') . "\n";
$body .= 'Service: ' . ($service !== '' ? $service : '—') . "\n\n";
$body .= "Project brief:\n$message\n\n";
$body .= str_repeat('-', 50) . "\n";
$body .= 'Sent:    ' . gmdate('Y-m-d H:i') . " UTC\n";
if ($page !== '') {
    $body .= "Page:    $page\n";
}
$body .= "IP:      $ip\n";

$headers = array(
    'From: ' . encode_header($fromName) . " <$fromAddress>",
    'Reply-To: ' . encode_header($name) . " <$email>",
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: BarakatArabia-Website',
);
$headers = implode("\r\n", $headers);

// Try with an envelope sender on our own domain first (better deliverability),
// then without it for hosts that don't allow the -f flag.
$sent = @mail($recipient, encode_header($subject), $body, $headers, '-f' . $fromAddress);
if (!$sent) {
    $sent = @mail($recipient, encode_header($subject), $body, $headers);
}

if ($sent) {
    respond(200, 'sent');
}

error_log('Barakat mailer: mail() failed for submission from ' . $email);
respond(500, 'failed');
