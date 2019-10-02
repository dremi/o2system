<?php
/**
 * Created by O2System Framework File Generator.
 * DateTime: 26/09/2019 08:09
 */

// ------------------------------------------------------------------------

namespace App\Controllers;

// ------------------------------------------------------------------------

use O2System\Framework\Http\Controller;
use O2System\Session;

/**
 * Class Employees
 *
 * @package \App\Controllers
 */
class Employees extends Controller
{
    /**
     * Employees::index
     */
    public function index()
    {
        $session = $this->session->get('user-login');
        
        if ($session) {  
            presenter()->page->setHeader( 'Employee Page' );
            $this->load->view('employees', [
                'data' => [
                    'employeesTable' => $this->model->allWithPaging(), 
                    'sessionUser' => $session
                ] 
            ]);
        } else {        
            presenter()->page->setHeader( 'Login Page' );
            $this->load->view('login');
        }
    }
    public function getjson()
    {
        try {
            output()->setContentType('application/json');
            $data = $this->model->all();
            if (!empty($data)) {
                $columData = [];
                $columns = [
                        // datatable column index  => database column name
                        0 => 'number',
                        1 => 'Employees.name',
                        2 => 'Employees.mobile',
                        3 => 'Employees.address',
                        4 => 'option'
                    ];

                $i = 0;
                $outputTime = '-';
                foreach ($data as $row) {
                    $i++;
                    $editIcon = '<button data-label="Edit #'.$i.'" data-toggle="modal" data-target=".bs-example-modal-form" data-url="'. base_url().'/employees/edit?id='.$row['id'] .'" type="button" class="cell-modal-button btn btn-outline btn-info">Edit</button>';
                    $deleteIcon = ' <button data-i="'.$i.'" data-id="'.$row['id'].'" data-label="Delete #'.$i.'"  data-title="Delete #'.$i.'" data-toggle="modal" data-target="#modal-confirm" data-url="'. base_url().'/employees/delete?id='.$row['id'] .'" type="button" class="cell-confirm-button btn btn-outline btn-danger">Delete</button>';
                    
                    $columData[]   = [
                        $i,
                        $row['name'],
                        $row['mobile'],
                        $row['address'],
                        $editIcon .
                        $deleteIcon
                    ];
                }
                $totalFiltered = count($data);
                $getData = $_REQUEST;
                if (!empty($getData['draw'])) {
                    $results = [
                        'draw'            => intval( $getData['draw'] ), // for every request/draw by clientside , they send a number as a parameter, when they recieve a response/data they first check the draw number, so we are sending same number in draw.
                        'recordsTotal'    => intval( $totalData ), // total number of records
                        'recordsFiltered' => intval( $totalData ), // total number of records after searching, if there is no searching then totalFiltered = totalData
                        'data'            => $columData // total data array
                    ];
                }
                output()->sendPayload($results);
            } else {
                output()->sendError(204, "Data not found.");
            }
        } catch (Exception $ex) {
            output()->sendError(204, $ex->getMessage());
        }
    }
    
    public function logout() 
    {
        $this->session->offsetUnset('user-login');
        header("Location: /admin");
    }
    
    public function add() 
    {
        $session = $this->session->get('user-login');
        
        if ($session) {  
            presenter()->page->setHeader( 'Add Form' );
            $this->load->view('employee-add');
        } else {        
            presenter()->page->setHeader( 'Login Page' );
            $this->load->view('login');
        }
    }
    
    public function edit() 
    {
        $session = $this->session->get('user-login');
        
        if ($session) {  
            presenter()->page->setHeader( 'Edit Form' );
            $this->load->view('employee-edit', [
                'data' => $this->model->findWhere([
                        'id' => $_REQUEST['id']
                    ], 1)
            ]);
        } else {        
            presenter()->page->setHeader( 'Login Page' );
            $this->load->view('login');
        }
    }
    
    public function save() 
    {
        output()->setContentType('application/json');
        $post = input()->post();
        if (!empty($post)) {
            // $result = $this->model->update($post);
            $link = mysqli_connect("localhost", "root", "", "circle_creative");
            $query = "INSERT INTO employees(name, mobile, address, created) VALUES('".$post['name']."', '".$post['mobile']."', '".$post['address']."', '".date('Y-m-d H:i:s')."')";
            $result = mysqli_query($link, $query);
            output()->sendPayload([
                'code' => 201,
                'message' => 'Data has been saved successfully',
                'data' => $result,
            ]);
        } else {
            output()->sendError(204, "Failed. Please double-check and try again.");
        }
    }
    
    public function update() 
    {
        output()->setContentType('application/json');
        $post = input()->post();
        $data = $this->model->findWhere([
            'id' => $post['id']
        ], 1);
        
        if ($data) {
            // $result = $this->model->update($post);
            $link = mysqli_connect("localhost", "root", "", "circle_creative");
            $query = "UPDATE employees SET name='".$post['name']."', mobile = '".$post['mobile']."', address = '".$post['address']."', modified = '".date('Y-m-d H:i:s')."' WHERE id = '".$post['id']."'";
            $result = mysqli_query($link, $query);
            output()->sendPayload([
                'code' => 201,
                'message' => 'Data has been saved successfully',
                'data' => $result,
            ]);
        } else {
            output()->sendError(204, "Failed. Please double-check and try again.");
        }
    }
    
    public function delete() 
    {
        output()->setContentType('application/json');
        $data = $this->model->findWhere([
            'id' => $_REQUEST['id']
        ], 1);
        
        if ($data) {
            // $result = $this->model->delete($data);
            $link = mysqli_connect("localhost", "root", "", "circle_creative");
            $query = "DELETE FROM employees WHERE id = '".$_REQUEST['id']."'";
            $result = mysqli_query($link, $query);
            output()->sendPayload([
                'code' => 201,
                'message' => 'Data has been delete successfully',
                'data' => $result,
            ]);
        } else {
            output()->sendError(204, "Failed. Please double-check and try again.");
        }
    }
}