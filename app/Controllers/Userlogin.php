<?php
/**
 * Created by O2System Framework File Generator.
 * DateTime: 26/09/2019 08:09
 */

// ------------------------------------------------------------------------

namespace App\Controllers;

// ------------------------------------------------------------------------

use O2System\Framework\Http\Controller;
use App\Models\Users;
use O2System\Session;

/**
 * Class Users
 *
 * @package \App\Controllers
 */
class Userlogin extends Controller
{

    /**
     * Users::index
     */
    public function index()
    {
        output()->setContentType('application/json');
        $post = input()->post();
        $data = $this->model->findWhere([
            'username' => $post['username'],
            'password' => md5($post['password'])
        ], 1);
        if (!empty($data)) {
            $this->session->set('user-login', $data);
            output()->sendPayload([
                'code' => 201,
                'message' => 'Successful login',
                'data' => $data,
            ]);
        } else {
            output()->sendError(204, "The username and password you entered did not match our records. Please double-check and try again.");
        }
    }
}