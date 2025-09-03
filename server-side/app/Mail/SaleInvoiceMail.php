<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SaleInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $order;
    public $invoice;

    public function __construct($order, $invoice)
    {
        $this->order = $order;
        $this->invoice = $invoice;
    }

    public function build()
    {
        return $this->subject('Invoice for Order #' . $this->order->id)
            ->view('mail.sale_invoice') // create a Blade template for body
            ->attachData($this->invoice, 'invoice.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
