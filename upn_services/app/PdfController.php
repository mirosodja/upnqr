<?php
define('K_PATH_IMAGES', $_SERVER['DOCUMENT_ROOT'] . '/crud/img/');
class PdfController
{
    //============================================================+
    // File name   : PdfContriller.php
    // Begin       : 2018-04-04
    // Last Update : 2018-04-13
    //
    // Description : create PDF file for print UPN (univerzalni plačilni nalog)
    //
    // Author: Miro Sodja
    //
    // (c) Copyright:
    //               Miro Sodja
    //               Miroslav Sodja s.p.
    //
    //============================================================+

    /**
     * Creates an example PDF TEST document using TCPDF
     * @package UPN nalogi priprava
     * @abstract Izpis UPN nalogov v pdf datoteko
     * @author Miro Sodja
     * @since 2018-04-04
     *          */

    //! UPN PDFPRINT
    public function pdfUpnPrint()
    {
        header('Content-Type: application/pdf');
        $POST = json_decode(file_get_contents('php://input'), true);

        echo $this->createUpnPdf($POST, 'P', 'A4');

        //============================================================+
        //! END OF PDFPRINT
        //============================================================+
    }

    //! UPN PDF2ZIP
    public function pdfUpn2zip()
    {
        header('Content-Type: application/zip');
        $POST = json_decode(file_get_contents('php://input'), true);
        $fileNameRight = 'upn_' . date("YmdHis") . '.zip';
        array_map('unlink', glob($_SERVER['DOCUMENT_ROOT'] . '/crud/tmp/*.zip'));
        $filename = $_SERVER['DOCUMENT_ROOT'] . '/crud/tmp/' . $fileNameRight;
        // $filename =tempnam("tmp", "zip");
        $zip = new ZipArchive();

        if ($zip->open($filename, ZipArchive::CREATE) !== true) {
            exit("cannot open <$filename>\n");
        }

        foreach ($POST as $key => $value) {
            $stringifiedPdf = $this->createUpnPdf(array($value), 'L', 'A5');
            $rightPdfFileName = str_replace(array("š", "đ", "č", "ć", "ž", "Š", "Đ", "Č", "Ć", "Ž", ",", "/"), array("s", "d", "c", "c", "z", "S", "D", "C", "C", "Z", "", ""), preg_replace('/^\s+|\s+$|\s+/', '', $value['imePlacnik'])) . '.pdf';
            $pdfFileName = 'upn' . sprintf('%02d', $key) . '_' . $rightPdfFileName;
            $zip->addFromString($pdfFileName, $stringifiedPdf);
        }

        $zip->close();

        // Stream the file to the client
        // header("Content-Type: application/zip");
        // header("Content-Disposition: attachment; filename=\"$filename\"");
        // header("Content-Length: " . filesize($filename));
        // ob_end_clean();
        // flush();
        // readfile($filename);

        // echo json_encode(array('message' => $_SERVER['HTTP_REFERER'] . '/crud/tmp/' . $fileNameRight));
        $current_url = $this->f3->get('SCHEME') . "://" . $this->f3->get('HOST');
        $filename = $current_url . '/crud/tmp/' . $fileNameRight;
        echo json_encode(array('message' => $filename));
        // unlink($filename);
        // echo base64_encode($stringifiedPdf);

    }

    //! QR UPN PDFPRINT
    public function pdfUpnQrPrint()
    {
        header('Content-Type: application/pdf');
        $POST = json_decode(file_get_contents('php://input'), true);

        echo $this->createUpnQrPdf($POST, 'P', 'A4');


        //============================================================+
        //! END OF PDFPRINT
        //============================================================+
    }

    //! QR UPN PDF2ZIP
    public function pdfUpnQr2zip()
    {
        header('Content-Type: application/zip');
        $POST = json_decode(file_get_contents('php://input'), true);
        $fileNameRight = 'upn_' . date("YmdHis") . '.zip';
        array_map('unlink', glob($_SERVER['DOCUMENT_ROOT'] . '/crud/tmp/*.zip'));
        $filename = $_SERVER['DOCUMENT_ROOT'] . '/crud/tmp/' . $fileNameRight;
        // $filename =tempnam("tmp", "zip");
        // $filename = "php://memory";

        $zip = new ZipArchive();

        if ($zip->open($filename, ZipArchive::CREATE) !== true) {
            exit("cannot open <$filename>\n");
        }
        $pdfPageFormat = array(99, 210);

        foreach ($POST as $key => $value) {
            $stringifiedPdf = $this->createUpnQrPdf(array($value), 'L', $pdfPageFormat);
            $rightPdfFileName = str_replace(array("š", "đ", "č", "ć", "ž", "Š", "Đ", "Č", "Ć", "Ž", ",", "/"), array("s", "d", "c", "c", "z", "S", "D", "C", "C", "Z", "", ""), preg_replace('/^\s+|\s+$|\s+/', '', $value['imePlacnik'])) . '.pdf';
            $pdfFileName = 'upn' . sprintf('%02d', $key) . '_' . $rightPdfFileName;
            $zip->addFromString($pdfFileName, $stringifiedPdf);
        }

        $zip->close();
        // Stream the file to the client
        // header("Content-Type: application/zip");
        // header("Content-Disposition: attachment; filename=\"$filename\"");
        // header("Content-Length: " . filesize($filename));
        // ob_end_clean();
        // flush();
        // readfile($filename);
        // $current_url = $this->f3->get('SCHEME')."://".$this->f3->get('HOST');
        $current_url = 'https://www.potep.in';
        $filename = $current_url . '/crud/tmp/' . $fileNameRight;
        echo json_encode(array('message' => $filename));
        // unlink($filename);
        // echo base64_encode($stringifiedPdf);

    }
    //  ! create PDF stream to zip it JScript
    public function pdfUpnQr4stream2zip()
    {
        header('Content-Type: application/pdf');
        $pdfPageFormat = array(99, 210);
        $POST = json_decode(file_get_contents('php://input'), true);
        echo $this->createUpnQrPdf(array($POST), 'L', $pdfPageFormat);
    }
    //! create UPN PDF
    private function createUpnPdf($POST, $pdfPageOrientation = PDF_PAGE_ORIENTATION, $pdfPageFormat = PDF_PAGE_FORMAT)
    {
        // Include the main TCPDF library (search for installation path).
        setlocale(LC_ALL, 'sl_SI');
        require_once 'tcpdf/tcpdf.php';

        // create new PDF document
        $pdf = new TCPDF($pdfPageOrientation, PDF_UNIT, $pdfPageFormat, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator(PDF_CREATOR);
        $pdf->SetAuthor('Miro Sodja');
        $pdf->SetTitle('UPN izpis nalogov');
        $pdf->SetSubject('Izpis UPN nalogov');
        $pdf->SetKeywords('Izpis UPN nalogov');

        // remove header data
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);

        // set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $pdf->SetMargins(0, 0, 0);
        // PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);

        // set auto page breaks
        $pdf->SetAutoPageBreak(true, 0);

        // set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // set some language-dependent strings (optional)
        if (@file_exists(dirname(__FILE__) . '/lang/slv.php')) {
            require_once dirname(__FILE__) . '/lang/slv.php';
            $pdf->setLanguageArray($l);
        }

        // ---------------------------------------------------------

        // set cell padding
        $pdf->setCellPaddings(1, 0.1, 1, 0.1);

        // set cell margins
        $pdf->setCellMargins(0, 0, 0, 0);

        // set color for background
        $pdf->SetFillColor(255, 255, 175);

        // MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0)
        $XpomikPrinterja = 0;
        $YpomikPrinterja == 0;
        $YpresledekMedNalogi = 0;
        // Multicell
        // odmik od robu
        // talon
        $odmikPredInPo = 23.45;
        $widthTalonNormal = 53;
        $widthTalonLess = 40;
        $heightTalonNormal = 9;
        $heightTalonMore = 13;
        $heightTalonLess = 5.5;
        $xTalonNormal = 4 + $XpomikPrinterja;
        $xTalonMore = 17 + $XpomikPrinterja;
        // nalog
        $xNalogNormal = 64.5 + $XpomikPrinterja;
        $xNalogMore = 83 + $XpomikPrinterja;

        //! adds UPNs
        foreach ($POST as $key => $value) {
            // če je liho število
            if (($key + 1) & 1) {
                // add a page
                $pdf->AddPage();
                if ($pdfPageFormat == 'A5') {
                    // set bacground image
                    $img_file = K_PATH_IMAGES . 'upn.jpg';
                    $pdf->Image($img_file, 1.5, 23, 208.5, 105.1, '', '', '', false, 72, '', false, false, 0);
                }
                $currentY = $pdf->GetY() + $YpomikPrinterja + $odmikPredInPo;
            } else {
                $currentY = $pdf->GetY() + $YpomikPrinterja + $YpresledekMedNalogi + $odmikPredInPo * 3;
            }
            // remove spaces in $value
            foreach ($value as $keyOFvalue => $valueOFvalue) {
                $value[$keyOFvalue] = preg_replace('/^\s+|\s+$|\s{2,}/', '', $valueOFvalue);
            }
            // talon
            $value['znesek'] = '***' . number_format($value['znesek'], 2, ',', '.');
            // set font
            $pdf->SetFont('couriernew', '', 8);
            $pdf->MultiCell($widthTalonNormal, $heightTalonNormal, $value['imePlacnik'], 0, 'L', 0, 0, $xTalonNormal, $currentY + 9, true);
            $pdf->MultiCell($widthTalonNormal, $heightTalonNormal, $value['namen_rok_placila'], 0, 'L', 0, 0, $xTalonNormal, $currentY + 21, true);
            $pdf->MultiCell($widthTalonLess, $heightTalonLess, $value['znesek'], 0, 'L', 0, 0, $xTalonMore, $currentY + 33.5, true);
            $pdf->MultiCell($widthTalonNormal, $heightTalonMore, $value['prejemnik_IBAN'], 0, 'L', 0, 0, $xTalonNormal, $currentY + 42, true);
            $pdf->MultiCell($widthTalonNormal, $heightTalonLess, $value['prejemnik_referenca'], 0, 'L', 0, 0, $xTalonNormal, $currentY + 59, true);
            $pdf->MultiCell($widthTalonNormal, $heightTalonNormal, $value['imePrejemnik'], 0, 'L', 0, 0, $xTalonNormal, $currentY + 68, true);

            //nalog
            // set font
            $pdf->SetFont('couriernew', '', 10);
            $pdf->MultiCell(99, $heightTalonNormal, $value['imePlacnik'], 0, 'L', 0, 0, $xNalogNormal, $currentY + 21, true);
            $pdf->MultiCell(14, $heightTalonLess, $value['koda_namena'], 0, 'L', 0, 0, $xNalogNormal, $currentY + 33.5, true);
            $pdf->MultiCell(112, $heightTalonLess, $value['namen_rok_placila'], 0, 'L', 0, 0, $xNalogMore, $currentY + 33.5, true);
            $pdf->MultiCell(41, $heightTalonLess, $value['znesek'], 0, 'L', 0, 0, $xNalogMore - 7.5, $currentY + 42, true);
            $pdf->MultiCell(41, $heightTalonLess, $value['prejemnik_BIC'], 0, 'L', 0, 0, $xNalogNormal + 90, $currentY + 42, true);
            $pdf->MultiCell(127, $heightTalonLess, $value['prejemnik_IBAN'], 0, 'L', 0, 0, $xNalogNormal, $currentY + 50, true);
            $pdf->MultiCell(92, $heightTalonLess, $value['prejemnik_referenca'], 0, 'L', 0, 0, $xNalogNormal + 5.5, $currentY + 59, true);
            $pdf->MultiCell(131, $heightTalonNormal, $value['imePrejemnik'], 0, 'L', 0, 0, $xNalogNormal, $currentY + 68, true);
        }

        //Close and output PDF document
        $fileName = 'upn_' . date("Ymd") . '.pdf';
        if ($pdfPageFormat == 'A4') {
            $pdf_output = ($pdf->Output($fileName, 'S'));
            //! base64_encode <- angularJS
        } elseif ($pdfPageFormat == 'A5') {
            $pdf_output = $pdf->Output($fileName, 'S');
        }

        return $pdf_output;
    }

    //! create QR UPN PDF
    private function createUpnQrPdf($POST, $pdfPageOrientation = PDF_PAGE_ORIENTATION, $pdfPageFormat = PDF_PAGE_FORMAT)
    {
        // Include the main TCPDF library (search for installation path).
        setlocale(LC_ALL, 'sl_SI');
        // define('K_PATH_IMAGES', $_SERVER['DOCUMENT_ROOT'] . '/crud/img/');
        require_once 'tcpdf/tcpdf.php';

        // create new PDF document
        $pdf = new TCPDF($pdfPageOrientation, PDF_UNIT, $pdfPageFormat, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator(PDF_CREATOR);
        $pdf->SetAuthor('Miro Sodja');
        $pdf->SetTitle('UPN izpis nalogov');
        $pdf->SetSubject('Izpis UPN nalogov');
        $pdf->SetKeywords('Izpis UPN nalogov');

        // remove header data
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);

        // set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $pdf->SetMargins(0, 0, 0);
        // PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);

        // set auto page breaks
        $pdf->SetAutoPageBreak(true, 0);

        // set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // set some language-dependent strings (optional)
        if (@file_exists(dirname(__FILE__) . '/lang/slv.php')) {
            require_once dirname(__FILE__) . '/lang/slv.php';
            $pdf->setLanguageArray($l);
        }

        // ---------------------------------------------------------

        // set cell padding
        $pdf->setCellPaddings(1, 1, 1, 0.1);

        // set cell margins
        $pdf->setCellMargins(0, 0, 0, 0);

        // set color for background
        $pdf->SetFillColor(255, 255, 175);

        // set style for barcode
        $style = array(
            'border' => 0,
            'vpadding' => 'auto',
            'hpadding' => 'auto',
            'fgcolor' => array(0, 0, 0),
            'bgcolor' => false, //array(255,255,255)
            'module_width' => 77, // width of a single module in points
            'module_height' => 77, // height of a single module in points
        );

        // MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0)
        // $XpomikPrinterja koliko premaknem od robu po X v mm, originalno sem imel 0 tako za A4 format kot za zip
        if ($pdfPageFormat == 'A4') {
            $XpomikPrinterja = 1;
        } else {
            $XpomikPrinterja = 0;
        }
        $YpomikPrinterja == 0;
        $YpresledekMedNalogi = 24.6;
        // Multicell
        // odmik od robu
        // po Y
        $odmikPredInPo = 0;
        $widthTalonNormal = 52.5; // šriina okenca normal
        $widthTalonLess = 40;
        $heightTalonNormal = 9; // višina okenca
        $heightTalonMore = 13.5;
        $heightTalonLess = 5;
        $xTalonNormal = 4 + $XpomikPrinterja;
        $xTalonMore = 16.5 + $XpomikPrinterja;
        // nalog
        $heightNalogMore = 15;
        $xNalogNormal = 63.5 + $XpomikPrinterja;
        $xNalogMore = 106.5 + $XpomikPrinterja;

        //! adds UPNs
        foreach ($POST as $key => $value) {
            // če je ostanek po deljenju 1
            if (((($key + 1)) % 3) == 1) {
                // add a page
                $pdf->AddPage();
                if ($pdfPageFormat != 'A4') {
                    // set bacground image
                    $img_file = K_PATH_IMAGES . 'upnqr.jpg';
                    $pdf->Image($img_file, 0, 0, 210, 99, '', '', '', false, 72, '', false, false, 0);
                }
                $currentY = $pdf->GetY() + $YpomikPrinterja + $odmikPredInPo;
            } elseif (((($key + 1)) % 3) == 2) {
                $currentY = $pdf->GetY() + $YpomikPrinterja + $YpresledekMedNalogi + $odmikPredInPo * 3;
            } else {
                $currentY = $pdf->GetY() + $YpomikPrinterja + $YpresledekMedNalogi + $odmikPredInPo * 5;
            }
            // remove spaces in $value
            foreach ($value as $keyOFvalue => $valueOFvalue) {
                $value[$keyOFvalue] = preg_replace('/^\s+|\s+$|\s{2,}/', '', $valueOFvalue);
            }
            // talon
            $value['imePlacnik'] = $this->prepare1vrstico2vrstice3($value['imePlacnik']);
            $value['imePrejemnik'] = $this->prepare1vrstico2vrstice3($value['imePrejemnik']);
            $value['znesek'] = '***' . ltrim(rtrim(number_format($value['znesek'], 2, ',', '.')));
            $qrCodeString = $this->prepareString4Qrcode($value);

            // set font
            $pdf->SetFont('couriernew', '', 8);
            $pdf->MultiCell($widthTalonNormal, $heightTalonMore, $value['imePlacnik'], 0, 'L', 0, 0, $xTalonNormal, $currentY + 6, true);
            $pdf->MultiCell($widthTalonNormal, $heightTalonNormal, $value['namen_rok_placila'], 0, 'L', 0, 0, $xTalonNormal, $currentY + 22.5, true);
            $pdf->MultiCell($widthTalonLess, $heightTalonLess, $value['znesek'], 0, 'L', 0, 0, $xTalonMore, $currentY + 34.5, true);
            $pdf->MultiCell($widthTalonNormal, $heightTalonMore, $value['prejemnik_IBAN'] . "\n" . $value['prejemnik_referenca'], 0, 'L', 0, 0, $xTalonNormal, $currentY + 42.5, true);
            $pdf->MultiCell($widthTalonNormal, $heightTalonMore, $value['imePrejemnik'], 0, 'L', 0, 0, $xTalonNormal, $currentY + 59, true);

            //nalog
            // set font
            $pdf->SetFont('couriernew', '', 10);
            $pdf->write2DBarcode($qrCodeString, 'QRCODE,M', $xNalogNormal, $currentY + 6, 40, 39.5, $style, 'N');
            $pdf->MultiCell(99, $heightNalogMore, $value['imePlacnik'], 0, 'L', 0, 0, $xNalogMore, $currentY + 22, true);
            $pdf->MultiCell(41, $heightTalonLess, $value['znesek'], 0, 'L', 0, 0, $xNalogMore + 8.5, $currentY + 40.5, true);
            $pdf->MultiCell(14, $heightTalonLess, $value['koda_namena'], 0, 'L', 0, 0, $xNalogNormal, $currentY + 49, true);
            $pdf->MultiCell(112, $heightTalonLess, $value['namen_rok_placila'], 0, 'L', 0, 0, $xNalogNormal + 17, $currentY + 49, true);
            $pdf->MultiCell(127, $heightTalonLess, $value['prejemnik_IBAN'], 0, 'L', 0, 0, $xNalogNormal, $currentY + 58, true);
            $pdf->MultiCell(92, $heightTalonLess, $value['prejemnik_referenca'], 0, 'L', 0, 0, $xNalogNormal + 4.5, $currentY + 66, true);
            $pdf->MultiCell(131, $heightNalogMore, $value['imePrejemnik'], 0, 'L', 0, 0, $xNalogNormal, $currentY + 74, true);
        }

        //Close and output PDF document
        $fileName = 'upn_' . date("Ymd") . '.pdf';
        if ($pdfPageFormat == 'A4') {
            $pdf_output = ($pdf->Output($fileName, 'S'));
            //! base64_encode<-angularJS
        } else {
            $pdf_output = $pdf->Output($fileName, 'S');
        }

        return $pdf_output;
    }

    // vrne enovrstično v treh vrsticah
    private function prepare1vrstico2vrstice3($string)
    {
        $string = explode(",", $string);
        foreach ($string as $key => $value) {
            $string[$key] = preg_replace('/^\s+|\s+$|\s{2,}/', '', $value);
        }
        return implode("\n", $string);
    }

    private function prepareString4Qrcode($data)
    {
        $arrKeys = array("konstanta", "placnik_IBAN", "polog", "dvig", "placnik_referenca", "imePlacnik", "znesek", "datum_placila", "nujno", "koda_namena", "namen_rok_placila", "rok_placila", "prejemnik_IBAN", "prejemnik_referenca", "imePrejemnik");

        foreach ($arrKeys as $key => $value) {
            $data4Qrcode[$value] = '';
        }

        foreach ($data as $key => $value) {
            if (key_exists($key, $data4Qrcode)) {
                $data4Qrcode[$key] = $value;
            }
        }

        $data4Qrcode["konstanta"] = "UPNQR";
        $data4Qrcode["znesek"] = sprintf('%011d', ltrim(str_replace(",", "", $data4Qrcode["znesek"]), '*'));
        $data4Qrcode["prejemnik_IBAN"] = preg_replace('/^\s+|\s+$|\s+/', '', $data4Qrcode["prejemnik_IBAN"]);
        $data4Qrcode["prejemnik_referenca"] = preg_replace('/^\s+|\s+$|\s+/', '', $data4Qrcode["prejemnik_referenca"]);
        $string = implode(chr(10), $data4Qrcode) . chr(10);
        // adding kontrol sum
        $string .= sprintf('%03d', strlen($string)) . chr(10) . " ";
        return $string;
    }
}
