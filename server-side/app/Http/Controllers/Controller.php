<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Storage;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    public function fixedText($text, $length = 18) {
        // If too long, cut to length-3 and add "..."
        if (strlen($text) > $length) {
            return substr($text, 0, $length - 3) . '...';
        }

        // If shorter, pad with spaces
        return str_pad($text, $length, ' ');
    }
    /**
     * upload picture for the first time
     * @param picture
     * @return pictureName
     */
    public function upload_picture($picture)
    {
        $pictureName = time() . '.' . $picture->extension();
        $picture->storeAs("images", $pictureName);
        return $pictureName;
    }
    /**
     * update picture 
     * @param picture
     * @param object Model
     * @return pictureName
     */
    public function update_picture($picture,Model $model){
        Storage::delete("images/" . $model->picture);
        $pictureName = time() . '.' . $picture->extension();
        $picture->storeAs("images", $pictureName);
        return $pictureName;
    }
    /**
     * delete image
     */
    public function delete_picture(Model $model)
    {
        Storage::delete("images/" . $model->picture);
    }
    /**
     * get the days of week
     */
    public function daysOfWeek()
    {
        $daysOfweek = [];
        for ($i = 0; $i < 7; $i++) {
            $daysOfweek[] = date("Y-m-d", strtotime(Carbon::now()->weekday($i)));
        }
        return $daysOfweek;
    }
    /**
     * get tge days of month
     */
    public function daysOfMonth()
    {
        $startMonth = Carbon::now()->startOfMonth();
        $endMonth = Carbon::now()->endOfMonth();
        $days = [];
        while ($startMonth->lte($endMonth)) {
            $days[] = date("Y-m-d", strtotime($startMonth));
            $startMonth = $startMonth->addDay();
        }
        return $days;
    }
    /**
     * get days of range
     */
    public function daysOfRange($start, $end)
    {
        $startDate = Carbon::createFromFormat("Y-m-d", $start);
        $endDate = Carbon::createFromFormat("Y-m-d", $end);
        $days = [];
        while ($startDate->lte($endDate)) {
            $days[] = date("Y-m-d", strtotime($startDate));
            $startDate = $startDate->addDay();
        }
        return $days;
    }
    /**
     * prepare data to return
     * prepare Sales
     */
    public function prepareSales($sales, $dates, $prefix)
    {
        $dataX = [];
        $dataY = [];

        foreach ($dates as $day) {
            $dateToshow = "";
            switch ($prefix) {
                case "hour":
                    $dateToshow = $day . "h";
                    break;
                case "month":
                    $dateToshow = "m" . $day;
                    break;
                default:
                    $timestemp = strtotime($day);
                    $dateToshow = date("d/m", $timestemp);
            }
            if (count($sales) > 0) {
                $orders = 0;
                foreach ($sales as $sale) {
                    if ($sale->date == $day) {
                        $orders = $sale->order_count;
                        break;
                    }
                }
                $dataX[] = $dateToshow;
                $dataY[] = $orders;
            } else {
                $dataX[] = $dateToshow;
                $dataY[] = 0;
            }
        }
        return collect(["dataX" => $dataX, "dataY" => $dataY]);
    }
    /**
     * prepare turnovers
     */
    public function prepareTurnover($sales, $dates, $prefix)
    {
        $dataX = [];
        $dataY = [];
        foreach ($dates as $day) {
            $dateToshow = "";
            switch ($prefix) {
                case "hour":
                    $dateToshow = $day . "h";
                    break;
                case "month":
                    $dateToshow = "m" . $day;
                    break;
                default:
                    $timestemp = strtotime($day);
                    $dateToshow = date("d/m", $timestemp);
            }
            if (count($sales) > 0) {
                $orders = 0;
                foreach ($sales as $sale) {
                    if ($sale->date == $day) {
                        $orders = $sale->turnover;
                        break;
                    }
                }
                $dataX[] = $dateToshow;
                $dataY[] = $orders;
            } else {
                $dataX[] = $dateToshow;
                $dataY[] = 0;
            }
        }
        return collect(["dataX" => $dataX, "dataY" => $dataY]);
    }
    public function filterData($validateFields, $col)
    {
        $filter = [];
        $days = [];
        $prefix = "";
        $filterType = "";
        $filterTitle = "Current Week";
        switch ($validateFields['filter']) {
            case "today":
                $filter = [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()];
                $filterType = "HOUR($col) as date";
                $days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                $prefix = "hour";
                $filterTitle = "Today";
                break;
            case "yesterday":
                $filter = [Carbon::yesterday()->startOfDay(), Carbon::yesterday()->endOfDay()];
                $filterType = "HOUR($col) as date";
                $days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                $prefix = "hour";
                $filterTitle = "Yesterday";
                break;
            case "month":
                //code
                $filter = [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()];
                $filterType = "DATE($col) as date";
                $days = $this->daysOfMonth();
                $prefix = "day";
                $filterTitle = "Current Month";
                break;
            case "year":
                //code
                $filter = [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()];
                $filterType = "MONTH($col) as date";
                $days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                $prefix = "month";
                $filterTitle = "Current Year";
                break;
            case "range":
                //get date 
                $timeStart = strtotime($validateFields["startDate"]);
                $timeEnd = strtotime($validateFields["endDate"]);
                $filter = [date("Y-m-d", $timeStart), date("Y-m-d", $timeEnd + 86400)];
                $filterType = "DATE($col) as date";
                $days = $this->daysOfRange($validateFields["startDate"], $validateFields["endDate"]);
                $prefix = "day";
                $filterTitle = "from " . date("Y-m-d", $timeStart) . "to" . date("Y-m-d", $timeEnd);
                break;
            default:
                $filter = [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()];
                $filterType = "DATE($col) as date";
                $days = $this->daysOfWeek();
                $prefix = "day";
                $filterTitle = "Current Week";
        }
        return
            [
                "filter" => $filter,
                "days" => $days,
                "prefix" => $prefix,
                "filterTitle" => $filterTitle,
                "filterType" => $filterType
            ];
    }
    
}
