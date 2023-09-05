<?php
//DB接続
function connectDB() {
    $servername = "localhost";
    $username = "test";
    $password = "test";
    $dbname = "crud_test";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

//DBのデータ取得
function fetchData($conn){
    $sql = "SELECT id, title, description FROM todos";
    $result = $conn->query($sql);
    $conn->close();

    $todoList = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            array_push($todoList, $row);
        }
    }

    return $todoList;
}

//DBのデータ更新
function updateData($conn, $id, $updatedData) {
    $sql = "UPDATE todos SET title = ?, description = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $updatedData['title'], $updatedData['description'], $id); // string string int
    $result = $stmt->execute();
    return ['success' => $result];
}

//DBにデータ挿入
function insertData($conn, $newData) {
    $sql = "INSERT INTO todos (title, description) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $newData['title'], $newData['description']);
    $result = $stmt->execute();
    return ['success' => $result];
}

//DBからデータ削除
function deleteData($conn, $id){
    $sql = "DELETE FROM todos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $result = $stmt->execute();
    return ['success' => $result];
}

function exportCsv($conn){
    header('Content-Type: text/csv');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'Title', 'Description']); // CSV Header
  
    $sql = "SELECT * FROM todos";
    $result = $conn->query($sql);
  
    while ($row = $result->fetch_assoc()) {
      fputcsv($output, $row);
    }
  
    fclose($output);
    return $output;
}

$action = $_GET['action'];
$conn = connectDB();
$response;

//TODO: バリデーションや、異常系のハンドリングを書く
switch($action){    
    case 'fetchData':
        $response = fetchData($conn);
        break;
    case 'updateData':
        $id = $_GET['id'];
        $updatedData = json_decode(file_get_contents('php://input'), true);
        $response = updateData($conn, $id, $updatedData);
        break;
    case 'insertData':
        $newData = json_decode(file_get_contents('php://input'), true);
        $response = insertData($conn, $newData);
        break;
    case 'deleteData':
        $id = $_GET['id'];
        $response = deleteData($conn, $id);
        break;
    case 'exportCsv':
        $response = exportCsv($conn);
        break;
}

echo json_encode($response);
?>