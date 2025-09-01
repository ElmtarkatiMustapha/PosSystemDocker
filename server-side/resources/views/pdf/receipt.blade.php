<!DOCTYPE html>
<html>
<head>
    <title>Invoice</title>
    <style>
        /* Header */
        .header {
            position: fixed;
            top: -120px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            /* border-bottom: 1px solid #000; */
            padding: 10px; 
        }

        /* Footer */
        .footer {
            position: fixed;
            bottom: -100px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            border-top: 1px solid #000;
            padding: 10px; 
        }

        /* Content */
        /* .content {
            margin-top: 100px; 
            margin-bottom: 100px; 
        } */

        /* Page break */
        .page-break {
            page-break-after: always;
        }
        @page { 
            margin-top: 150px; 
            margin-bottom: 100px;
        }

        
        body {
            font-family: Arial, sans-serif;
        }
        .invoice-header {
            text-align: center;
            margin-bottom: 20px;
            padding: 5px 0px;
        }
        .invoice-header h1 {
            margin: 0px!important;
            padding: 0px !important;
            font-size: 24px;
        }
        .invoice-header p {
            margin: 0px!important;
            padding: 0px !important;
        }
        .invoice-details {
            margin-bottom: 10px;
            display: block;
            position: relative;
            align-items: baseline;
        }
        .invoice-details p {
            margin: 3px 0!important;
            padding: 0px!important;
            text-align: end;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .invoice-table th, .invoice-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        .invoice-table th {
            background-color: #f2f2f2;
        }
        .invoice-total {
            text-align: right;
            font-size: 14px;
            font-weight: bold;
        }
        .d-inline-block{
            display: inline-block !important;
        }
        .logo .img{
            width: 100px;
            text-align: start;
        }
        .float-end{
            float: right!important;
        }
        .float-start{
            float: left!important;
        }
        .position-relative{
            position: relative!important;
        }
        .row {
            width: 100%;
            display: table; /* Use table layout for compatibility */
            table-layout: fixed; /* Ensure equal column widths */
            margin-bottom: 15px; /* Add spacing between rows */
        }

        /* Custom Column */
        .col-6 {
            display: table-cell; /* Use table-cell for compatibility */
            width: 50%; /* Each column takes 50% width */
            padding: 0 15px; /* Add padding for spacing */
            box-sizing: border-box; /* Include padding in width calculation */
            vertical-align: top; /* Align content to the top */
        }
        .text-end{
            text-align: right;
        }
        .align-self-end{
            align-self: flex-end;
        }
        th, td{
            font-size: 12px;
        }
        .total-to-pay{
            font-size: 20px;
            font-weight: bolder;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="invoice-header">
            <div class="logo d-inline-block float-start">
                <img src="{{ $logo }}" class="img"/>
            </div>
            <div class="companyInfos d-inline-block float-end">
                <h1>{{ $companyName }}</h1>
                <p>{{ $companyAddress }}</p>
                <p>Tel: {{ $companyPhone }}</p>
                <p>ICE: {{ $companyIce }}</p>
            </div>
        </div>
    </div>

    
    
    <div class="content">
        <div class="invoice-details row">
            <div class="customerInfos col-6 ">
                <p><strong>Customer:</strong> {{ $order->customer->name }}</p>
                <p><strong>Customer ICE:</strong> {{ $order->customer->ice }}</p>
                <p><strong>Customer Phone:</strong> {{ $order->customer->phone }}</p>
                <p><strong>Customer Adresse:</strong> {{ $order->customer->adresse }}</p>
            </div>
            <div class="orderInfos col-6 text-end  ">
                <p><strong>Invoice Number:</strong> {{ $order->id }}</p>
                <p><strong>Order type:</strong> {{ $order->type }}</p>
                <p><strong>Date:</strong> {{ $order->created_at }}</p>
            </div>
        </div>

        <table class="invoice-table position-relative">
            <thead>
                <tr>
                    <th>Barcode</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Discount (%)</th>
                    <th>Total HT</th>
                    <th>Tax (%)</th>
                    <th>Total TTC</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->details_order as $item)
                    <tr>
                        <td>{{ $item->product->barcode }}</td>
                        <td>{{ $item->product->name }}</td>
                        <td>{{ $item->qnt }}</td>
                        <td>{{ number_format($item->price, 2) }}</td>
                        <td>{{ $item->discount }}</td>
                        <td>{{ number_format($item->price*$item->qnt - $item->price*$item->qnt*$item->discount/100, 2) }}</td>
                        <td>{{ $order->tax }}</td>
                        <td>{{ number_format(($item->price*$item->qnt - $item->price*$item->qnt*$item->discount/100)+($item->price*$item->qnt*$order->tax/100), 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="invoice-total">
            <p><strong>TOTAL H.Discount:</strong> {{ number_format($totalHD, 2) }} {{$currency}}</p>
            <p><strong>TOTAL Discount:</strong> {{ number_format($totalDiscount, 2) }} {{$currency}}</p>
            <p><strong>Total HT:</strong> {{ number_format($totalHT, 2) }} {{$currency}}</p>
            <p><strong>Total TAX:</strong> {{ number_format($totalTAX, 2) }} {{$currency}}</p>
            <p class="total-to-pay"><strong>Total TTC:</strong> {{ number_format($totalTTC, 2) }} {{$currency}}</p>
        </div>
    </div>
    <!-- Footer -->
    <div class="footer">
        <div class="invoice-footer">
            <p>{{ $companyEmail }}</p>
            <p>{{ $companyAddress }}</p>
        </div>
    </div>
    
</body>
</html>