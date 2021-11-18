<?php
class CsvController
{

    public function csv2json()
    {
        $POST = file_get_contents('php://input');
        $POST = $this->convert_to($POST, "UTF-8");
        $lines = explode("\n", $POST);
        $findTabulator = strpos($lines[0], "\t");
        $lines = null;
        if ($findTabulator === false) {
            // NOT excel
            $csvArray = $this->csvstring_to_array($POST);
            array_shift($csvArray);
            $csvArray = $this->combineWithKeys($csvArray);
        } else {
            // excel
            $csvArray = $this->csvstring_to_array($POST, '\t');
            array_shift($csvArray);
            $csvArray = $this->combineWithKeys($csvArray);
        }
        echo json_encode($csvArray);
    }

    private function csvstring_to_array($string, $separatorChar = ',', $enclosureChar = '"', $newlineChar = "\n")
    {
        // @author: Klemen Nagode
        $array = array();
        $size = strlen($string);
        $columnIndex = 0;
        $rowIndex = 0;
        $fieldValue = "";
        $isEnclosured = false;
        for ($i = 0; $i < $size; $i++) {

            $char = $string{
                $i};
            $addChar = "";

            if ($isEnclosured) {
                if ($char == $enclosureChar) {

                    if ($i + 1 < $size && $string{
                        $i + 1} == $enclosureChar) {
                        // escaped char
                        $addChar = $char;
                        $i++; // dont check next char
                    } else {
                        $isEnclosured = false;
                    }
                } else {
                    $addChar = $char;
                }
            } else {
                if ($char == $enclosureChar) {
                    $isEnclosured = true;
                } else {

                    if ($char == $separatorChar) {

                        $array[$rowIndex][$columnIndex] = $fieldValue;
                        $fieldValue = "";

                        $columnIndex++;
                    } elseif ($char == $newlineChar) {
                        echo $char;
                        $array[$rowIndex][$columnIndex] = $fieldValue;
                        $fieldValue = "";
                        $columnIndex = 0;
                        $rowIndex++;
                    } else {
                        $addChar = $char;
                    }
                }
            }
            if ($addChar != "") {
                $fieldValue .= $addChar;
            }
        }

        if ($fieldValue) { // save last field
            $array[$rowIndex][$columnIndex] = $fieldValue;
        }
        return $array;
    }

    private function convert_to($source, $target_encoding)
    {
        // detect the character encoding of the incoming file
        $encoding = mb_detect_encoding($source, "auto");

        // escape all of the question marks so we can remove artifacts from
        // the unicode conversion process
        $target = str_replace("?", "[question_mark]", $source);

        // convert the string to the target encoding
        $target = mb_convert_encoding($target, $target_encoding, $encoding);

        // remove any question marks that have been introduced because of illegal characters
        $target = str_replace("?", "", $target);

        // replace the token string "[question_mark]" with the symbol "?"
        $target = str_replace("[question_mark]", "?", $target);

        return $target;
    }

    private function combineWithKeys($arrValue)
    {
        $arrKey = array(
            'imePlacnik',
            'placnik_skupina',
            'znesek',
            'koda_namena',
            'namen_rok_placila',
            'prejemnik_BIC',
            'prejemnik_IBAN',
            'prejemnik_referenca',
            'imePrejemnik'
        );
        foreach ($arrValue as $key => $value) {
            $arrCombined[$key] = array_combine($arrKey, $arrValue[$key]);
        }
        return $arrCombined;
    }
}
