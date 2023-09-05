<?php
require('Smarty.class.php');

$smarty = new Smarty;

//Smarty.class.phpの設定を手動で設定。
$smarty->template_dir = "./templates";
$smarty->compile_dir = "./templates_c";

$smarty->display('index.tpl');
?>