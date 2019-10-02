<?php
/**
 * Created by O2System Framework File Generator.
 * DateTime: 26/09/2019 08:09
 */

// ------------------------------------------------------------------------

namespace App\Controllers;

// ------------------------------------------------------------------------

use O2System\Framework\Http\Controller;

/**
 * Class Admin
 *
 * @package \App\Controllers
 */
class Admin extends Controller
{
    /**
     * Admin::index
     */
    public function index()
    {
        if (!empty(session_name('user-login')) && session_name('user-login') == true) {
            presenter()->page->setHeader( 'Welcome Admin!' );
            $this->load->view('admin');
        } else {        
            presenter()->page->setHeader( 'Login Page' );
            $this->load->view('login');
        }
    }
}