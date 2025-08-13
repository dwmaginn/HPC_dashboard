<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

ini_set('display_errors', '0');

/**
 * Sanitize plain text input for safe inclusion in emails/logs.
 */
function sanitize_text(string $value): string {
    $value = trim($value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Method Not Allowed';
    exit;
}

$honeypot = $_POST['company'] ?? '';
if (!empty($honeypot)) {
    // Treat as spam; do nothing but respond OK
    http_response_code(200);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'OK';
    exit;
}

$name = isset($_POST['name']) ? sanitize_text((string)$_POST['name']) : '';
$emailRaw = isset($_POST['email']) ? trim((string)$_POST['email']) : '';
$email = filter_var($emailRaw, FILTER_VALIDATE_EMAIL) ? $emailRaw : '';
$details = isset($_POST['details']) ? trim((string)$_POST['details']) : '';

if ($name === '' || $email === '' || $details === '') {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Invalid submission. Please provide all required fields.';
    exit;
}

$autoloaderPath = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloaderPath)) {
    log_order(false, $name, $email, $details, 'Mailer not configured');
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Service unavailable. Please try again later.';
    exit;
}
require $autoloaderPath;

/**
 * Append a simple log entry to data/orders.log.
 */
function log_order(bool $sent, string $name, string $email, string $details, string $error = ''): void {
    $logDir = __DIR__ . '/data';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0775, true);
    }
    $logPath = $logDir . '/orders.log';
    $timestamp = gmdate('c');
    $summaryDetails = substr(preg_replace('/\s+/', ' ', $details), 0, 500);
    $entry = sprintf("[%s] sent=%s name=\"%s\" email=\"%s\" details=\"%s\" error=\"%s\"\n",
        $timestamp, $sent ? 'yes' : 'no', $name, $email, $summaryDetails, $error);
    @file_put_contents($logPath, $entry, FILE_APPEND | LOCK_EX);
}

$host = getenv('SMTP_HOST') ?: '';
$user = getenv('SMTP_USER') ?: '';
$pass = getenv('SMTP_PASS') ?: '';
$port = getenv('SMTP_PORT') ?: '587';
$from = getenv('SMTP_FROM') ?: '';
$to = getenv('ORDER_RECIPIENT') ?: $from;

if ($host === '' || $user === '' || $pass === '' || $from === '' || $to === '') {
    log_order(false, $name, $email, $details, 'Missing SMTP configuration');
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Service unavailable. Please try again later.';
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $user;
    $mail->Password = $pass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = (int)$port;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($from, 'Order Notifications');
    $mail->addAddress($to);
    $mail->addReplyTo($email, $name);

    $subject = 'New Order from Website';
    $bodyText = "New order received:\n\n"
        . "Name: {$name}\n"
        . "Email: {$email}\n"
        . "Details:\n{$details}\n"
        . "\nSubmitted at: " . gmdate('Y-m-d H:i:s') . " UTC\n";

    $mail->Subject = $subject;
    $mail->Body = $bodyText;
    $mail->AltBody = $bodyText;
    $mail->isHTML(false);

    $mail->send();
    log_order(true, $name, $email, $details, '');

    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Order Received</title><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:2rem;max-width:42rem;margin:0 auto;"><h1>Thank you!</h1><p>Your order has been received. We will contact you shortly.</p><p><a href="index.html">Return to site</a></p></body></html>';
    exit;
} catch (Exception $e) {
    log_order(false, $name, $email, $details, $mail->ErrorInfo ?: $e->getMessage());
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'We could not send your request right now. Please try again later.';
    exit;
}

