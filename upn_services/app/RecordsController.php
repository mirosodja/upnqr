<?php
class RecordsController extends DbController
{
    // za SELECT
    private $tableView = 'upnViewPregled';
    // za PUT, POST, DELETE
    private $table = 'upn';

    //  to mak copyfrom and sanitaze
    // SHOW FIELDS FROM $table WHERE `Field`!='id' AND `Field`!='created_date';

    public function recordsAll()
    {
        header('Content-Type: application/json');
        $records = $this->db->exec("SELECT * FROM `$this->tableView` ORDER BY `id`;");
        echo json_encode($records, 32);
    }

    public function recordOne()
    {
        header('Content-Type: application/json');
        $records = $this->db->exec("SELECT * FROM `$this->tableView` WHERE `id`=" . $this->f3->get('PARAMS.id') . ";");
        echo json_encode($records, 32);
    }

    public function recordUpdate()
    // foreach ($POST as $key => $value)
    {
        header('Content-Type: application/json');
        $records = new DB\SQL\Mapper($this->db, $this->table);
        $POST = json_decode(file_get_contents('php://input'), true);
        $POST = $this->prepareData4mysql($POST);
        $id = $this->f3->get('PARAMS.id');
        $id = $POST["id"];
        $records->load(array('id = ?', $id));
        $records->copyfrom($POST);
        $records->save();
        echo json_encode(array('httperror' => 200, 'message' => 'Successfully updated record!'));
    }

    public function insertRecord()
    {
        header('Content-Type: application/json');
        $records = new DB\SQL\Mapper($this->db, $this->table);
        $POST = json_decode(file_get_contents('php://input'), true);
        $POST = $this->prepareData4mysql($POST);
        $records->copyfrom($POST);
        $records->insert();
        $id = $records->id;
        echo json_encode(array('id' => $id, 'httperror' => 200, 'message' => 'Successfully insert record!'));
    }

    public function deleteRecord()
    {
        header('Content-Type: application/json');
        $records = $this->db->exec("SELECT count(*) AS `numOfRecords` FROM `$this->tableView` WHERE `id`=" . $this->f3->get('PARAMS.id') . ";");
        if ($records[0]['numOfRecords'] > 0) {
            $records = $this->db->exec("DELETE FROM `$this->table` WHERE `id`=" . $this->f3->get('PARAMS.id') . ";");
            echo json_encode(array('httperror' => 200, 'message' => 'Successfully deleted record!'));
        } else {
            echo json_encode(array('httperror' => 404, 'message' => 'Records not found!'));
        }
    }

    // prepare data
    // call=> $this->prepareData4mysql($date)
    public function prepareData4mysql($data)
    {

        $arrKeysPlacnik = array("placnik_ime", "placnik_ulica_hs_st", "placnik_PS_kraj");
        $arrKeysPrejemnik = array("prejemnik_ime", "prejemnik_ulica_hs_st", "prejemnik__PS_kraj");
        $arrNull = array(null, null, null);

        if (array_key_exists("imePlacnik", $data)) {
            //! tukaj je potrebno narediti preverjanje za slučaj, če kakšen podatek manjka (recimo ni naslova)
            if ($data["imePlacnik"]) {
                $arrImePlacnik = explode(",", $data["imePlacnik"]);
                $arrImePlacnik = array_combine($arrKeysPlacnik, $arrImePlacnik);
            } elseif ($data["imePlacnik"] === null) {
                $arrImePlacnik = array_combine($arrKeysPlacnik, $arrNull);
            }
            unset($data["imePlacnik"]);
            foreach ($arrImePlacnik as $key => $value) {
                $data[$key] = $value;
            }
        }
        if (array_key_exists("imePrejemnik", $data)) {
            if ($data["imePrejemnik"]) {
                $arrImePrejemnik = explode(",", $data["imePrejemnik"]);
                $arrImePrejemnik = array_combine($arrKeysPrejemnik, $arrImePrejemnik);
            } elseif ($data["imePrejemnik"] == false || $data["imePrejemnik"] == null) {
                $arrImePrejemnik = array_combine($arrKeysPrejemnik, $arrNull);
            }
            unset($data["imePrejemnik"]);
            foreach ($arrImePrejemnik as $key => $value) {
                $data[$key] = $value;
            }
        }
        if (array_key_exists("znesek", $data)) {
            //! odkomentiraj, če hočeš nadomestiti US formating z SL formating
            // $data["znesek"] = str_replace(',', '.', str_replace('.', '', $data['znesek']));
        }
        $data = array_map('trim', $data);
        return ($data);
    }
}
