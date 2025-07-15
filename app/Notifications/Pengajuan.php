<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class Pengajuan extends Notification implements ShouldQueue
{
    use Queueable;

    private $message; // Ubah dari $messages menjadi $message

    /**
     * Create a new notification instance.
     */
    public function __construct($message)
    {
        $this->message = $message; // Simpan pesan yang diterima
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Pengajuan Lomba Baru')
            ->line($this->message) // Tampilkan pesan yang dikirim
            ->action('Lihat Detail', url('/pengajuan-lomba/update'))
            ->line('Terima kasih telah menggunakan layanan kami!');
    }
}

